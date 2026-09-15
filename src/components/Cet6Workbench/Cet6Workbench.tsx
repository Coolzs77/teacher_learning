import React, { useState } from 'react';
import { Cet6ScoreStrategy } from './Cet6ScoreStrategy';
import { Cet6ClozeTrainer } from './Cet6ClozeTrainer';
import { Cet6TranslationWorkshop } from './Cet6TranslationWorkshop';
import { Cet6WritingModule } from './Cet6WritingModule';
import { Cet6ClozeAndSyntax } from './Cet6ClozeAndSyntax';
import { Cet6GrammarPractice } from './Cet6GrammarPractice';
import { Cet6MistakeNotebook } from './Cet6MistakeNotebook';
import { Cet6EmergencyPack } from './Cet6EmergencyPack';
import { Cet6MistakeItem } from '../../data/cet6PracticeData';
import {
  TrendingUp,
  Scissors,
  Languages,
  PenTool,
  Split,
  BookMarked,
  ShieldAlert,
  Sparkles,
  Award,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';

export type Cet6Tab =
  | 'strategy'
  | 'cloze'
  | 'translation'
  | 'writing'
  | 'syntax'
  | 'grammar'
  | 'mistakes'
  | 'emergency';

export const Cet6Workbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Cet6Tab>('strategy');

  // 全局收录错题回调（可从选词填空、翻译、长难句、语法任意组件调用）
  const handleAddMistake = (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => {
    try {
      const saved = localStorage.getItem('cet6_mistakes');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift({
        ...item,
        id: `mis-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        isMastered: false
      });
      localStorage.setItem('cet6_mistakes', JSON.stringify(list));
    } catch (e) {}
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/60 pb-16">
      {/* 顶部专属二级子导航条 */}
      <div className="bg-white border-b border-slate-200 sticky top-14 sm:top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 overflow-x-auto hide-scrollbar">
            {/* 专属标识 */}
            <div className="hidden lg:flex items-center space-x-2 shrink-0 mr-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                CET6
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900">琪琪六级专练台</span>
                <span className="text-[10px] text-emerald-600 font-bold block">388 ➔ 425+ 突破</span>
              </div>
            </div>

            {/* 8 个专项导航按钮 */}
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => setActiveTab('strategy')}
                className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'strategy'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. 提分战报</span>
              </button>

              <button
                onClick={() => setActiveTab('cloze')}
                className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'cloze'
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>2. 选词填空</span>
                <span className="text-[9px] bg-rose-200 text-rose-900 px-1 rounded font-bold">送14分</span>
              </button>

              <button
                onClick={() => setActiveTab('translation')}
                className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'translation'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Languages className="w-3.5 h-3.5 text-rose-300" />
                <span>3. 汉译英台阶</span>
              </button>

              <button
                onClick={() => setActiveTab('writing')}
                className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'writing'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-amber-300" />
                <span>4. 万能作文</span>
              </button>

              <button
                onClick={() => setActiveTab('syntax')}
                className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'syntax'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Split className="w-3.5 h-3.5 text-sky-400" />
                <span>5. 长难句拆解</span>
              </button>

              <button
                onClick={() => setActiveTab('grammar')}
                className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'grammar'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>6. 核心语法</span>
              </button>

              <button
                onClick={() => setActiveTab('mistakes')}
                className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'mistakes'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5 text-purple-300" />
                <span>7. 专属错题本</span>
              </button>

              <button
                onClick={() => setActiveTab('emergency')}
                className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'emergency'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>8. 考场急救包</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主体工作区 */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* “今天想练什么？”快捷点选面板（在任何 Tab 顶部都提供即插即用入口） */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-indigo-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm sm:text-base">琪琪今天想练什么？（点选即刻沉浸练习）</h3>
            </div>
            <span className="text-[11px] text-slate-300 font-sans">
              单词在百词斩刷完即可 · 无需刻板分阶段 · 直击痛点提分
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
            {[
              { tab: 'cloze', label: '选词填空秒杀', icon: '✂️', highlight: true },
              { tab: 'translation', label: '汉译英台阶拆解', icon: '🌐', highlight: true },
              { tab: 'writing', label: '5段万能作文仿写', icon: '✍️', highlight: true },
              { tab: 'syntax', label: '长难句步步拆解', icon: '🌲', highlight: false },
              { tab: 'grammar', label: '六级核心语法突击', icon: '⚡', highlight: false },
              { tab: 'mistakes', label: '错题本归因攻坚', icon: '📕', highlight: false },
              { tab: 'strategy', label: '388➔425+ 战报', icon: '📊', highlight: false },
              { tab: 'emergency', label: '考场急救包必背', icon: '🚑', highlight: false }
            ].map((btn) => (
              <button
                key={btn.tab}
                onClick={() => setActiveTab(btn.tab as any)}
                className={`btn-tactile p-2 rounded-xl text-center border transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  activeTab === btn.tab
                    ? 'bg-white text-indigo-950 font-bold border-white shadow-md'
                    : btn.highlight
                    ? 'bg-indigo-900/60 border-indigo-400/30 text-indigo-100 hover:bg-indigo-800/80'
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-700/80'
                }`}
              >
                <span className="text-sm">{btn.icon}</span>
                <span className="text-[11px] truncate w-full">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 页面渲染 */}
        {activeTab === 'strategy' && <Cet6ScoreStrategy />}
        {activeTab === 'cloze' && <Cet6ClozeTrainer onAddMistake={handleAddMistake} />}
        {activeTab === 'translation' && <Cet6TranslationWorkshop onAddMistake={handleAddMistake} />}
        {activeTab === 'writing' && <Cet6WritingModule />}
        {activeTab === 'syntax' && (
          <Cet6ClozeAndSyntax
            onAddMistake={handleAddMistake}
            onGoToClozeTrainer={() => setActiveTab('cloze')}
          />
        )}
        {activeTab === 'grammar' && <Cet6GrammarPractice onAddMistake={handleAddMistake} />}
        {activeTab === 'mistakes' && <Cet6MistakeNotebook />}
        {activeTab === 'emergency' && <Cet6EmergencyPack />}
      </main>
    </div>
  );
};
