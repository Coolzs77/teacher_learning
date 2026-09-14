import React, { useState } from 'react';
import { Lesson, Genre, StudyStatus, BookId } from '../../types';
import { LESSONS_DATA } from '../../data/lessonsData';
import { PdfViewer } from './PdfViewer';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Bookmark,
  ChevronDown,
  ChevronRight,
  FileText,
  Highlighter,
  MessageSquare,
  AlertCircle,
  Play,
  CalendarPlus,
  Edit3,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkbenchProps {
  currentLesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
  studyStatuses: Record<string, StudyStatus>;
  onUpdateStatus: (lessonId: string, status: StudyStatus) => void;
  onAddToDaily: (lesson: Lesson) => void;
  onStartTrialTimer: () => void;
  userNotes: Record<string, string>;
  onSaveNote: (lessonId: string, note: string) => void;
}

const BOOKS: { id: BookId; name: string }[] = [
  { id: '7s', name: '七年级上册' },
  { id: '7x', name: '七年级下册' },
  { id: '8s', name: '八年级上册' },
  { id: '8x', name: '八年级下册' },
  { id: '9s', name: '九年级上册' },
  { id: '9x', name: '九年级下册' },
];

const GENRES: { label: string; value: Genre | 'all' }[] = [
  { label: '全部文体', value: 'all' },
  { label: '写景散文', value: '现代写景抒情散文' },
  { label: '叙事/小说', value: '叙事散文/小说' },
  { label: '文言文', value: '文言文' },
  { label: '古诗词', value: '古诗词' },
  { label: '说明/新闻', value: '说明文/新闻/活动' },
  { label: '议论文', value: '议论文/思辨文本' },
];

