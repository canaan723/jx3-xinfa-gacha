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
  healerCount: number
): LotteryResult[] {
  if (members.length === 0 || selectedXinFa.length === 0) return [];

  // 1. 分离治疗和输出心法
  const healerPool = selectedXinFa.filter((x) => x.type === 'healer');
  const dpsPool = selectedXinFa.filter((x) => x.type !== 'healer');

  // 2. 检查池子是否足够
  // 如果治疗池不够，就全用上，剩下的名额给DPS
  const actualHealerCount = Math.min(healerCount, healerPool.length);
  // 如果DPS池不够，可能需要重复抽取或者报错（这里假设池子足够大，或者允许重复？需求未明确，暂按不重复抽取实现，若池子不够则允许重复）
  // 修正：通常抽奖转盘允许重复中奖吗？
  // 需求描述：“结果总数 = 队员人数。结果中必须包含指定数量的“治疗”组心法，其余名额在选中的输出心法中随机。”
  // 既然是给队员分配心法，通常意味着每个队员一个心法。
  // 逻辑：
  // a. 随机抽取 actualHealerCount 个治疗心法
  // b. 随机抽取 (members.length - actualHealerCount) 个输出心法
  // c. 将这些心法随机分配给 members

  const results: LotteryResult[] = [];
  const assignedMembers = [...members]; // 待分配的队员

  // 辅助函数：从池中随机抽取N个（允许重复？通常心法分配不希望重复，除非池子太小）
  // 这里采用：如果池子够大，不重复；不够大，则重置池子继续抽（即允许重复）
  const drawFromPool = (pool: XinFa[], count: number): XinFa[] => {
    const drawn: XinFa[] = [];
    let currentPool = [...pool];
    
    for (let i = 0; i < count; i++) {
      if (currentPool.length === 0) {
        currentPool = [...pool]; // 重置池子
      }
      const idx = Math.floor(Math.random() * currentPool.length);
      drawn.push(currentPool[idx]);
      currentPool.splice(idx, 1); // 移除已抽取的
    }
    return drawn;
  };

  // 3. 抽取心法
  const drawnHealers = drawFromPool(healerPool, actualHealerCount);
  const dpsCountNeeded = members.length - actualHealerCount;
  
  // 如果DPS池为空但还需要抽取（极端情况：只选了治疗心法但要求人数 > 治疗数），则只能从治疗池补
  let drawnDps: XinFa[] = [];
  if (dpsPool.length > 0) {
    drawnDps = drawFromPool(dpsPool, dpsCountNeeded);
  } else if (dpsCountNeeded > 0) {
    // 降级：从治疗池补足剩余名额
    drawnDps = drawFromPool(healerPool, dpsCountNeeded);
  }

  const allDrawnXinFa = [...drawnHealers, ...drawnDps];

  // 4. 随机打乱心法并分配给队员
  // Fisher-Yates Shuffle
  for (let i = allDrawnXinFa.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allDrawnXinFa[i], allDrawnXinFa[j]] = [allDrawnXinFa[j], allDrawnXinFa[i]];
  }

  // 5. 组装结果
  for (let i = 0; i < members.length; i++) {
    if (i < allDrawnXinFa.length) {
      results.push({
        id: allDrawnXinFa[i].id,
        name: allDrawnXinFa[i].name,
        image: allDrawnXinFa[i].image,
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
