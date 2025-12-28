import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ALL_XINFA, BACKGROUNDS, XinFa } from '@/lib/data';
import { drawSingle, drawTeam, drawCustom, LotteryResult } from '@/lib/logic';

export type LotteryMode = 'single' | 'team' | 'custom';

interface LotteryState {
  // 模式
  mode: LotteryMode;
  setMode: (mode: LotteryMode) => void;

  // 心法选择 (个人/队伍模式)
  selectedXinFaIds: string[];
  toggleXinFa: (id: string) => void;
  toggleCategory: (type: XinFa['type'], select: boolean) => void;
  selectAll: () => void;
  deselectAll: () => void;

  // 队伍设置
  members: string[];
  setMembers: (members: string[]) => void;
  healerCount: number;
  setHealerCount: (count: number) => void;

  // 自定义选项
  customOptions: string[];
  addCustomOption: (option: string) => void;
  removeCustomOption: (option: string) => void;
  setCustomOptions: (options: string[]) => void;

  // 抽奖状态
  isSpinning: boolean;
  setIsSpinning: (isSpinning: boolean) => void;
  lastResult: LotteryResult | LotteryResult[] | null;
  
  // 背景
  currentBgId: string;
  setRandomBg: () => void;
  setNextBg: () => void;

  // 动作
  startLottery: () => void;
  resetResult: () => void;
}

export const useLotteryStore = create<LotteryState>()(
  persist(
    (set, get) => ({
      mode: 'single',
      setMode: (mode) => set({ mode }),

      selectedXinFaIds: ALL_XINFA.map((x) => x.id), // 默认全选
      toggleXinFa: (id) =>
        set((state) => {
          const ids = state.selectedXinFaIds;
          if (ids.includes(id)) {
            return { selectedXinFaIds: ids.filter((i) => i !== id) };
          } else {
            return { selectedXinFaIds: [...ids, id] };
          }
        }),
      toggleCategory: (type, select) =>
        set((state) => {
          const categoryIds = ALL_XINFA.filter((x) => x.type === type).map((x) => x.id);
          const otherIds = state.selectedXinFaIds.filter((id) => !categoryIds.includes(id));
          return {
            selectedXinFaIds: select ? [...otherIds, ...categoryIds] : otherIds,
          };
        }),
      selectAll: () => set({ selectedXinFaIds: ALL_XINFA.map((x) => x.id) }),
      deselectAll: () => set({ selectedXinFaIds: [] }),

      members: ['队友1', '队友2', '队友3'],
      setMembers: (members) => set({ members }),
      healerCount: 1,
      setHealerCount: (count) => set({ healerCount: count }),

      customOptions: ['选项1', '选项2'],
      addCustomOption: (option) =>
        set((state) => ({ customOptions: [...state.customOptions, option] })),
      removeCustomOption: (option) =>
        set((state) => ({
          customOptions: state.customOptions.filter((o) => o !== option),
        })),
      setCustomOptions: (options) => set({ customOptions: options }),

      isSpinning: false,
      setIsSpinning: (isSpinning) => set({ isSpinning }),
      lastResult: null,

      currentBgId: 'cg', // 默认
      setRandomBg: () => {
        const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
        set({ currentBgId: randomBg.id });
        // 设置 CSS 变量
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--brand', randomBg.theme);
          // 生成一个稍浅或稍深的辅助色
          // 简单处理：直接使用同色，或者后续在 CSS 中用 color-mix 处理
          document.documentElement.style.setProperty('--brand-secondary', randomBg.theme);
        }
      },

      setNextBg: () => {
        const { currentBgId } = get();
        const currentIndex = BACKGROUNDS.findIndex((b) => b.id === currentBgId);
        const nextIndex = (currentIndex + 1) % BACKGROUNDS.length;
        const nextBg = BACKGROUNDS[nextIndex];

        set({ currentBgId: nextBg.id });

        // 设置 CSS 变量
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--brand', nextBg.theme);
          document.documentElement.style.setProperty('--brand-secondary', nextBg.theme);
        }
      },

      startLottery: () => {
        const state = get();
        const selectedXinFa = ALL_XINFA.filter((x) => state.selectedXinFaIds.includes(x.id));

        let result: LotteryResult | LotteryResult[] | null = null;

        if (state.mode === 'single') {
          result = drawSingle(selectedXinFa);
        } else if (state.mode === 'team') {
          result = drawTeam(state.members, selectedXinFa, state.healerCount);
        } else if (state.mode === 'custom') {
          result = drawCustom(state.customOptions);
        }

        set({ lastResult: result });
      },
      resetResult: () => set({ lastResult: null }),
    }),
    {
      name: 'jx3-lottery-storage',
      partialize: (state) => ({
        mode: state.mode,
        selectedXinFaIds: state.selectedXinFaIds,
        members: state.members,
        healerCount: state.healerCount,
        customOptions: state.customOptions,
      }),
    }
  )
);
