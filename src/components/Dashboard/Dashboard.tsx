import React, { useState, useEffect, useMemo } from 'react';
import { Lesson, Genre, StudyStatus, DailyPracticeItem, StudySessionRecord } from '../../types';
import { LESSONS_DATA } from '../../data/lessonsData';
import {
  Compass,
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  Plus,
  Trash2,
  BookOpen,
  ArrowUpRight,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Eye,
  PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardProps {
  onSelectLesson: (lesson: Lesson) => void;
  onOpenExamSimulator: () => void;
  examDate: string;
  onUpdateExamDate: (date: string) => void;
  studyStatuses: Record<string, StudyStatus>;
  dailyTasks: DailyPracticeItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: DailyPracticeItem) => void;
  onDeleteTask: (taskId: string) => void;
}

const GENRE_LIST: Genre[] = [
  '现代写景抒情散文',
  '叙事散文/小说',
  '文言文',
  '古诗词',
  '说明文/新闻/活动',
  '议论文/思辨文本',
  '写作与表达专项'
];

// 播放清脆白噪音/铃声
const playChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25); // A5
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
};

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectLesson,
  onOpenExamSimulator,
  examDate,
  onUpdateExamDate,
  studyStatuses,
  dailyTasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [selectedGenreForTask, setSelectedGenreForTask] = useState<Genre>('文言文');
  const [expandedGenre, setExpandedGenre] = useState<Genre | null>(null);

  // 1. 倒计时实时秒级跳动
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const targetDate = new Date(examDate);
  const diffMs = Math.max(0, targetDate.getTime() - currentTime.getTime());
  const countdownDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const countdownHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const countdownMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const countdownSeconds = Math.floor((diffMs / 1000) % 60);

  // 2. 番茄专注钟状态 (支持10分钟考场试讲、25分钟教案备课、5分钟复盘休息)
  const [pomoMode, setPomoMode] = useState<'trial' | 'prep' | 'rest'>('trial');
  const [pomoTotalSeconds, setPomoTotalSeconds] = useState<number>(10 * 60);
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState<number>(10 * 60);
  const [pomoActive, setPomoActive] = useState<boolean>(false);

  // 3. 近7日备课时长统计数据
  const [studySessions, setStudySessions] = useState<StudySessionRecord[]>(() => {
    try {
      const stored = localStorage.getItem('tl_study_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveSessions = (sessions: StudySessionRecord[]) => {
    setStudySessions(sessions);
    try {
      localStorage.setItem('tl_study_sessions', JSON.stringify(sessions));
    } catch {
      // ignore
    }
  };

  const recordStudyMinutes = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: StudySessionRecord = {
      id: 'sess-' + Date.now(),
      date: today,
      minutes,
      completedAt: new Date().toISOString()
    };
    const updated = [...studySessions, newRecord];
    saveSessions(updated);
  };

  // 切换番茄钟模式
  const handleSwitchPomoMode = (mode: 'trial' | 'prep' | 'rest') => {
    setPomoActive(false);
    setPomoMode(mode);
    const secs = mode === 'trial' ? 10 * 60 : mode === 'prep' ? 25 * 60 : 5 * 60;
    setPomoTotalSeconds(secs);
    setPomoSecondsLeft(secs);
  };

  // 番茄钟倒计时逻辑
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (pomoActive && pomoSecondsLeft > 0) {
      timer = setInterval(() => {
        setPomoSecondsLeft(prev => {
          if (prev <= 1) {
            setPomoActive(false);
            playChime();
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 }
            });
            // 自动记录学时
            const mins = Math.round(pomoTotalSeconds / 60);
            recordStudyMinutes(mins);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [pomoActive, pomoSecondsLeft, pomoTotalSeconds]);

  // 计算过去7天每日学习时长
  const past7DaysData = useMemo(() => {
    const result: { dateStr: string; label: string; minutes: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const monthDay = `${d.getMonth() + 1}/${d.getDate()}`;
      const label = i === 0 ? '今天' : i === 1 ? '昨天' : monthDay;
      const dayMinutes = studySessions
        .filter(s => s.date === dateStr)
        .reduce((sum, s) => sum + s.minutes, 0);
      result.push({ dateStr, label, minutes: dayMinutes });
    }
    return result;
  }, [studySessions]);

  const maxMinutesInWeek = Math.max(30, ...past7DaysData.map(d => d.minutes));
  const totalWeekMinutes = past7DaysData.reduce((acc, cur) => acc + cur.minutes, 0);

  // 基础统计
  const totalLessons = LESSONS_DATA.length;
  const masteredCount = Object.values(studyStatuses).filter(s => s === 'mastered').length;
  const practicingCount = Object.values(studyStatuses).filter(s => s === 'practicing').length;
  const reviewCount = Object.values(studyStatuses).filter(s => s === 'review_needed').length;
  const highFreqLessons = LESSONS_DATA.filter(l => l.star === 5);
  const masteredHighFreq = highFreqLessons.filter(l => studyStatuses[l.id] === 'mastered').length;

  const highFreqRate = highFreqLessons.length > 0
    ? Math.round((masteredHighFreq / highFreqLessons.length) * 100)
    : 0;

  // 7大文体进度统计
  const genreStats = GENRE_LIST.map(genre => {
    const genreLessons = LESSONS_DATA.filter(l => l.genre === genre);
    const count = genreLessons.length;
    const mastered = genreLessons.filter(l => studyStatuses[l.id] === 'mastered').length;
    const rate = count > 0 ? Math.round((mastered / count) * 100) : 0;
    return { genre, count, mastered, rate, lessons: genreLessons };
  });

  const handleTaskCheck = (taskId: string, isCompleted: boolean) => {
    onToggleTask(taskId);
    if (!isCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskTitle.trim()) return;

    const clean = customTaskTitle.replace(/[《》\s]/g, '');
    const match = LESSONS_DATA.find(l => l.title === clean || l.title.includes(clean));
    const newTask: DailyPracticeItem = {
      id: 'task-' + Date.now(),
      lessonId: match ? match.id : 'custom',
      title: customTaskTitle.trim().startsWith('《') ? customTaskTitle.trim() : `《${customTaskTitle.trim()}》`,
      author: match ? match.author : '自选备考',
      genre: match ? match.genre : selectedGenreForTask,
      bookName: match ? match.bookName : '练习篇目',
      completed: false,
      date: new Date().toISOString().split('T')[0]
    };

    onAddTask(newTask);
    setCustomTaskTitle('');
  };

  // 智能跳转课文：先尝试匹配 lessonId，再匹配名称
  const handleGoToTaskLesson = (task: DailyPracticeItem) => {
    let found = LESSONS_DATA.find(x => x.id === task.lessonId);
    if (!found) {
      const clean = task.title.replace(/[《》\s]/g, '');
      found = LESSONS_DATA.find(x => x.title === clean || x.title.includes(clean) || clean.includes(x.title));
    }
    if (!found) {
      found = LESSONS_DATA.find(x => x.genre === task.genre);
    }
    if (found) {
      onSelectLesson(found);
    }
  };

  // 智能顺延：点击进入文体时，跳转到该文体下【第一个未掌握】的课文
  const handleSmartGenreJump = (lessons: Lesson[]) => {
    if (!lessons.length) return;
    const nextUnmastered = lessons.find(l => studyStatuses[l.id] !== 'mastered');
    onSelectLesson(nextUnmastered || lessons[0]);
  };

  const getStatusBadge = (id: string) => {
    const s = studyStatuses[id] || 'unlearned';
    switch (s) {
      case 'mastered':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-bamboo-100 text-bamboo-800 font-bold">已掌握</span>;
      case 'practicing':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">备课中</span>;
      case 'review_needed':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-cinnabar-100 text-cinnabar-800 font-bold">需复习</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-paper-100 text-wood-500">未学习</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. Overview Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-wood-800 via-wood-700 to-bamboo-900 text-paper-50 p-6 md:p-8 shadow-scholarly overflow-hidden group">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-paper-200 text-xs font-serif backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>备考原则：一课一得 · 骨架清晰 · 自然互动 · 规范板书</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-black tracking-wide text-paper-50">
            初中语文教资面试 · 10分钟试讲专项备考工作台
          </h1>

          <p className="text-xs md:text-sm text-paper-200/90 leading-relaxed font-serif">
            系统深度整理部编版 6 册全套教材 <strong>146 篇核心精讲课文</strong> 与 <strong>12 堂写作指导专项课</strong>（共 158 篇），完全剥离注脚与排版干扰。每篇均配备考场重点切片、百字速写教案、逐字示范稿、标准板书设计及教材原版高精 PDF。
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenExamSimulator}
              className="btn-tactile flex items-center space-x-2 px-4 py-2 rounded-xl bg-bamboo-700 hover:bg-bamboo-800 text-white font-bold text-xs md:text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>考场模拟抽题</span>
            </button>

            <button
              onClick={() => {
                const spring = LESSONS_DATA.find(l => l.title === '春');
                if (spring) onSelectLesson(spring);
              }}
              className="btn-tactile flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-paper-50 border border-white/20 text-xs md:text-sm font-medium transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>经典示范《春》</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const writing = LESSONS_DATA.find(l => l.genre === '写作与表达专项');
                if (writing) onSelectLesson(writing);
              }}
              className="btn-tactile flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs md:text-sm font-medium transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-300" />
              <span>写作指导专项课</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Overview Stats Bar with Lively Hover Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-paper-card border border-paper-border shadow-sm flex items-center space-x-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-bamboo-300 cursor-pointer">
          <div className="w-11 h-11 rounded-lg bg-bamboo-100 flex items-center justify-center text-bamboo-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-wood-500 font-serif">收录课文总量</div>
            <div className="font-serif font-bold text-xl text-wood-900">
              {totalLessons} <span className="text-xs font-normal text-wood-600">篇 (含12篇写作)</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-paper-card border border-paper-border shadow-sm flex items-center space-x-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-300 cursor-pointer">
          <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-wood-500 font-serif">5星常考掌握</div>
            <div className="font-serif font-bold text-xl text-wood-900">
              {masteredHighFreq} / {highFreqLessons.length}{' '}
              <span className="text-xs font-normal text-amber-700 font-mono">
                ({highFreqRate}%)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-paper-card border border-paper-border shadow-sm flex items-center space-x-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-bamboo-300 cursor-pointer">
          <div className="w-11 h-11 rounded-lg bg-bamboo-100 flex items-center justify-center text-bamboo-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-wood-500 font-serif">已掌握篇目</div>
            <div className="font-serif font-bold text-xl text-wood-900">
              {masteredCount}{' '}
              <span className="text-xs font-normal text-wood-500">
                (备课中 {practicingCount} · 需复习 {reviewCount})
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-paper-card border border-paper-border shadow-sm flex items-center space-x-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-bamboo-300 cursor-pointer">
          <div className="w-11 h-11 rounded-lg bg-wood-200 flex items-center justify-center text-wood-800">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-wood-500 font-serif">整体掌握率</div>
            <div className="font-serif font-bold text-xl text-wood-900">
              {Math.round((masteredCount / totalLessons) * 100)} <span className="text-xs font-normal text-wood-500">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: 7-Genre Breakdown & Countdown + Daily Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: 7-Genre Mastery Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-paper-card p-6 rounded-2xl border border-paper-border shadow-scholarly space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-lg text-wood-900 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-bamboo-700" />
                  <span>7大文体备考进度与篇目清单</span>
                </h2>
                <p className="text-xs text-wood-500 font-serif mt-0.5">
                  点击“进入该文体”将<strong>自动顺延至下一个未掌握的篇目</strong>；点击“查看篇目”可展开查阅该文体包含的全部课文。
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-paper-100 rounded-lg text-wood-600 border border-paper-border font-serif">
                7大文体
              </span>
            </div>

            {/* Genre Progress Grid with Micro-animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {genreStats.map((item) => {
                const isExpanded = expandedGenre === item.genre;
                const nextUnmastered = item.lessons.find(l => studyStatuses[l.id] !== 'mastered');

                return (
                  <div
                    key={item.genre}
                    className="p-4 rounded-xl bg-paper-50 border border-paper-border hover:border-bamboo-400 hover:shadow-md transition-all duration-300 space-y-3 group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-wood-900 group-hover:text-bamboo-800 transition">
                          {item.genre}
                        </span>
                        <span className="text-xs font-mono font-bold text-wood-700">
                          {item.mastered} / {item.count} 篇 ({item.rate}%)
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-bamboo-700 h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${Math.max(2, item.rate)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-paper-border/60 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setExpandedGenre(isExpanded ? null : item.genre)}
                        className="text-wood-600 hover:text-wood-900 font-serif flex items-center space-x-1 cursor-pointer"
                        title="展开查看所有篇目"
                      >
                        <Eye className="w-3.5 h-3.5 text-wood-500" />
                        <span>篇目清单 ({item.count})</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleSmartGenreJump(item.lessons)}
                        className="btn-tactile px-2.5 py-1 rounded bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-800 border border-bamboo-200 font-medium flex items-center space-x-1 cursor-pointer"
                        title={nextUnmastered ? `进入待掌握：《${nextUnmastered.title}》` : '已全部掌握，复习第1篇'}
                      >
                        <span>{nextUnmastered ? '顺延备课' : '通篇复习'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Expandable Lesson Details for this Genre */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-paper-border space-y-1.5 max-h-56 overflow-y-auto pr-1 animate-fadeIn">
                        <div className="text-[11px] text-wood-500 font-serif mb-1">
                          包含篇目（点击直接开启备课）：
                        </div>
                        {item.lessons.map(l => (
                          <div
                            key={l.id}
                            onClick={() => onSelectLesson(l)}
                            className="flex items-center justify-between p-1.5 rounded hover:bg-white border border-transparent hover:border-paper-border cursor-pointer transition text-xs"
                          >
                            <div className="flex items-center space-x-1.5 truncate">
                              <span className="font-serif font-medium text-wood-800 truncate">
                                《{l.title}》
                              </span>
                              <span className="text-[10px] text-wood-500">
                                {l.bookName.split(' ')[0]}
                              </span>
                              {l.star === 5 && (
                                <span className="text-[10px] text-amber-600 font-bold">★5星</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1 pl-2">
                              {getStatusBadge(l.id)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* High Frequency Quick Runway */}
            <div className="pt-3 border-t border-paper-border space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-wood-800 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>常考高频篇目快速通道（考官最爱抽考）：</span>
                </span>
                <span className="text-[11px] text-wood-500">点击直达课文工作台</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['春', '背影', '陋室铭', '爱莲说', '小石潭记', '岳阳楼记', '中国石拱桥', '孔乙己', '出师表', '从百草园到三味书屋', '写作：写人要抓住特点', '写作：审题立意'].map(title => {
                  const clean = title.replace('写作：', '');
                  const target = LESSONS_DATA.find(l => l.title === clean || l.title === title || l.title.includes(clean));
                  if (!target) return null;
                  const status = studyStatuses[target.id] || 'unlearned';
                  const isDone = status === 'mastered';
                  return (
                    <button
                      key={title}
                      onClick={() => onSelectLesson(target)}
                      className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-serif flex items-center space-x-1 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer ${
                        isDone
                          ? 'bg-bamboo-100 text-bamboo-900 border-bamboo-300 font-bold'
                          : status === 'review_needed'
                          ? 'bg-cinnabar-50 text-cinnabar-900 border-cinnabar-300 font-medium'
                          : 'bg-white text-wood-800 border-paper-border hover:bg-paper-100'
                      }`}
                    >
                      <span>《{target.title}》</span>
                      {isDone && <CheckCircle2 className="w-3 h-3 text-bamboo-700" />}
                      {status === 'review_needed' && <AlertCircle className="w-3 h-3 text-cinnabar-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Real-time Countdown & Daily Practice To-Do */}
        <div className="space-y-6">
          {/* 4. Real-Time Countdown Card (Accurate down to seconds) */}
          <div className="bg-paper-card p-6 rounded-2xl border border-paper-border shadow-scholarly space-y-4 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-wood-700" />
                <h3 className="font-serif font-bold text-base text-wood-900">
                  面试备战倒计时
                </h3>
              </div>
              <div className="flex items-center space-x-1 text-xs text-wood-500 font-serif">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
                <span>实时跳动</span>
              </div>
            </div>

            {/* Dynamic Countdown Grid */}
            <div className="p-4 bg-paper-50 rounded-xl border border-paper-border space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-paper-border shadow-xs">
                  <div className="font-mono text-2xl font-black text-wood-900">
                    {countdownDays}
                  </div>
                  <div className="text-[10px] text-wood-500 font-serif">天</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-paper-border shadow-xs">
                  <div className="font-mono text-2xl font-black text-wood-900">
                    {String(countdownHours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-wood-500 font-serif">时</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-paper-border shadow-xs">
                  <div className="font-mono text-2xl font-black text-wood-900">
                    {String(countdownMinutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-wood-500 font-serif">分</div>
                </div>
                <div className="bg-bamboo-50 p-2.5 rounded-lg border border-bamboo-200 shadow-xs">
                  <div className="font-mono text-2xl font-black text-bamboo-800">
                    {String(countdownSeconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-bamboo-700 font-serif">秒</div>
                </div>
              </div>

              <div className="text-center text-[11px] text-wood-500 font-serif pt-1">
                考场关键：沉着开场 · 切忌念教案 · 突出师生对话与板书生成
              </div>
            </div>

            {/* Custom Date Setter */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-paper-border text-wood-600">
              <span>自定义考期：</span>
              <input
                type="date"
                value={examDate.split('T')[0]}
                onChange={(e) => onUpdateExamDate(e.target.value + 'T08:30:00')}
                className="px-2 py-1 rounded border border-paper-border text-xs bg-white focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-mono"
              />
            </div>
          </div>

          {/* 5. Daily Mock Practice Checklist with Guaranteed Jump */}
          <div className="bg-paper-card p-6 rounded-2xl border border-paper-border shadow-scholarly space-y-4 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-bamboo-700" />
                <h3 className="font-serif font-bold text-base text-wood-900">
                  今日试讲计划
                </h3>
              </div>
              <span className="text-xs font-mono text-wood-600">
                {dailyTasks.filter(t => t.completed).length} / {dailyTasks.length} 完成
              </span>
            </div>

            {/* Task list */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {dailyTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-wood-400 font-serif">
                  今日计划暂无内容，可通过下方输入框添加演练课文。
                </div>
              ) : (
                dailyTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                      task.completed
                        ? 'bg-bamboo-50/60 border-bamboo-200 text-wood-500'
                        : 'bg-paper-50 border-paper-border text-wood-900 hover:bg-paper-100'
                    }`}
                  >
                    <label className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleTaskCheck(task.id, task.completed)}
                        className="w-4 h-4 rounded text-bamboo-700 focus:ring-bamboo-600 border-stone-400 cursor-pointer"
                      />
                      <div className="truncate">
                        <span className={`font-serif text-xs font-bold block truncate ${
                          task.completed ? 'line-through text-stone-400' : 'text-wood-900'
                        }`}>
                          {task.title}
                        </span>
                        <span className="text-[10px] text-wood-500 block truncate">
                          {task.author} · {task.genre}
                        </span>
                      </div>
                    </label>

                    <div className="flex items-center space-x-1.5 pl-2">
                      <button
                        onClick={() => handleGoToTaskLesson(task)}
                        className="btn-tactile px-2 py-0.5 rounded bg-bamboo-700 hover:bg-bamboo-800 text-white text-[11px] font-medium flex items-center space-x-0.5 cursor-pointer shadow-xs"
                        title="打开课文工作台开始备课"
                      >
                        <span>备课</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded transition cursor-pointer"
                        title="删除待办"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Task Input Form */}
            <form onSubmit={handleAddCustomTask} className="pt-2 border-t border-paper-border space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="输入篇目（如：天净沙·秋思）"
                  value={customTaskTitle}
                  onChange={(e) => setCustomTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-paper-50 border border-paper-border rounded-lg focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
                />
                <button
                  type="submit"
                  disabled={!customTaskTitle.trim()}
                  className="btn-tactile p-1.5 bg-bamboo-700 text-white rounded-lg disabled:opacity-40 hover:bg-bamboo-800 cursor-pointer"
                  title="添加待办"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 4. Focus Pomodoro & Weekly Study Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pomodoro Timer Card */}
        <div className="bg-paper-card p-6 rounded-2xl border border-paper-border shadow-scholarly space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-bamboo-700" />
              <h3 className="font-serif font-bold text-base text-wood-900">
                试讲与备课专注钟
              </h3>
            </div>
            <div className="text-xs text-wood-500 font-serif">
              沉浸模拟
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-paper-50 p-1 border border-paper-border text-xs font-serif">
            <button
              onClick={() => handleSwitchPomoMode('trial')}
              className={`flex-1 py-1.5 rounded-lg text-center font-bold transition cursor-pointer ${
                pomoMode === 'trial' ? 'bg-bamboo-700 text-white shadow-xs' : 'text-wood-600 hover:text-wood-900'
              }`}
            >
              10分钟试讲
            </button>
            <button
              onClick={() => handleSwitchPomoMode('prep')}
              className={`flex-1 py-1.5 rounded-lg text-center font-bold transition cursor-pointer ${
                pomoMode === 'prep' ? 'bg-bamboo-700 text-white shadow-xs' : 'text-wood-600 hover:text-wood-900'
              }`}
            >
              25分钟备课
            </button>
            <button
              onClick={() => handleSwitchPomoMode('rest')}
              className={`flex-1 py-1.5 rounded-lg text-center font-bold transition cursor-pointer ${
                pomoMode === 'rest' ? 'bg-bamboo-700 text-white shadow-xs' : 'text-wood-600 hover:text-wood-900'
              }`}
            >
              5分钟休息
            </button>
          </div>

          {/* Big Timer Dial Display */}
          <div className="text-center py-6 bg-paper-50 rounded-2xl border border-paper-border space-y-2">
            <div className="font-mono text-5xl font-black text-wood-900 tracking-wider">
              {String(Math.floor(pomoSecondsLeft / 60)).padStart(2, '0')} : {String(pomoSecondsLeft % 60).padStart(2, '0')}
            </div>
            <div className="text-xs text-wood-500 font-serif">
              {pomoMode === 'trial' && '考场10分钟试讲倒计时（建议8分30秒收尾留作业）'}
              {pomoMode === 'prep' && '考场备课室20-25分钟编写百字速写教案'}
              {pomoMode === 'rest' && '闭目养神，复盘语速与板书要点'}
            </div>

            {/* Controls */}
            <div className="pt-4 flex items-center justify-center space-x-3">
              <button
                onClick={() => setPomoActive(!pomoActive)}
                className={`btn-tactile px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center space-x-1.5 shadow-md cursor-pointer transition ${
                  pomoActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-bamboo-700 hover:bg-bamboo-800'
                }`}
              >
                {pomoActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{pomoActive ? '暂停计时' : '开始演练'}</span>
              </button>

              <button
                onClick={() => {
                  setPomoActive(false);
                  setPomoSecondsLeft(pomoTotalSeconds);
                }}
                className="btn-tactile p-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-wood-700 border border-paper-border cursor-pointer transition"
                title="重置计时"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Study Time Bar Chart */}
        <div className="lg:col-span-2 bg-paper-card p-6 rounded-2xl border border-paper-border shadow-scholarly space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-wood-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-bamboo-700" />
                <span>近 7 日备考与试讲时长统计</span>
              </h3>
              <p className="text-xs text-wood-500 font-serif mt-0.5">
                记录每日试讲专注时长，持续保持讲台说话手感。
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  recordStudyMinutes(10);
                  confetti({ particleCount: 30, spread: 50 });
                }}
                className="btn-tactile px-2.5 py-1 rounded bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-800 border border-bamboo-200 text-xs font-serif font-medium cursor-pointer"
                title="手动打卡记录10分钟模拟试讲"
              >
                + 10分钟试讲打卡
              </button>
              <div className="text-xs font-mono font-bold text-bamboo-800 bg-paper-50 px-2.5 py-1 rounded-lg border border-paper-border">
                近7日累计：{totalWeekMinutes} 分钟
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-paper-50 rounded-xl border border-paper-border">
            {past7DaysData.map((d, idx) => {
              const heightPct = Math.max(8, Math.round((d.minutes / maxMinutesInWeek) * 100));
              const isToday = idx === past7DaysData.length - 1;

              return (
                <div key={d.dateStr} className="flex-1 flex flex-col items-center justify-end h-full group">
                  {/* Tooltip / minutes label */}
                  <span className="text-[10px] font-mono font-bold text-wood-600 mb-1 opacity-80 group-hover:opacity-100">
                    {d.minutes > 0 ? `${d.minutes}分` : '0'}
                  </span>

                  {/* Bar */}
                  <div className="w-full max-w-[36px] bg-stone-200 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:brightness-105" style={{ height: '75%' }}>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-bamboo-800 to-bamboo-600'
                          : 'bg-gradient-to-t from-wood-700 to-wood-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  {/* Date label */}
                  <span className={`text-[11px] mt-2 font-serif ${isToday ? 'font-bold text-bamboo-800' : 'text-wood-500'}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-wood-500 font-serif pt-1">
            <span>考官经验谈：考前建议累计演练不少于 30 篇不同文体课文，方能形成肌肉记忆。</span>
            <span className="font-mono text-wood-600">日均建议：20~40分钟</span>
          </div>
        </div>
      </div>
    </div>
  );
};
