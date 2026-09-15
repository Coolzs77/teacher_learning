import React, { useState } from 'react';
import { COMPLEX_SENTENCE_SLICES, ComplexSentenceSlice, BANKED_CLOZE_RULES } from '../../data/cet6Data';
import { Cet6MistakeItem } from '../../data/cet6PracticeData';
import {
  Split,
  Scissors,
  BookOpen,
  CheckCircle,
  Search,
  HelpCircle,
  ArrowRight,
  Eye,
  ChevronRight,
  Layers,
  Sparkles,
  BookmarkPlus
} from 'lucide-react';

interface Cet6ClozeAndSyntaxProps {
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
  onGoToClozeTrainer?: () => void;
}

export const Cet6ClozeAndSyntax: React.FC<Cet6ClozeAndSyntaxProps> = ({
  onAddMistake,
  onGoToClozeTrainer
}) => {
  const [activeSection, setActiveSection] = useState<'syntax' | 'clozeRules'>('syntax');
  const [selectedSentenceId, setSelectedSentenceId] = useState<string>(COMPLEX_SENTENCE_SLICES[0].id);

  // 步步揭示机制 (Step 1: 原文与速读 -> Step 2: 主谓宾主干 -> Step 3: 修饰枝节 -> Step 4: 全文精通译)
  const [currentRevealStep, setCurrentRevealStep] = useState<number>(4);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedSentence = COMPLEX_SENTENCE_SLICES.find(s => s.id === selectedSentenceId) || COMPLEX_SENTENCE_SLICES[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleSaveToMistakes = (sentence: ComplexSentenceSlice) => {
    const data = {
      type: 'syntax' as const,
      typeLabel: '长难句',
      title: `长难句剖析: ${sentence.examSource}`,
      sourceContext: sentence.originalSentence,
      myMistake: '阅读时读了后面忘前面，难以提炼句子主谓宾',
      correctAnswer: `主干: [主语] ${sentence.syntaxHighlight.mainSubject} + [谓语] ${sentence.syntaxHighlight.mainPredicate} + [宾语] ${sentence.syntaxHighlight.mainObjectOrComplement}。\n通译: ${sentence.translation}`,
      reason: 'meaning_error' as const,
      reasonLabel: '🏷️ 句意理解偏差 / 主干抓取慢',
      qiqiInsight: sentence.quickReadingRule
    };

    if (onAddMistake) {
      onAddMistake(data);
    } else {
      try {
        const saved = localStorage.getItem('cet6_mistakes');
        const list = saved ? JSON.parse(saved) : [];
        list.unshift({
          ...data,
          id: `mis-syn-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          isMastered: false
        });
        localStorage.setItem('cet6_mistakes', JSON.stringify(list));
      } catch (e) {}
    }
    showToast('✓ 已收录至长难句错题库！');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-emerald-400 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-emerald-500/30">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 顶部总览 */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 text-xs font-bold rounded-md border border-sky-100">
                第四优先级攻坚 · 步步拆解机制
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                ExamCraft 色彩分层 · 先抓主干，再析修饰，最后精通译文
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              真题重难长难句语法树剖析
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              针对六级仔细阅读长难句“读了后面忘前面”的通病，用考场 5 秒速读军规与层级揭示法降维打击！
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveSection('syntax')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                activeSection === 'syntax'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>真题重难长难句 (ExamCraft)</span>
            </button>
            <button
              onClick={() => setActiveSection('clozeRules')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                activeSection === 'clozeRules'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>词缀与槽位速查秘籍</span>
            </button>
          </div>
        </div>

        {/* ================= SECTION 1: 真题长难句剖析 ================= */}
        {activeSection === 'syntax' && (
          <div className="mt-6 space-y-6">
            {/* 句子列表选择 */}
            <div className="flex flex-wrap gap-2">
              {COMPLEX_SENTENCE_SLICES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSentenceId(s.id);
                    setCurrentRevealStep(4);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-2 ${
                    selectedSentenceId === s.id
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>长难句 {idx + 1}</span>
                  <span className="text-[10px] opacity-80 truncate max-w-[130px]">{s.examSource.split('·')[0]}</span>
                </button>
              ))}
            </div>

            {/* 步步提示步进器 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>步步提示探究机制：</span>
              </span>

              <div className="flex items-center space-x-1.5 overflow-x-auto">
                {[
                  { step: 1, label: '步骤 1: 英文与速读法' },
                  { step: 2, label: '步骤 2: 剥离主谓宾' },
                  { step: 3, label: '步骤 3: 展开修饰从句' },
                  { step: 4, label: '步骤 4: 全文精通译' }
                ].map(item => (
                  <button
                    key={item.step}
                    onClick={() => setCurrentRevealStep(item.step)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                      currentRevealStep >= item.step
                        ? 'bg-indigo-900 text-white font-bold shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 长难句呈现卡片 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              {/* 顶部出处与收藏 */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-slate-700">{selectedSentence.examSource}</span>
                </div>

                <button
                  onClick={() => handleSaveToMistakes(selectedSentence)}
                  className="text-xs text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>收录至错题/长难句库</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 步骤 1: 英文原句 + 考场5秒速读法 */}
                {currentRevealStep >= 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        真题长难句实景呈现 (Original Sentence)
                      </div>
                      <div className="p-4 bg-slate-900 text-white rounded-xl font-serif text-base md:text-lg leading-relaxed shadow-inner">
                        {selectedSentence.originalSentence}
                      </div>
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                      <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs mb-1">
                        <Eye className="w-4 h-4 text-amber-600" />
                        <span>⚡ 考场 5 秒极速破解法（ExamCraft 提速军规）</span>
                      </div>
                      <p className="text-xs md:text-sm text-amber-950 font-medium leading-relaxed">
                        {selectedSentence.quickReadingRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* 步骤 2: 剥离核心主谓宾 */}
                {currentRevealStep >= 2 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100 animate-fadeIn">
                    <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                      <Split className="w-4 h-4 text-indigo-600" />
                      <span>步骤 2 · 核心主干三要素（绿主·蓝谓·紫宾）</span>
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                          核心主语 (Subject)
                        </span>
                        <p className="font-serif text-sm font-bold text-emerald-950 mt-2">
                          {selectedSentence.syntaxHighlight.mainSubject}
                        </p>
                      </div>

                      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5">
                        <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded">
                          谓语动词 (Predicate)
                        </span>
                        <p className="font-serif text-sm font-bold text-blue-950 mt-2">
                          {selectedSentence.syntaxHighlight.mainPredicate}
                        </p>
                      </div>

                      <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3.5">
                        <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider bg-purple-100 px-2 py-0.5 rounded">
                          宾语 / 补足语 (Object)
                        </span>
                        <p className="font-serif text-sm font-bold text-purple-950 mt-2">
                          {selectedSentence.syntaxHighlight.mainObjectOrComplement}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 步骤 3: 展开修饰从句与插入语 */}
                {currentRevealStep >= 3 && selectedSentence.syntaxHighlight.modifiers.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-fadeIn">
                    <span className="text-xs font-bold text-slate-700 block">
                      步骤 3 · 修饰支节（定语从句 / 状语 / 非谓语 / 插入语）
                    </span>
                    {selectedSentence.syntaxHighlight.modifiers.map((mod, mIdx) => (
                      <div key={mIdx} className="bg-white border border-slate-200 rounded-lg p-3 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded text-[11px] shrink-0">
                            {mod.type}
                          </span>
                          <span className="font-serif text-slate-800 italic">{mod.content}</span>
                        </div>
                        <span className="text-slate-500 shrink-0 text-[11px]">{mod.role}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 步骤 4: 全文精通译 + 核心考点词 */}
                {currentRevealStep >= 4 && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 animate-fadeIn">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        步骤 4 · 全文精通译 (Chinese Translation)
                      </span>
                      <p className="text-sm text-slate-800 font-serif leading-relaxed">
                        {selectedSentence.translation}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-2">
                        句中六级考点词汇（百词斩联动强化）
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedSentence.cet6KeyVocab.map((vocab, vIdx) => (
                          <div key={vIdx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs shadow-2xs">
                            <strong className="font-mono text-indigo-900 mr-1.5">{vocab.word}</strong>
                            <span className="text-slate-500">{vocab.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: 词缀与槽位速查秘籍 ================= */}
        {activeSection === 'clozeRules' && (
          <div className="mt-6 space-y-6">
            <div className="bg-indigo-50/70 border-l-4 border-indigo-600 p-4 rounded-r-xl text-xs text-indigo-950">
              <strong className="block text-sm font-bold text-indigo-900 mb-1">
                琪琪考场速查锦囊
              </strong>
              随时回顾词尾特征与四大送分题型句式模式，配合“选词填空专项实战”食用效果更佳！
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <Search className="w-4 h-4 text-indigo-600" />
                <span>常见六级词缀速查对照表（秒判词性秘籍）</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BANKED_CLOZE_RULES.suffixRules.map((rule, rIdx) => (
                  <div key={rIdx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900">{rule.pos}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        特征词尾
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {rule.suffixes.map((suf, sIdx) => (
                        <span key={sIdx} className="text-xs font-mono bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded border border-indigo-100">
                          {suf}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <strong>位置特征：</strong>{rule.tips}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>四大送分题型句式模式（考场直接套用）</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BANKED_CLOZE_RULES.sentenceSlots.map((slot, sIdx) => (
                  <div key={sIdx} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <div className="font-mono text-xs font-bold text-indigo-900 mb-1">
                      {slot.slotPattern}
                    </div>
                    <div className="flex items-center space-x-2 text-xs mb-1">
                      <span className="text-slate-500">目标词性:</span>
                      <span className="font-bold text-rose-600">{slot.targetPos}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{slot.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
