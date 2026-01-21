import { NextResponse } from 'next/server';

const isQrImageUrl = (value: string) =>
  value.startsWith('data:image/') ||
  /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(value);
const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

const decodeCandidateUrl = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/');

const extractImageFromHtml = (html: string, baseUrl: string) => {
  const previewMatch = html.match(
    /previewService\.pushData\([\s\S]*?"url"\s*:\s*"([^"]+)"/i,
  );
  if (previewMatch?.[1]) {
    const decoded = decodeCandidateUrl(previewMatch[1]);
    return new URL(decoded, baseUrl).toString();
  }
  const ogMatch = html.match(
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
  );
  if (ogMatch?.[1]) {
    const decoded = decodeCandidateUrl(ogMatch[1]);
    return new URL(decoded, baseUrl).toString();
  }
  const refreshMatch = html.match(
    /http-equiv=["']refresh["'][^>]*content=["'][^;]+;\s*url=([^"']+)["']/i,
  );
  if (refreshMatch?.[1]) {
    const decoded = decodeCandidateUrl(refreshMatch[1]);
    return new URL(decoded, baseUrl).toString();
  }
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) {
    const decoded = decodeCandidateUrl(imgMatch[1]);
    return new URL(decoded, baseUrl).toString();
  }
  const absoluteMatch = html.match(
    /https?:\/\/[^"'\\s>]+\\.(png|jpe?g|gif|webp|bmp|svg)(\\?[^"'\\s>]*)?/i,
  );
  if (absoluteMatch?.[0]) {
    return decodeCandidateUrl(absoluteMatch[0]);
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
