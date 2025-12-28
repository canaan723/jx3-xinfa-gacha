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
    if (count <= 6) return 'w-14 h-14 md:w-20 md:h-20';
    if (count <= 12) return 'w-12 h-12 md:w-16 md:h-16';
    if (count <= 20) return 'w-10 h-10 md:w-14 md:h-14';
    return 'w-8 h-8 md:w-12 md:h-12';
  };

  const iconSizeClass = getIconSize();

  return (
    <div className="relative flex items-center justify-center w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
      {/* 指针 - 高级便当盒风格 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-40 w-10 h-14 flex items-center justify-center">
        {/* 指针主体：渐变 + 阴影 */}
        <div 
          className="w-full h-full bg-gradient-to-b from-brand to-brand-secondary shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
        />
        {/* 指针高光 */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-white/20"
          style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
        />
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
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 flex flex-col items-center justify-start pt-4 md:pt-8 origin-bottom"
                style={{ transform: `rotate(${anglePerSector / 2}deg)` }}
              >
                <div className="flex flex-col items-center gap-1 md:gap-3">
                  {item.image ? (
                    <div className={cn(iconSizeClass, "rounded-full p-1 bg-white/5 backdrop-blur-sm border border-white/10 shadow-inner")}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                  ) : (
                    <div className={cn(iconSizeClass, "rounded-full flex items-center justify-center text-xs text-center p-1 bg-white/10 backdrop-blur-md border border-white/20")}>
                      {item.name.slice(0, 2)}
                    </div>
                  )}
                  <span className="text-white text-[10px] md:text-sm font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap tracking-wider">
                    {item.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* 中心装饰 - 高级毛玻璃便当盒 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-32 md:h-32 z-30 flex items-center justify-center pointer-events-none">
        {/* 外层发光 */}
        <div className="absolute inset-0 rounded-full bg-brand/20 blur-2xl animate-pulse" />
        
        {/* 多层嵌套圆环 */}
        <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl flex items-center justify-center">
          {/* 内部渐变环 */}
          <div className="w-[80%] h-[80%] rounded-full border-2 border-brand/50 bg-gradient-to-br from-brand/20 to-brand-secondary/20 animate-[spin_15s_linear_infinite]" />
          
          {/* 核心点 */}
          <div className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-brand to-brand-secondary shadow-[0_0_20px_var(--brand)] border border-white/40 flex items-center justify-center">
             <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]" />
          </div>
        </div>
        
        {/* 正在抽取的提示 */}
        <AnimatePresence>
          {spinningTarget && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute top-28 md:top-40 left-1/2 -translate-x-1/2 whitespace-nowrap glass-morphism px-8 py-3 rounded-2xl text-white"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">Drawing</span>
                <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-brand to-brand-secondary bg-clip-text text-transparent drop-shadow-sm">
                  {spinningTarget}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
