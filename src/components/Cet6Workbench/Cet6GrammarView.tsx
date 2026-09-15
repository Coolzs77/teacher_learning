import React, { useState } from 'react';
import { CET6_GRAMMAR_QUESTIONS, Cet6GrammarQuestion, Cet6MistakeItem } from '../../data/cet6PracticeData';
import {
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookMarked,
  ArrowRight,
  Check
} from 'lucide-react';

interface Cet6GrammarViewProps {
  activeSubSection?: string;
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6GrammarView: React.FC<Cet6GrammarViewProps> = ({
  activeSubSection = 'all',
  onAddMistake,
}) => {
  const categoryMap: Record<string, string> = {
    all: 'all',
    nonfinite: '非谓语动词',
    clause: '定语从句',
    inversion: '倒装与强调句',
    subjunctive: '虚拟语气与状语从句',
  };

  const targetCategory = categoryMap[activeSubSection] || 'all';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosenOpt, setChosenOpt] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filtered = targetCategory === 'all'
    ? CET6_GRAMMAR_QUESTIONS
    : CET6_GRAMMAR_QUESTIONS.filter((q) => q.category === targetCategory);

  const currentQ = filtered[currentIdx % (filtered.length || 1)] || CET6_GRAMMAR_QUESTIONS[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleSaveMistake = () => {
    if (onAddMistake) {
      onAddMistake({
        type: 'grammar',
        typeLabel: '语法真题',
        title: `语法考点: ${currentQ.category} - ${currentQ.sentencePrompt.slice(0, 16)}...`,
        sourceContext: currentQ.sentencePrompt,
        myMistake: chosenOpt ? `选了 [${chosenOpt}]` : '当时未作答',
        correctAnswer: `${currentQ.correctAnswer}. ${currentQ.options.find((o) => o.label === currentQ.correctAnswer)?.text}`,
        reason: 'meaning_error',
        reasonLabel: '语法规则混淆',
        qiqiInsight: currentQ.analysis,
      });
      showToast('已成功收录至错题本！');
    }
  };

  return (
    <div className="space-y-6 font-serif">
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-wood-900 text-paper-50 px-4 py-2 rounded-xl text-xs shadow-xl flex items-center space-x-2 border border-stone-700 animate-fadeIn">
          <Check className="w-4 h-4 text-bamboo-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 语法练习卡片 */}
      <div className="bg-paper-card border border-paper-border rounded-2xl p-5 sm:p-6 shadow-scholarly card-practice space-y-4 animate-card-enter">
        <div className="flex items-center justify-between border-b border-paper-border pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
              {currentQ.category}
            </span>
            <span className="text-xs text-wood-500 font-mono">
              第 {(currentIdx % filtered.length) + 1} / {filtered.length} 题
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentIdx((prev) => (prev + 1) % filtered.length);
                setChosenOpt(null);
              }}
              className="px-3 py-1 text-xs rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition cursor-pointer"
            >
              换下一题 ➔
            </button>
          </div>
        </div>

        {/* 题目原句 */}
        <div className="bg-paper-50 p-4 rounded-xl border border-paper-border space-y-1">
          <div className="text-xs text-wood-500 font-bold">真题题目：</div>
          <div className="text-base sm:text-lg font-bold text-wood-900 leading-relaxed select-all">
            {currentQ.sentencePrompt}
          </div>
        </div>

        {/* 选项按钮 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt) => {
            const isPicked = chosenOpt === opt.label;
            const isCorrect = opt.label === currentQ.correctAnswer;

            let btnStyle = 'bg-paper-card border-paper-border text-wood-900 hover:border-bamboo-400';
            if (chosenOpt) {
              if (isCorrect) {
                btnStyle = 'bg-bamboo-700 text-white border-bamboo-800 shadow-sm animate-bounce-gentle';
              } else if (isPicked) {
                btnStyle = 'bg-cinnabar-100 text-cinnabar-800 border-cinnabar-300 animate-shake';
              }
            }

            return (
              <button
                key={opt.label}
                onClick={() => setChosenOpt(opt.label)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${btnStyle} active:scale-95`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-full bg-paper-200 text-wood-800 flex items-center justify-center font-bold text-xs">
                    {opt.label}
                  </span>
                  <span className="text-sm font-bold font-mono">{opt.text}</span>
                </div>
                {chosenOpt && isCorrect && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        {/* 即时反馈与解析 */}
        {chosenOpt && (
          <div
            className={`p-4 rounded-xl border space-y-3 animate-card-enter ${
              chosenOpt === currentQ.correctAnswer
                ? 'bg-bamboo-50 border-bamboo-300'
                : 'bg-cinnabar-50 border-cinnabar-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-sm">
                {chosenOpt === currentQ.correctAnswer ? (
                  <span className="text-bamboo-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>做对了！抓准了考点！</span>
                  </span>
                ) : (
                  <span className="text-cinnabar-800 flex items-center space-x-1">
                    <XCircle className="w-4 h-4" />
                    <span>选错了，正确答案是【{currentQ.correctAnswer}】</span>
                  </span>
                )}
              </div>

              <button
                onClick={handleSaveMistake}
                className="text-xs text-wood-600 hover:text-wood-900 flex items-center space-x-1 underline cursor-pointer"
              >
                <BookMarked className="w-3 h-3" />
                <span>记入错题本</span>
              </button>
            </div>

            <div className="text-xs space-y-1.5 pt-2 border-t border-black/10 text-wood-800 leading-relaxed">
              <p>
                <strong>解题线索：</strong>
                {currentQ.examClue}
              </p>
              <p>
                <strong>为什么选它：</strong>
                {currentQ.analysis}
              </p>
              <p className="text-cinnabar-900">
                <strong>错项错在哪：</strong>
                {currentQ.wrongDistractorWhy}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
