import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronUp, ChevronDown, Clock, X } from 'lucide-react';
import { useAudioBeep } from '../../hooks/useAudioBeep';
import confetti from 'canvas-confetti';

interface FloatingTimerProps {
  isOpen: boolean;
  onClose: () => void;
  activeLessonTitle?: string;
}

const STAGES = [
  {
    name: '阶段一：导入新课',
    timeRange: '00:00 - 01:30',
    seconds: 90,
    cue: '【情境引入】简练导入，书写课题与作者，明确本课研读重点。',
    tips: '用时约1分半钟，语言精炼，迅速切入课文。'
  },
  {
    name: '阶段二：初读感知',
    timeRange: '01:30 - 03:00',
    seconds: 180,
    cue: '【初读反馈】梳理文章层次脉络，检查字词预习，过渡到重点段落。',
    tips: '提问学生梳理主要内容，自然过渡到精读切片。'
  },
  {
    name: '阶段三：精读研讨',
    timeRange: '03:00 - 07:30',
    seconds: 450,
    cue: '【重点分析】精读核心段落，设计具体提问，分析关键词句与手法，逐步完成主板书。',
    tips: '占试讲主要时间，师生互动真实，落实教学重难点。'
  },
  {
    name: '阶段四：朗读指导',
    timeRange: '07:30 - 09:00',
    seconds: 540,
    cue: '【指导诵读】明确重音、节奏与停顿，范读或指导学生朗读，体会感情。',
    tips: '给出具体的朗读指导建议，体现语文学科特点。'
  },
  {
    name: '阶段五：小结作业',
    timeRange: '09:00 - 10:00',
    seconds: 600,
    cue: '【总结收尾】对照板书简要回顾，布置基础与拓展作业，礼貌致谢结课。',
    tips: '预留约1分钟平稳收尾，避免匆忙压哨。'
  }
];

export const FloatingTimer: React.FC<FloatingTimerProps> = ({
  isOpen,
  onClose,
  activeLessonTitle = '课文试讲',
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(600);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const { playGentleChime, playExamAlarm } = useAudioBeep();

  const elapsed = 600 - secondsLeft;
  const currentStageIndex = STAGES.findIndex((s) => elapsed < s.seconds);
  const currentStage = STAGES[currentStageIndex !== -1 ? currentStageIndex : STAGES.length - 1];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (soundEnabled) {
            if (prev === 450 || prev === 180 || prev === 60) {
              playGentleChime();
            } else if (prev === 1) {
              playExamAlarm();
              confetti({ particleCount: 40, spread: 70, origin: { y: 0.8 } });
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, soundEnabled, playGentleChime, playExamAlarm]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((600 - secondsLeft) / 600) * 100;

  return (
    <aside aria-label="10分钟试讲倒计时与提词辅助" className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isMinimized ? (
        <div className="flex items-center space-x-2 bg-stone-900/90 backdrop-blur text-white px-3.5 py-2 rounded-full shadow-2xl border border-stone-700">
          <Clock className="w-4 h-4 text-bamboo-400" />
          <span className="font-mono font-bold text-sm tracking-wider">
            {formatTime(secondsLeft)}
          </span>
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-1 hover:bg-stone-700 rounded-full cursor-pointer text-amber-300"
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 hover:bg-stone-700 rounded-full cursor-pointer text-stone-300"
            title="展开面板"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-700 rounded-full cursor-pointer text-stone-400"
            title="关闭"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="w-80 md:w-96 bg-paper-card/95 backdrop-blur-md rounded-2xl border border-wood-700 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-wood-800 text-white px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="font-serif font-bold text-xs tracking-wider">
                10分钟试讲计时与提示
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-wood-700 text-paper-200 truncate max-w-[110px]">
                {activeLessonTitle}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 hover:bg-wood-700 rounded transition text-stone-300 cursor-pointer"
                title={soundEnabled ? '音效开启' : '静音'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-stone-500" />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-wood-700 rounded transition text-stone-300 cursor-pointer"
                title="最小化"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-wood-700 rounded transition text-stone-300 cursor-pointer"
                title="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-200 h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                secondsLeft < 60 ? 'bg-amber-600' : 'bg-bamboo-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-wood-500 font-serif">剩余试讲时间</div>
                <div className={`font-mono text-3xl font-bold tracking-tight ${
                  secondsLeft < 60 ? 'text-amber-700' : 'text-wood-900'
                }`}>
                  {formatTime(secondsLeft)}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`btn-tactile flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow ${
                    isActive
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-bamboo-700 hover:bg-bamboo-800'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>暂停</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>开始</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsActive(false);
                    setSecondsLeft(600);
                  }}
                  className="p-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-wood-700 transition cursor-pointer"
                  title="重置为10:00"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Stage */}
            <div className="bg-paper-100 p-2.5 rounded-xl border border-paper-border space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-bamboo-800">
                  {currentStage.name}
                </span>
                <span className="font-mono text-[11px] text-wood-500 bg-white px-1.5 py-0.5 rounded border border-paper-border">
                  {currentStage.timeRange}
                </span>
              </div>
              <p className="text-xs text-wood-800 font-serif leading-snug">
                {currentStage.cue}
              </p>
              <p className="text-[10px] text-wood-600">
                教学提示：{currentStage.tips}
              </p>
            </div>

            {/* Quick Step Tracker */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {STAGES.map((s, idx) => {
                const isPassed = elapsed >= s.seconds;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div
                    key={idx}
                    className={`text-center py-1 px-0.5 rounded text-[10px] font-serif transition ${
                      isCurrent
                        ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                        : isPassed
                        ? 'bg-bamboo-100 text-bamboo-900 line-through opacity-70'
                        : 'bg-paper-200 text-wood-600'
                    }`}
                  >
                    {['导入', '初读', '精读', '朗读', '小结'][idx]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
