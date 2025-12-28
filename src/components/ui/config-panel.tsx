'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Users, User, Shuffle, X, Check, Search, Plus, Trash2, Heart } from 'lucide-react';
import { useLotteryStore } from '@/store/use-lottery-store';
import { ALL_XINFA, INTERNAL_DPS, EXTERNAL_DPS, HEALERS } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ConfigPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'mode' | 'xinfa' | 'team'>('mode');

  const {
    mode,
    setMode,
    selectedXinFaIds,
    toggleXinFa,
    toggleCategory,
    selectAll,
    deselectAll,
    members,
    setMembers,
    healerCount,
    setHealerCount,
    customOptions,
    addCustomOption,
    removeCustomOption,
    isSpinning,
    fixedHealerIndices,
    toggleFixedHealer
  } = useLotteryStore();

  // 模式切换处理
  const handleModeChange = (newMode: 'single' | 'team' | 'custom') => {
    setMode(newMode);
    // 切换模式时自动跳转到相关配置页
    if (newMode === 'team') setActiveTab('team');
    else if (newMode === 'custom') setActiveTab('mode'); // 自定义模式就在模式页配置
    else setActiveTab('xinfa');
  };

  // 队伍成员处理
  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const addMember = () => {
    if (members.length < 10) setMembers([...members, `队员${members.length + 1}`]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  // 自定义选项处理
  const [newOption, setNewOption] = useState('');
  const handleAddOption = () => {
    if (newOption.trim()) {
      addCustomOption(newOption.trim());
      setNewOption('');
    }
  };

  // 心法分组渲染
  const renderXinFaGroup = (title: string, list: typeof ALL_XINFA) => {
    const allSelected = list.every(x => selectedXinFaIds.includes(x.id));
    
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-gradient-to-b from-brand to-brand-secondary rounded-full" />
            <h3 className="text-white/90 font-bold text-sm">{title}</h3>
          </div>
          <button
            onClick={() => toggleCategory(list[0].type, !allSelected)}
            className="text-[10px] font-bold text-white/40 hover:text-white transition-all"
          >
            {allSelected ? '全不选' : '全选'}
          </button>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
          {list.map(xf => (
            <button
              key={xf.id}
              onClick={() => toggleXinFa(xf.id)}
              className={cn(
                "relative group flex flex-col items-center p-1.5 rounded-xl transition-all duration-300",
                selectedXinFaIds.includes(xf.id)
                  ? "bg-white/10 border-brand/30 shadow-[0_0_10px_rgba(var(--color-brand),0.1)]"
                  : "bg-white/5 border border-white/5 hover:bg-white/10 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
              )}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 relative mb-1">
                <img src={xf.image} alt={xf.name} className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <span className="text-[9px] md:text-[10px] text-white/80 text-center font-medium w-full leading-tight">{xf.name}</span>
              
              {selectedXinFaIds.includes(xf.id) && (
                <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-gradient-to-br from-brand to-brand-secondary rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-1.5 h-1.5 text-white" strokeWidth={4} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 悬浮按钮 - 高级毛玻璃 */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 p-3 rounded-full glass-button text-white"
        whileHover={{ rotate: 90, scale: 1.1 }}
        disabled={isSpinning}
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* 侧边面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            
            {/* 面板主体 - 高级便当盒毛玻璃 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white/5 backdrop-blur-3xl border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              {/* 头部 - 压缩高度 */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-gradient-to-b from-brand to-brand-secondary rounded-full" />
                  <h2 className="text-xl font-black text-white tracking-tight">抽签配置</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 标签页导航 - 精致胶囊风格 */}
              <div className="px-6 py-3">
                <div className="flex p-1 gap-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                  {[
                    { id: 'mode', label: '模式', icon: Shuffle },
                    { id: 'xinfa', label: '心法', icon: Search, disabled: mode === 'custom' },
                    { id: 'team', label: '队伍', icon: Users, disabled: mode !== 'team' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                      disabled={tab.disabled}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all duration-300",
                        activeTab === tab.id
                          ? "bg-white/10 text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-white/20"
                          : "text-white/40 hover:text-white/70",
                        tab.disabled && "opacity-20 cursor-not-allowed"
                      )}
                    >
                      <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-brand" : "")} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 内容区域 - 滚动 */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                
                {/* 模式选择 */}
                {activeTab === 'mode' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { id: 'single', title: '个人抽签', desc: '单人随机抽取心法', icon: User },
                        { id: 'team', title: '队伍抽签', desc: '根据队员人数和治疗需求自动分配', icon: Users },
                        { id: 'custom', title: '自定义抽签', desc: '自定义选项进行抽取', icon: Settings },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleModeChange(m.id as any)}
                          className={cn(
                            "flex items-center gap-4 p-5 rounded-[24px] border transition-all duration-500 text-left group relative overflow-hidden",
                            mode === m.id
                              ? "bg-white/10 border-brand/50 shadow-[0_0_30px_rgba(var(--color-brand),0.15)]"
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                          )}
                        >
                          {/* 选中时的背景微光 */}
                          {mode === m.id && (
                            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-brand-secondary/10 animate-pulse" />
                          )}
                          
                          <div className={cn(
                            "p-3 rounded-2xl relative z-10 transition-transform duration-500 group-hover:scale-110",
                            mode === m.id ? "bg-gradient-to-br from-brand to-brand-secondary text-white shadow-lg shadow-brand/20" : "bg-white/10 text-white/50"
                          )}>
                            <m.icon className="w-6 h-6" />
                          </div>
                          <div className="relative z-10">
                            <h3 className="text-white font-black text-lg tracking-tight">{m.title}</h3>
                            <p className="text-white/40 text-xs">{m.desc}</p>
                          </div>
                          {mode === m.id && (
                            <div className="ml-auto relative z-10 w-6 h-6 rounded-full bg-gradient-to-br from-brand/20 to-brand-secondary/20 flex items-center justify-center border border-brand/50">
                              <Check className="text-brand w-4 h-4" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* 自定义模式的选项配置 */}
                    {mode === 'custom' && (
                      <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-white font-bold mb-4">自定义选项 ({customOptions.length})</h3>
                        
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                            placeholder="输入选项内容..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:border-brand/50 focus:bg-white/10 outline-none transition-all"
                          />
                          <button 
                            onClick={handleAddOption}
                            className="bg-gradient-to-r from-brand to-brand-secondary hover:opacity-90 text-white px-4 rounded-xl flex items-center gap-2 font-bold transition-all"
                          >
                            <Plus className="w-4 h-4" /> 添加
                          </button>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {customOptions.map((opt, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 group hover:bg-white/10 border border-white/5 transition-all">
                              <span className="text-white font-medium">{opt}</span>
                              <button 
                                onClick={() => removeCustomOption(opt)}
                                className="text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {customOptions.length === 0 && (
                            <div className="text-center text-white/30 py-8 italic">暂无选项，请添加</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 心法选择 */}
                {activeTab === 'xinfa' && (
                  <div className="animate-in fade-in slide-in-from-right-4">
                    {/* 已选吸顶组件 - 重新设计：浅色高不透明度、更薄 */}
                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/20 backdrop-blur-2xl py-2 z-10 -mx-2 px-4 rounded-xl border border-white/20 shadow-xl">
                       <div className="flex items-center gap-2">
                         <div className="w-1 h-3 bg-gradient-to-b from-brand to-brand-secondary rounded-full" />
                         <span className="text-white font-bold text-[10px] uppercase tracking-widest">已选: {selectedXinFaIds.length}</span>
                       </div>
                       <div className="flex gap-1.5">
                         <button onClick={selectAll} className="text-[10px] font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-all">全选</button>
                         <button onClick={deselectAll} className="text-[10px] font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-all">清空</button>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                      {renderXinFaGroup('内功输出', INTERNAL_DPS)}
                      {renderXinFaGroup('外功输出', EXTERNAL_DPS)}
                      {renderXinFaGroup('治疗心法', HEALERS)}
                    </div>
                  </div>
                )}

                {/* 队伍设置 */}
                {activeTab === 'team' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <h3 className="text-white font-black mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-gradient-to-b from-brand to-brand-secondary rounded-full"></span>
                        治疗配置
                      </h3>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                        <label className="text-white/80 text-sm mb-4 block font-bold">必须包含治疗心法数量: <span className="text-brand font-black text-xl ml-2">{healerCount}</span></label>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="1"
                          value={healerCount}
                          onChange={(e) => setHealerCount(parseInt(e.target.value))}
                          className="w-full accent-brand h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-black text-white/30 mt-3 px-1">
                          <span>0</span>
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-black flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-gradient-to-b from-brand to-brand-secondary rounded-full"></span>
                          队员名单 ({members.length})
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                            <span>点击爱心固定治疗位</span>
                            <Heart className="w-3 h-3 fill-brand text-brand" />
                          </div>
                          <button 
                            onClick={addMember}
                            disabled={members.length >= 10}
                            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand border border-brand/30 px-4 py-2 rounded-xl flex items-center gap-1 disabled:opacity-50 font-bold transition-all"
                          >
                            <Plus className="w-3 h-3" /> 添加
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {members.map((member, i) => (
                          <div key={i} className="flex items-center gap-3 group">
                            <span className="text-white/20 text-[10px] font-black w-4">{String(i + 1).padStart(2, '0')}</span>
                            <input
                              type="text"
                              value={member}
                              onChange={(e) => handleMemberChange(i, e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-medium focus:border-brand/50 focus:bg-white/10 outline-none transition-all"
                            />
                            
                            {/* 固定治疗勾选 */}
                            <button
                              onClick={() => toggleFixedHealer(i)}
                              disabled={!fixedHealerIndices.includes(i) && fixedHealerIndices.length >= healerCount}
                              className={cn(
                                "p-2.5 rounded-xl transition-all border",
                                fixedHealerIndices.includes(i)
                                  ? "bg-brand/20 border-brand/50 text-brand shadow-[0_0_10px_rgba(var(--color-brand),0.2)]"
                                  : "bg-white/5 border-white/10 text-white/20 hover:text-white/40 disabled:opacity-10 disabled:cursor-not-allowed"
                              )}
                              title={fixedHealerIndices.includes(i) ? "取消固定治疗" : "固定为此人抽取治疗心法"}
                            >
                              <Heart className={cn("w-4 h-4", fixedHealerIndices.includes(i) ? "fill-current" : "")} />
                            </button>

                            <button
                              onClick={() => removeMember(i)}
                              disabled={members.length <= 1}
                              className="p-2.5 text-white/20 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all disabled:opacity-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
