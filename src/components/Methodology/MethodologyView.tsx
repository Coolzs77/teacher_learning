import React, { useState } from 'react';
import { METHODOLOGIES, Methodology } from '../../data/methodologyData';
import { LESSONS_DATA } from '../../data/lessonsData';
import { Lesson } from '../../types';
import { Chalkboard } from '../Common/Chalkboard';
import {
  GraduationCap,
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Quote,
  ArrowRight,
  BookOpen,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Scroll,
  Feather,
  Layout,
  MessageSquareQuote,
  PenTool
} from 'lucide-react';

interface MethodologyViewProps {
  onSelectLesson: (lesson: Lesson) => void;
}

const GENRE_ICONS: Record<string, string> = {
  '现代写景抒情散文': '🌿',
  '叙事散文/小说': '📖',
  '文言文': '📜',
  '古诗词': '🏮',
  '说明文/新闻/活动': '🔍',
  '议论文/思辨文本': '⚖️',
  '写作与表达专项': '✍️'
};

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onSelectLesson }) => {
  const [selectedGenreIndex, setSelectedGenreIndex] = useState<number>(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const currentMethod = METHODOLOGIES[selectedGenreIndex] || METHODOLOGIES[0];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-paper-card rounded-2xl border border-paper-border p-6 md:p-8 shadow-scholarly space-y-3">
        <div className="flex items-center space-x-2 text-bamboo-800 text-xs font-serif font-bold">
          <GraduationCap className="w-4 h-4" />
          <span>初中语文面试核心方法论 · 7大文体万能试讲切片与板书模型</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-wood-900">
          7大文体备考秘籍与试讲模型库
        </h1>
        <p className="text-xs md:text-sm text-wood-600 font-serif leading-relaxed max-w-3xl">
          教资面试考官核心考查“文体意识”与“学科素养”。散文贵在声情并茂的朗读感染力，文言贵在文白对译与文化气象，说明文重在严谨说明方法与语言准确，小说重在人物与情节镜头，写作指导课重在审题技法切片与现场微练笔。吃透7大文体模型，考场抽题从容过关。
        </p>
      </div>

      {/* Main Container: Left Sidebar + Right Content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Collapsible Sidebar */}
        <div
          className={`bg-paper-card rounded-2xl border border-paper-border shadow-scholarly transition-all duration-300 ${
            sidebarCollapsed ? 'w-full lg:w-16 p-2' : 'w-full lg:w-64 p-4'
          } shrink-0 sticky top-20 z-10`}
        >
          {/* Collapse Toggle */}
          <div className="flex items-center justify-between pb-3 border-b border-paper-border mb-3">
            {!sidebarCollapsed && (
              <span className="font-serif font-bold text-xs text-wood-800 flex items-center space-x-1.5">
                <Bookmark className="w-3.5 h-3.5 text-bamboo-700" />
                <span>文体分类导航</span>
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-paper-200 text-wood-600 transition cursor-pointer mx-auto lg:mx-0"
              title={sidebarCollapsed ? '展开导航栏' : '收起导航栏'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <span className="flex items-center space-x-1 text-xs text-wood-500 hover:text-wood-800">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>收起</span>
                </span>
              )}
            </button>
          </div>

          {/* Genre List */}
          <div className="space-y-1.5">
            {METHODOLOGIES.map((m, idx) => {
              const isSelected = selectedGenreIndex === idx;
              const icon = GENRE_ICONS[m.genre] || '📄';

              if (sidebarCollapsed) {
                return (
                  <button
                    key={m.genre}
                    onClick={() => setSelectedGenreIndex(idx)}
                    className={`w-full h-11 flex items-center justify-center rounded-xl text-base transition cursor-pointer ${
                      isSelected
                        ? 'bg-bamboo-700 text-white shadow-sm ring-2 ring-bamboo-600'
                        : 'hover:bg-paper-200 text-wood-700'
                    }`}
                    title={m.genre}
                  >
                    <span>{icon}</span>
                  </button>
                );
              }

              return (
                <button
                  key={m.genre}
                  onClick={() => setSelectedGenreIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-serif transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                      : 'hover:bg-paper-200 text-wood-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-sm shrink-0">{icon}</span>
                    <span className="truncate">{m.genre}</span>
                  </div>
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                </button>
              );
            })}
          </div>

          {!sidebarCollapsed && (
            <div className="mt-4 pt-3 border-t border-paper-border text-[11px] text-wood-500 font-serif leading-snug">
              涵盖 6 大常规文体与最新面试常考的<strong>写作指导专项课</strong>。
            </div>
          )}
        </div>

        {/* Right Main Content Area */}
        <div className="flex-1 min-w-0 bg-paper-card rounded-2xl border border-paper-border shadow-scholarly p-6 md:p-8 space-y-8">
          {/* Header Title & Tagline */}
          <div className="border-b border-paper-border pb-4 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-bamboo-100 text-bamboo-800 border border-bamboo-200 font-serif font-bold">
                {currentMethod.genre}
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-black text-wood-900">
                {currentMethod.title}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-wood-600 font-serif italic">
              “{currentMethod.tagline}”
            </p>
          </div>

          {/* 1. 10分钟5步核心教学骨架 */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-wood-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-bamboo-700" />
              <span>一、10分钟全真时间配比与教学步骤骨架</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {currentMethod.coreFramework.map((step, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-paper-50 border border-paper-border space-y-2 flex flex-col justify-between hover:border-bamboo-300 transition"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-wood-500 font-mono">
                      <span className="font-bold text-bamboo-800 font-serif">{step.step}</span>
                      <span>{step.timing}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-wood-900 mt-1">
                      {step.name}
                    </h4>
                    <p className="text-[11px] text-wood-600 mt-1 leading-snug">
                      <strong>核心目标：</strong>{step.goal}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-paper-border/60 text-[11px] text-wood-700 leading-snug">
                    {step.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 考官雷区 vs 高分技巧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deductions */}
            <div className="p-5 rounded-xl bg-cinnabar-50/70 border border-cinnabar-200 space-y-3">
              <h4 className="font-serif font-bold text-sm text-cinnabar-800 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-cinnabar-600" />
                <span>考官必扣分雷区（千万避开）</span>
              </h4>
              <div className="space-y-2 text-xs font-serif text-cinnabar-900 leading-relaxed">
                {currentMethod.examinerDeductions.map((d, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <span className="text-cinnabar-500 font-bold shrink-0">✕</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* High score */}
            <div className="p-5 rounded-xl bg-bamboo-50/70 border border-bamboo-200 space-y-3">
              <h4 className="font-serif font-bold text-sm text-bamboo-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-bamboo-700" />
                <span>考官青睐的高分制胜技巧</span>
              </h4>
              <div className="space-y-2 text-xs font-serif text-wood-900 leading-relaxed">
                {currentMethod.highScoreTechniques.map((h, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <span className="text-bamboo-600 font-bold shrink-0">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. 万能口语套路汇编 */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-wood-900 flex items-center space-x-2">
              <Quote className="w-4 h-4 text-amber-600" />
              <span>三、万能口语化台词与指令库（即学即用）</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif">
              {/* Opening */}
              <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-wood-900">万能情境导入语</span>
                  <button
                    onClick={() => handleCopy(currentMethod.universalOpening, 'open')}
                    className="text-[11px] text-bamboo-700 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'open' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'open' ? '已复制' : '复制台词'}</span>
                  </button>
                </div>
                <p className="text-wood-800 leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                  {currentMethod.universalOpening}
                </p>
              </div>

              {/* Transition */}
              <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-wood-900">万能切片过渡语</span>
                  <button
                    onClick={() => handleCopy(currentMethod.universalTransition, 'trans')}
                    className="text-[11px] text-bamboo-700 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'trans' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'trans' ? '已复制' : '复制台词'}</span>
                  </button>
                </div>
                <p className="text-wood-800 leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                  {currentMethod.universalTransition}
                </p>
              </div>

              {/* Reading Directive */}
              <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-wood-900">万能朗读/探究指导口令</span>
                  <button
                    onClick={() => handleCopy(currentMethod.universalReadingDirective, 'read')}
                    className="text-[11px] text-bamboo-700 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'read' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'read' ? '已复制' : '复制台词'}</span>
                  </button>
                </div>
                <p className="text-wood-800 leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                  {currentMethod.universalReadingDirective}
                </p>
              </div>

              {/* Homework */}
              <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-wood-900">万能分层课后作业</span>
                  <button
                    onClick={() => handleCopy(currentMethod.universalHomework, 'hw')}
                    className="text-[11px] text-bamboo-700 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedKey === 'hw' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'hw' ? '已复制' : '复制台词'}</span>
                  </button>
                </div>
                <p className="text-wood-800 leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                  {currentMethod.universalHomework}
                </p>
              </div>
            </div>
          </div>

          {/* 4. 标准板书模型 UI 组件 (替换所有字符错位排版) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-wood-900 flex items-center space-x-2">
                <Layout className="w-4 h-4 text-bamboo-700" />
                <span>四、{currentMethod.genre}万能结构化板书模板</span>
              </h3>
              <span className="text-xs text-wood-500 font-serif">
                考场黑板规范布局 · 主板书 70% + 副板书 30%
              </span>
            </div>

            <Chalkboard
              title={currentMethod.genre}
              author="通用试讲板书骨架"
              mainBoardNodes={currentMethod.mainBoardNodes}
              rawMainBoard={currentMethod.blackboardModel}
              subBoard={currentMethod.subBoardItems || ['生字词：重点字形、易错音', '微练笔：摘抄好词好句']}
            />
          </div>

          {/* 5. 代表篇目即学即练 */}
          <div className="pt-4 border-t border-paper-border space-y-3">
            <h4 className="font-serif font-bold text-sm text-wood-900 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-bamboo-700" />
              <span>五、推荐配套即学即练代表篇目（点击直达课文工作台）：</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentMethod.representativeLessons.map((lessonName) => {
                const clean = lessonName.replace('《', '').replace('》', '');
                const found = LESSONS_DATA.find(l => l.title === clean || l.title.includes(clean));
                return (
                  <button
                    key={lessonName}
                    onClick={() => {
                      if (found) onSelectLesson(found);
                    }}
                    className="btn-tactile flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-paper-100 hover:bg-bamboo-100 hover:border-bamboo-300 border border-paper-border text-xs font-serif text-wood-800 transition cursor-pointer"
                  >
                    <span>{lessonName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-bamboo-700" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
