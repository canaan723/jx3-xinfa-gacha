import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "剑网3 心法转盘",
  description: "剑网3心法抽奖转盘 - 内功、外功、治疗心法随机抽取",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased overflow-hidden w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
