import React, { useState } from 'react';
import { COMPLEX_SENTENCE_SLICES, ComplexSentenceSlice } from '../../data/cet6Data';
import { Cet6MistakeItem } from '../../data/cet6PracticeData';
import {
  Split,
  Eye,
  Sparkles,
  BookMarked,
  ArrowRight,
  ChevronRight,
  Check
} from 'lucide-react';

interface Cet6SyntaxViewProps {
  activeSubSection?: string;
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6SyntaxView: React.FC<Cet6SyntaxViewProps> = ({
  activeSubSection = 'step1',
  onAddMistake,
}) => {
  const [selectedId, setSelectedId] = useState<string>(COMPLEX_SENTENCE_SLICES[0].id);
  const [revealStep, setRevealStep] = useState<number>(4);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedSentence = COMPLEX_SENTENCE_SLICES.find((s) => s.id === selectedId) || COMPLEX_SENTENCE_SLICES[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleSaveMistake = (s: ComplexSentenceSlice) => {
    if (onAddMistake) {
      onAddMistake({
        type: 'syntax',
        typeLabel: '长难句',
        title: `长难句重点: ${s.examSource}`,
        sourceContext: s.originalSentence,
        myMistake: '句子从句太长，读了后面忘了前面',
        correctAnswer: `主干: ${s.syntaxHighlight.mainSubject} + ${s.syntaxHighlight.mainPredicate} + ${s.syntaxHighlight.mainObjectOrComplement}。\n翻译: ${s.translation}`,
        reason: 'meaning_error',
        reasonLabel: '抓主干慢',
        qiqiInsight: s.quickReadingRule,
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

      {/* 句子选择卡片 */}
      <div className="bg-paper-card p-3 rounded-2xl border border-paper-border shadow-scholarly flex flex-wrap gap-2 animate-card-enter">
        {COMPLEX_SENTENCE_SLICES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedId === s.id
                ? 'bg-bamboo-700 text-white shadow-xs'
                : 'bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border'
            }`}
          >
            长难句 {idx + 1}
          </button>
        ))}
      </div>

      {/* 核心长难句拆解主卡片 */}
      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly card-practice space-y-4 animate-card-enter">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-border pb-3">
          <div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
              {selectedSentence.examSource}
            </span>
            <h3 className="font-bold text-base text-wood-900 mt-1">
              先找主谓宾，修饰从句放一边
            </h3>
          </div>

          <button
            onClick={() => handleSaveMistake(selectedSentence)}
            className="px-3 py-1.5 rounded-xl bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border text-xs transition flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
          >
            <BookMarked className="w-3.5 h-3.5 text-bamboo-700" />
            <span>记入错题本</span>
          </button>
        </div>

        {/* 英文原句 */}
        <div className="space-y-1.5 bg-paper-50 p-4 rounded-xl border border-paper-border">
          <div className="text-xs text-wood-500 font-bold">真题原句：</div>
          <div className="text-sm sm:text-base font-bold text-wood-900 leading-relaxed select-all">
            {selectedSentence.originalSentence}
          </div>
        </div>

        {/* 学长速读技巧 */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>学长速读建议：</strong>
            {selectedSentence.quickReadingRule}
          </p>
        </div>

        {/* 主谓宾主干（彩色卡片，一目了然） */}
        <div className="space-y-2 pt-2">
          <div className="text-xs text-wood-500 font-bold">句子主干三要素（核心意思都在这）：</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-bamboo-50 rounded-xl border border-bamboo-200">
              <span className="text-[11px] font-bold text-bamboo-800">① 谁（主语）：</span>
              <p className="text-xs font-mono font-bold text-bamboo-900 mt-1 leading-snug">
                {selectedSentence.syntaxHighlight.mainSubject}
              </p>
            </div>

            <div className="p-3 bg-paper-100 rounded-xl border border-paper-border">
              <span className="text-[11px] font-bold text-wood-800">② 做了什么（谓语）：</span>
              <p className="text-xs font-mono font-bold text-wood-900 mt-1 leading-snug">
                {selectedSentence.syntaxHighlight.mainPredicate}
              </p>
            </div>

            <div className="p-3 bg-paper-100 rounded-xl border border-paper-border">
              <span className="text-[11px] font-bold text-wood-800">③ 什么对象（宾语/补语）：</span>
              <p className="text-xs font-mono font-bold text-wood-900 mt-1 leading-snug">
                {selectedSentence.syntaxHighlight.mainObjectOrComplement}
              </p>
            </div>
          </div>
        </div>

        {/* 修饰从句解析 */}
        <div className="space-y-2 pt-2 border-t border-paper-border">
          <div className="text-xs text-wood-500 font-bold">修饰从句（起补充说明作用）：</div>
          <div className="space-y-2">
            {selectedSentence.syntaxHighlight.modifiers.map((mod, i) => (
              <div key={i} className="p-3 bg-paper-50 rounded-xl border border-paper-border text-xs space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-wood-800 text-paper-50 text-[10px] font-bold">
                    {mod.type}
                  </span>
                  <span className="text-wood-600 font-bold">{mod.role}</span>
                </div>
                <div className="font-mono text-wood-900 font-medium pl-2 border-l-2 border-bamboo-500">
                  {mod.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 翻译与考点词汇 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-paper-border">
          <div className="p-3.5 bg-paper-50 rounded-xl border border-paper-border space-y-1">
            <span className="text-xs text-wood-500 font-bold">中文参考翻译：</span>
            <p className="text-xs sm:text-sm text-wood-900 font-bold leading-relaxed">
              {selectedSentence.translation}
            </p>
          </div>

          <div className="p-3.5 bg-paper-50 rounded-xl border border-paper-border space-y-1">
            <span className="text-xs text-wood-500 font-bold">句中重点词汇：</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedSentence.cet6KeyVocab.map((w, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded bg-paper-card border border-paper-border text-wood-800 font-mono"
                >
                  <strong>{w.word}</strong>: {w.meaning}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
