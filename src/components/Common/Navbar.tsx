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
    <header className="sticky top-0 z-40 bg-paper-100/95 backdrop-blur-md border-b border-paper-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-bamboo-700 flex items-center justify-center text-paper-50 shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-lg text-wood-900 tracking-wide">
                初中语文教资面试备课工作台
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 border border-bamboo-200">
                10分钟试讲
              </span>
            </div>
            <p className="text-xs text-wood-500 font-serif">
              统编版6册 · 146篇课文教学设计与原文
            </p>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-paper-200/80 p-1 rounded-xl border border-paper-border">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`btn-tactile flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
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
            className={`btn-tactile flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
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
            className={`btn-tactile flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              currentTab === 'methodology'
                ? 'bg-paper-card text-bamboo-800 shadow-sm font-bold'
                : 'text-wood-600 hover:text-wood-900 hover:bg-paper-50/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>文体教学法</span>
          </button>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center space-x-3">
          {/* Exam Simulator Button */}
          <button
            onClick={onOpenExamSimulator}
            className="btn-tactile flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-wood-800 text-white hover:bg-wood-900 shadow-sm text-xs md:text-sm font-medium"
            title="模拟抽取一篇课题"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>考场模拟抽题</span>
          </button>

          {/* Countdown Pill */}
          <div className="hidden sm:flex items-center space-x-1 px-3 py-1 rounded-full bg-paper-200 text-wood-800 border border-paper-border text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-wood-600" />
            <span>
              距12月面试 <strong>{examDaysLeft}</strong> 天
            </span>
          </div>

          {/* Floating Timer Switch */}
          <button
            onClick={onToggleTimer}
            className={`btn-tactile p-2 rounded-lg border text-xs font-medium flex items-center space-x-1 ${
              timerActive
                ? 'bg-bamboo-100 text-bamboo-800 border-bamboo-300'
                : 'bg-paper-50 text-wood-600 border-paper-border hover:bg-paper-200'
            }`}
            title={timerActive ? '关闭试讲倒计时' : '开启10分钟试讲倒计时'}
          >
            <Clock className="w-4 h-4 text-bamboo-700" />
            <span className="hidden lg:inline">{timerActive ? '计时中' : '试讲计时'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-paper-border bg-paper-50 px-2 text-xs">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
            currentTab === 'dashboard' ? 'bg-bamboo-100 text-bamboo-900 font-bold' : 'text-wood-600'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>备考概览</span>
        </button>
        <button
          onClick={() => onSelectTab('workbench')}
          className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
            currentTab === 'workbench' ? 'bg-bamboo-100 text-bamboo-900 font-bold' : 'text-wood-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>课文工作台</span>
        </button>
        <button
          onClick={() => onSelectTab('methodology')}
          className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
            currentTab === 'methodology' ? 'bg-bamboo-100 text-bamboo-900 font-bold' : 'text-wood-600'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>文体教学法</span>
        </button>
      </div>
    </header>
  );
};
