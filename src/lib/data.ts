export interface XinFa {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'healer';
  image: string;
}

export const INTERNAL_DPS: XinFa[] = [
  { id: 'bxj', name: '冰心诀', type: 'internal', image: '/xinfa/冰心诀.png' },
  { id: 'hjy', name: '花间游', type: 'internal', image: '/xinfa/花间游.png' },
  { id: 'dj', name: '毒经', type: 'internal', image: '/xinfa/毒经.png' },
  { id: 'mw', name: '莫问', type: 'internal', image: '/xinfa/莫问.png' },
  { id: 'wf', name: '无方', type: 'internal', image: '/xinfa/无方.png' },
  { id: 'yjj', name: '易筋经', type: 'internal', image: '/xinfa/易筋经.png' },
  { id: 'fysj', name: '焚影圣诀', type: 'internal', image: '/xinfa/焚影圣诀.png' },
  { id: 'zxg', name: '紫霞功', type: 'internal', image: '/xinfa/紫霞功.png' },
  { id: 'tlgd', name: '天罗诡道', type: 'internal', image: '/xinfa/天罗诡道.png' },
  { id: 'txj', name: '太玄经', type: 'internal', image: '/xinfa/太玄经.png' },
  { id: 'ztg', name: '周天功', type: 'internal', image: '/xinfa/周天功.png' },
  { id: 'yly', name: '幽罗引', type: 'internal', image: '/xinfa/幽罗引.png' },
];

export const EXTERNAL_DPS: XinFa[] = [
  { id: 'axzy', name: '傲血战意', type: 'external', image: '/xinfa/傲血战意.png' },
  { id: 'fsj', name: '分山劲', type: 'external', image: '/xinfa/分山劲.png' },
  { id: 'txjy', name: '太虚剑意', type: 'external', image: '/xinfa/太虚剑意.png' },
  { id: 'jyj', name: '惊羽诀', type: 'external', image: '/xinfa/惊羽诀.png' },
  { id: 'wsj', name: '问水诀', type: 'external', image: '/xinfa/问水诀.png' },
  { id: 'xcj', name: '笑尘诀', type: 'external', image: '/xinfa/笑尘诀.png' },
  { id: 'baj', name: '北傲诀', type: 'external', image: '/xinfa/北傲诀.png' },
  { id: 'lhj', name: '凌海诀', type: 'external', image: '/xinfa/凌海诀.png' },
  { id: 'ylj', name: '隐龙诀', type: 'external', image: '/xinfa/隐龙诀.png' },
  { id: 'gfj', name: '孤锋诀', type: 'external', image: '/xinfa/孤锋诀.png' },
  { id: 'shxj', name: '山海心诀', type: 'external', image: '/xinfa/山海心诀.png' },
];

export const HEALERS: XinFa[] = [
  { id: 'ysxj', name: '云裳心经', type: 'healer', image: '/xinfa/云裳心经.png' },
  { id: 'ljyd', name: '离经易道', type: 'healer', image: '/xinfa/离经易道.png' },
  { id: 'btj', name: '补天诀', type: 'healer', image: '/xinfa/补天诀.png' },
  { id: 'xz', name: '相知', type: 'healer', image: '/xinfa/相知.png' },
  { id: 'ls', name: '灵素', type: 'healer', image: '/xinfa/灵素.png' },
];

export const ALL_XINFA = [...INTERNAL_DPS, ...EXTERNAL_DPS, ...HEALERS];

export const BACKGROUNDS = [
  { id: 'cg', src: '/bg/cg.jfif', theme: '#1fc9e7' }, // 青色
  { id: 'mj', src: '/bg/mj.jfif', theme: '#e71f1f' }, // 红色
  { id: 'wd', src: '/bg/wd.jfif', theme: '#a51fe7' }, // 紫色
];
