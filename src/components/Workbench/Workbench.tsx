import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { Lesson, Genre, StudyStatus, BookId } from '../../types';
import { LESSONS_DATA } from '../../data/lessonsData';
import { Chalkboard } from '../Common/Chalkboard';
import {
  LESSON_VARIANTS,
  getLessonWithVariant,
  applyCustomLessonEdits,
  LessonCustomData
} from '../../utils/lessonVariants';
import { LessonEditModal } from './LessonEditModal';
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
  RotateCcw,
  BookmarkCheck,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PdfViewer = lazy(() => import('./PdfViewer').then(m => ({ default: m.PdfViewer })));

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

const FONT_SCALE_CONFIG = {
  normal: {
    label: '标准',
    tab1Requirement: 'text-xs',
    tab1Body: 'text-xs md:text-sm leading-relaxed',
    tab1Heading: 'text-sm md:text-base font-bold',
    tab1Script: 'text-xs md:text-sm leading-relaxed',
    tab2Para: 'text-sm md:text-base leading-relaxed',
    tab2Note: 'text-xs md:text-sm',
    tab2Word: 'text-xs',
  },
  large: {
    label: '大',
    tab1Requirement: 'text-sm',
    tab1Body: 'text-sm md:text-base leading-loose',
    tab1Heading: 'text-base md:text-lg font-bold',
    tab1Script: 'text-sm md:text-base leading-loose',
    tab2Para: 'text-base md:text-lg leading-loose tracking-wide',
    tab2Note: 'text-sm md:text-base leading-relaxed',
    tab2Word: 'text-sm',
  },
  xlarge: {
    label: '特大',
    tab1Requirement: 'text-base',
    tab1Body: 'text-base md:text-lg leading-loose',
    tab1Heading: 'text-lg md:text-xl font-bold',
    tab1Script: 'text-base md:text-lg leading-loose',
    tab2Para: 'text-lg md:text-xl leading-loose tracking-wider',
    tab2Note: 'text-base md:text-lg leading-relaxed',
    tab2Word: 'text-base',
  }
};

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

  // Directory Sidebar state (Left column, completely disappears when collapsed)
  const [isTOCCollapsed, setIsTOCCollapsed] = useState<boolean>(false);

  // Lesson Variant & Single-Lesson Regeneration state
  const [variantIndex, setVariantIndex] = useState<number>(() => {
    const saved = localStorage.getItem(`tl_variant_idx_${currentLesson.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [customEdits, setCustomEdits] = useState<LessonCustomData | null>(() => {
    const saved = localStorage.getItem(`tl_custom_lesson_${currentLesson.id}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  // Font Size Scaler state (标准 大 特大)
  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    return (localStorage.getItem('tl_font_size') as FontSizeLevel) || 'large';
  });
  const [fontToast, setFontToast] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'bible' | 'text' | 'pdf'>('bible');
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [noteContent, setNoteContent] = useState<string>(userNotes[currentLesson.id] || '');
  const [noteSavedToast, setNoteSavedToast] = useState(false);

  // Paragraph-level annotations
  const [paraNotes, setParaNotes] = useState<Record<number, string>>({});
  const [editingParaId, setEditingParaId] = useState<number | null>(null);
  const [tempParaText, setTempParaText] = useState<string>('');

  useEffect(() => {
    setSelectedBook(currentLesson.book);
    setExpandedUnits(prev => ({ ...prev, [currentLesson.unit]: true }));
    setNoteContent(userNotes[currentLesson.id] || '');

    // Load variant and custom edits for current lesson
    const savedVar = localStorage.getItem(`tl_variant_idx_${currentLesson.id}`);
    setVariantIndex(savedVar ? parseInt(savedVar, 10) : 0);

    const savedCustom = localStorage.getItem(`tl_custom_lesson_${currentLesson.id}`);
    setCustomEdits(savedCustom ? JSON.parse(savedCustom) : null);

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

  // Compute active lesson design with variant + custom edits applied
  const baseVariantLesson = useMemo(() => {
    return getLessonWithVariant(currentLesson, variantIndex);
  }, [currentLesson, variantIndex]);

  const activeLesson = useMemo(() => {
    return applyCustomLessonEdits(baseVariantLesson, customEdits);
  }, [baseVariantLesson, customEdits]);

  const isCustomEdited = Boolean(customEdits && Object.keys(customEdits).length > 0);

  // Single-lesson design regeneration ("换一版设计" / 刷新)
  const handleRegenerateLessonDesign = () => {
    setIsRegenerating(true);
    const nextIdx = (variantIndex + 1) % LESSON_VARIANTS.length;
    setVariantIndex(nextIdx);
    localStorage.setItem(`tl_variant_idx_${currentLesson.id}`, nextIdx.toString());
    if (customEdits) {
      localStorage.removeItem(`tl_custom_lesson_${currentLesson.id}`);
      setCustomEdits(null);
    }
    setTimeout(() => {
      setIsRegenerating(false);
      setFontToast(`已为《${currentLesson.title}》重新生成【${LESSON_VARIANTS[nextIdx].name}】！`);
      setTimeout(() => setFontToast(null), 3000);
    }, 300);
  };

  const handleSaveCustomEdits = (data: LessonCustomData) => {
    setCustomEdits(data);
    localStorage.setItem(`tl_custom_lesson_${currentLesson.id}`, JSON.stringify(data));
    setIsEditModalOpen(false);
    setFontToast(`已保存《${currentLesson.title}》专属定制教案！`);
    setTimeout(() => setFontToast(null), 3000);
  };

  const handleResetToDefault = () => {
    localStorage.removeItem(`tl_custom_lesson_${currentLesson.id}`);
    localStorage.removeItem(`tl_variant_idx_${currentLesson.id}`);
    setCustomEdits(null);
    setVariantIndex(0);
    setIsEditModalOpen(false);
    setFontToast(`已恢复《${currentLesson.title}》考纲官方标准版！`);
    setTimeout(() => setFontToast(null), 3000);
  };

  const handleFontSizeChange = (level: FontSizeLevel) => {
    setFontSize(level);
    localStorage.setItem('tl_font_size', level);
    setFontToast(`字号已调整为【${FONT_SCALE_CONFIG[level].label}】`);
    setTimeout(() => setFontToast(null), 2500);
  };

  const handleSelectLessonFromTOC = (lesson: Lesson) => {
    onSelectLesson(lesson);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsTOCCollapsed(true);
    }
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
    const stepsText = activeLesson.speedPlan.steps
      .map((s) => `${s.step}. ${s.name}（${s.duration}）：${s.coreAction}`)
      .join('\n');

    const fullPlanText = `《${activeLesson.title}》10分钟试讲简案（考场速记提纲）
作者：${activeLesson.author} | 文体：${activeLesson.genre}
----------------------------------------
【一课一得目标】：
- 知识要点：${activeLesson.speedPlan.objectives.knowledge}
- 过程方法：${activeLesson.speedPlan.objectives.process}
- 情感升华：${activeLesson.speedPlan.objectives.emotional}

【核心教学切片】：
${activeLesson.goldenSlice.sliceRange}
聚焦要点：${activeLesson.goldenSlice.sliceTitle}

【教学过程五步流程】：
${stepsText}

【黑板板书核心】：
${activeLesson.blackboard.mainBoard}

【课后作业】：
${activeLesson.speedPlan.homework}`;

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
  const currentScale = FONT_SCALE_CONFIG[fontSize];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn space-y-6">
      {/* 2-Column Layout: Left Directory Column + Right Column (Top Summary + Bottom Tabs) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Lesson Directory (Completely hidden when collapsed, taking zero space) */}
        {!isTOCCollapsed && (
          <div className="w-full lg:w-80 shrink-0 bg-paper-card rounded-2xl border border-paper-border shadow-scholarly flex flex-col max-h-[calc(100vh-100px)] sticky top-20 z-10 transition-all">
            {/* Directory Header with Collapse Button */}
            <div className="p-3.5 border-b border-paper-border flex items-center justify-between bg-paper-100/70 rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-bamboo-700" />
                <span className="font-serif font-bold text-xs text-wood-900">初中语文统编教材目录</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-serif font-medium">158篇</span>
              </div>
              <button
                onClick={() => setIsTOCCollapsed(true)}
                className="px-2 py-1 rounded-lg hover:bg-paper-200 text-wood-600 hover:text-wood-900 transition cursor-pointer flex items-center space-x-1 text-xs font-serif"
                title="收起课文目录"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
                <span>收起</span>
              </button>
            </div>

            {/* Directory Body */}
            <div className="p-3.5 space-y-3 overflow-y-auto flex-1">
              {/* Book Selector Tabs (Horizontal Scroll Single Row) */}
              <div className="flex items-center space-x-1.5 p-1 bg-paper-100 rounded-xl border border-paper-border text-xs font-serif overflow-x-auto scrollbar-none flex-nowrap">
                {BOOKS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBook(b.id)}
                    className={`px-2.5 py-1 text-center rounded-lg transition cursor-pointer font-medium whitespace-nowrap flex-shrink-0 text-xs ${
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
                <Search className="w-3.5 h-3.5 text-wood-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="搜索篇目 / 作者..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-paper-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value as any)}
                  className="bg-white border border-paper-border rounded-lg px-2 py-1.5 text-wood-800 font-serif focus:outline-none text-[11px]"
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
                  className="bg-white border border-paper-border rounded-lg px-2 py-1.5 text-wood-800 font-serif focus:outline-none text-[11px]"
                >
                  <option value="all">全部备考状态</option>
                  <option value="unlearned">⚪ 未学习</option>
                  <option value="practicing">🟡 备课中</option>
                  <option value="mastered">🟢 已掌握</option>
                  <option value="review_needed">🔴 需复习</option>
                </select>
              </div>

              {/* Lesson Tree */}
              <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {unitsInBook.map((unitNum) => {
                  const lessonsInUnit = filteredLessons.filter((l) => l.unit === unitNum);
                  if (lessonsInUnit.length === 0) return null;
                  const unitTitle = lessonsInUnit[0].unitTitle;
                  const isExpanded = expandedUnits[unitNum] ?? true;

                  return (
                    <div key={unitNum} className="border border-paper-border rounded-xl overflow-hidden bg-white/50">
                      <button
                        onClick={() => toggleUnit(unitNum)}
                        className="w-full flex items-center justify-between p-2 bg-paper-100/70 hover:bg-paper-200 text-left text-xs font-serif font-bold text-wood-900 cursor-pointer"
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
                        <div className="p-1 space-y-1">
                          {lessonsInUnit.map((lesson) => {
                            const isSelected = lesson.id === currentLesson.id;
                            const st = studyStatuses[lesson.id] || 'unlearned';

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleSelectLessonFromTOC(lesson)}
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
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="已掌握" />
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
          </div>
        )}

        {/* Right Column: Two rows (Top Summary Card + Bottom Content Tabs) */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {/* Right Column Top: The Summary Banner Toolbar (移到右栏的上边) */}
          <div className="bg-paper-card p-4 md:p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-4">
            {/* Row 1: Title, Meta, Variant badge & Primary Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left: Expand Directory Button (if collapsed) + Title & Meta */}
              <div className="flex items-center space-x-3 min-w-0">
                {isTOCCollapsed && (
                  <button
                    onClick={() => setIsTOCCollapsed(false)}
                    className="p-2 rounded-xl bg-paper-100 hover:bg-paper-200 border border-paper-border text-wood-700 transition cursor-pointer flex items-center space-x-1.5 shadow-sm flex-shrink-0"
                    title="展开课文目录"
                  >
                    <PanelLeftOpen className="w-4 h-4 text-bamboo-700" />
                    <span className="text-xs font-serif font-bold text-bamboo-900 hidden sm:inline">展开目录 (158篇)</span>
                  </button>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-wood-200 text-wood-800 font-serif">
                      {activeLesson.bookName} · {activeLesson.unitTitle}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-bamboo-100 text-bamboo-800 font-serif font-medium">
                      {activeLesson.genre}
                    </span>
                    <span className="text-amber-700 text-xs font-bold font-mono">
                      {'★'.repeat(activeLesson.star)}
                    </span>
                    {/* Variant or Custom Badge */}
                    {isCustomEdited ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-serif font-bold flex items-center space-x-1">
                        <span>✏️ 个人定制版</span>
                      </span>
                    ) : variantIndex > 0 ? (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-serif font-medium border flex items-center space-x-1 ${LESSON_VARIANTS[variantIndex].badgeColor}`}>
                        <Sparkles className="w-3 h-3 text-bamboo-700" />
                        <span>方案{variantIndex + 1}：{LESSON_VARIANTS[variantIndex].name}</span>
                      </span>
                    ) : null}
                  </div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-wood-900 mt-1 truncate">
                    《{activeLesson.title}》
                    <span className="text-xs sm:text-sm font-normal text-wood-600 ml-2">作者：{activeLesson.author}</span>
                  </h1>
                </div>
              </div>

              {/* Right: Quick Actions (Regenerate, Edit, Add to Daily, Start Trial) */}
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                {/* Single-Lesson Regenerate / Refresh Button (换一版设计) */}
                <button
                  onClick={handleRegenerateLessonDesign}
                  className="btn-tactile flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-serif font-medium cursor-pointer shadow-sm transition"
                  title="重新生成本课试讲设计（换一版导入语、重点与逐字稿）"
                >
                  <RotateCcw className={`w-3.5 h-3.5 text-purple-700 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>换一版设计</span>
                </button>

                {/* Custom Edit Button (自定义修改) */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn-tactile flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-paper-100 hover:bg-paper-200 border border-paper-border text-wood-800 text-xs font-serif cursor-pointer shadow-sm transition"
                  title="自定义修改本课导入语、重点与逐字稿"
                >
                  <Edit3 className="w-3.5 h-3.5 text-bamboo-700" />
                  <span>自定义修改</span>
                </button>

                {/* Add to Daily Task */}
                <button
                  onClick={() => onAddToDaily(currentLesson)}
                  className="btn-tactile flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-paper-100 hover:bg-paper-200 border border-paper-border text-wood-800 text-xs font-serif cursor-pointer shadow-sm"
                  title="加入今日模拟练待办"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-bamboo-700" />
                  <span className="hidden sm:inline">加入待办</span>
                </button>

                {/* Start 10-Minute Trial */}
                <button
                  onClick={onStartTrialTimer}
                  className="btn-tactile flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-bamboo-700 text-white hover:bg-bamboo-800 text-xs font-serif font-bold shadow cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>开启10分钟试讲</span>
                </button>
              </div>
            </div>

            {/* Row 2: Font Size Switcher & Status Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-paper-border/60">
              {/* Font Size Adjuster (标准 大 特大) */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-paper-100 border border-paper-border rounded-xl p-1 space-x-1 shadow-sm">
                  <span className="text-[11px] text-wood-600 font-serif font-medium pl-1.5 pr-0.5 flex items-center space-x-1">
                    <Type className="w-3.5 h-3.5 text-bamboo-700" />
                    <span className="hidden sm:inline">字号:</span>
                  </span>
                  <button
                    onClick={() => handleFontSizeChange('normal')}
                    className={`px-3 py-1 text-xs rounded-lg font-serif transition cursor-pointer ${
                      fontSize === 'normal'
                        ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                        : 'text-wood-700 hover:bg-paper-200'
                    }`}
                    title="标准字号"
                  >
                    标准
                  </button>
                  <button
                    onClick={() => handleFontSizeChange('large')}
                    className={`px-3 py-1 text-xs rounded-lg font-serif transition cursor-pointer ${
                      fontSize === 'large'
                        ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                        : 'text-wood-700 hover:bg-paper-200'
                    }`}
                    title="大字号"
                  >
                    大
                  </button>
                  <button
                    onClick={() => handleFontSizeChange('xlarge')}
                    className={`px-3 py-1 text-xs rounded-lg font-serif transition cursor-pointer ${
                      fontSize === 'xlarge'
                        ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                        : 'text-wood-700 hover:bg-paper-200'
                    }`}
                    title="特大字号"
                  >
                    特大
                  </button>
                </div>

                {fontToast && (
                  <span className="text-[11px] text-bamboo-800 bg-bamboo-50 border border-bamboo-200 px-2 py-0.5 rounded-lg animate-fadeIn font-serif hidden md:inline">
                    ✓ {fontToast}
                  </span>
                )}
              </div>

              {/* Manual Status Buttons */}
              <div className="flex items-center bg-paper-100 border border-paper-border rounded-xl p-1 space-x-1 shadow-sm overflow-x-auto">
                <span className="text-[11px] text-wood-500 font-serif px-1 hidden lg:inline">备考进度:</span>
                <button
                  onClick={() => onUpdateStatus(currentLesson.id, 'unlearned')}
                  className={`px-2 py-1 rounded-lg text-xs font-serif transition cursor-pointer whitespace-nowrap ${
                    currentStatus === 'unlearned' ? 'bg-white text-wood-800 shadow font-bold ring-1 ring-wood-300' : 'text-wood-600 hover:bg-paper-200'
                  }`}
                >
                  ⚪ 未学
                </button>
                <button
                  onClick={() => onUpdateStatus(currentLesson.id, 'practicing')}
                  className={`px-2 py-1 rounded-lg text-xs font-serif transition cursor-pointer whitespace-nowrap ${
                    currentStatus === 'practicing' ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-sm' : 'text-wood-600 hover:bg-paper-200'
                  }`}
                >
                  🟡 备课中
                </button>
                <button
                  onClick={() => onUpdateStatus(currentLesson.id, 'mastered')}
                  className={`px-2 py-1 rounded-lg text-xs font-serif transition cursor-pointer whitespace-nowrap ${
                    currentStatus === 'mastered' ? 'bg-bamboo-700 text-white shadow font-bold' : 'text-wood-600 hover:bg-paper-200'
                  }`}
                >
                  🟢 已掌握
                </button>
                <button
                  onClick={() => onUpdateStatus(currentLesson.id, 'review_needed')}
                  className={`px-2 py-1 rounded-lg text-xs font-serif transition cursor-pointer whitespace-nowrap ${
                    currentStatus === 'review_needed' ? 'bg-cinnabar-700 text-white shadow font-bold' : 'text-wood-600 hover:bg-paper-200'
                  }`}
                >
                  🔴 需复习
                </button>
              </div>
            </div>
          </div>

          {/* Right Column Bottom: Triple Tabs Navigation & Content */}
          <div className="w-full space-y-6">
          {/* Triple Tabs Navigation */}
          <div className="flex items-center border-b border-paper-border space-x-1 sm:space-x-2 bg-paper-card p-1.5 rounded-2xl border shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab('bible')}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-serif text-xs md:text-sm transition cursor-pointer whitespace-nowrap ${
                activeTab === 'bible'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-100 font-medium'
              }`}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">选项卡 1【10分钟教学设计与板书】</span>
              <span className="sm:hidden">1. 教学设计</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-serif text-xs md:text-sm transition cursor-pointer whitespace-nowrap ${
                activeTab === 'text'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-100 font-medium'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">选项卡 2【课文全文与分段批注】</span>
              <span className="sm:hidden">2. 课文批注</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-serif text-xs md:text-sm transition cursor-pointer whitespace-nowrap ${
                activeTab === 'pdf'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-100 font-medium'
              }`}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">选项卡 3【统编原版教材 PDF】</span>
              <span className="sm:hidden">3. 原版教材</span>
            </button>
          </div>

          {/* ================= TAB A: 10分钟教学设计 ================= */}
          {activeTab === 'bible' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1. 试讲考查要求 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-3">
                <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm md:text-base">
                  <AlertCircle className="w-4 h-4 text-bamboo-700" />
                  <span>一、试讲考查要求</span>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 font-serif ${currentScale.tab1Requirement}`}>
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
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm md:text-base">
                    <Sparkles className="w-4 h-4 text-bamboo-700" />
                    <span>二、10分钟教学切片建议（围绕“一课一得”）</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-900 font-serif font-medium">
                    核心切片
                  </span>
                </div>

                <div className={`space-y-2.5 font-serif text-wood-800 ${currentScale.tab1Body}`}>
                  <div className="p-3.5 bg-white rounded-xl border border-bamboo-200 space-y-1">
                    <strong className="text-bamboo-900 block font-bold">🎯 建议精讲段落切片：</strong>
                    <p className={`text-wood-900 font-medium ${currentScale.tab1Heading}`}>{activeLesson.goldenSlice.sliceRange}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 bg-white rounded-xl border border-paper-border space-y-1">
                      <strong className="text-wood-900 block font-bold">✨ 一课一得目标：</strong>
                      <p className="text-wood-700">{activeLesson.goldenSlice.oneGain}</p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-paper-border space-y-1">
                      <strong className="text-wood-900 block font-bold">⏱️ 建议时间分配：</strong>
                      <p className="text-wood-700 font-mono text-xs">{activeLesson.goldenSlice.timingGuide}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start space-x-2">
                    <span className="font-bold flex-shrink-0">💡 备考提示：</span>
                    <span>{activeLesson.goldenSlice.examinerTip}</span>
                  </div>
                </div>
              </div>

              {/* 3. 考场教学简案设计 */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm md:text-base">
                    <Edit3 className="w-4 h-4 text-bamboo-700" />
                    <span>三、教学简案设计（备考室速写备课）</span>
                  </div>
                  <button
                    onClick={handleCopyPlan}
                    className="btn-tactile flex items-center space-x-1 px-3 py-1 bg-paper-100 hover:bg-paper-200 border border-paper-border rounded-lg text-xs font-serif text-wood-800 cursor-pointer"
                  >
                    {copiedPlan ? <Check className="w-3.5 h-3.5 text-bamboo-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPlan ? '已复制简案' : '一键复制简案'}</span>
                  </button>
                </div>

                <div className={`p-4 bg-paper-50 rounded-xl border border-paper-border font-serif space-y-2.5 text-wood-800 ${currentScale.tab1Body}`}>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="font-bold text-wood-900">课型：{activeLesson.speedPlan.courseType}</span>
                    <span className="text-wood-500 text-xs">考场草稿提纲（建议备考室5-8分钟速成）</span>
                  </div>

                  <div>
                    <strong className="text-wood-900">【教学重点】：</strong>
                    <span>{activeLesson.speedPlan.keyPoints}</span>
                  </div>

                  <div>
                    <strong className="text-wood-900">【教学难点】：</strong>
                    <span>{activeLesson.speedPlan.difficulties}</span>
                  </div>

                  <div className="space-y-1.5">
                    <strong className="text-wood-900 block">【教学过程（5步流程）】：</strong>
                    {activeLesson.speedPlan.steps.map((s) => (
                      <div key={s.step} className="pl-2 flex items-start space-x-1.5">
                        <span className="font-bold text-bamboo-800 flex-shrink-0">{s.step}. {s.name}（{s.duration}）：</span>
                        <span className="text-wood-700">{s.coreAction}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-200">
                    <strong className="text-wood-900">【课后作业】：</strong>
                    <span>{activeLesson.speedPlan.homework}</span>
                  </div>
                </div>
              </div>

              {/* 4. 教学过程示范（逐字稿） */}
              <div className="bg-paper-card p-5 rounded-2xl border border-paper-border shadow-scholarly space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-wood-900 font-serif font-bold text-sm md:text-base">
                    <MessageSquare className="w-4 h-4 text-bamboo-700" />
                    <span>四、10分钟试讲教学过程示范（互动与指导语言）</span>
                  </div>
                  <span className="text-xs text-wood-500 font-serif hidden sm:inline">
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
                      教师活动：{activeLesson.verbatimScript.importStage.actionNotes}
                    </span>
                  </div>
                  <p className={`font-serif text-wood-900 bg-white p-3 rounded-lg border border-paper-border ${currentScale.tab1Script}`}>
                    {activeLesson.verbatimScript.importStage.teacherLines}
                  </p>
                </div>

                {/* Stage 2: 初读 */}
                <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-wood-800 font-serif">
                    <span className="px-2 py-0.5 rounded bg-wood-200 text-wood-900">
                      第2步 · 初读感知（01:30 - 03:00）
                    </span>
                    <span className="text-[11px] text-wood-500 font-normal">
                      教师活动：{activeLesson.verbatimScript.preliminaryReadStage.actionNotes}
                    </span>
                  </div>
                  <p className={`font-serif text-wood-900 bg-white p-3 rounded-lg border border-paper-border ${currentScale.tab1Script}`}>
                    {activeLesson.verbatimScript.preliminaryReadStage.teacherLines}
                  </p>
                </div>

                {/* Stage 3: 精读研讨 */}
                <div className="p-4 rounded-xl bg-bamboo-50/50 border border-bamboo-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-bamboo-900 font-serif">
                    <span className="px-2 py-0.5 rounded bg-bamboo-700 text-white">
                      第3步 · 精读切片深入探究（03:00 - 07:30 重点突破）
                    </span>
                    <span className="text-bamboo-800 font-medium">
                      {activeLesson.verbatimScript.deepDiveStage.title}
                    </span>
                  </div>

                  <div className="space-y-2 font-serif">
                    <div className="bg-white p-3 rounded-lg border border-bamboo-200 space-y-1">
                      <strong className="text-bamboo-800 block text-xs md:text-sm">【教师提问设计】：</strong>
                      <p className={`text-wood-900 ${currentScale.tab1Script}`}>{activeLesson.verbatimScript.deepDiveStage.teacherQuestion}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-stone-300 space-y-1">
                      <strong className="text-stone-700 block text-xs md:text-sm">【预设学生回答】：</strong>
                      <p className={`text-wood-800 italic ${currentScale.tab1Script}`}>{activeLesson.verbatimScript.deepDiveStage.studentAnswer}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-bamboo-200 space-y-1">
                      <strong className="text-bamboo-800 block text-xs md:text-sm">【教师评价与板书提示】：</strong>
                      <p className={`text-wood-900 ${currentScale.tab1Script}`}>{activeLesson.verbatimScript.deepDiveStage.teacherFeedback}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-bamboo-200 space-y-1">
                      <strong className="text-bamboo-800 block text-xs md:text-sm">【追问启发】：</strong>
                      <p className={`text-wood-900 ${currentScale.tab1Script}`}>{activeLesson.verbatimScript.deepDiveStage.deepenQuestion}</p>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-lg border border-stone-300 space-y-1">
                      <strong className="text-wood-800 block text-xs md:text-sm">【朗读指导提示】：</strong>
                      <p className={`text-wood-900 font-medium ${currentScale.tab1Script}`}>{activeLesson.verbatimScript.deepDiveStage.readingGuidance}</p>
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
                  <div className={`space-y-1 font-serif bg-white p-3 rounded-lg border border-paper-border ${currentScale.tab1Script}`}>
                    <p className="text-wood-900">{activeLesson.verbatimScript.summaryAndHomeworkStage.summaryLines}</p>
                    <p className="text-wood-700 pt-1">{activeLesson.verbatimScript.summaryAndHomeworkStage.homeworkLines}</p>
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
                  title={activeLesson.title}
                  author={activeLesson.author}
                  rawMainBoard={activeLesson.blackboard.mainBoard}
                  subBoard={activeLesson.blackboard.subBoard}
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

                {/* 选项卡1与选项卡2协同看板：确保重点、切片与板书高度一致 */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-bamboo-50/90 via-paper-50 to-amber-50/60 border border-bamboo-200 shadow-sm space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-serif font-bold text-sm text-bamboo-950 flex items-center space-x-1.5">
                      <BookmarkCheck className="w-4 h-4 text-bamboo-700" />
                      <span>本课试讲核心切片与研讨重点（与选项卡1及板书严格保持一致）</span>
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-700 text-white font-serif font-medium">
                      定位段落：{activeLesson.goldenSlice.sliceRange}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-serif pt-1">
                    <div className="p-3 bg-white/95 rounded-lg border border-bamboo-200/80 space-y-1 shadow-xs">
                      <strong className="text-bamboo-900 block font-bold">🎯 选项卡1教学重点（板书主干）：</strong>
                      <p className="text-wood-800 leading-relaxed">{activeLesson.speedPlan.keyPoints}</p>
                    </div>

                    <div className="p-3 bg-white/95 rounded-lg border border-paper-border space-y-1 shadow-xs">
                      <strong className="text-wood-900 block font-bold">💬 精读探究主问题（课堂互动）：</strong>
                      <p className="text-wood-800 leading-relaxed">{activeLesson.verbatimScript.deepDiveStage.teacherQuestion}</p>
                    </div>
                  </div>

                  {activeLesson.speedPlan.difficulties && (
                    <div className="text-xs font-serif text-wood-600 px-1 flex items-center space-x-1.5">
                      <span className="font-bold text-amber-800">💡 教学难点对应：</span>
                      <span>{activeLesson.speedPlan.difficulties}</span>
                    </div>
                  )}
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
                              <span className="px-2.5 py-0.5 rounded-full bg-bamboo-700 text-white font-serif font-bold text-[11px] flex items-center space-x-1">
                                <BookmarkCheck className="w-3 h-3" />
                                <span>🎯 建议10分钟精读教学段落（选项卡1教学重点聚焦处）</span>
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

                        {/* Paragraph Pure Body Text (Problem 1) */}
                        <p className={`indent-8 font-serif text-wood-900 ${currentScale.tab2Para}`}>
                          {para.content}
                        </p>

                        {/* 重点内容与设问直连卡片（与选项卡1和板书严格一致） */}
                        {para.isHighlightedSlice && (
                          <div className="mt-3 p-3.5 bg-white/95 border border-bamboo-300 rounded-xl space-y-1.5 text-xs font-serif text-wood-900 shadow-xs">
                            <div className="flex items-center space-x-1.5 font-bold text-bamboo-900 pb-1 border-b border-bamboo-200/60">
                              <BookmarkCheck className="w-3.5 h-3.5 text-bamboo-700" />
                              <span>本段试讲重点与课堂设问（与选项卡1教学重点及板书一致）：</span>
                            </div>
                            <p className="text-wood-800">
                              <strong className="text-bamboo-900">🎯 本课教学重点：</strong>{activeLesson.speedPlan.keyPoints}
                            </p>
                            <p className="text-wood-800">
                              <strong className="text-bamboo-900">💬 课堂提问示范：</strong>{activeLesson.verbatimScript.deepDiveStage.teacherQuestion}
                            </p>
                            <p className="text-stone-600 italic">
                              <strong>预设学生回答：</strong>{activeLesson.verbatimScript.deepDiveStage.studentAnswer}
                            </p>
                          </div>
                        )}

                        {/* Pinyin Notes if available */}
                        {para.pinyinNotes && para.pinyinNotes.length > 0 && (
                          <div className={`mt-3 pt-2.5 border-t border-bamboo-200/60 flex flex-wrap gap-2 ${currentScale.tab2Word}`}>
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
                          <div className={`mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950 font-serif space-y-1 shadow-sm ${currentScale.tab2Note}`}>
                            <div className="flex items-center justify-between text-xs font-bold text-amber-800 pb-1 border-b border-amber-200/60">
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
                              className={`w-full p-2.5 bg-white border border-paper-border rounded-lg focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif ${currentScale.tab2Note}`}
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
                    className={`w-full p-3 bg-white border border-paper-border rounded-xl focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif leading-relaxed ${currentScale.tab2Note}`}
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

          {/* ================= TAB C: 教材原版 PDF (Problem 9 & 4) ================= */}
          {activeTab === 'pdf' && (
            <div className="space-y-4 animate-fadeIn">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-stone-100 rounded-2xl border border-paper-border text-center">
                    <div className="w-8 h-8 border-4 border-bamboo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-serif text-sm font-bold text-wood-800">正在异步载入 PDF 阅读器组件...</p>
                    <p className="font-serif text-xs text-wood-500">已启用分包按需加载，无需等待完整大文件</p>
                  </div>
                }
              >
                <PdfViewer
                  fileName={currentLesson.pdfFileName}
                  initialPage={currentLesson.pdfPage}
                  lessonTitle={currentLesson.title}
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Lesson Custom Edit Modal */}
      <LessonEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lessonTitle={currentLesson.title}
        author={currentLesson.author}
        initialData={{
          importScript: activeLesson.verbatimScript.importStage.teacherLines,
          keyPoints: activeLesson.speedPlan.keyPoints,
          difficulties: activeLesson.speedPlan.difficulties,
          sliceRange: activeLesson.goldenSlice.sliceRange,
          sliceTitle: activeLesson.goldenSlice.sliceTitle,
          teacherQuestion: activeLesson.verbatimScript.deepDiveStage.teacherQuestion,
          studentAnswer: activeLesson.verbatimScript.deepDiveStage.studentAnswer,
          teacherFeedback: activeLesson.verbatimScript.deepDiveStage.teacherFeedback,
          mainBoard: activeLesson.blackboard.mainBoard,
        }}
        onSave={handleSaveCustomEdits}
        onReset={handleResetToDefault}
        isCustomized={isCustomEdited}
      />
    </div>
  );
};
