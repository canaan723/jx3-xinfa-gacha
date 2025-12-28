'use client';

import { useEffect, useState } from 'react';
import BackgroundManager from '@/components/ui/background-manager';
import Wheel from '@/components/ui/wheel';
import ConfigPanel from '@/components/ui/config-panel';
import ResultModal from '@/components/ui/result-modal';
import { useLotteryStore } from '@/store/use-lottery-store';
import { RefreshCcw, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { setNextBg, startLottery, isSpinning, mode } = useLotteryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative w-screen h-screen overflow-hidden text-white font-sans">
      {/* 动态背景 */}
      <BackgroundManager />

      {/* 顶部栏 */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto flex gap-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider drop-shadow-md font-display">
            JX3 JJC心法盲盒
          </h1>
          <button 
            onClick={setNextBg}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95 border border-white/20"
            title="切换背景"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 主体内容：转盘 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="mb-8 md:mb-12 scale-90 md:scale-100 transition-transform">
           <Wheel />
        </div>

        {/* 开始按钮 - 重新设计：精致大圆角毛玻璃风格 */}
        <button
          onClick={startLottery}
          disabled={isSpinning}
          className={cn(
            "group relative px-10 py-3 rounded-full transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
            "bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]",
            !isSpinning && "hover:bg-white/10 hover:border-white/40 hover:shadow-[0_15px_35px_-5px_var(--brand)]/20"
          )}
        >
          {/* 极简背景渐变 */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-brand-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <span className="relative z-10 flex items-center gap-2 text-lg font-bold tracking-widest text-white/90 group-hover:text-white transition-colors">
            {isSpinning ? (
              <RefreshCcw className="w-4 h-4 animate-spin text-brand" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-brand to-brand-secondary shadow-[0_0_8px_var(--brand)] group-hover:scale-125 transition-transform" />
            )}
            {isSpinning ? '抽奖中' : mode === 'team' ? '开始分配' : '开始抽签'}
          </span>

          {/* 极细扫光 */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[2s] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </button>
      </div>

      {/* 功能组件 */}
      <ConfigPanel />
      <ResultModal />

      {/* 底部版权/信息 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs text-center z-20 pointer-events-none">
        <p>JX3 JJC心法盲盒 © 2025 | 仅供娱乐</p>
      </div>
    </main>
  );
}
