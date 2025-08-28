import type { Metadata } from 'next';
import '../index.css';

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
      <body>{children}</body>
    </html>
  );
}
