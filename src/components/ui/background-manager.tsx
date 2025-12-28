'use client';

import { useEffect } from 'react';
import { useLotteryStore } from '@/store/use-lottery-store';
import { BACKGROUNDS } from '@/lib/data';

export default function BackgroundManager() {
  const { currentBgId, setRandomBg } = useLotteryStore();

  useEffect(() => {
    // 首次加载随机一个背景
    setRandomBg();
  }, [setRandomBg]);

  const currentBg = BACKGROUNDS.find((b) => b.id === currentBgId) || BACKGROUNDS[0];

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentBg.src})` }}
      />
      {/* 叠加层，增加文字可读性和统一色调 */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
    </div>
  );
}
