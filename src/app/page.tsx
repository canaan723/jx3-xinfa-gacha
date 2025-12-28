'use client';

import { useEffect, useState } from 'react';
import BackgroundManager from '@/components/ui/background-manager';
import Wheel from '@/components/ui/wheel';
import ConfigPanel from '@/components/ui/config-panel';
import ResultModal from '@/components/ui/result-modal';
import { useLotteryStore } from '@/store/use-lottery-store';
import { RefreshCcw, Play, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { setNextBg, startLottery, isSpinning, mode, setIsConfigOpen } = useLotteryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden text-white font-sans">
      {/* 动态背景 */}
      <BackgroundManager />

      {/* 顶部导航布局：三段式（左、中、右） */}
      <div className="absolute top-0 left-0 w-full px-6 py-6 z-20 flex justify-between items-center pointer-events-none">
        {/* 左侧：功能按钮 */}
        <div className="flex-1 flex justify-start">
          <button
            onClick={setNextBg}
            className="pointer-events-auto p-2.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all active:scale-90 group"
            title="切换背景"
          >
            <RefreshCcw className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* 中间：绝对居中标题 */}
        <div className="flex-[2] flex justify-center">
          <div className="relative group">
            {/* 标题文字：精致、间距大、渐变感 */}
            <h1 className="text-lg md:text-xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-2xl font-display whitespace-nowrap">
              JX3 JJC心法盲盒
            </h1>
            
            {/* 底部精致装饰线 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent opacity-40 group-hover:w-full group-hover:opacity-100 transition-all duration-700" />
            
            {/* 两侧极细装饰点 */}
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-1 h-1 rounded-full bg-brand/40 blur-[1px] hidden md:block" />
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-1 h-1 rounded-full bg-brand-secondary/40 blur-[1px] hidden md:block" />
          </div>
        </div>

        {/* 右侧：占位（配置按钮在 ConfigPanel 中，这里保持平衡） */}
        <div className="flex-1 flex justify-end">
          {/* 保持布局平衡的空容器 */}
          <div className="w-10 h-10" />
        </div>
      </div>

      {/* 主体内容：转盘 - 居中偏上布局 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pb-[10vh]">
        <div className="scale-90 md:scale-100 transition-transform">
           <Wheel />
        </div>
      </div>

      {/* 底部操作栏：固定在页脚上方 */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 w-full max-w-fit px-6">
        {/* 开始按钮 - 重新设计：精致大圆角毛玻璃风格 */}
        <button
          onClick={startLottery}
          disabled={isSpinning}
          className={cn(
            "group relative px-6 md:px-10 py-3 rounded-full transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex-shrink-0",
            "bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]",
            !isSpinning && "hover:bg-white/10 hover:border-white/40 hover:shadow-[0_15px_35px_-5px_var(--brand)]/20"
          )}
        >
          {/* 极简背景渐变 */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-brand-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <span className="relative z-10 flex items-center gap-2 text-base md:text-lg font-bold tracking-widest text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
            {isSpinning ? (
              <RefreshCcw className="w-4 h-4 animate-spin text-brand" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-brand to-brand-secondary shadow-[0_0_8px_var(--brand)] group-hover:scale-125 transition-transform" />
            )}
            {isSpinning ? '抽取中' : mode === 'team' ? '开始队伍抽签' : mode === 'single' ? '开始个人抽签' : '开始自定义抽签'}
          </span>

          {/* 极细扫光 */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[2s] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </button>

        {/* 配置按钮 - 与开始按钮视觉和谐 */}
        <button
          onClick={() => setIsConfigOpen(true)}
          disabled={isSpinning}
          className={cn(
            "p-3.5 rounded-full transition-all duration-500 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed",
            "bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg text-white/60 hover:text-white hover:bg-white/10 hover:border-white/40 group"
          )}
          title="抽签配置"
        >
          <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* 功能组件 */}
      <ConfigPanel />
      <ResultModal />

      {/* 底部版权/信息 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-4 text-white/40 text-xs text-center z-20">
        <p className="max-w-md mx-auto leading-relaxed">
          JX3 JJC心法盲盒 © 2025 | 仅供娱乐 | Made by{' '}
          <a
            href="https://blog.qjyg.de"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors underline underline-offset-2"
          >
            清绝
          </a>
        </p>
      </div>
    </main>
  );
}
