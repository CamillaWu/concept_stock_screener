import type { Metadata } from 'next';
import '../index.css';
import '../App.css';

export const metadata: Metadata = {
  title: '概念股自動化篩選系統',
  description: 'AI 驅動的台灣股市概念股篩選系統',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI 驅動的台灣股市概念股篩選系統" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
