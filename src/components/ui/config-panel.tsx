'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Users, User, Shuffle, X, Check, Search, Plus, Trash2 } from 'lucide-react';
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
    isSpinning
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button 
            onClick={() => toggleCategory(list[0].type, !allSelected)}
            className="text-xs text-white/70 hover:text-white bg-white/10 px-2 py-1 rounded"
          >
            {allSelected ? '全不选' : '全选'}
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {list.map(xf => (
            <button
              key={xf.id}
              onClick={() => toggleXinFa(xf.id)}
              className={cn(
                "relative group flex flex-col items-center p-2 rounded-xl transition-all duration-200",
                selectedXinFaIds.includes(xf.id)
                  ? "bg-brand/20 border border-brand/50 shadow-[0_0_15px_rgba(var(--color-brand),0.3)]"
                  : "bg-white/5 border border-white/10 hover:bg-white/10 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
              )}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 relative mb-1">
                <img src={xf.image} alt={xf.name} className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <span className="text-[10px] md:text-xs text-white text-center font-medium">{xf.name}</span>
              
              {selectedXinFaIds.includes(xf.id) && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-gradient-to-br from-brand to-brand-secondary rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-2 h-2 text-white" />
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
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-black/40 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-2xl font-black text-white tracking-tighter">抽签配置</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 标签页导航 */}
              <div className="flex p-4 gap-2">
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
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-brand to-brand-secondary text-white shadow-lg shadow-brand/20"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
                      tab.disabled && "opacity-30 cursor-not-allowed"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
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
                            "flex items-center gap-4 p-5 rounded-2xl border transition-all text-left",
                            mode === m.id 
                              ? "bg-brand/10 border-brand/50 shadow-[0_0_20px_rgba(var(--color-brand),0.1)]" 
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          )}
                        >
                          <div className={cn(
                            "p-3 rounded-xl",
                            mode === m.id ? "bg-gradient-to-br from-brand to-brand-secondary text-white" : "bg-white/10 text-white/50"
                          )}>
                            <m.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-white font-black text-lg">{m.title}</h3>
                            <p className="text-white/50 text-xs">{m.desc}</p>
                          </div>
                          {mode === m.id && <Check className="ml-auto text-brand w-6 h-6" />}
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
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-black/40 backdrop-blur-xl py-3 z-10 -mx-2 px-2 rounded-b-xl">
                       <span className="text-white/70 text-xs font-bold uppercase tracking-widest">已选: {selectedXinFaIds.length}</span>
                       <div className="flex gap-2">
                         <button onClick={selectAll} className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg uppercase transition-all">全选</button>
                         <button onClick={deselectAll} className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg uppercase transition-all">清空</button>
                       </div>
                    </div>
                    
                    {renderXinFaGroup('内功输出', INTERNAL_DPS)}
                    {renderXinFaGroup('外功输出', EXTERNAL_DPS)}
                    {renderXinFaGroup('治疗心法', HEALERS)}
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
                        <button 
                          onClick={addMember}
                          disabled={members.length >= 10}
                          className="text-xs bg-brand/10 hover:bg-brand/20 text-brand border border-brand/30 px-4 py-2 rounded-xl flex items-center gap-1 disabled:opacity-50 font-bold transition-all"
                        >
                          <Plus className="w-3 h-3" /> 添加
                        </button>
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
