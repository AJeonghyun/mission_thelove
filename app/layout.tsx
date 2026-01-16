import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const dunggeunmo = localFont({
  src: '/Users/anjeonghyeon/Desktop/thelove/public/fonts/DungGeunMo.ttf',
  variable: '--font-geist-sans',
  display: 'swap',
});

const dunggeunmoMono = localFont({
  src: '/Users/anjeonghyeon/Desktop/thelove/public/fonts/DungGeunMo.ttf',
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MISSION:THELOVE',
  description: 'MISSION:THELOVE',
  manifest: '/manifest.json',
};

export function generateViewport() {
  return {
    themeColor: '#ffffff',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dunggeunmo.variable} ${dunggeunmoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
