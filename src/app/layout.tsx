import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 하네스 빌더",
  description: "AI 에이전트 오케스트레이션 하네스를 시각적으로 설계하고 내보내기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-carbon-theme="white" className="h-full" style={{ WebkitFontSmoothing: "antialiased" }}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--cds-font-sans)" }}>{children}</body>
    </html>
  );
}
