import React, { useState } from 'react';
import { Cet6Sidebar, Cet6ModuleId } from './Cet6Sidebar';
import { Cet6ScoreView } from './Cet6ScoreView';
import { Cet6ClozeView } from './Cet6ClozeView';
import { Cet6TranslationView } from './Cet6TranslationView';
import { Cet6WritingView } from './Cet6WritingView';
import { Cet6SyntaxView } from './Cet6SyntaxView';
import { Cet6GrammarView } from './Cet6GrammarView';
import { Cet6MistakeView } from './Cet6MistakeView';
import { Cet6EmergencyView } from './Cet6EmergencyView';
import { Cet6MistakeItem, INITIAL_CET6_MISTAKES } from '../../data/cet6PracticeData';
import {
  PanelLeftOpen,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';

interface Cet6WorkbenchProps {
  onSwitchToChinese?: () => void;
}

export const Cet6Workbench: React.FC<Cet6WorkbenchProps> = ({ onSwitchToChinese }) => {
  const [activeModule, setActiveModule] = useState<Cet6ModuleId>('score');
  const [activeSubSection, setActiveSubSection] = useState<string>('plan');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSelectModuleWithSub = (id: Cet6ModuleId, sub?: string) => {
    setActiveModule(id);
    if (sub) {
      setActiveSubSection(sub);
    } else {
      const defaultSubMap: Record<Cet6ModuleId, string> = {
        score: 'plan',
        cloze: 'pos',
        translation: 'practice',
        writing: 'template',
        syntax: 'step1',
        grammar: 'all',
        mistakes: 'all',
        emergency: 'examples',
      };
      setActiveSubSection(defaultSubMap[id] || 'default');
    }
  };

  const handleAddMistake = (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => {
    try {
      const saved = localStorage.getItem('cet6_mistakes');
      const list: Cet6MistakeItem[] = saved ? JSON.parse(saved) : INITIAL_CET6_MISTAKES;
      const newItem: Cet6MistakeItem = {
        ...item,
        id: 'mistake-' + Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        isMastered: false,
      };
      const updated = [newItem, ...list];
      localStorage.setItem('cet6_mistakes', JSON.stringify(updated));
      showToast(`已成功将「${item.title}」记入错题本！`);
    } catch (e) {
      console.error(e);
      showToast('保存错题失败，请重试');
    }
  };

  const moduleTitles: Record<Cet6ModuleId, { title: string; desc: string; tag: string }> = {
    score: {
      title: '提分账本与时间表',
      desc: '离及格线还差 37 分，考场 130 分钟怎么掐表，不用瞎忙活。',
      tag: '多拿37分',
    },
    cloze: {
      title: '选词填空：挑送分题做',
      desc: '看词尾认词性，4分钟把最简单的4道题做对，剩下蒙一个。稳拿14分！',
      tag: '稳拿14分',
    },
    translation: {
      title: '汉译英：套句型写',
      desc: '先定主谓宾，再套常用句型，不用生僻词也能拿高分。',
      tag: '稳拿70分',
    },
    writing: {
      title: '5段作文模板与练写',
      desc: '考前把这5段背熟，考场往里填词，180词轻松搞定。',
      tag: '背熟就过',
    },
    syntax: {
      title: '长难句：抓主谓宾',
      desc: '不被长定语绕晕，一眼看出谁做了什么，阅读不再反复回读。',
      tag: '读懂长句',
    },
    grammar: {
      title: '常考语法小练习',
      desc: '只练非谓语、定从、倒装这几类常考题，做懂出题套路。',
      tag: '常考必练',
    },
    mistakes: {
      title: '琪琪的错题本',
      desc: '做错的记在这，考前翻两遍，同样的坑不踩第二次。',
      tag: '少踩坑',
    },
    emergency: {
      title: '考场卡壳急救包',
      desc: '没话说直接套例子，脑子空了默写保底5句。',
      tag: '心里有底',
    },
  };

  const currentModuleInfo = moduleTitles[activeModule];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-serif space-y-6">
      {/* Toast 提示 */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-wood-900 text-paper-50 px-4 py-2 rounded-xl text-xs shadow-xl flex items-center space-x-2 border border-stone-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-bamboo-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 2-Column 主布局：左侧导航目录 + 右侧操作区 */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* 左侧专项目录（收起时不占宽度，支持树状子功能） */}
        {!isSidebarCollapsed && (
          <Cet6Sidebar
            activeModule={activeModule}
            activeSubSection={activeSubSection}
            onSelectModule={handleSelectModuleWithSub}
            onCollapse={() => setIsSidebarCollapsed(true)}
            onSwitchToChinese={onSwitchToChinese}
          />
        )}

        {/* 右侧主工作面板 */}
        <div className="flex-1 min-w-0 space-y-5 w-full">
          {/* 顶部长条状态卡片（无任何横向tab干扰） */}
          <div className="bg-paper-card border border-paper-border rounded-2xl p-4 sm:p-5 shadow-scholarly flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-card-enter">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                {isSidebarCollapsed && (
                  <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 text-xs border border-paper-border transition mr-1 cursor-pointer"
                    title="展开左侧备考目录"
                  >
                    <PanelLeftOpen className="w-3.5 h-3.5 text-bamboo-700" />
                    <span>展开目录</span>
                  </button>
                )}

                <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>英语六级备考</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-paper-100 text-wood-700 border border-paper-border">
                  {currentModuleInfo.tag}
                </span>
                <span className="text-xs text-wood-500 hidden sm:inline">
                  琪琪专属 · 目标及格线 425 分
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-wood-900 truncate">
                {currentModuleInfo.title}
              </h1>

              <p className="text-xs sm:text-sm text-wood-600 leading-relaxed">
                {currentModuleInfo.desc}
              </p>
            </div>

            {/* 右侧轻量状态指标 */}
            <div className="flex items-center space-x-2.5 text-xs text-wood-600 shrink-0 self-start sm:self-center">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-paper-50 rounded-xl border border-paper-border">
                <Target className="w-3.5 h-3.5 text-cinnabar-700" />
                <span>差 37 分及格</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-paper-50 rounded-xl border border-paper-border">
                <Clock className="w-3.5 h-3.5 text-bamboo-700" />
                <span>总时长 130 分钟</span>
              </div>
            </div>
          </div>

          {/* 各功能视图切换渲染 */}
          <div className="w-full">
            {activeModule === 'score' && (
              <Cet6ScoreView
                activeSubSection={activeSubSection}
                onNavigateToModule={handleSelectModuleWithSub}
              />
            )}
            {activeModule === 'cloze' && (
              <Cet6ClozeView
                activeSubSection={activeSubSection}
                onAddMistake={handleAddMistake}
              />
            )}
            {activeModule === 'translation' && (
              <Cet6TranslationView
                activeSubSection={activeSubSection}
                onAddMistake={handleAddMistake}
              />
            )}
            {activeModule === 'writing' && (
              <Cet6WritingView activeSubSection={activeSubSection} />
            )}
            {activeModule === 'syntax' && (
              <Cet6SyntaxView
                activeSubSection={activeSubSection}
                onAddMistake={handleAddMistake}
              />
            )}
            {activeModule === 'grammar' && (
              <Cet6GrammarView
                activeSubSection={activeSubSection}
                onAddMistake={handleAddMistake}
              />
            )}
            {activeModule === 'mistakes' && (
              <Cet6MistakeView activeSubSection={activeSubSection} />
            )}
            {activeModule === 'emergency' && (
              <Cet6EmergencyView activeSubSection={activeSubSection} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
