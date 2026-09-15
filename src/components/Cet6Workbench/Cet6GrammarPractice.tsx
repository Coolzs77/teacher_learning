import React, { useState } from 'react';
import { CET6_GRAMMAR_QUESTIONS, Cet6GrammarQuestion, Cet6MistakeItem } from '../../data/cet6PracticeData';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  BookmarkPlus,
  BookOpen,
  RotateCcw,
  Layers
} from 'lucide-react';

interface Cet6GrammarPracticeProps {
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6GrammarPractice: React.FC<Cet6GrammarPracticeProps> = ({ onAddMistake }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: '全部语法实战' },
    { key: '非谓语动词', label: '非谓语动词 (doing/done/having done)' },
    { key: '定语从句', label: '定语从句 (which/where/that)' },
    { key: '倒装与强调句', label: '倒装与强调句 (Only when...)' },
    { key: '虚拟语气与状语从句', label: '虚拟语气与状语从句' }
  ];

  const filteredQuestions = activeCategory === 'all'
    ? CET6_GRAMMAR_QUESTIONS
    : CET6_GRAMMAR_QUESTIONS.filter(q => q.category === activeCategory);

  const currentQuestion = filteredQuestions[currentIndex % filteredQuestions.length];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSelectOption = (label: string) => {
    if (isAnswered) return;
    setSelectedOption(label);
    setIsAnswered(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSaveMistake = (q: Cet6GrammarQuestion) => {
    const data = {
      type: 'grammar' as const,
      typeLabel: '核心语法',
      title: `语法考点: ${q.category} - ${q.sentencePrompt.slice(0, 20)}...`,
      sourceContext: q.sentencePrompt,
      myMistake: `选择 ${selectedOption || '未选择'}`,
      correctAnswer: `${q.correctAnswer} (${q.options.find(o => o.label === q.correctAnswer)?.text})`,
      reason: 'vocab_unknown' as const,
      reasonLabel: '🏷️ 语法规则反应迟钝',
      qiqiInsight: `${q.examClue}。${q.analysis}`
    };

    if (onAddMistake) {
      onAddMistake(data);
    } else {
      try {
        const saved = localStorage.getItem('cet6_mistakes');
        const list = saved ? JSON.parse(saved) : [];
        list.unshift({
          ...data,
          id: `mis-gram-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          isMastered: false
        });
        localStorage.setItem('cet6_mistakes', JSON.stringify(list));
      } catch (e) {}
    }
    showToast('✓ 已收录至专属错题本！');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-emerald-400 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-emerald-500/30">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
        {/* 顶部介绍 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>实景真题语境 · 绝不死背枯燥规则</span>
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                非谓语动词 · 定语从句 · 虚拟语气 · 倒装强调
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              六级真题高频核心语法突击
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              不讲空泛理论！直接把六级阅读和写作中最容易失分、最常考的 4 大语法点放入真题句子中演练。
            </p>
          </div>
        </div>

        {/* 语法分类横条 */}
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                activeCategory === cat.key
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 题目大卡片 */}
        {currentQuestion && (
          <div className="border border-slate-200 rounded-2xl p-6 md:p-8 bg-slate-50 space-y-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900">
                考点：{currentQuestion.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                第 {currentIndex + 1} / {filteredQuestions.length} 题
              </span>
            </div>

            {/* 句子题干 */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 font-serif text-base md:text-lg leading-relaxed text-slate-900 shadow-2xs">
              {currentQuestion.sentencePrompt}
            </div>

            {/* 4 个选项卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map(opt => {
                const isCorrect = opt.label === currentQuestion.correctAnswer;
                const isSelected = selectedOption === opt.label;

                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt.label)}
                    disabled={isAnswered}
                    className={`btn-tactile p-4 rounded-xl text-xs md:text-sm font-medium border transition cursor-pointer flex items-center space-x-3 text-left ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : isAnswered && isCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center border shrink-0">
                      {opt.label}
                    </span>
                    <span className="font-serif">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* 解析卡片（做答后展开） */}
            {isAnswered && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {selectedOption === currentQuestion.correctAnswer ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <span className="font-bold text-sm text-slate-900">
                      {selectedOption === currentQuestion.correctAnswer
                        ? '回答正确！秒判考点极佳！'
                        : `回答错误！正确选项为 ${currentQuestion.correctAnswer}`}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSaveMistake(currentQuestion)}
                    className="text-xs text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>收入错题本</span>
                  </button>
                </div>

                <div className="space-y-2 text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                  <p>
                    <strong className="text-indigo-950">⚡ 考场秒杀线索：</strong>
                    {currentQuestion.examClue}
                  </p>
                  <p>
                    <strong className="text-emerald-900">💡 考点深度剖析：</strong>
                    {currentQuestion.analysis}
                  </p>
                  <p className="text-slate-500">
                    <strong className="text-rose-900">⚠️ 干扰项陷阱：</strong>
                    {currentQuestion.wrongDistractorWhy}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="btn-tactile bg-indigo-900 text-white text-xs px-4 py-2 rounded-xl flex items-center space-x-1 cursor-pointer font-medium shadow-xs"
                  >
                    <span>下一题</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
