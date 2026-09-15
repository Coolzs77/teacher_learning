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
  Calendar,
  Clock,
  Compass
} from 'lucide-react';

export const Cet6Workbench: React.FC = () => {
  const [activeModule, setActiveModule] = useState<Cet6ModuleId>('score');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
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
      showToast(`已成功将「${item.title}」收入专属错题本！`);
    } catch (e) {
      console.error(e);
      showToast('保存错题失败，请重试');
    }
  };

  const moduleTitles: Record<Cet6ModuleId, { title: string; desc: string; tag: string }> = {
    score: {
      title: '提分规划与考场时间表',
      desc: '388 分 ➔ 425+ 分差距归因，130 分钟考场答题与收卷节奏表，不盲目刷题。',
      tag: '战略底盘'
    },
    cloze: {
      title: '选词填空四步专项突破',
      desc: '抓词尾辨词性、看空前后找线索、单空快速排除，4-5 分钟挑出 4 道好拿分的题。',
      tag: '必抓送分题'
    },
    translation: {
      title: '汉译英台阶演练工坊',
      desc: '划主谓宾定主干、高频词汇提示、套用 10 大句型、实操动笔试写与范文对照。',
      tag: '稳扎稳打'
    },
    writing: {
      title: '五段万能作文与仿写',
      desc: '个人成长 ➔ 他人影响 ➔ 社会价值底层逻辑，逐段背诵打卡与 180 词即时仿写。',
      tag: '写作基本盘'
    },
    syntax: {
      title: '真题长难句步步拆解',
      desc: '层层剥离修饰从句，5 秒锁定主谓宾主干，彻底解决回读与读不懂的问题。',
      tag: '阅读攻坚'
    },
    grammar: {
      title: '真题核心语法实战',
      desc: '非谓语动词、定语从句、倒装强调、虚拟语气高频题型实测与错因剖析。',
      tag: '单题突破'
    },
    mistakes: {
      title: '专属错题本与攻坚归因',
      desc: '按词性看错、句意理解偏差、盲区、粗心归类，复练标记攻克，拒绝反复踩坑。',
      tag: '查漏补缺'
    },
    emergency: {
      title: '考场保底应急锦囊',
      desc: '举例卡壳套句、大脑空白保底 5 步默写法、考前 20 分钟必背 10 句，慌乱急救。',
      tag: '保底护航'
    },
  };

  const currentModuleInfo = moduleTitles[activeModule];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn space-y-6">
      {/* Toast 提示 */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-wood-900 text-paper-50 px-4 py-2 rounded-xl text-xs font-serif shadow-xl flex items-center space-x-2 border border-stone-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-bamboo-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 2-Column 主布局：左侧导航目录 + 右侧操作区 */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* 左侧专项目录（收起时不占宽度，保持与教资模块一致体验） */}
        {!isSidebarCollapsed && (
          <Cet6Sidebar
            activeModule={activeModule}
            onSelectModule={setActiveModule}
            onCollapse={() => setIsSidebarCollapsed(true)}
          />
        )}

        {/* 右侧主工作面板 */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {/* 顶部长条状态卡片（严格参照教资顶部卡片风格） */}
          <div className="bg-paper-card border border-paper-border rounded-2xl p-4 sm:p-6 shadow-scholarly flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                {/* 若左侧导航已收起，显示展开按钮 */}
                {isSidebarCollapsed && (
                  <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 hover:text-wood-900 border border-paper-border text-xs font-serif transition mr-1"
                    title="展开左侧备考目录"
                  >
                    <PanelLeftOpen className="w-3.5 h-3.5 text-bamboo-700" />
                    <span>展开目录</span>
                  </button>
                )}

                <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-serif font-medium flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>英语六级备考</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-paper-100 text-wood-700 font-serif border border-paper-border">
                  {currentModuleInfo.tag}
                </span>
                <span className="text-xs text-wood-500 font-serif hidden sm:inline">
                  琪琪专属 · 388 ➔ 425+ 分突破
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-serif font-bold text-wood-900 truncate">
                {currentModuleInfo.title}
              </h1>

              <p className="text-xs sm:text-sm text-wood-600 font-serif leading-relaxed">
                {currentModuleInfo.desc}
              </p>
            </div>

            {/* 右侧微型状态指示器 */}
            <div className="flex items-center space-x-3 text-xs font-serif text-wood-600 shrink-0 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-paper-border">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-paper-50 rounded-xl border border-paper-border">
                <Compass className="w-3.5 h-3.5 text-bamboo-700" />
                <span>目标差距：37 分</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-paper-50 rounded-xl border border-paper-border">
                <Clock className="w-3.5 h-3.5 text-cinnabar-700" />
                <span>总时长：130 分钟</span>
              </div>
            </div>
          </div>

          {/* 各子功能视图切换渲染 */}
          <div className="w-full space-y-6">
            {activeModule === 'score' && <Cet6ScoreView />}
            {activeModule === 'cloze' && <Cet6ClozeView onAddMistake={handleAddMistake} />}
            {activeModule === 'translation' && <Cet6TranslationView />}
            {activeModule === 'writing' && <Cet6WritingView />}
            {activeModule === 'syntax' && <Cet6SyntaxView onAddMistake={handleAddMistake} />}
            {activeModule === 'grammar' && <Cet6GrammarView onAddMistake={handleAddMistake} />}
            {activeModule === 'mistakes' && <Cet6MistakeView />}
            {activeModule === 'emergency' && <Cet6EmergencyView />}
          </div>
        </div>
      </div>
    </div>
  );
};
