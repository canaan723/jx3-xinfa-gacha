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
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="6ee2ca0f-54a9-418c-aeb9-f4e8ad0ac89e"></script>
      </head>
      <body className="antialiased overflow-hidden w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
