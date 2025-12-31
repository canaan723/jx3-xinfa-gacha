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
        <link rel='stylesheet' href='https://chinese-fonts-cdn.deno.dev/packages/hcqyt/dist/ChillRoundFRegular/result.css' />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="6ee2ca0f-54a9-418c-aeb9-f4e8ad0ac89e"></script>
      </head>
      <body className="antialiased overflow-hidden w-screen h-screen">
        {/* 全局 SVG 渐变定义，供 icon-gradient 使用 */}
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand)" />
              <stop offset="50%" stopColor="color-mix(in srgb, var(--brand), var(--brand-secondary))" />
              <stop offset="100%" stopColor="var(--brand-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
