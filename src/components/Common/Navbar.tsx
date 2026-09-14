import React from 'react';
import { BookOpen, Compass, GraduationCap, Sparkles, Clock } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'workbench' | 'methodology';
  onSelectTab: (tab: 'dashboard' | 'workbench' | 'methodology') => void;
  onOpenExamSimulator: () => void;
  examDaysLeft: number;
  timerActive: boolean;
  onToggleTimer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenExamSimulator,
  examDaysLeft,
  timerActive,
  onToggleTimer,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-paper-100/95 backdrop-blur-md border-b border-paper-border shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand & Title - Responsive for Mobile */}
        <div
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer min-w-0"
          onClick={() => onSelectTab('dashboard')}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-bamboo-700 flex items-center justify-center text-paper-50 shadow-md shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-serif font-black text-sm sm:text-lg text-wood-900 tracking-wide truncate">
                <span className="inline sm:hidden">初中语文试讲备考台</span>
                <span className="hidden sm:inline">初中语文教资面试备考工作台</span>
              </span>
              <span className="hidden xs:inline text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 border border-bamboo-200 shrink-0">
                10分钟试讲
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-wood-500 font-serif">
              统编版6册 · 158篇课文教学设计、原文与结构化板书
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-paper-200/80 p-1 rounded-xl border border-paper-border">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`btn-tactile flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-paper-card text-bamboo-800 shadow-sm font-bold'
                : 'text-wood-600 hover:text-wood-900 hover:bg-paper-50/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>备考概览</span>
          </button>

          <button
            onClick={() => onSelectTab('workbench')}
            className={`btn-tactile flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition cursor-pointer ${
              currentTab === 'workbench'
                ? 'bg-paper-card text-bamboo-800 shadow-sm font-bold'
                : 'text-wood-600 hover:text-wood-900 hover:bg-paper-50/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>课文工作台</span>
          </button>

          <button
            onClick={() => onSelectTab('methodology')}
            className={`btn-tactile flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition cursor-pointer ${
              currentTab === 'methodology'
                ? 'bg-paper-card text-bamboo-800 shadow-sm font-bold'
                : 'text-wood-600 hover:text-wood-900 hover:bg-paper-50/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>文体教学法</span>
          </button>
        </nav>

        {/* Right Tools - Compact on Mobile */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {/* Exam Simulator Button */}
          <button
            onClick={onOpenExamSimulator}
            className="btn-tactile flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-wood-800 text-white hover:bg-wood-900 shadow-sm text-xs sm:text-sm font-medium cursor-pointer"
            title="模拟考场抽取试讲题目"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="inline sm:hidden">抽题</span>
            <span className="hidden sm:inline">考场抽题</span>
          </button>

          {/* Countdown Pill for Desktop */}
          <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-paper-200 text-wood-800 border border-paper-border text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-wood-600" />
            <span>
              距面试 <strong>{examDaysLeft}</strong> 天
            </span>
          </div>

          {/* Quick Timer Button */}
          <button
            onClick={onToggleTimer}
            className={`btn-tactile p-1.5 sm:p-2 rounded-lg border text-xs font-medium flex items-center space-x-1 cursor-pointer ${
              timerActive
                ? 'bg-bamboo-100 text-bamboo-800 border-bamboo-300'
                : 'bg-paper-50 text-wood-600 border-paper-border hover:bg-paper-200'
            }`}
            title={timerActive ? '正在试讲倒计时' : '开启10分钟试讲倒计时'}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-bamboo-700" />
            <span className="hidden xl:inline">{timerActive ? '计时中' : '试讲计时'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Ergonomic Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-1.5 border-t border-paper-border bg-paper-50/95 px-2 text-xs font-serif shadow-xs">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1 rounded-lg transition ${
            currentTab === 'dashboard'
              ? 'bg-bamboo-700 text-white font-bold shadow-xs'
              : 'text-wood-600 hover:text-wood-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>备考概览</span>
        </button>
        <button
          onClick={() => onSelectTab('workbench')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1 rounded-lg transition ${
            currentTab === 'workbench'
              ? 'bg-bamboo-700 text-white font-bold shadow-xs'
              : 'text-wood-600 hover:text-wood-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>课文备课</span>
        </button>
        <button
          onClick={() => onSelectTab('methodology')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1 rounded-lg transition ${
            currentTab === 'methodology'
              ? 'bg-bamboo-700 text-white font-bold shadow-xs'
              : 'text-wood-600 hover:text-wood-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>文体秘籍</span>
        </button>
      </div>
    </header>
  );
};
