import React, { useState, useEffect } from 'react';
import { Lesson, Genre, StudyStatus, BookId } from '../../types';
import { LESSONS_DATA } from '../../data/lessonsData';
import { PdfViewer } from './PdfViewer';
import { Chalkboard } from '../Common/Chalkboard';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  MessageSquare,
  AlertCircle,
  Play,
  CalendarPlus,
  Edit3,
  PanelLeftClose,
  PanelLeftOpen,
  Type,
  Trash2,
  Star,
  Clock,
  Sparkles,
  RotateCcw
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
  { label: '写作/作文', value: '写作与表达专项' },
];

type FontSizeLevel = 'normal' | 'large' | 'xlarge';

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

  // Sidebar Collapse state (Problem 7)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Font Size Scaler state (Problem 10)
  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    return (localStorage.getItem('tl_font_size') as FontSizeLevel) || 'large';
  });

  const [activeTab, setActiveTab] = useState<'bible' | 'text' | 'pdf'>('bible');
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [noteContent, setNoteContent] = useState<string>(userNotes[currentLesson.id] || '');
  const [noteSavedToast, setNoteSavedToast] = useState(false);

  // Paragraph-level annotations (Problem 8)
  const [paraNotes, setParaNotes] = useState<Record<number, string>>({});
  const [editingParaId, setEditingParaId] = useState<number | null>(null);
  const [tempParaText, setTempParaText] = useState<string>('');

  useEffect(() => {
    setSelectedBook(currentLesson.book);
    setExpandedUnits(prev => ({ ...prev, [currentLesson.unit]: true }));
    setNoteContent(userNotes[currentLesson.id] || '');

    // Load paragraph annotations for current lesson
    try {
      const savedParaNotes = localStorage.getItem(`tl_para_notes_${currentLesson.id}`);
      if (savedParaNotes) {
        setParaNotes(JSON.parse(savedParaNotes));
      } else {
        setParaNotes({});
      }
    } catch {
      setParaNotes({});
    }
  }, [currentLesson.id]);

  const handleFontSizeChange = (level: FontSizeLevel) => {
    setFontSize(level);
    localStorage.setItem('tl_font_size', level);
  };

  const handleSaveParagraphNote = (paraId: number) => {
    const updated = { ...paraNotes, [paraId]: tempParaText.trim() };
    if (!tempParaText.trim()) {
      delete updated[paraId];
    }
    setParaNotes(updated);
    localStorage.setItem(`tl_para_notes_${currentLesson.id}`, JSON.stringify(updated));
    setEditingParaId(null);
    setTempParaText('');
  };

  const handleDeleteParagraphNote = (paraId: number) => {
    const updated = { ...paraNotes };
    delete updated[paraId];
    setParaNotes(updated);
    localStorage.setItem(`tl_para_notes_${currentLesson.id}`, JSON.stringify(updated));
  };

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
    setExpandedUnits((prev) => ({ ...prev, [unit]: !prev[unit] }));
  };

  const handleCopyPlan = () => {
    const stepsText = currentLesson.speedPlan.steps
      .map((s) => `${s.step}. ${s.name}（${s.duration}）：${s.coreAction}`)
      .join('\n');

    const fullPlanText = `《${currentLesson.title}》10分钟试讲简案（考场速记提纲）
作者：${currentLesson.author} | 文体：${currentLesson.genre}
----------------------------------------
【一课一得目标】：
- 知识要点：${currentLesson.speedPlan.objectives.knowledge}
- 过程方法：${currentLesson.speedPlan.objectives.process}
- 情感升华：${currentLesson.speedPlan.objectives.emotional}

【核心教学切片】：
${currentLesson.goldenSlice.sliceRange}
聚焦要点：${currentLesson.goldenSlice.sliceTitle}

【教学过程五步流程】：
${stepsText}

【黑板板书核心】：
${currentLesson.blackboard.mainBoard}

【课后作业】：
${currentLesson.speedPlan.homework}`;

    navigator.clipboard.writeText(fullPlanText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  const handleSaveUserNote = () => {
    onSaveNote(currentLesson.id, noteContent);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2000);
  };

  const currentStatus = studyStatuses[currentLesson.id] || 'unlearned';

  // Font size classes
  const fontClass = {
    normal: 'text-sm md:text-base leading-relaxed',
    large: 'text-base md:text-[17px] leading-loose',
    xlarge: 'text-lg md:text-[19px] leading-loose'
  }[fontSize];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-paper-card p-4 md:p-5 rounded-2xl border border-paper-border shadow-scholarly flex flex-wrap items-center justify-between gap-4">
        {/* Left Lesson Info & Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl bg-paper-100 hover:bg-paper-200 border border-paper-border text-wood-700 transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
            title={isSidebarCollapsed ? '展开课文目录' : '收起课文目录以获得沉浸研读视野'}
          >
            {isSidebarCollapsed ? (
              <>
                <PanelLeftOpen className="w-4 h-4 text-bamboo-700" />
                <span className="text-xs font-serif font-bold text-bamboo-800">展开目录</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-wood-600" />
                <span className="text-xs font-serif text-wood-600">收起目录</span>
              </>
            )}
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded bg-wood-200 text-wood-800 font-serif">
                {currentLesson.bookName} · {currentLesson.unitTitle}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-bamboo-100 text-bamboo-800 font-serif font-medium">
                {currentLesson.genre}
              </span>
              <span className="text-amber-700 text-xs font-bold font-mono">
                {'★'.repeat(currentLesson.star)}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-wood-900 mt-1">
              《{currentLesson.title}》
              <span className="text-sm font-normal text-wood-600 ml-2">作者：{currentLesson.author}</span>
            </h1>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Font Size Adjuster (Problem 10) */}
          <div className="flex items-center bg-paper-100 border border-paper-border rounded-xl p-1 space-x-0.5 shadow-sm">
            <Type className="w-3.5 h-3.5 text-wood-500 ml-1 mr-0.5" />
            <button
              onClick={() => handleFontSizeChange('normal')}
              className={`px-2 py-0.5 text-xs rounded-lg font-serif transition cursor-pointer ${
                fontSize === 'normal' ? 'bg-white shadow text-wood-900 font-bold' : 'text-wood-600 hover:bg-paper-200'
              }`}
              title="标准字号"
            >
              标准
            </button>
            <button
              onClick={() => handleFontSizeChange('large')}
              className={`px-2 py-0.5 text-xs rounded-lg font-serif transition cursor-pointer ${
                fontSize === 'large' ? 'bg-white shadow text-wood-900 font-bold' : 'text-wood-600 hover:bg-paper-200'
              }`}
              title="护眼大字"
            >
              大
            </button>
            <button
              onClick={() => handleFontSizeChange('xlarge')}
              className={`px-2 py-0.5 text-xs rounded-lg font-serif transition cursor-pointer ${
                fontSize === 'xlarge' ? 'bg-white shadow text-wood-900 font-bold' : 'text-wood-600 hover:bg-paper-200'
              }`}
              title="特大字号"
            >
              特大
            </button>
          </div>

          {/* Manual Status Buttons (Problem 12) */}
          <div className="flex items-center bg-paper-100 border border-paper-border rounded-xl p-1 space-x-1 shadow-sm">
            <span className="text-[11px] text-wood-500 font-serif px-1 hidden sm:inline">标记状态:</span>
            <button
              onClick={() => onUpdateStatus(currentLesson.id, 'unlearned')}
              className={`px-2 py-1 rounded-lg text-xs font-serif transition cursor-pointer flex items-center space-x-1 ${
                currentStatus === 'unlearned' ? 'bg-white text-wood-800 shadow font-bold' : 'text-wood-500 hover:bg-paper-200'
              }`}
            >
              <span>⚪ 未学</span>
            </button>
            <button
              onClick={() => onUpdateStatus(currentLesson.id, 'practicing')}
              className={`px-2 py-1 rounded-lg text-xs font-serif transition cursor-pointer flex items-center space-x-1 ${
                currentStatus === 'practicing' ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' : 'text-wood-600 hover:bg-paper-200'
              }`}
            >
              <span>🟡 备课中</span>
            </button>
            <button
              onClick={() => onUpdateStatus(currentLesson.id, 'mastered')}
              className={`px-2 py-1 rounded-lg text-xs font-serif transition cursor-pointer flex items-center space-x-1 ${
                currentStatus === 'mastered' ? 'bg-bamboo-700 text-white shadow font-bold' : 'text-wood-600 hover:bg-paper-200'
              }`}
            >
              <span>🟢 已掌握</span>
            </button>
            <button
              onClick={() => onUpdateStatus(currentLesson.id, 'review_needed')}
              className={`px-2 py-1 rounded-lg text-xs font-serif transition cursor-pointer flex items-center space-x-1 ${
                currentStatus === 'review_needed' ? 'bg-cinnabar-700 text-white shadow font-bold' : 'text-wood-600 hover:bg-paper-200'
              }`}
            >
              <span>🔴 需复习</span>
            </button>
          </div>

          <button
            onClick={() => onAddToDaily(currentLesson)}
            className="btn-tactile flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-paper-100 hover:bg-paper-200 border border-paper-border text-wood-800 text-xs font-serif cursor-pointer shadow-sm"
            title="加入今日模拟练待办"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-bamboo-700" />
            <span className="hidden sm:inline">加入待办</span>
          </button>

          <button
            onClick={onStartTrialTimer}
            className="btn-tactile flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-bamboo-700 text-white hover:bg-bamboo-800 text-xs font-serif font-bold shadow cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>开启10分钟试讲</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left TOC Drawer + Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: TOC Sidebar (Collapsible - Problem 7) */}
        {!isSidebarCollapsed && (
          <div className="lg:col-span-4 bg-paper-card rounded-2xl border border-paper-border shadow-scholarly p-4 space-y-4 transition-all duration-300">
            {/* Book Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-paper-100 rounded-xl border border-paper-border text-xs font-serif">
              {BOOKS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBook(b.id)}
                  className={`py-1.5 text-center rounded-lg transition cursor-pointer font-medium ${
                    selectedBook === b.id
                      ? 'bg-wood-800 text-paper-50 shadow-sm font-bold'
                      : 'text-wood-700 hover:bg-paper-200'
                  }`}
                >
                  {b.name.replace('年级', '')}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-wood-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="搜索篇目 / 作者..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-paper-50 border border-paper-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value as any)}
                className="bg-paper-50 border border-paper-border rounded-lg px-2 py-1 text-wood-800 font-serif focus:outline-none"
              >
                {GENRES.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="bg-paper-50 border border-paper-border rounded-lg px-2 py-1 text-wood-800 font-serif focus:outline-none"
              >
                <option value="all">全部备考状态</option>
                <option value="unlearned">⚪ 未学习</option>
                <option value="practicing">🟡 备课中</option>
                <option value="mastered">🟢 已掌握</option>
                <option value="review_needed">🔴 需复习</option>
              </select>
            </div>

            {/* Lesson Tree by Units */}
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {unitsInBook.map((unitNum) => {
                const lessonsInUnit = filteredLessons.filter((l) => l.unit === unitNum);
                if (lessonsInUnit.length === 0) return null;
                const unitTitle = lessonsInUnit[0].unitTitle;
                const isExpanded = expandedUnits[unitNum] ?? true;

                return (
                  <div key={unitNum} className="border border-paper-border rounded-xl overflow-hidden bg-white/40">
                    <button
                      onClick={() => toggleUnit(unitNum)}
                      className="w-full flex items-center justify-between p-2.5 bg-paper-100/70 hover:bg-paper-200 text-left text-xs font-serif font-bold text-wood-900 cursor-pointer"
                    >
                      <span className="flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-bamboo-700" />
                        <span>{unitTitle}</span>
                      </span>
                      <span className="text-wood-400">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="p-1.5 space-y-1">
                        {lessonsInUnit.map((lesson) => {
                          const isSelected = lesson.id === currentLesson.id;
                          const st = studyStatuses[lesson.id] || 'unlearned';

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => onSelectLesson(lesson)}
                              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer ${
                                isSelected
                                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                                  : 'hover:bg-paper-100 text-wood-800'
                              }`}
                            >
                              <div className="truncate flex-1 pr-2">
                                <div className="text-xs font-serif truncate">
                                  《{lesson.title}》
                                </div>
                                <div className={`text-[10px] ${isSelected ? 'text-bamboo-100' : 'text-wood-500'}`}>
                                  {lesson.author} · {lesson.genre}
                                </div>
                              </div>

                              <div className="flex items-center space-x-1.5 flex-shrink-0">
                                <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-amber-600'}`}>
                                  {'★'.repeat(lesson.star)}
                                </span>
                                {st === 'mastered' && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="已攻克" />
                                )}
                                {st === 'practicing' && (
                                  <span className="w-2 h-2 rounded-full bg-amber-500" title="备课中" />
                                )}
                                {st === 'review_needed' && (
                                  <span className="w-2 h-2 rounded-full bg-rose-500" title="需复习" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Column: Workbench Main Stage */}
        <div className={`${isSidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-6 transition-all duration-300`}>
          {/* Triple Tabs Navigation */}
          <div className="flex items-center border-b border-paper-border space-x-2 bg-paper-card p-1.5 rounded-2xl border shadow-sm">
            <button
              onClick={() => setActiveTab('bible')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-serif text-xs md:text-sm transition cursor-pointer ${
                activeTab === 'bible'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-100 font-medium'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>选项卡 1【10分钟教学设计】</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-serif text-xs md:text-sm transition cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-100 font-medium'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>选项卡 2【课文全文与段落批注】</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-serif text-xs md:text-sm transition cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-100 font-medium'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>选项卡 3【教材原版 PDF（画笔标注）】</span>
            </button>
          </div>

          {/* ================= TAB A: 10分钟教学设计 ================= */}
          {activeTab === 'bible' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1. 试讲考查要求 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-3">
                <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-bamboo-700" />
                  <span>一、试讲考查要求</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif">
                  {currentLesson.examRequirement.map((req, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-paper-50 border border-paper-border text-wood-800 flex items-start space-x-2">
                      <span className="font-bold text-bamboo-700">✓</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. 10分钟教学切片建议 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-bamboo-200/80 shadow-scholarly space-y-3 bg-gradient-to-br from-paper-50 via-bamboo-50/20 to-paper-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-bamboo-700" />
                    <span>二、10分钟教学切片建议（围绕“一课一得”）</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-900 font-serif font-medium">
                    核心切片
                  </span>
                </div>

                <div className="space-y-2 text-xs font-serif text-wood-800 leading-relaxed">
                  <div className="p-3 bg-white rounded-xl border border-bamboo-200 space-y-1">
                    <strong className="text-bamboo-900 block font-bold">🎯 建议精讲段落切片：</strong>
                    <p className="text-wood-900 text-sm font-medium">{currentLesson.goldenSlice.sliceRange}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white rounded-xl border border-paper-border space-y-1">
                      <strong className="text-wood-900 block font-bold">✨ 一课一得目标：</strong>
                      <p className="text-wood-700">{currentLesson.goldenSlice.oneGain}</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-paper-border space-y-1">
                      <strong className="text-wood-900 block font-bold">⏱️ 建议时间分配：</strong>
                      <p className="text-wood-700 font-mono text-[11px]">{currentLesson.goldenSlice.timingGuide}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] flex items-start space-x-2">
                    <span className="font-bold">💡 备考提示：</span>
                    <span>{currentLesson.goldenSlice.examinerTip}</span>
                  </div>
                </div>
              </div>

              {/* 3. 考场教学简案设计 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                    <Edit3 className="w-4 h-4 text-bamboo-700" />
                    <span>三、考场教学简案设计（备考室草稿纸速写）</span>
                  </div>
                  <button
                    onClick={handleCopyPlan}
                    className="btn-tactile flex items-center space-x-1 px-3 py-1 bg-paper-100 hover:bg-paper-200 border border-paper-border rounded-lg text-xs font-serif text-wood-800 cursor-pointer"
                  >
                    {copiedPlan ? <Check className="w-3.5 h-3.5 text-bamboo-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPlan ? '已复制简案' : '一键复制简案'}</span>
                  </button>
                </div>

                <div className="p-4 bg-paper-50 rounded-xl border border-paper-border font-serif text-xs leading-relaxed space-y-2.5 text-wood-800">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="font-bold text-wood-900">课型：{currentLesson.speedPlan.courseType}</span>
                    <span className="text-wood-500">考场草稿提纲（建议备考室5-8分钟速成）</span>
                  </div>

                  <div>
                    <strong className="text-wood-900">【教学重点】：</strong>
                    <span>{currentLesson.speedPlan.keyPoints}</span>
                  </div>

                  <div>
                    <strong className="text-wood-900">【教学难点】：</strong>
                    <span>{currentLesson.speedPlan.difficulties}</span>
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

              {/* 4. 教学过程示范（逐字稿） */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                    <MessageSquare className="w-4 h-4 text-bamboo-700" />
                    <span>四、10分钟试讲教学过程示范（互动与指导语言）</span>
                  </div>
                  <span className="text-xs text-wood-500 font-serif">
                    口语化示范师生互动提问与朗读口令
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
                  <p className="text-xs md:text-sm font-serif leading-relaxed text-wood-900 bg-white p-3 rounded-lg border border-paper-border">
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
                  <p className="text-xs md:text-sm font-serif leading-relaxed text-wood-900 bg-white p-3 rounded-lg border border-paper-border">
                    {currentLesson.verbatimScript.preliminaryReadStage.teacherLines}
                  </p>
                </div>

                {/* Stage 3: 精读研讨 */}
                <div className="p-4 rounded-xl bg-bamboo-50/50 border border-bamboo-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-bamboo-900 font-serif">
                    <span className="px-2 py-0.5 rounded bg-bamboo-700 text-white">
                      第3步 · 精读切片深入探究（03:00 - 07:30 重点突破）
                    </span>
                    <span className="text-bamboo-800 font-medium">
                      {currentLesson.verbatimScript.deepDiveStage.title}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs md:text-sm font-serif leading-relaxed">
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
                  <div className="space-y-1 text-xs md:text-sm font-serif leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                    <p className="text-wood-900">{currentLesson.verbatimScript.summaryAndHomeworkStage.summaryLines}</p>
                    <p className="text-wood-700 pt-1">{currentLesson.verbatimScript.summaryAndHomeworkStage.homeworkLines}</p>
                  </div>
                </div>
              </div>

              {/* 5. 黑板板书设计 (Chalkboard Component - Problem 11) */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm">
                    <Edit3 className="w-4 h-4 text-bamboo-700" />
                    <span>五、黑板板书设计参考（结构化黑板呈现）</span>
                  </div>
                  <span className="text-xs text-wood-500 font-serif">
                    左侧主板书呈现行文脉络与切片，右侧副板书呈现字词与技法
                  </span>
                </div>

                <Chalkboard
                  title={currentLesson.title}
                  author={currentLesson.author}
                  rawMainBoard={currentLesson.blackboard.mainBoard}
                  subBoard={currentLesson.blackboard.subBoard}
                />
              </div>
            </div>
          )}

          {/* ================= TAB B: 课文全文与段落批注 (Problem 8) ================= */}
          {activeTab === 'text' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-paper-card p-6 md:p-8 rounded-2xl border border-paper-border shadow-scholarly space-y-6">
                <div className="flex flex-wrap items-center justify-between border-b border-paper-border pb-4 gap-2">
                  <div>
                    <h2 className="font-serif font-bold text-xl md:text-2xl text-wood-900">
                      《{currentLesson.title}》课文正文与段落批注
                    </h2>
                    <p className="text-xs text-wood-500 font-serif mt-1">
                      收录教材纯净正文（共 {currentLesson.fullText.paragraphs.length} 段）。点击段落右上角的“+ 批注”可记录个性化教学设计。
                    </p>
                  </div>

                  <div className="text-xs text-wood-600 font-serif">
                    已记录批注：<span className="font-mono font-bold text-bamboo-800">{Object.keys(paraNotes).length}</span> 处
                  </div>
                </div>

                {/* Paragraphs List with Inline Annotation Support */}
                <div className="space-y-5 font-serif text-wood-900">
                  {currentLesson.fullText.paragraphs.map((para) => {
                    const hasNote = Boolean(paraNotes[para.id]);
                    const isEditing = editingParaId === para.id;

                    return (
                      <div
                        key={para.id}
                        className={`p-5 rounded-xl border transition-all ${
                          para.isHighlightedSlice
                            ? 'bg-bamboo-50/60 border-bamboo-300 shadow-sm ring-1 ring-bamboo-400/40'
                            : 'bg-white border-paper-border hover:border-bamboo-300'
                        }`}
                      >
                        {/* Paragraph Top Meta */}
                        <div className="flex items-center justify-between text-xs text-wood-400 mb-2.5 pb-1 border-b border-paper-border/60">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-wood-700">自然段 {para.id}</span>
                            {para.isHighlightedSlice && (
                              <span className="px-2 py-0.5 rounded-full bg-bamboo-700 text-white font-serif font-bold text-[11px]">
                                🎯 建议10分钟精读教学段落
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                if (isEditing) {
                                  setEditingParaId(null);
                                } else {
                                  setEditingParaId(para.id);
                                  setTempParaText(paraNotes[para.id] || '');
                                }
                              }}
                              className="px-2 py-0.5 rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 text-xs font-serif cursor-pointer transition flex items-center space-x-1"
                            >
                              <Edit3 className="w-3 h-3 text-bamboo-700" />
                              <span>{hasNote ? '修改批注' : '+ 批注'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Paragraph Pure Body Text (Problem 8 & 10) */}
                        <p className={`indent-8 tracking-wide font-serif text-wood-900 ${fontClass}`}>
                          {para.content}
                        </p>

                        {/* Pinyin Notes if available */}
                        {para.pinyinNotes && para.pinyinNotes.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-bamboo-200/60 flex flex-wrap gap-2 text-xs">
                            <span className="text-bamboo-800 font-bold">【重点词语注释】：</span>
                            {para.pinyinNotes.map((pn, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-paper-50 text-wood-800 border border-stone-300 font-serif">
                                <strong>{pn.word}</strong>（{pn.pinyin}）{pn.meaning ? `：${pn.meaning}` : ''}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Existing Paragraph Annotation Display */}
                        {hasNote && !isEditing && (
                          <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs md:text-sm text-amber-950 font-serif space-y-1 shadow-sm">
                            <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 pb-1 border-b border-amber-200/60">
                              <span className="flex items-center space-x-1">
                                <span>📝 我的段落备课批注：</span>
                              </span>
                              <button
                                onClick={() => handleDeleteParagraphNote(para.id)}
                                className="text-stone-400 hover:text-cinnabar-700 cursor-pointer"
                                title="删除批注"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="leading-relaxed whitespace-pre-wrap">{paraNotes[para.id]}</p>
                          </div>
                        )}

                        {/* Paragraph Inline Editor */}
                        {isEditing && (
                          <div className="mt-3 p-3 bg-paper-50 border border-bamboo-300 rounded-xl space-y-2 animate-fadeIn">
                            <div className="text-xs font-serif font-bold text-wood-800">
                              撰写自然段 {para.id} 的教学批注（如提问话术、板书关键词）：
                            </div>
                            <textarea
                              rows={3}
                              value={tempParaText}
                              onChange={(e) => setTempParaText(e.target.value)}
                              placeholder="例如：此处模拟点名李同学提问‘这三个动词有何表达效果’；在副板书写上重点生字注音..."
                              className="w-full p-2.5 text-xs md:text-sm bg-white border border-paper-border rounded-lg focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingParaId(null)}
                                className="px-3 py-1 text-xs text-wood-600 hover:bg-paper-200 rounded-lg cursor-pointer"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => handleSaveParagraphNote(para.id)}
                                className="px-3.5 py-1 text-xs bg-bamboo-700 text-white rounded-lg font-serif font-bold cursor-pointer"
                              >
                                保存段落批注
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Overall Lesson Note Box */}
                <div className="p-5 rounded-2xl bg-paper-50 border border-paper-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-wood-900 flex items-center space-x-1.5">
                      <Edit3 className="w-4 h-4 text-bamboo-700" />
                      <span>本课备课总笔记（自动保存到浏览器本地）：</span>
                    </span>
                    {noteSavedToast && (
                      <span className="text-xs text-bamboo-700 font-bold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>笔记已保存</span>
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    placeholder="在此记录本篇课文个人的试讲提问设计、导入语调整或板书心得..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full p-3 text-xs md:text-sm bg-white border border-paper-border rounded-xl focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveUserNote}
                      className="btn-tactile px-4 py-2 bg-bamboo-700 text-white rounded-xl text-xs md:text-sm font-serif font-bold cursor-pointer shadow"
                    >
                      保存备课笔记
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB C: 教材原版 PDF (Problem 9) ================= */}
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
