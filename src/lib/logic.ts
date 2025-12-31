import { XinFa } from './data';

export interface LotteryResult {
  id: string;
  name: string;
  image: string;
  memberId?: string; // 队伍模式下对应的队员ID
}

/**
 * 个人抽签逻辑
 * 从选中的心法中随机抽取1个
 */
export function drawSingle(selectedXinFa: XinFa[]): LotteryResult | null {
  if (selectedXinFa.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * selectedXinFa.length);
  const winner = selectedXinFa[randomIndex];
  return {
    id: winner.id,
    name: winner.name,
    image: winner.image,
  };
}

/**
 * 队伍抽签逻辑
 * @param members 队员ID列表
 * @param selectedXinFa 所有选中的心法池
 * @param healerCount 指定的治疗心法数量
 */
export function drawTeam(
  members: string[],
  selectedXinFa: XinFa[],
  healerCount: number,
  fixedHealerIndices: number[] = [],
  allowRepeat: boolean = false
): LotteryResult[] {
  if (members.length === 0 || selectedXinFa.length === 0) return [];

  // 1. 分离治疗和输出心法
  const healerPool = selectedXinFa.filter((x) => x.type === 'healer');
  const dpsPool = selectedXinFa.filter((x) => x.type !== 'healer');

  // 2. 确定实际抽取的治疗和DPS数量
  const actualHealerCount = Math.min(healerCount, healerPool.length);
  const dpsCountNeeded = members.length - actualHealerCount;

  // 辅助函数：从池中随机抽取N个
  const drawFromPool = (pool: XinFa[], count: number): XinFa[] => {
    const drawn: XinFa[] = [];
    let currentPool = [...pool];
    for (let i = 0; i < count; i++) {
      if (currentPool.length === 0) currentPool = [...pool];
      const idx = Math.floor(Math.random() * currentPool.length);
      drawn.push(currentPool[idx]);
      
      // 如果不允许重复，则从池中移除已抽中的心法
      if (!allowRepeat) {
        currentPool.splice(idx, 1);
      }
    }
    return drawn;
  };

  // 3. 抽取心法
  const drawnHealers = drawFromPool(healerPool, actualHealerCount);
  let drawnDps: XinFa[] = [];
  if (dpsPool.length > 0) {
    drawnDps = drawFromPool(dpsPool, dpsCountNeeded);
  } else if (dpsCountNeeded > 0) {
    drawnDps = drawFromPool(healerPool, dpsCountNeeded);
  }

  // 4. 分配心法
  const finalAssignments = new Array(members.length).fill(null);
  const availableHealers = [...drawnHealers];
  const availableDps = [...drawnDps];

  // a. 首先分配固定的治疗
  fixedHealerIndices.forEach((memberIdx) => {
    if (memberIdx < members.length && availableHealers.length > 0) {
      finalAssignments[memberIdx] = availableHealers.pop();
    }
  });

  // b. 找出剩余未分配的队员索引
  const remainingMemberIndices = members
    .map((_, i) => i)
    .filter((i) => finalAssignments[i] === null);
  
  // 打乱剩余位置以实现随机分配
  for (let i = remainingMemberIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingMemberIndices[i], remainingMemberIndices[j]] = [remainingMemberIndices[j], remainingMemberIndices[i]];
  }

  // c. 分配剩余的治疗到随机位置
  while (availableHealers.length > 0 && remainingMemberIndices.length > 0) {
    const memberIdx = remainingMemberIndices.shift()!;
    finalAssignments[memberIdx] = availableHealers.pop();
  }

  // d. 分配DPS到剩下的位置
  while (availableDps.length > 0 && remainingMemberIndices.length > 0) {
    const memberIdx = remainingMemberIndices.shift()!;
    finalAssignments[memberIdx] = availableDps.pop();
  }

  // 5. 组装结果
  const results: LotteryResult[] = [];
  for (let i = 0; i < members.length; i++) {
    if (finalAssignments[i]) {
      results.push({
        id: finalAssignments[i].id,
        name: finalAssignments[i].name,
        image: finalAssignments[i].image,
        memberId: members[i],
      });
    }
  }

  return results;
}

/**
 * 自定义抽签逻辑
 * 从自定义选项中随机抽取1个
 */
export function drawCustom(options: string[]): LotteryResult | null {
  if (options.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * options.length);
  const winner = options[randomIndex];
  return {
    id: `custom-${Date.now()}`,
    name: winner,
    image: '', // 自定义模式可能没有图片，或者使用默认图
  };
}
