'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Download } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl overflow-hidden"
          >
            {/* 装饰光效 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-brand/30 blur-[100px] pointer-events-none" />

            <div className="relative p-8 md:p-12 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                🎉 中奖结果 🎉
              </h2>
              <p className="text-white/60 mb-8">恭喜以上少侠获得心法</p>

              {/* 结果列表 */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto scrollbar-none">
                {results.map((res, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    {/* 头像/图标 */}
                    <div className="w-16 h-16 rounded-full bg-white/10 p-1 shadow-inner flex-shrink-0">
                      {res.image ? (
                        <img src={res.image} alt={res.name} className="w-full h-full object-contain" />
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
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all active:scale-95"
                >
                  关闭
                </button>
                {/* 预留分享功能 */}
                <button className="px-8 py-3 rounded-xl bg-brand hover:bg-brand-secondary text-white font-medium shadow-lg shadow-[0_0_20px_var(--brand)]/20 transition-all active:scale-95 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> 分享结果
                </button>
              </div>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
