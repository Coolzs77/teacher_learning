import React, { useState } from 'react';
import { COMPLEX_SENTENCE_SLICES, ComplexSentenceSlice } from '../../data/cet6Data';
import { Cet6MistakeItem } from '../../data/cet6PracticeData';
import {
  Split,
  Eye,
  Sparkles,
  BookMarked,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface Cet6SyntaxViewProps {
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6SyntaxView: React.FC<Cet6SyntaxViewProps> = ({ onAddMistake }) => {
  const [selectedId, setSelectedId] = useState<string>(COMPLEX_SENTENCE_SLICES[0].id);
  const [revealStep, setRevealStep] = useState<number>(4);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedSentence = COMPLEX_SENTENCE_SLICES.find(s => s.id === selectedId) || COMPLEX_SENTENCE_SLICES[0];

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
        myMistake: '句子太长，读了后面忘了前面',
        correctAnswer: `主干: ${s.syntaxHighlight.mainSubject} + ${s.syntaxHighlight.mainPredicate} + ${s.syntaxHighlight.mainObjectOrComplement}。\n通译: ${s.translation}`,
        reason: 'meaning_error',
        reasonLabel: '🏷️ 抓主干慢',
        qiqiInsight: s.quickReadingRule
      });
      showToast('✓ 已收录至长难句本！');
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
              第四优先级 · 攻克长难句卡壳
            </span>
            <span className="text-xs text-wood-500">考场5秒速读法 ➔ 剥离主干 ➔ 展开修饰</span>
          </div>
          <h2 className="text-xl font-bold text-wood-900">
            真题重难长难句步步拆解
          </h2>
          <p className="text-xs sm:text-sm text-wood-600 mt-1">
            六级仔细阅读一题 14.2 分！长难句看不懂主要是被从句绕晕了。学会抓主谓宾，把枝节放到一边，阅读速度翻倍！
          </p>
        </div>

        {/* 句子选择列表 */}
        <div className="flex flex-wrap gap-2 pb-1 border-b border-paper-border/60">
          {COMPLEX_SENTENCE_SLICES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedId(s.id);
                setRevealStep(4);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center space-x-1.5 ${
                selectedId === s.id
                  ? 'bg-wood-900 text-white font-bold shadow-sm'
                  : 'bg-paper-100 text-wood-700 hover:bg-paper-200'
              }`}
            >
              <span>长句 {idx + 1}</span>
              <span className="text-[10px] opacity-80 truncate max-w-[120px]">{s.examSource.split('·')[0]}</span>
            </button>
          ))}
        </div>

        {/* 步进器按钮 */}
        <div className="bg-paper-100 p-2.5 rounded-xl border border-paper-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-wood-800">步步探究揭示：</span>
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {[
              { step: 1, label: '1. 原文与速读法' },
              { step: 2, label: '2. 剥离核心主谓宾' },
              { step: 3, label: '3. 展开修饰支节' },
              { step: 4, label: '4. 全文通译' }
            ].map(b => (
              <button
                key={b.step}
                onClick={() => setRevealStep(b.step)}
                className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
                  revealStep >= b.step
                    ? 'bg-bamboo-700 text-white font-bold shadow-xs'
                    : 'bg-paper-card border border-paper-border text-wood-700 hover:bg-paper-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 长难句展示大卡片 */}
        <div className="bg-paper-50 rounded-2xl p-5 md:p-6 border border-paper-border space-y-5">
          {/* 句子来源与收录按钮 */}
          <div className="flex items-center justify-between pb-3 border-b border-paper-border">
            <span className="text-xs font-bold text-wood-800 bg-paper-100 px-2.5 py-1 rounded-lg border border-paper-border">
              {selectedSentence.examSource}
            </span>
            <button
              onClick={() => handleSaveMistake(selectedSentence)}
              className="text-xs text-wood-600 hover:text-bamboo-800 flex items-center space-x-1 cursor-pointer"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>存入长难句本</span>
            </button>
          </div>

          {/* 步骤 1: 原句与速读法 */}
          {revealStep >= 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div>
                <span className="text-[11px] text-wood-400 font-bold block mb-1">英文原句：</span>
                <div className="p-4 bg-paper-card rounded-xl border border-paper-border font-sans text-sm md:text-base leading-relaxed text-wood-900 shadow-xs font-medium">
                  {selectedSentence.originalSentence}
                </div>
              </div>

              <div className="bg-amberGold-100 p-3.5 rounded-xl border border-amberGold-600/40 text-xs text-wood-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-wood-900">
                  <Eye className="w-4 h-4 text-amberGold-600" />
                  <span>考场 5 秒速读法则（抓主干、略枝节）：</span>
                </div>
                <p className="leading-relaxed pl-5">{selectedSentence.quickReadingRule}</p>
              </div>
            </div>
          )}

          {/* 步骤 2: 剥离核心主谓宾 */}
          {revealStep >= 2 && (
            <div className="space-y-2 pt-3 border-t border-paper-border animate-fadeIn">
              <span className="text-xs font-bold text-wood-800 block">
                核心主干三要素（绿主语·灰谓语·褐宾语）：
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div className="bg-paper-card p-3 rounded-xl border border-bamboo-300">
                  <span className="text-[10px] bg-bamboo-100 text-bamboo-800 px-1.5 py-0.5 rounded font-bold">
                    核心主语 (Subject)
                  </span>
                  <p className="font-sans text-xs font-bold text-wood-900 mt-1">
                    {selectedSentence.syntaxHighlight.mainSubject}
                  </p>
                </div>

                <div className="bg-paper-card p-3 rounded-xl border border-paper-border">
                  <span className="text-[10px] bg-paper-200 text-wood-800 px-1.5 py-0.5 rounded font-bold">
                    谓语动词 (Predicate)
                  </span>
                  <p className="font-sans text-xs font-bold text-wood-900 mt-1">
                    {selectedSentence.syntaxHighlight.mainPredicate}
                  </p>
                </div>

                <div className="bg-paper-card p-3 rounded-xl border border-paper-border">
                  <span className="text-[10px] bg-cinnabar-50 text-cinnabar-800 px-1.5 py-0.5 rounded font-bold">
                    宾语 / 补足语 (Object)
                  </span>
                  <p className="font-sans text-xs font-bold text-wood-900 mt-1">
                    {selectedSentence.syntaxHighlight.mainObjectOrComplement}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 步骤 3: 展开修饰从句 */}
          {revealStep >= 3 && selectedSentence.syntaxHighlight.modifiers.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-paper-border animate-fadeIn">
              <span className="text-xs font-bold text-wood-800 block">
                修饰成分（定语从句 / 状语从句 / 分词短语）：
              </span>
              <div className="space-y-1.5">
                {selectedSentence.syntaxHighlight.modifiers.map((mod, mIdx) => (
                  <div key={mIdx} className="bg-paper-card p-2.5 rounded-lg border border-paper-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.2 rounded bg-paper-200 text-wood-700 text-[10px] font-bold shrink-0">
                        {mod.type}
                      </span>
                      <span className="font-sans italic text-wood-900">{mod.content}</span>
                    </div>
                    <span className="text-[11px] text-wood-500 shrink-0">{mod.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 步骤 4: 全文通译与生词 */}
          {revealStep >= 4 && (
            <div className="space-y-3 pt-3 border-t border-paper-border animate-fadeIn">
              <div className="bg-paper-card p-3.5 rounded-xl border border-paper-border text-xs leading-relaxed text-wood-900">
                <span className="text-wood-400 font-bold block mb-1">中文精通译：</span>
                <p>{selectedSentence.translation}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-wood-800 block mb-1.5">
                  句中六级常考词汇（百词斩联动强化）：
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSentence.cet6KeyVocab.map((v, vIdx) => (
                    <span key={vIdx} className="text-xs bg-paper-card px-2.5 py-1 rounded-lg border border-paper-border text-wood-800">
                      <strong className="font-sans mr-1">{v.word}</strong>
                      <span className="text-wood-500">{v.meaning}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
