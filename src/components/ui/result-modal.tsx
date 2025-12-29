'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLotteryStore } from '@/store/use-lottery-store';
import { LotteryResult } from '@/lib/logic';

export default function ResultModal() {
  const { lastResult, resetResult, isSpinning } = useLotteryStore();
  const [show, setShow] = useState(false);

  // 监听结果变化，当有结果且不在旋转时显示
  useEffect(() => {
    if (lastResult && !isSpinning) {
      // 稍微延迟一点显示，让转盘完全停稳的视觉效果更好
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [lastResult, isSpinning]);

  const handleClose = () => {
    setShow(false);
    // 等待动画结束后重置 store 状态
    setTimeout(resetResult, 300);
  };

  if (!lastResult) return null;

  const results = Array.isArray(lastResult) ? lastResult : [lastResult];

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* 弹窗主体 */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* 装饰光效 - 顶部主题色光晕 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-brand/20 to-transparent blur-[120px] pointer-events-none" />
            
            {/* 内部微弱渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand/5 via-transparent to-brand-secondary/5 pointer-events-none" />

            <div className="relative p-6 md:p-10 flex flex-col items-center overflow-hidden">
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-1 bg-gradient-to-r from-transparent via-brand to-transparent rounded-full mb-6"
                />
                <h2 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter drop-shadow-2xl">
                  抽取结果
                </h2>
                <p className="text-white/40 font-bold tracking-widest uppercase text-xs">恭喜侠士，加油喔！</p>
              </div>

              {/* 结果列表 */}
              <div className={cn(
                "w-full grid gap-3 max-h-[40vh] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
                results.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2"
              )}>
                {results.map((res, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-[24px] hover:bg-white/10 hover:border-white/20 transition-all duration-500 group"
                  >
                    {/* 头像/图标 */}
                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                      {res.image ? (
                        <div className="w-full h-full">
                          <img src={res.image} alt={res.name} className="w-full h-full object-contain drop-shadow-md" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                          {res.name.slice(0, 1)}
                        </div>
                      )}
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      {res.memberId && (
                        <div className="text-white/50 text-sm mb-1">
                          {res.memberId}
                        </div>
                      )}
                      <div className="text-white font-bold text-xl truncate">
                        {res.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 底部按钮 */}
              <div className="mt-6 flex gap-3 md:gap-4 action-buttons">
                <button
                  onClick={handleClose}
                  className="px-6 md:px-10 py-3.5 rounded-full bg-gradient-to-r from-brand to-brand-secondary text-white font-black shadow-[0_10px_25px_-5px_rgba(var(--color-brand),0.3)] hover:shadow-[0_15px_35px_-5px_rgba(var(--color-brand),0.4)] transition-all active:scale-95 whitespace-nowrap"
                >
                  确定
                </button>
              </div>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors close-button"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
