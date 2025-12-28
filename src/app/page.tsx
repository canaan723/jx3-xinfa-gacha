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
            剑网3心法转盘
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
        <div className="mb-8 md:mb-12 scale-75 md:scale-100 transition-transform">
           <Wheel />
        </div>

        {/* 开始按钮 */}
        <button
          onClick={startLottery}
          disabled={isSpinning}
          className={cn(
            "group relative px-12 py-4 bg-brand hover:bg-brand-secondary text-white text-xl font-bold rounded-full shadow-[0_0_20px_var(--brand)]/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden",
            isSpinning && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isSpinning ? '抽奖中...' : mode === 'team' ? '开始队伍分配' : '开始抽签'}
            {!isSpinning && <Play className="w-5 h-5 fill-current" />}
          </span>
          {/* 光效扫过动画 */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
        </button>
      </div>

      {/* 功能组件 */}
      <ConfigPanel />
      <ResultModal />

      {/* 底部版权/信息 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs text-center z-20 pointer-events-none">
        <p>剑网3心法转盘 © 2025 | 仅供娱乐</p>
      </div>
    </main>
  );
}
