import React, { useState } from 'react';
import { CET6_GRAMMAR_QUESTIONS, Cet6GrammarQuestion, Cet6MistakeItem } from '../../data/cet6PracticeData';
import {
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookMarked,
  ArrowRight
} from 'lucide-react';

interface Cet6GrammarViewProps {
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6GrammarView: React.FC<Cet6GrammarViewProps> = ({ onAddMistake }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosenOpt, setChosenOpt] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: '全部语法实战' },
    { key: '非谓语动词', label: '非谓语动词 (doing/done)' },
    { key: '定语从句', label: '定语从句 (which/where/that)' },
    { key: '倒装与强调句', label: '倒装与强调句 (Only when...)' },
    { key: '虚拟语气与状语从句', label: '虚拟语气与状语从句' }
  ];

  const filtered = activeCategory === 'all'
    ? CET6_GRAMMAR_QUESTIONS
    : CET6_GRAMMAR_QUESTIONS.filter(q => q.category === activeCategory);

  const currentQ = filtered[currentIdx % filtered.length];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleSaveMistake = (q: Cet6GrammarQuestion) => {
    if (onAddMistake) {
      onAddMistake({
        type: 'grammar',
        typeLabel: '核心语法',
        title: `语法考点: ${q.category}`,
        sourceContext: q.sentencePrompt,
        myMistake: `误选了 ${chosenOpt || '未选'}`,
        correctAnswer: `${q.correctAnswer}. ${q.options.find(o => o.label === q.correctAnswer)?.text}`,
        reason: 'vocab_unknown',
        reasonLabel: '🏷️ 语法反应慢',
        qiqiInsight: `${q.examClue}。${q.analysis}`
      });
      showToast('✓ 已收录至语法错题本！');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-serif">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-wood-900 text-bamboo-200 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-bamboo-600">
          <Sparkles className="w-4 h-4 text-amberGold-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly space-y-4">
        <div className="border-b border-paper-border pb-4">
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 border border-bamboo-200 text-xs font-bold">
              第五优先级 · 语境真题实练
            </span>
            <span className="text-xs text-wood-500">不背枯燥死规则 · 真题语境体味</span>
          </div>
          <h2 className="text-xl font-bold text-wood-900">
            六级真题核心语法实战突击
          </h2>
          <p className="text-xs sm:text-sm text-wood-600 mt-1">
            重点突破非谓语动词（having done/done）、定语从句（most of which）、倒装句和虚拟语气，扫清做题盲区。
          </p>
        </div>

        {/* 分类栏 */}
        <div className="flex flex-wrap gap-2 pb-1 border-b border-paper-border/60">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setCurrentIdx(0);
                setChosenOpt(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center space-x-1 ${
                activeCategory === cat.key
                  ? 'bg-wood-900 text-white font-bold shadow-sm'
                  : 'bg-paper-100 text-wood-700 hover:bg-paper-200'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 题目大卡片 */}
        {currentQ && (
          <div className="bg-paper-50 rounded-2xl p-5 md:p-6 border border-paper-border space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded bg-bamboo-100 text-bamboo-800 font-bold">
                考点：{currentQ.category}
              </span>
              <span className="text-wood-400">
                第 {currentIdx + 1} / {filtered.length} 题
              </span>
            </div>

            {/* 句子题干 */}
            <div className="p-4 bg-paper-card rounded-xl border border-paper-border font-sans text-sm md:text-base leading-relaxed text-wood-900 shadow-xs font-medium">
              {currentQ.sentencePrompt}
            </div>

            {/* 4 个选项 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map(opt => {
                const isRight = opt.label === currentQ.correctAnswer;
                const isPicked = chosenOpt === opt.label;

                return (
                  <button
                    key={opt.label}
                    onClick={() => setChosenOpt(opt.label)}
                    disabled={chosenOpt !== null}
                    className={`btn-tactile p-3 rounded-xl text-xs text-left border transition cursor-pointer flex items-center space-x-2.5 ${
                      isPicked
                        ? isRight
                          ? 'bg-bamboo-700 text-white border-bamboo-700 font-bold'
                          : 'bg-cinnabar-700 text-white border-cinnabar-700 font-bold'
                        : chosenOpt !== null && isRight
                        ? 'bg-bamboo-100 text-bamboo-900 border-bamboo-300 font-bold'
                        : 'bg-paper-card border-paper-border text-wood-800 hover:bg-paper-100'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center font-mono font-bold shrink-0">
                      {opt.label}
                    </span>
                    <span className="font-sans text-sm">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* 做答后展开解析 */}
            {chosenOpt !== null && (
              <div className="bg-paper-card p-4 rounded-xl border border-paper-border text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold">
                    {chosenOpt === currentQ.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-bamboo-700" />
                        <span className="text-bamboo-800">回答正确！一眼识破考点！</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-cinnabar-700" />
                        <span className="text-cinnabar-800">
                          答错了！正确选项为 {currentQ.correctAnswer}
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleSaveMistake(currentQ)}
                    className="text-wood-600 hover:text-bamboo-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>收入错题本</span>
                  </button>
                </div>

                <div className="space-y-1 text-wood-700 bg-paper-50 p-3 rounded-lg border border-paper-border/60">
                  <p><strong className="text-bamboo-800">⚡ 考场线索：</strong>{currentQ.examClue}</p>
                  <p><strong className="text-wood-900">💡 考点解析：</strong>{currentQ.analysis}</p>
                  <p className="text-wood-500"><strong className="text-cinnabar-800">⚠️ 干扰项原因：</strong>{currentQ.wrongDistractorWhy}</p>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      setChosenOpt(null);
                      setCurrentIdx(prev => prev + 1);
                    }}
                    className="btn-tactile bg-bamboo-700 text-white px-3.5 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer font-bold"
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
