import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ALL_XINFA, BACKGROUNDS, XinFa } from '@/lib/data';
import { drawSingle, drawTeam, drawCustom, LotteryResult } from '@/lib/logic';
import { safeViewTransition } from '@/lib/utils';

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
  fixedHealerIndices: number[];
  toggleFixedHealer: (index: number) => void;
  allowRepeat: boolean;
  setAllowRepeat: (allow: boolean) => void;

  // 自定义选项
  customOptions: string[];
  addCustomOption: (option: string) => void;
  removeCustomOption: (option: string) => void;
  setCustomOptions: (options: string[]) => void;

  // 抽奖状态
  isSpinning: boolean;
  setIsSpinning: (isSpinning: boolean) => void;
  lastResult: LotteryResult | LotteryResult[] | null;
  
  // UI 状态
  isConfigOpen: boolean;
  setIsConfigOpen: (isOpen: boolean) => void;

  // 背景
  currentBgId: string;
  setRandomBg: (event?: React.MouseEvent | MouseEvent) => void;
  setNextBg: (event?: React.MouseEvent | MouseEvent) => void;

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
      setMembers: (members) => set((state) => {
        // 如果成员减少，需要过滤掉超出范围的固定索引
        const fixedHealerIndices = state.fixedHealerIndices.filter(idx => idx < members.length);
        return { members, fixedHealerIndices };
      }),
      healerCount: 1,
      allowRepeat: true, // 默认为完全随机（允许重复）
      setAllowRepeat: (allowRepeat) => set({ allowRepeat }),
      setHealerCount: (count) => set((state) => {
        // 如果治疗人数减少，可能需要移除多余的固定名额
        let fixedHealerIndices = state.fixedHealerIndices;
        if (fixedHealerIndices.length > count) {
          fixedHealerIndices = fixedHealerIndices.slice(0, count);
        }
        return { healerCount: count, fixedHealerIndices };
      }),
      fixedHealerIndices: [],
      toggleFixedHealer: (index) => set((state) => {
        const isFixed = state.fixedHealerIndices.includes(index);
        if (isFixed) {
          return { fixedHealerIndices: state.fixedHealerIndices.filter(i => i !== index) };
        } else {
          if (state.fixedHealerIndices.length < state.healerCount) {
            return { fixedHealerIndices: [...state.fixedHealerIndices, index].sort((a, b) => a - b) };
          }
          return state;
        }
      }),

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

      isConfigOpen: false,
      setIsConfigOpen: (isOpen) => set({ isConfigOpen: isOpen }),

      currentBgId: 'cg', // 默认
      setRandomBg: (event) => {
        const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
        
        safeViewTransition(() => {
          set({ currentBgId: randomBg.id });
          // 设置 CSS 变量
          if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--brand', randomBg.theme);
            document.documentElement.style.setProperty('--brand-secondary', randomBg.themeSecondary);
          }
        }, event);
      },

      setNextBg: (event) => {
        const { currentBgId } = get();
        const currentIndex = BACKGROUNDS.findIndex((b) => b.id === currentBgId);
        const nextIndex = (currentIndex + 1) % BACKGROUNDS.length;
        const nextBg = BACKGROUNDS[nextIndex];

        safeViewTransition(() => {
          set({ currentBgId: nextBg.id });

          // 设置 CSS 变量
          if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--brand', nextBg.theme);
            document.documentElement.style.setProperty('--brand-secondary', nextBg.themeSecondary);
          }
        }, event);
      },

      startLottery: () => {
        const state = get();
        const selectedXinFa = ALL_XINFA.filter((x) => state.selectedXinFaIds.includes(x.id));

        let result: LotteryResult | LotteryResult[] | null = null;

        if (state.mode === 'single') {
          result = drawSingle(selectedXinFa);
        } else if (state.mode === 'team') {
          result = drawTeam(state.members, selectedXinFa, state.healerCount, state.fixedHealerIndices, state.allowRepeat);
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
        fixedHealerIndices: state.fixedHealerIndices,
        allowRepeat: state.allowRepeat,
        customOptions: state.customOptions,
      }),
    }
  )
);