export const Workbench: React.FC<WorkbenchProps> = ({
  currentLesson,
  onSelectLesson,
  studyStatuses,
  onUpdateStatus,
  onAddToDaily,
  onStartTrialTimer,
  userNotes,
  onSaveNote,
}) => {
  const [selectedBook, setSelectedBook] = useState<BookId>(currentLesson.book);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'all'>('all');
  const [selectedStar, setSelectedStar] = useState<number | 'all'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<StudyStatus | 'all'>('all');
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>({ [currentLesson.unit]: true });

  const [activeTab, setActiveTab] = useState<'bible' | 'text' | 'pdf'>('bible');
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [noteContent, setNoteContent] = useState<string>(userNotes[currentLesson.id] || '');
  const [noteSavedToast, setNoteSavedToast] = useState(false);

  React.useEffect(() => {
    setSelectedBook(currentLesson.book);
    setExpandedUnits(prev => ({ ...prev, [currentLesson.unit]: true }));
    setNoteContent(userNotes[currentLesson.id] || '');
  }, [currentLesson.id]);

  const filteredLessons = LESSONS_DATA.filter((l) => {
    if (l.book !== selectedBook) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchAuthor = l.author.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor) return false;
    }
    if (selectedGenre !== 'all' && l.genre !== selectedGenre) return false;
    if (selectedStar !== 'all' && l.star !== selectedStar) return false;
    if (selectedStatusFilter !== 'all') {
      const status = studyStatuses[l.id] || 'unlearned';
      if (status !== selectedStatusFilter) return false;
    }
    return true;
  });

  const unitsInBook = Array.from(new Set(filteredLessons.map(l => l.unit))).sort((a, b) => a - b);

  const toggleUnit = (unit: number) => {
    setExpandedUnits(prev => ({ ...prev, [unit]: !prev[unit] }));
  };

  const handleCopySpeedPlan = () => {
    const planText = `
【课题与课型】：${currentLesson.title}（${currentLesson.speedPlan.courseType}）
【教学目标】：
1. 知识与能力：${currentLesson.speedPlan.objectives.knowledge}
2. 过程与方法：${currentLesson.speedPlan.objectives.process}
3. 情感态度与价值观：${currentLesson.speedPlan.objectives.emotional}
【教学重点】：${currentLesson.speedPlan.keyPoints}
【教学难点】：${currentLesson.speedPlan.difficulties}
【教学过程】：
${currentLesson.speedPlan.steps.map(s => `${s.step}. ${s.name}（${s.duration}）：${s.coreAction}`).join('\n')}
【板书设计】：
${currentLesson.blackboard.mainBoard}
【课后作业】：${currentLesson.speedPlan.homework}
    `.trim();

    navigator.clipboard.writeText(planText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  const handleSaveUserNote = () => {
    onSaveNote(currentLesson.id, noteContent);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2000);
  };

  const handleMarkMastered = () => {
    const current = studyStatuses[currentLesson.id];
    const next: StudyStatus = current === 'mastered' ? 'practicing' : 'mastered';
    onUpdateStatus(currentLesson.id, next);
    if (next === 'mastered') {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT SIDEBAR (4 Cols) ================= */}
        <div className="lg:col-span-4 bg-paper-card rounded-2xl border border-paper-border shadow-scholarly overflow-hidden sticky top-20 flex flex-col max-h-[calc(100vh-6rem)]">
          {/* Volume Tabs */}
          <div className="bg-wood-800 p-1.5 flex items-center justify-between text-xs text-paper-200">
            {BOOKS.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBook(b.id)}
                className={`flex-1 py-1.5 px-1 rounded-lg text-center font-serif transition cursor-pointer ${
                  selectedBook === b.id
                    ? 'bg-paper-100 text-wood-900 font-bold shadow'
                    : 'text-stone-300 hover:text-white hover:bg-wood-700/60'
                }`}
              >
                {b.name.replace('年级', '')}
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="p-3 border-b border-paper-border bg-paper-50 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="搜索篇目、作者（如：春、朱自清）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-paper-border rounded-lg focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value as Genre | 'all')}
                className="px-2 py-1 text-[11px] bg-white border border-paper-border rounded-md font-serif text-wood-700"
              >
                {GENRES.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>

              <select
                value={selectedStar}
                onChange={(e) => setSelectedStar(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-2 py-1 text-[11px] bg-white border border-paper-border rounded-md font-serif text-wood-700"
              >
                <option value="all">全部星级</option>
                <option value="5">5星常考</option>
                <option value="4">4星次常考</option>
                <option value="3">3星阅读</option>
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as StudyStatus | 'all')}
                className="px-2 py-1 text-[11px] bg-white border border-paper-border rounded-md font-serif text-wood-700"
              >
                <option value="all">全部状态</option>
                <option value="unlearned">未学</option>
                <option value="practicing">备课中</option>
                <option value="mastered">已复习</option>
              </select>
            </div>
          </div>

          {/* Lessons Tree by Unit */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {unitsInBook.length === 0 ? (
              <div className="text-center py-8 text-xs text-wood-400 font-serif">
                未找到匹配的课文篇目
              </div>
            ) : (
              unitsInBook.map((unitNum) => {
                const lessonsInUnit = filteredLessons.filter(l => l.unit === unitNum);
                const unitInfo = lessonsInUnit[0];
                const isExpanded = expandedUnits[unitNum] ?? true;

                return (
                  <div key={unitNum} className="space-y-1">
                    <button
                      onClick={() => toggleUnit(unitNum)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-paper-100 hover:bg-paper-200 transition text-left cursor-pointer border border-paper-border/60"
                    >
                      <div className="flex items-center space-x-1.5 truncate">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                        )}
                        <span className="font-serif font-bold text-xs text-wood-900 truncate">
                          {unitInfo.unitTitle}
                        </span>
                      </div>
                      <span className="text-[10px] text-wood-500 font-mono">
                        {lessonsInUnit.length} 篇
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="pl-2 space-y-1">
                        {lessonsInUnit.map((lesson) => {
                          const isCurrent = lesson.id === currentLesson.id;
                          const status = studyStatuses[lesson.id] || 'unlearned';

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => onSelectLesson(lesson)}
                              className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between group cursor-pointer border ${
                                isCurrent
                                  ? 'bg-bamboo-100/70 border-bamboo-400 shadow-sm ring-1 ring-bamboo-500'
                                  : 'bg-white border-paper-border hover:bg-paper-50'
                              }`}
                            >
                              <div className="min-w-0 flex-1 pr-2">
                                <div className="flex items-center space-x-1.5">
                                  <span className={`font-serif text-xs font-bold truncate ${
                                    isCurrent ? 'text-bamboo-900' : 'text-wood-800 group-hover:text-wood-900'
                                  }`}>
                                    {lesson.title}
                                  </span>
                                  <span className="text-[10px] text-wood-500 truncate">
                                    {lesson.author}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 mt-0.5">
                                  <span className="text-[9px] px-1 rounded bg-stone-100 text-stone-600 border border-stone-200">
                                    {lesson.genre.replace('现代写景抒情散文', '写景散文').replace('叙事散文/小说', '叙事小说')}
                                  </span>
                                  <span className="text-[10px] text-amber-500 font-bold">
                                    {'★'.repeat(lesson.star)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center">
                                {status === 'mastered' ? (
                                  <span className="w-5 h-5 rounded-full bg-bamboo-200 text-bamboo-800 flex items-center justify-center text-[10px]" title="已复习">
                                    ✓
                                  </span>
                                ) : status === 'practicing' ? (
                                  <span className="w-2 h-2 rounded-full bg-amber-400" title="备课中" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-stone-300" title="未学习" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT MAIN WORKSPACE (8 Cols) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Lesson Meta Banner */}
          <div className="bg-paper-card p-6 rounded-2xl border border-paper-border shadow-scholarly space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-wood-800 text-paper-50 font-serif">
                    {currentLesson.bookName}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-paper-200 text-wood-700 font-serif">
                    {currentLesson.unitTitle}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-bamboo-100 text-bamboo-800 border border-bamboo-200 font-medium">
                    {currentLesson.genre}
                  </span>
                  <span className="text-xs text-amber-600 font-bold">
                    {'★'.repeat(currentLesson.star)}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-serif font-bold text-wood-900 mt-2">
                  《{currentLesson.title}》
                  <span className="text-base font-normal text-wood-600 ml-2">
                    {currentLesson.author}
                  </span>
                </h1>

                <p className="text-xs text-wood-600 font-serif mt-1">
                  <strong>单元语文要素：</strong>{currentLesson.unitReadingFocus}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleMarkMastered}
                  className={`btn-tactile flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-serif border ${
                    studyStatuses[currentLesson.id] === 'mastered'
                      ? 'bg-bamboo-700 text-white border-bamboo-800 shadow-sm'
                      : 'bg-paper-50 text-wood-700 border-paper-border hover:bg-paper-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {studyStatuses[currentLesson.id] === 'mastered' ? '已标记为掌握' : '标记已掌握'}
                  </span>
                </button>

                <button
                  onClick={() => onAddToDaily(currentLesson)}
                  className="btn-tactile flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-paper-50 text-wood-700 border border-paper-border hover:bg-paper-200 text-xs font-serif"
                >
                  <CalendarPlus className="w-4 h-4 text-bamboo-700" />
                  <span>加今日待办</span>
                </button>

                <button
                  onClick={onStartTrialTimer}
                  className="btn-tactile flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-bamboo-700 text-white hover:bg-bamboo-800 text-xs font-bold shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
                  <span>开启10分钟试讲</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-wood-500 pt-2 border-t border-paper-border font-serif">
              <span>
                教材页码：第 <strong>{currentLesson.pdfPage - (currentLesson.book === '8s' ? 6 : 7)}</strong> 页 · 原版 PDF 页码：第 <strong>{currentLesson.pdfPage}</strong> 页
              </span>
              <span className="text-wood-700 font-medium">
                教学建议：围绕一课一得，切忌面面俱到。
              </span>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center space-x-2 border-b border-paper-border pb-1">
            <button
              onClick={() => setActiveTab('bible')}
              className={`btn-tactile flex items-center space-x-2 px-5 py-2.5 rounded-t-xl text-sm font-serif font-bold transition border-b-2 ${
                activeTab === 'bible'
                  ? 'bg-paper-card text-bamboo-800 border-bamboo-700 shadow-sm'
                  : 'text-wood-600 border-transparent hover:text-wood-900 hover:bg-paper-200/50'
              }`}
            >
              <FileText className="w-4 h-4 text-bamboo-700" />
              <span>选项卡 A【10分钟教学设计】</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`btn-tactile flex items-center space-x-2 px-5 py-2.5 rounded-t-xl text-sm font-serif font-bold transition border-b-2 ${
                activeTab === 'text'
                  ? 'bg-paper-card text-bamboo-800 border-bamboo-700 shadow-sm'
                  : 'text-wood-600 border-transparent hover:text-wood-900 hover:bg-paper-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-wood-600" />
              <span>选项卡 B【课文全文与批注】</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`btn-tactile flex items-center space-x-2 px-5 py-2.5 rounded-t-xl text-sm font-serif font-bold transition border-b-2 ${
                activeTab === 'pdf'
                  ? 'bg-paper-card text-bamboo-800 border-bamboo-700 shadow-sm'
                  : 'text-wood-600 border-transparent hover:text-wood-900 hover:bg-paper-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-bamboo-700" />
              <span>选项卡 C【教材原版 PDF】</span>
            </button>
          </div>

          {/* ================= TAB A: 教学设计 ================= */}
          {activeTab === 'bible' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1. 考纲试讲要求 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-3">
                <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                  <Bookmark className="w-4 h-4 text-bamboo-700" />
                  <span>一、试讲要求</span>
                </div>
                <div className="bg-paper-50 p-3.5 rounded-xl border border-paper-border text-xs text-wood-800 space-y-1.5 font-serif leading-relaxed">
                  {currentLesson.examRequirement.map((req, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="text-bamboo-800 font-bold">({idx + 1})</span>
                      <span>{req.replace(/^\d+[\.、]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. 10分钟教学切片建议 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-3">
                <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                  <Highlighter className="w-4 h-4 text-wood-700" />
                  <span>二、10分钟教学切片建议</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-serif">
                  <div className="p-3 bg-paper-50 rounded-xl border border-paper-border space-y-1">
                    <span className="text-wood-500 font-bold block">【建议精读段落】：</span>
                    <p className="text-wood-900 font-medium">
                      {currentLesson.goldenSlice.sliceRange}
                    </p>
                  </div>

                  <div className="p-3 bg-paper-50 rounded-xl border border-paper-border space-y-1">
                    <span className="text-wood-500 font-bold block">【教学目标（一课一得）】：</span>
                    <p className="text-bamboo-900 font-medium">
                      {currentLesson.goldenSlice.oneGain}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs font-serif flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-900">时间分配与避坑提示：</strong>
                    <span className="text-amber-900 ml-1">
                      {currentLesson.goldenSlice.examinerTip}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. 考场教学简案速写参考 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                    <Edit3 className="w-4 h-4 text-stone-700" />
                    <span>三、考场教学简案速写参考（备考草稿纸）</span>
                  </div>
                  <button
                    onClick={handleCopySpeedPlan}
                    className="btn-tactile flex items-center space-x-1 px-3 py-1 bg-paper-100 hover:bg-paper-200 rounded-lg text-xs text-wood-700 border border-paper-border"
                  >
                    {copiedPlan ? <Check className="w-3.5 h-3.5 text-bamboo-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPlan ? '已复制简案' : '复制简案'}</span>
                  </button>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-300 font-serif text-xs leading-relaxed space-y-2.5 text-wood-800">
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-stone-200">
                    <div>
                      <strong className="text-wood-900">【课题与课型】：</strong>
                      <span>《{currentLesson.title}》（{currentLesson.speedPlan.courseType}）</span>
                    </div>
                    <div>
                      <strong className="text-wood-900">【教学重难点】：</strong>
                      <span>{currentLesson.speedPlan.keyPoints}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-wood-900 block">【教学过程（5步流程）】：</strong>
                    {currentLesson.speedPlan.steps.map((s) => (
                      <div key={s.step} className="pl-2 flex items-start space-x-1.5">
                        <span className="font-bold text-bamboo-800">{s.step}. {s.name}（{s.duration}）：</span>
                        <span className="text-wood-700">{s.coreAction}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-200">
                    <strong className="text-wood-900">【课后作业】：</strong>
                    <span>{currentLesson.speedPlan.homework}</span>
                  </div>
                </div>
              </div>

              {/* 4. 10分钟试讲教学过程示范 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                    <MessageSquare className="w-4 h-4 text-bamboo-700" />
                    <span>四、10分钟试讲教学过程示范（互动与指导语言）</span>
                  </div>
                  <span className="text-xs text-wood-500 font-serif">
                    示范教师提问、学生回答与朗读指导口令
                  </span>
                </div>

                {/* Stage 1: 导入 */}
                <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-wood-800 font-serif">
                    <span className="px-2 py-0.5 rounded bg-wood-200 text-wood-900">
                      第1步 · 导入新课（00:00 - 01:30）
                    </span>
                    <span className="text-[11px] text-wood-500 font-normal">
                      教师活动：{currentLesson.verbatimScript.importStage.actionNotes}
                    </span>
                  </div>
                  <p className="text-xs font-serif leading-relaxed text-wood-900 bg-white p-3 rounded-lg border border-paper-border">
                    {currentLesson.verbatimScript.importStage.teacherLines}
                  </p>
                </div>

                {/* Stage 2: 初读 */}
                <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-wood-800 font-serif">
                    <span className="px-2 py-0.5 rounded bg-wood-200 text-wood-900">
                      第2步 · 初读感知（01:30 - 03:00）
                    </span>
                    <span className="text-[11px] text-wood-500 font-normal">
                      教师活动：{currentLesson.verbatimScript.preliminaryReadStage.actionNotes}
                    </span>
                  </div>
                  <p className="text-xs font-serif leading-relaxed text-wood-900 bg-white p-3 rounded-lg border border-paper-border">
                    {currentLesson.verbatimScript.preliminaryReadStage.teacherLines}
                  </p>
                </div>

                {/* Stage 3: 精读研讨 */}
                <div className="p-4 rounded-xl bg-bamboo-50/50 border border-bamboo-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-bamboo-900 font-serif">
                    <span className="px-2 py-0.5 rounded bg-bamboo-700 text-white">
                      第3步 · 精读切片深入探究（03:00 - 07:30 重点分析）
                    </span>
                    <span className="text-bamboo-800 font-medium">
                      {currentLesson.verbatimScript.deepDiveStage.title}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-serif leading-relaxed">
                    <div className="bg-white p-3 rounded-lg border border-bamboo-200 space-y-1">
                      <strong className="text-bamboo-800 block">【教师提问设计】：</strong>
                      <p className="text-wood-900">{currentLesson.verbatimScript.deepDiveStage.teacherQuestion}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-stone-300 space-y-1">
                      <strong className="text-stone-700 block">【预设学生回答】：</strong>
                      <p className="text-wood-800 italic">{currentLesson.verbatimScript.deepDiveStage.studentAnswer}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-bamboo-200 space-y-1">
                      <strong className="text-bamboo-800 block">【教师评价与板书提示】：</strong>
                      <p className="text-wood-900">{currentLesson.verbatimScript.deepDiveStage.teacherFeedback}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-bamboo-200 space-y-1">
                      <strong className="text-bamboo-800 block">【追问启发】：</strong>
                      <p className="text-wood-900">{currentLesson.verbatimScript.deepDiveStage.deepenQuestion}</p>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-lg border border-stone-300 space-y-1">
                      <strong className="text-wood-800 block">【朗读指导提示】：</strong>
                      <p className="text-wood-900 font-medium">{currentLesson.verbatimScript.deepDiveStage.readingGuidance}</p>
                    </div>
                  </div>
                </div>

                {/* Stage 4: 小结与作业 */}
                <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
                  <div className="text-xs font-bold text-wood-800 font-serif">
                    <span className="px-2 py-0.5 rounded bg-wood-200 text-wood-900">
                      第4~5步 · 小结与布置作业（07:30 - 10:00）
                    </span>
                  </div>
                  <div className="space-y-1 text-xs font-serif leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                    <p className="text-wood-900">{currentLesson.verbatimScript.summaryAndHomeworkStage.summaryLines}</p>
                    <p className="text-wood-700 pt-1">{currentLesson.verbatimScript.summaryAndHomeworkStage.homeworkLines}</p>
                  </div>
                </div>
              </div>

              {/* 5. 黑板板书设计 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                    <Edit3 className="w-4 h-4 text-stone-700" />
                    <span>五、黑板板书设计参考（主板书与副板书）</span>
                  </div>
                  <span className="text-xs text-wood-500 font-serif">
                    主板书占主要区域，副板书书写重点字词
                  </span>
                </div>

                <div className="blackboard-chalk rounded-xl p-5 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="text-xs text-amber-200/80 font-bold border-b border-stone-600 pb-1">
                        【主板书区】
                      </div>
                      <pre className="font-mono text-xs md:text-sm text-stone-100 whitespace-pre-wrap leading-relaxed">
                        {currentLesson.blackboard.mainBoard}
                      </pre>
                    </div>

                    <div className="w-full md:w-56 space-y-2 border-t md:border-t-0 md:border-l border-stone-600 pt-3 md:pt-0 md:pl-4">
                      <div className="text-xs text-amber-200/80 font-bold border-b border-stone-600 pb-1">
                        【副板书区】
                      </div>
                      <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                        {currentLesson.blackboard.subBoard.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB B: 课文全文与批注 ================= */}
          {activeTab === 'text' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-paper-card p-6 md:p-8 rounded-2xl border border-paper-border shadow-scholarly space-y-6">
                <div className="flex items-center justify-between border-b border-paper-border pb-4">
                  <div>
                    <h2 className="font-serif font-bold text-xl text-wood-900">
                      《{currentLesson.title}》课文全文（共 {currentLesson.fullText.paragraphs.length} 段）
                    </h2>
                    <p className="text-xs text-wood-500 font-serif mt-1">
                      重点教学段落标注 🎯 符号，支持在文末添加个人备课笔记
                    </p>
                  </div>
                </div>

                {/* Complete Paragraphs */}
                <div className="space-y-4 font-serif text-wood-900 text-sm md:text-base leading-relaxed">
                  {currentLesson.fullText.paragraphs.map((para) => (
                    <div
                      key={para.id}
                      className={`p-4 rounded-xl border transition ${
                        para.isHighlightedSlice
                          ? 'bg-bamboo-50/70 border-bamboo-300 shadow-sm ring-1 ring-bamboo-400/40'
                          : 'bg-white border-paper-border'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-wood-400 mb-2">
                        <span className="font-mono">自然段 {para.id}</span>
                        {para.isHighlightedSlice && (
                          <span className="px-2 py-0.5 rounded-full bg-bamboo-700 text-white font-serif font-bold text-[11px]">
                            🎯 建议精读教学段落
                          </span>
                        )}
                      </div>

                      <p className="indent-8 leading-loose tracking-wide">
                        {para.content}
                      </p>

                      {para.pinyinNotes && para.pinyinNotes.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-bamboo-200/60 flex flex-wrap gap-2 text-xs">
                          <span className="text-bamboo-800 font-bold">【重点字词注音】：</span>
                          {para.pinyinNotes.map((pn, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white text-wood-800 border border-stone-300 font-serif">
                              <strong>{pn.word}</strong>（{pn.pinyin}）{pn.meaning ? `：${pn.meaning}` : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Personal Note Taking Box */}
                <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-wood-900 flex items-center space-x-1.5">
                      <Edit3 className="w-4 h-4 text-bamboo-700" />
                      <span>我的备课笔记（保存在本地浏览器）：</span>
                    </span>
                    {noteSavedToast && (
                      <span className="text-xs text-bamboo-700 font-bold">
                        ✓ 笔记已保存
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    placeholder="在此记录本篇课文个人的试讲提问设计、导入语调整或板书心得..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full p-3 text-xs bg-white border border-paper-border rounded-xl focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveUserNote}
                      className="btn-tactile px-4 py-1.5 bg-bamboo-700 text-white rounded-lg text-xs font-serif font-bold cursor-pointer"
                    >
                      保存笔记
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB C: 教材原版 PDF ================= */}
          {activeTab === 'pdf' && (
            <div className="space-y-4 animate-fadeIn">
              <PdfViewer
                fileName={currentLesson.pdfFileName}
                initialPage={currentLesson.pdfPage}
                lessonTitle={currentLesson.title}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
