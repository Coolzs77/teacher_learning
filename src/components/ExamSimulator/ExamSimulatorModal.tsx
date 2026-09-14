import React, { useState, useEffect } from 'react';
import { Lesson } from '../../types';
import { LESSONS_DATA } from '../../data/lessonsData';
import { X, Sparkles, Clock, Play, RotateCcw, ArrowRight, CheckCircle2, Award, Printer } from 'lucide-react';

interface ExamSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  onStartTrialTimer: () => void;
}

export const ExamSimulatorModal: React.FC<ExamSimulatorModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onStartTrialTimer,
}) => {
  const [ticketNumber, setTicketNumber] = useState<string>('2026110803219');
  const [seatNumber, setSeatNumber] = useState<string>('第 04 考场 · 12 号机位');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(LESSONS_DATA[0]);
  const [prepSeconds, setPrepSeconds] = useState<number>(1200); // 20 mins prep
  const [isPrepActive, setIsPrepActive] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      drawRandomLesson();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPrepActive && prepSeconds > 0) {
      interval = setInterval(() => {
        setPrepSeconds((prev) => prev - 1);
      }, 1000);
    } else if (prepSeconds === 0) {
      setIsPrepActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPrepActive, prepSeconds]);

  const drawRandomLesson = () => {
    const highFreq = LESSONS_DATA.filter(l => l.star >= 4);
    const pool = Math.random() > 0.15 && highFreq.length > 0 ? highFreq : LESSONS_DATA;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    setSelectedLesson(chosen);

    const randTicket = '202611' + Math.floor(1000000 + Math.random() * 9000000);
    const randSeat = `第 ${Math.floor(1 + Math.random() * 8)} 考场 · ${Math.floor(1 + Math.random() * 20).toString().padStart(2, '0')} 号机位`;
    setTicketNumber(randTicket);
    setSeatNumber(randSeat);
    setPrepSeconds(1200);
    setIsPrepActive(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-2xl border border-stone-400 shadow-2xl overflow-hidden my-8">
        {/* Top Header */}
        <div className="bg-wood-800 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="font-serif font-bold text-base tracking-wider">
              教师资格考试面试试题模拟抽取
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-wood-700 transition cursor-pointer text-stone-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Container */}
        <div className="p-6 md:p-8 space-y-6 text-wood-900 bg-white m-4 rounded-xl border border-stone-300 shadow-sm print:border-none print:shadow-none">
          <div className="text-center space-y-1 pb-4 border-b-2 border-stone-800">
            <h2 className="text-xl md:text-2xl font-serif font-bold tracking-widest text-stone-900">
              教师资格考试面试试题清单（模拟）
            </h2>
            <p className="text-xs text-stone-600 font-serif">
              抽考科目：初中语文 · 考试时间：10分钟试讲
            </p>
          </div>

          {/* Candidate Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-serif bg-stone-50 p-3 rounded-lg border border-stone-300">
            <div>
              <span className="text-stone-500">准考证号：</span>
              <span className="font-mono font-bold text-stone-800">{ticketNumber}</span>
            </div>
            <div>
              <span className="text-stone-500">考生姓名：</span>
              <span className="font-bold text-stone-800">考生</span>
            </div>
            <div>
              <span className="text-stone-500">机位信息：</span>
              <span className="font-bold text-stone-800">{seatNumber}</span>
            </div>
            <div>
              <span className="text-stone-500">报考学科：</span>
              <span className="font-bold text-bamboo-800">初中语文</span>
            </div>
          </div>

          {/* Topic Section */}
          <div className="border border-stone-400 rounded-lg p-4 bg-paper-50 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-wood-800 text-white font-serif text-xs">
                  抽考课题
                </span>
                <h3 className="font-serif font-bold text-lg text-wood-900">
                  《{selectedLesson.title}》
                </h3>
                <span className="text-xs text-wood-600">
                  （{selectedLesson.author}）
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-serif">
                  {selectedLesson.bookName} · {selectedLesson.unitTitle.split('·')[0]}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 border border-bamboo-300">
                  {selectedLesson.genre}
                </span>
              </div>
            </div>

            <div className="text-xs text-wood-700 pt-1">
              <span className="font-bold text-wood-900">【建议教学切片】：</span>
              <span className="text-wood-800 font-medium bg-white px-2 py-0.5 rounded border border-stone-300">
                {selectedLesson.goldenSlice.sliceRange}
              </span>
            </div>
          </div>

          {/* Test Paper Requirements */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-bamboo-700" />
              <span>试题要求：</span>
            </h4>
            <div className="bg-paper-50 p-3.5 rounded-lg border border-paper-border space-y-1.5 text-xs text-wood-800 leading-relaxed font-serif">
              {selectedLesson.examRequirement.map((req, idx) => (
                <div key={idx} className="flex items-start space-x-1.5">
                  <span className="font-bold text-bamboo-800 min-w-[18px]">({idx + 1})</span>
                  <span>{req.replace(/^\d+[\.、]\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dual Timers Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Prep Room Timer */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-paper-100 border border-paper-border">
              <div>
                <div className="flex items-center space-x-1 text-xs text-wood-600">
                  <Clock className="w-3.5 h-3.5 text-wood-500" />
                  <span>备考室速写教案计时</span>
                </div>
                <div className="font-mono font-bold text-lg text-wood-900 mt-0.5">
                  {formatTime(prepSeconds)}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsPrepActive(!isPrepActive)}
                  className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-medium text-white ${
                    isPrepActive ? 'bg-amber-600' : 'bg-wood-700'
                  }`}
                >
                  {isPrepActive ? '暂停' : '开始备课'}
                </button>
                <button
                  onClick={() => {
                    setIsPrepActive(false);
                    setPrepSeconds(1200);
                  }}
                  className="p-1.5 rounded-lg hover:bg-paper-200 text-wood-600 transition"
                  title="重置"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 10 Min Trial Lecture Start */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-bamboo-50 border border-bamboo-200">
              <div>
                <div className="flex items-center space-x-1 text-xs text-bamboo-800">
                  <Play className="w-3.5 h-3.5 text-bamboo-600" />
                  <span>考场10分钟试讲计时</span>
                </div>
                <div className="font-mono font-bold text-lg text-bamboo-900 mt-0.5">
                  10:00 倒计时
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onSelectLesson(selectedLesson);
                  onStartTrialTimer();
                }}
                className="btn-tactile flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-bamboo-700 text-white text-xs font-bold shadow hover:bg-bamboo-800"
              >
                <span>进入试讲</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-paper-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper-border">
          <div className="flex items-center space-x-2">
            <button
              onClick={drawRandomLesson}
              className="btn-tactile flex items-center space-x-1.5 px-4 py-2 bg-white text-wood-800 rounded-xl border border-stone-300 text-xs font-medium hover:bg-paper-50 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>抽取新课题</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-tactile flex items-center space-x-1 px-3 py-2 bg-white text-wood-700 rounded-xl border border-stone-300 text-xs font-medium hover:bg-paper-50"
              title="打印题本"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">打印题本</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="btn-tactile px-4 py-2 rounded-xl text-xs text-wood-600 hover:bg-paper-300 transition"
            >
              关闭
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectLesson(selectedLesson);
              }}
              className="btn-tactile flex items-center space-x-1.5 px-5 py-2 bg-bamboo-700 text-white rounded-xl text-xs font-bold shadow-md hover:bg-bamboo-800"
            >
              <span>进入课文工作台</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
