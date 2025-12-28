import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JX3 JJC心法盲盒",
  description: "剑网3 JJC心法抽奖转盘 - 不管会不会，抽到什么打什么！为剑三JJC亲友娱乐局设计的随机心法抽签工具。",
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
