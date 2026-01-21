import { NextResponse } from 'next/server';

const isQrImageUrl = (value: string) =>
  value.startsWith('data:image/') ||
  /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(value);
const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

const extractImageFromHtml = (html: string, baseUrl: string) => {
  const previewMatch = html.match(
    /previewService\.pushData\([\s\S]*?"url"\s*:\s*"([^"]+)"/i,
  );
  if (previewMatch?.[1]) {
    return new URL(previewMatch[1], baseUrl).toString();
  }
  const ogMatch = html.match(
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
  );
  if (ogMatch?.[1]) {
    return new URL(ogMatch[1], baseUrl).toString();
  }
  const refreshMatch = html.match(
    /http-equiv=["']refresh["'][^>]*content=["'][^;]+;\s*url=([^"']+)["']/i,
  );
  if (refreshMatch?.[1]) {
    return new URL(refreshMatch[1], baseUrl).toString();
  }
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) {
    return new URL(imgMatch[1], baseUrl).toString();
  }
  return null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('url');

  if (!target || (!isQrImageUrl(target) && !isHttpUrl(target))) {
    return NextResponse.json({ type: 'unknown' }, { status: 400 });
  }

  if (isQrImageUrl(target)) {
    return NextResponse.json({ type: 'image', url: target });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(target, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
    });

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.startsWith('image/')) {
      return NextResponse.json({
        type: 'image',
        url: response.url || target,
      });
    }

    if (contentType.includes('text/html')) {
      const html = await response.text();
      const extracted = extractImageFromHtml(html, response.url || target);
      if (extracted && isQrImageUrl(extracted)) {
        return NextResponse.json({ type: 'image', url: extracted });
      }
    }
  } catch (error) {
    return NextResponse.json({ type: 'iframe', url: target });
  } finally {
    clearTimeout(timeoutId);
  }

  return NextResponse.json({ type: 'iframe', url: target });
}
