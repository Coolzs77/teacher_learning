import React, { useState } from 'react';
import { Cet6ScoreStrategy } from './Cet6ScoreStrategy';
import { Cet6WritingModule } from './Cet6WritingModule';
import { Cet6ClozeAndSyntax } from './Cet6ClozeAndSyntax';
import { Cet6TranslationModule } from './Cet6TranslationModule';
import { Cet6EmergencyPack } from './Cet6EmergencyPack';
import {
  TrendingUp,
  PenTool,
  Split,
  Languages,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  Award
} from 'lucide-react';

export type Cet6Tab = 'strategy' | 'writing' | 'syntax' | 'translation' | 'emergency';

export const Cet6Workbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Cet6Tab>('strategy');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 pb-16">
      {/* 顶部二级专属子导航条 */}
      <div className="bg-white border-b border-slate-200 sticky top-14 sm:top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 overflow-x-auto hide-scrollbar">
            {/* 琪琪专属标识 */}
            <div className="hidden lg:flex items-center space-x-2 shrink-0 mr-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                CET6
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800">琪琪专属冲刺工作台</span>
                <span className="text-[10px] text-slate-500 block">388分 ➔ 425+ 精密增分</span>
              </div>
            </div>

            {/* 5 个专项导航按钮 */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('strategy')}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'strategy'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>1. 提分战略看板</span>
              </button>

              <button
                onClick={() => setActiveTab('writing')}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'writing'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PenTool className="w-4 h-4 text-amber-300" />
                <span>2. 核心写作骨架</span>
              </button>

              <button
                onClick={() => setActiveTab('syntax')}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'syntax'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Split className="w-4 h-4 text-sky-400" />
                <span>3. 选词秒杀与重难句</span>
              </button>

              <button
                onClick={() => setActiveTab('translation')}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'translation'
                    ? 'bg-indigo-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Languages className="w-4 h-4 text-rose-300" />
                <span>4. 翻译冲刺语料</span>
              </button>

              <button
                onClick={() => setActiveTab('emergency')}
                className={`btn-tactile px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'emergency'
                    ? 'bg-rose-700 text-white font-bold shadow-xs'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>5. 考场急救包</span>
              </button>
            </div>

            <div className="hidden xl:flex items-center space-x-1 pl-4 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>目标 425+ 一次通过</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主体工作区 */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'strategy' && <Cet6ScoreStrategy />}
        {activeTab === 'writing' && <Cet6WritingModule />}
        {activeTab === 'syntax' && <Cet6ClozeAndSyntax />}
        {activeTab === 'translation' && <Cet6TranslationModule />}
        {activeTab === 'emergency' && <Cet6EmergencyPack />}
      </main>
    </div>
  );
};
