import React, { useState, useEffect } from 'react';
import { Lesson, StudyStatus, DailyPracticeItem } from './types';
import { LESSONS_DATA } from './data/lessonsData';
import { DEFAULT_EXAM_DATE, DEFAULT_DAILY_PRACTICE } from './data/defaultState';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navbar, AppMainModule } from './components/Common/Navbar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Workbench } from './components/Workbench/Workbench';
import { MethodologyView } from './components/Methodology/MethodologyView';
import { ExamSimulatorModal } from './components/ExamSimulator/ExamSimulatorModal';
import { FloatingTimer } from './components/FloatingTimer/FloatingTimer';
import { Cet6Workbench } from './components/Cet6Workbench/Cet6Workbench';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  // Top-level Module: 语文教资 vs 英语六级
  const [mainModule, setMainModule] = useLocalStorage<AppMainModule>('tl_main_module', 'chinese');

  // Navigation (for Chinese module)
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'workbench' | 'methodology'>('dashboard');
  
  // Selected active lesson
  const [currentLesson, setCurrentLesson] = useState<Lesson>(LESSONS_DATA[0]);

  // Persistent States
  const [studyStatuses, setStudyStatuses] = useLocalStorage<Record<string, StudyStatus>>(
    'tl_study_statuses',
    { [LESSONS_DATA[0].id]: 'mastered' }
  );

  const [dailyTasks, setDailyTasks] = useLocalStorage<DailyPracticeItem[]>(
    'tl_daily_tasks',
    DEFAULT_DAILY_PRACTICE
  );

  const [examDate, setExamDate] = useLocalStorage<string>(
    'tl_exam_date',
    DEFAULT_EXAM_DATE
  );

  const [userNotes, setUserNotes] = useLocalStorage<Record<string, string>>(
    'tl_user_notes',
    {}
  );

  // Modals & Floating Tools
  const [isExamModalOpen, setIsExamModalOpen] = useState<boolean>(false);
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Calculate days left
  const targetDate = new Date(examDate);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentTab('workbench');
  };

  const handleUpdateStatus = (lessonId: string, status: StudyStatus) => {
    setStudyStatuses((prev) => ({ ...prev, [lessonId]: status }));
    showToast(status === 'mastered' ? '已标记为【已攻克掌握】！' : '已更新备课状态');
  };

  const handleAddToDaily = (lesson: Lesson) => {
    // Check if already in tasks
    if (dailyTasks.some(t => t.lessonId === lesson.id)) {
      showToast(`《${lesson.title}》已在今日待办中`);
      return;
    }

    const newTask: DailyPracticeItem = {
      id: 'task-' + Date.now(),
      lessonId: lesson.id,
      title: `《${lesson.title}》`,
      author: lesson.author,
      genre: lesson.genre,
      bookName: lesson.bookName,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    };

    setDailyTasks(prev => [newTask, ...prev]);
    showToast(`已将《${lesson.title}》加入今日模拟练待办`);
  };

  const handleToggleTask = (taskId: string) => {
    setDailyTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (task: DailyPracticeItem) => {
    setDailyTasks(prev => [task, ...prev]);
    showToast(`已添加待办：${task.title}`);
  };

  const handleDeleteTask = (taskId: string) => {
    setDailyTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('已移除待办');
  };

  const handleSaveNote = (lessonId: string, note: string) => {
    setUserNotes(prev => ({ ...prev, [lessonId]: note }));
  };

  const handleStartTrialTimer = () => {
    setIsTimerOpen(true);
    showToast('10分钟试讲倒计时已开启！');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-wood-800 flex flex-col font-sans selection:bg-bamboo-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-wood-900 text-paper-50 px-4 py-2 rounded-xl text-xs font-serif shadow-xl flex items-center space-x-2 border border-stone-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-bamboo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        mainModule={mainModule}
        onSelectMainModule={setMainModule}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenExamSimulator={() => setIsExamModalOpen(true)}
        examDaysLeft={daysLeft}
        timerActive={isTimerOpen}
        onToggleTimer={() => setIsTimerOpen(!isTimerOpen)}
      />

      {/* Main Body Content by Active Module */}
      <main className="flex-1">
        {mainModule === 'cet6' ? (
          <Cet6Workbench />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <Dashboard
                onSelectLesson={handleSelectLesson}
                onOpenExamSimulator={() => setIsExamModalOpen(true)}
                examDate={examDate}
                onUpdateExamDate={setExamDate}
                studyStatuses={studyStatuses}
                dailyTasks={dailyTasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {currentTab === 'workbench' && (
              <Workbench
                currentLesson={currentLesson}
                onSelectLesson={setCurrentLesson}
                studyStatuses={studyStatuses}
                onUpdateStatus={handleUpdateStatus}
                onAddToDaily={handleAddToDaily}
                onStartTrialTimer={handleStartTrialTimer}
                userNotes={userNotes}
                onSaveNote={handleSaveNote}
              />
            )}

            {currentTab === 'methodology' && (
              <MethodologyView onSelectLesson={handleSelectLesson} />
            )}
          </>
        )}
      </main>

      {/* Floating 10-Minute Trial Timer Widget (For Chinese Mode) */}
      {mainModule === 'chinese' && (
        <FloatingTimer
          isOpen={isTimerOpen}
          onClose={() => setIsTimerOpen(false)}
          activeLessonTitle={currentLesson.title}
        />
      )}

      {/* Full Exam Simulation Lottery Modal (For Chinese Mode) */}
      {mainModule === 'chinese' && (
        <ExamSimulatorModal
          isOpen={isExamModalOpen}
          onClose={() => setIsExamModalOpen(false)}
          onSelectLesson={handleSelectLesson}
          onStartTrialTimer={handleStartTrialTimer}
        />
      )}

      {/* Scholarly Footer */}
      <footer className="border-t border-paper-border bg-paper-50 py-6 text-center text-xs text-wood-500 font-serif">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          {mainModule === 'chinese' ? (
            <>
              <p className="flex items-center justify-center space-x-1">
                <span>初中语文教师资格证面试（10分钟试讲专项）研修工作台</span>
                <span>·</span>
                <span>统编版初中语文 158 篇全景切片数据库</span>
                <span>·</span>
                <span>河南省考真题答辩规范</span>
              </p>
              <p className="text-[11px] text-stone-400">
                纯前端离线可用 · 状态持久化于本地 · 支持 200Mbps 云服务器极速秒开
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center justify-center space-x-1 font-sans">
                <span className="font-bold text-indigo-900">英语六级真题备考工作台</span>
                <span>·</span>
                <span className="text-rose-600 font-bold">琪琪专属 388 ➔ 425+ 分通关逆袭</span>
                <span>·</span>
                <span>选词填空秒杀 · ExamCraft真题语法树 · 5段万能作文 · 翻译语料</span>
              </p>
              <p className="text-[11px] text-stone-400">
                纯前端架构 · 数据安全离线持久化 · 助力琪琪顺利拿下英语六级！
              </p>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};
