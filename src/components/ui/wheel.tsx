'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue, AnimatePresence } from 'framer-motion';
import { useLotteryStore } from '@/store/use-lottery-store';
import { ALL_XINFA } from '@/lib/data';
import { cn } from '@/lib/utils';

// 辅助函数：计算扇区角度
const SECTOR_ANGLE = 360;

export default function Wheel() {
  const { 
    mode, 
    selectedXinFaIds, 
    customOptions, 
    isSpinning, 
    setIsSpinning,
    startLottery,
    lastResult
  } = useLotteryStore();

  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const [items, setItems] = useState<{ id: string; image?: string; name: string }[]>([]);
  const [spinningTarget, setSpinningTarget] = useState<string | null>(null);

  // 根据模式获取当前转盘选项
  useEffect(() => {
    if (mode === 'custom') {
      setItems(customOptions.map((opt, i) => ({ id: `custom-${i}`, name: opt })));
    } else {
      const selected = ALL_XINFA.filter((x) => selectedXinFaIds.includes(x.id));
      setItems(selected.map((x) => ({ id: x.id, image: x.image, name: x.name })));
    }
  }, [mode, selectedXinFaIds, customOptions]);

  // 监听开始抽奖信号
  const prevResultRef = useRef(lastResult);

  useEffect(() => {
    if (lastResult && lastResult !== prevResultRef.current && !isSpinning) {
      // 新的结果产生了，开始旋转
      handleSpin();
    }
    prevResultRef.current = lastResult;
  }, [lastResult]);

  const handleSpin = async () => {
    if (items.length === 0 || !lastResult) return;
    
    setIsSpinning(true);

    const results = Array.isArray(lastResult) ? lastResult : [lastResult];
    
    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      const targetId = res.id;
      
      // 设置当前正在抽取的队员
      if (res.memberId) {
        setSpinningTarget(res.memberId);
      } else {
        setSpinningTarget(null);
      }

      const targetIndex = items.findIndex((item) => item.id === targetId);
      const finalIndex = targetIndex === -1 ? 0 : targetIndex;

      const count = items.length;
      const anglePerSector = 360 / count;
      
      // 基础圈数：第一次转多点，后续转少点
      const baseRotations = (i === 0 ? 5 : 2) * 360;
      const targetAngle = 360 - (finalIndex * anglePerSector + anglePerSector / 2);
      const totalRotation = baseRotations + targetAngle;

      const currentRotation = rotation.get();
      const currentMod = currentRotation % 360;
      const nextRotation = currentRotation + (360 - currentMod) + totalRotation;

      await controls.start({
        rotate: nextRotation,
        transition: {
          duration: i === 0 ? 4 : 2, // 第一次4秒，后续2秒
          ease: [0.2, 0.8, 0.2, 1],
        },
      });

      rotation.set(nextRotation);
      
      // 如果是队伍模式，在每个人转完后稍微停顿一下
      if (results.length > 1 && i < results.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setSpinningTarget(null);
    setIsSpinning(false);
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white/50">
        请先选择心法或添加选项
      </div>
    );
  }

  const anglePerSector = 360 / items.length;

  // 根据选项数量动态计算图标大小
  const getIconSize = () => {
    const count = items.length;
    if (count <= 6) return 'w-12 h-12 md:w-16 md:h-16';
    if (count <= 12) return 'w-10 h-10 md:w-14 md:h-14';
    if (count <= 20) return 'w-8 h-8 md:w-10 md:h-10';
    return 'w-6 h-6 md:w-8 md:h-8';
  };

  const iconSizeClass = getIconSize();

  // 根据选项数量动态计算文字大小
  const getTextSize = () => {
    const count = items.length;
    if (count <= 6) return 'text-[10px] md:text-base';
    if (count <= 12) return 'text-[9px] md:text-sm';
    if (count <= 20) return 'text-[8px] md:text-xs';
    return 'text-[7px] md:text-[10px]';
  };

  const textSizeClass = getTextSize();

  return (
    <div className="relative flex items-center justify-center w-[320px] h-[320px] sm:w-[350px] sm:h-[350px] md:w-[580px] md:h-[580px]">
      {/* 指针 - 重新设计：高级水晶棱镜指针（缩小版） */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-40 w-5 h-12 md:w-6 md:h-16 flex flex-col items-center pointer-events-none">
        {/* 顶部固定基座 */}
        <div className="w-3 h-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md z-50 flex items-center justify-center shadow-lg">
          <div className="w-1 h-1 rounded-full bg-gradient-to-br from-brand to-brand-secondary shadow-[0_0_8px_var(--brand)]" />
        </div>

        {/* 指针主体：锋利的三角形棱镜 */}
        <div className="w-full flex-1 relative -mt-1">
          {/* 玻璃外壳 */}
          <div 
            className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
            style={{ clipPath: 'polygon(50% 100%, 100% 0, 0 0)' }}
          />
          
          {/* 内部核心渐变 - 柔和过渡 */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-brand/40 via-brand-secondary/60 to-transparent"
            style={{ clipPath: 'polygon(50% 92%, 80% 8%, 20% 8%)' }}
          />

          {/* 脊线高光 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-white/60 via-white/10 to-transparent opacity-40" />
        </div>

        {/* 尖端强化 */}
        <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_10px_#fff] z-50" />
        
        {/* 底部环境光 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-t from-brand/20 to-transparent blur-xl rounded-full -z-10" />
      </div>

      {/* 转盘主体 - 增强毛玻璃 */}
      <motion.div
        className="w-full h-full rounded-full border-[12px] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/20 backdrop-blur-2xl overflow-hidden relative"
        animate={controls}
        style={{ rotate: rotation, backfaceVisibility: 'hidden' }}
      >
        {/* 扇区 */}
        {items.map((item, index) => {
          const rotate = index * anglePerSector;
          const results = Array.isArray(lastResult) ? lastResult : (lastResult ? [lastResult] : []);
          const isWinner = results.some(r => r.id === item.id);
          
          return (
            <div
              key={item.id}
              className="absolute top-0 left-0 w-full h-full origin-center pointer-events-none"
              style={{ transform: `rotate(${rotate}deg)` }}
            >
              {/* 分割线 - 减弱感 */}
              <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-white/10 -translate-x-1/2 origin-bottom" />
              
              {/* 内容容器 */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 flex flex-col items-center justify-start pt-3 sm:pt-4 md:pt-8 origin-bottom"
                style={{ transform: `rotate(${anglePerSector / 2}deg)` }}
              >
                <div className="flex flex-col items-center gap-1 md:gap-1.5">
                  {item.image ? (
                    <div className={cn(iconSizeClass, "flex items-center justify-center relative")}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
                      {isWinner && !isSpinning && lastResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0, 0.8, 0], scale: [1, 1.5, 1.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-white/30 rounded-full blur-xl"
                        />
                      )}
                    </div>
                  ) : (
                    <div className={cn(iconSizeClass, "rounded-full flex items-center justify-center text-xs text-center p-1 bg-white/10 backdrop-blur-md border border-white/20")}>
                      {item.name.slice(0, 2)}
                    </div>
                  )}
                  <span
                    className={cn("text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wider font-medium antialiased", textSizeClass)}
                    style={{ fontFamily: "'寒蝉全圆体', 'Chill Round F', sans-serif" }}
                  >
                    {item.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* 中心装饰 - 高级毛玻璃便当盒 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 z-30 flex items-center justify-center pointer-events-none">
        {/* 外层发光 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/20 to-brand-secondary/20 blur-2xl animate-pulse" />
        
        {/* 多层嵌套圆环 */}
        <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl flex items-center justify-center">
          {/* 内部渐变环 */}
          <div className="w-[80%] h-[80%] rounded-full border-2 border-brand/50 bg-gradient-to-br from-brand/20 to-brand-secondary/20 animate-[spin_15s_linear_infinite]" />
          
          {/* 核心点 */}
          <div className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-brand to-brand-secondary shadow-[0_0_20px_var(--brand)] border border-white/40 flex items-center justify-center">
             <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]" />
          </div>
        </div>
        
        {/* 正在抽取的提示 - 重新设计：精致胶囊毛玻璃风格 */}
        <AnimatePresence>
          {spinningTarget && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="absolute top-24 sm:top-28 md:top-40 left-1/2 -translate-x-1/2 whitespace-nowrap z-50"
            >
              <div className="relative px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_8px_20px_-5px_rgba(0,0,0,0.3)] flex items-center gap-2 sm:gap-3 overflow-hidden">
                {/* 内部微弱渐变背景 */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-brand-secondary/5" />
                
                {/* 状态指示点 */}
                <div className="relative w-1.5 h-1.5 rounded-full bg-gradient-to-br from-brand to-brand-secondary shadow-[0_0_8px_var(--brand)]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand to-brand-secondary animate-ping opacity-40" />
                </div>

                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">正在抽取</span>
                  <span className="text-lg md:text-xl font-black text-white tracking-tight">
                    {spinningTarget}
                  </span>
                </div>

                {/* 极细扫光动画 */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
