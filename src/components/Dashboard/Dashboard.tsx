import React, { useState } from 'react';
import { Lesson, Genre, StudyStatus, DailyPracticeItem } from '../../types';
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
  BarChart3
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
  '议论文/思辨文本'
];

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

  const totalLessons = LESSONS_DATA.length;
  const masteredCount = Object.values(studyStatuses).filter(s => s === 'mastered').length;
  const practicingCount = Object.values(studyStatuses).filter(s => s === 'practicing').length;
  const highFreqLessons = LESSONS_DATA.filter(l => l.star === 5);
  const masteredHighFreq = highFreqLessons.filter(l => studyStatuses[l.id] === 'mastered').length;

  const highFreqRate = highFreqLessons.length > 0
    ? Math.round((masteredHighFreq / highFreqLessons.length) * 100)
    : 0;

  const genreStats = GENRE_LIST.map(genre => {
    const genreLessons = LESSONS_DATA.filter(l => l.genre === genre);
    const count = genreLessons.length;
    const mastered = genreLessons.filter(l => studyStatuses[l.id] === 'mastered').length;
    const rate = count > 0 ? Math.round((mastered / count) * 100) : 0;
    return { genre, count, mastered, rate, lessons: genreLessons };
  });

  const targetDate = new Date(examDate);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

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

    const match = LESSONS_DATA.find(l => l.title.includes(customTaskTitle.trim()));
    const newTask: DailyPracticeItem = {
      id: 'task-' + Date.now(),
      lessonId: match ? match.id : 'custom',
      title: customTaskTitle.trim().startsWith('《') ? customTaskTitle.trim() : `《${customTaskTitle.trim()}》`,
      author: match ? match.author : '自选篇目',
      genre: match ? match.genre : selectedGenreForTask,
      bookName: match ? match.bookName : '练习篇目',
      completed: false,
      date: new Date().toISOString().split('T')[0]
    };

    onAddTask(newTask);
    setCustomTaskTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Overview Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-wood-800 via-wood-700 to-bamboo-900 text-paper-50 p-6 md:p-8 shadow-scholarly overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-paper-200 text-xs font-serif">
            <span>备考建议：目标明确 · 重点突出 · 师生互动自然 · 板书清晰</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wide text-paper-50">
            初中语文教资面试 · 备考进度与课文导航
          </h1>

          <p className="text-xs md:text-sm text-paper-200/90 leading-relaxed font-serif">
            面试试讲时间为 10 分钟。备考时建议围绕“一课一得”确立教学重点，截取最关键的自然段展开研读，设计合理的提问与朗读指导，并规范呈现板书。系统收录 6 册教材 146 篇课文全文与教学参考。
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenExamSimulator}
              className="btn-tactile flex items-center space-x-2 px-4 py-2 rounded-xl bg-bamboo-700 text-white font-bold text-xs md:text-sm shadow-md hover:bg-bamboo-800 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>考场模拟抽题</span>
            </button>

            <button
              onClick={() => {
                const spring = LESSONS_DATA.find(l => l.title === '春');
                if (spring) onSelectLesson(spring);
              }}
              className="btn-tactile flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-paper-50 border border-white/20 text-xs md:text-sm font-medium cursor-pointer"
            >
              <span>查看示范篇目《春》</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-paper-card border border-paper-border shadow-sm flex items-center space-x-3">
          <div className="w-11 h-11 rounded-lg bg-bamboo-100 flex items-center justify-center text-bamboo-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-wood-500 font-serif">收录课文总量</div>
            <div className="font-serif font-bold text-xl text-wood-900">
              {totalLessons} <span className="text-xs font-normal text-wood-600">篇</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-paper-card border border-paper-border shadow-sm flex items-center space-x-3">
          <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-wood-500 font-serif">5星常考掌握</div>
            <div className="font-serif font-bold text-xl text-wood-900">
              {masteredHighFreq} / {highFreqLessons.length}{' '}
              <span className="text-xs font-normal text-wood-600">
                ({highFreqRate}%)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-paper-card border border-paper-border shadow-sm flex items-center space-x-3">
          <div className="w-11 h-11 rounded-lg bg-bamboo-100 flex items-center justify-center text-bamboo-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-wood-500 font-serif">已复习篇目</div>
            <div className="font-serif font-bold text-xl text-wood-900">
              {masteredCount}{' '}
              <span className="text-xs font-normal text-wood-500">
                (备课中 {practicingCount} 篇)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-paper-card border border-paper-border shadow-sm flex items-center space-x-3">
          <div className="w-11 h-11 rounded-lg bg-wood-200 flex items-center justify-center text-wood-800">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-wood-500 font-serif">高频篇目掌握率</div>
            <div className="font-serif font-bold text-xl text-wood-900">
              {highFreqRate} <span className="text-xs font-normal text-wood-500">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 6-Genre Mastery & Countdown + Daily Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: 6-Genre Mastery Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-paper-card p-6 rounded-2xl border border-paper-border shadow-scholarly space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-lg text-wood-900 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-bamboo-700" />
                  <span>6大文体备考进度统计</span>
                </h2>
                <p className="text-xs text-wood-500 font-serif mt-0.5">
                  分类展示不同文体的篇目数量与复习进度。
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-paper-100 rounded-lg text-wood-600 border border-paper-border font-serif">
                6大文体
              </span>
            </div>

            {/* Genre Progress Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {genreStats.map((item) => (
                <div
                  key={item.genre}
                  className="p-4 rounded-xl bg-paper-50 border border-paper-border hover:border-bamboo-400 transition space-y-2 group"
                >
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
                      className="bg-bamboo-700 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(2, item.rate)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-wood-500 font-serif">
                      课文数：{item.count} 篇
                    </span>
                    <button
                      onClick={() => onSelectLesson(item.lessons[0])}
                      className="text-xs text-bamboo-700 hover:text-bamboo-900 font-medium flex items-center space-x-0.5 cursor-pointer"
                    >
                      <span>进入该文体</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* High Frequency Quick Runway */}
            <div className="pt-2 border-t border-paper-border space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-wood-800">
                  常考高频篇目快速通道：
                </span>
                <span className="text-[11px] text-wood-500">点击进入课文工作台</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['春', '背影', '陋室铭', '爱莲说', '小石潭记', '岳阳楼记', '中国石拱桥', '孔乙己', '出师表', '从百草园到三味书屋'].map(title => {
                  const target = LESSONS_DATA.find(l => l.title === title || l.title.includes(title));
                  if (!target) return null;
                  const isDone = studyStatuses[target.id] === 'mastered';
                  return (
                    <button
                      key={title}
                      onClick={() => onSelectLesson(target)}
                      className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-serif flex items-center space-x-1 border ${
                        isDone
                          ? 'bg-bamboo-100 text-bamboo-900 border-bamboo-300 font-bold'
                          : 'bg-white text-wood-800 border-paper-border hover:bg-paper-100'
                      }`}
                    >
                      <span>《{title}》</span>
                      {isDone && <CheckCircle2 className="w-3 h-3 text-bamboo-700" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Countdown & Daily Practice To-Do */}
        <div className="space-y-6">
          {/* Countdown Card */}
          <div className="bg-paper-card p-6 rounded-2xl border border-paper-border shadow-scholarly space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-wood-700" />
                <h3 className="font-serif font-bold text-base text-wood-900">
                  面试备考倒计时
                </h3>
              </div>
              <div className="text-xs text-wood-500 font-serif">
                12月考期
              </div>
            </div>

            <div className="text-center py-4 bg-paper-50 rounded-xl border border-paper-border">
              <div className="text-xs text-wood-500 font-serif">距离考试剩余</div>
              <div className="font-mono text-4xl font-bold text-wood-900 my-1">
                {daysLeft} <span className="text-base font-serif text-wood-700">天</span>
              </div>
              <div className="text-[11px] text-wood-500">
                建议重点：理清教学切片，练习脱稿试讲与板书
              </div>
            </div>

            {/* Custom Date Setter */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-paper-border text-wood-600">
              <span>设置考试日期：</span>
              <input
                type="date"
                value={examDate.split('T')[0]}
                onChange={(e) => onUpdateExamDate(e.target.value + 'T08:30:00')}
                className="px-2 py-1 rounded border border-paper-border text-xs bg-white focus:outline-none focus:ring-1 focus:ring-bamboo-600"
              />
            </div>
          </div>

          {/* Daily Mock Practice Checklist */}
          <div className="bg-paper-card p-6 rounded-2xl border border-paper-border shadow-scholarly space-y-4">
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
                  今日计划暂无内容，可添加课文进行练习。
                </div>
              ) : (
                dailyTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
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
                        <span className={`font-serif text-xs font-medium block truncate ${
                          task.completed ? 'line-through text-stone-400' : 'text-wood-900'
                        }`}>
                          {task.title}
                        </span>
                        <span className="text-[10px] text-wood-500 block">
                          {task.author} · {task.genre}
                        </span>
                      </div>
                    </label>

                    <div className="flex items-center space-x-1 pl-2">
                      {task.lessonId !== 'custom' && (
                        <button
                          onClick={() => {
                            const l = LESSONS_DATA.find(x => x.id === task.lessonId);
                            if (l) onSelectLesson(l);
                          }}
                          className="text-[11px] text-bamboo-700 hover:underline px-1.5 py-0.5 rounded hover:bg-paper-200 cursor-pointer"
                        >
                          备课
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded transition cursor-pointer"
                        title="删除"
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
                  placeholder="添加练习课文（如：济南的冬天）"
                  value={customTaskTitle}
                  onChange={(e) => setCustomTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-paper-50 border border-paper-border rounded-lg focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
                />
                <button
                  type="submit"
                  disabled={!customTaskTitle.trim()}
                  className="btn-tactile p-1.5 bg-bamboo-700 text-white rounded-lg disabled:opacity-40 cursor-pointer"
                  title="添加待办"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
