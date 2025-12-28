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
  // 注意：这里我们通过点击按钮触发 startLottery，然后监听 lastResult 的变化来启动动画
  // 或者直接在点击处理函数中启动动画。为了解耦，我们监听 isSpinning 状态变化可能更合适，
  // 但 Zustand 的 isSpinning 是状态，我们需要一个触发器。
  // 更好的方式：点击 -> setIsSpinning(true) -> startLottery() -> 计算结果 -> 启动动画 -> 动画结束 -> setIsSpinning(false) -> 显示结果
  
  // 这里我们采用：父组件调用 startLottery -> lastResult 更新 -> 触发动画
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
      {/* 指针 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-12 bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-lg drop-shadow-md"
           style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
      />

      {/* 转盘主体 */}
      <motion.div
        className="w-full h-full rounded-full border-8 border-white/20 shadow-2xl bg-black/40 backdrop-blur-sm overflow-hidden relative"
        animate={controls}
        style={{ rotate: rotation, backfaceVisibility: 'hidden' }}
      >
        {/* 扇区 */}
        {items.map((item, index) => {
          const rotate = index * anglePerSector;
          const skew = 90 - anglePerSector;
          
          // 只有当扇区角度小于 90 度时，skew 变换才有效用于生成扇形
          // 对于只有 2-3 个选项的情况，CSS 绘制扇形比较复杂，这里使用 conic-gradient 或 SVG 可能更好
          // 为了通用性，我们使用绝对定位 + 旋转的方式放置内容，背景用 conic-gradient 绘制
          
          return (
            <div
              key={item.id}
              className="absolute top-0 left-0 w-full h-full origin-center pointer-events-none"
              style={{ transform: `rotate(${rotate}deg)` }}
            >
              {/* 分割线 */}
              <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-white/20 -translate-x-1/2 origin-bottom" />
              
              {/* 内容容器：旋转到扇区中心 */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 flex flex-col items-center justify-start pt-4 md:pt-6 origin-bottom"
                style={{ transform: `rotate(${anglePerSector / 2}deg)` }}
              >
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  {item.image ? (
                    <div className={cn(iconSizeClass, "rounded-full p-1")}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className={cn(iconSizeClass, "rounded-full flex items-center justify-center text-xs text-center p-1")}>
                      {item.name.slice(0, 2)}
                    </div>
                  )}
                  {/* 扇区较窄时隐藏文字 - 修复：增加阈值或始终显示 */}
                  <span className="text-white text-[9px] md:text-xs font-bold drop-shadow-md whitespace-nowrap writing-vertical-rl md:writing-horizontal-tb">
                    {item.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
      </motion.div>

      {/* 中心装饰 (不随转盘旋转) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 z-30 flex items-center justify-center pointer-events-none">
        {/* 多层嵌套圆环 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand to-brand-secondary shadow-[0_0_30px_var(--brand)]/50 border-4 border-white/30" />
        <div className="absolute inset-2 rounded-full border-2 border-white/20 animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />
        </div>
        
        {/* 正在抽取的提示 - 移至转盘下方展示，避免遮挡中心且更易读 */}
        <AnimatePresence>
          {spinningTarget && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-24 md:top-32 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 backdrop-blur-xl px-6 py-2 rounded-2xl border border-brand/50 text-white shadow-[0_0_20px_rgba(var(--color-brand),0.3)]"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-white/50 uppercase tracking-widest">Current Drawing</span>
                <span className="text-lg font-black text-brand drop-shadow-[0_0_10px_var(--brand)]">{spinningTarget}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
