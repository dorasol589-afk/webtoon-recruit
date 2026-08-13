import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "웹툰 제작사 채용공고",
  description: "웹툰 제작사들의 사람인/잡코리아 채용공고를 모아서 매일 자동으로 갱신합니다",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <h1 className="text-lg font-semibold">📋 웹툰 제작사 채용공고</h1>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-400">
          데이터 출처: 사람인 · 잡코리아 (비공식) · 매일 자동 수집
        </footer>
      </body>
    </html>
  );
}
