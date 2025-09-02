import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '概念股自動化篩選系統',
  description: '智能篩選概念股，提供專業的投資分析工具',
  keywords: '概念股, 股票篩選, 投資分析, 台股',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">
                    概念股篩選系統
                  </h1>
                </div>
                <nav className="flex space-x-8">
                  <a href="/" className="text-gray-500 hover:text-gray-900">
                    首頁
                  </a>
                  <a href="/stocks" className="text-gray-500 hover:text-gray-900">
                    股票列表
                  </a>
                  <a href="/concepts" className="text-gray-500 hover:text-gray-900">
                    概念股
                  </a>
                  <a href="/screener" className="text-gray-500 hover:text-gray-900">
                    篩選器
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
