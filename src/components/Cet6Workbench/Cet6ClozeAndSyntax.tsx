import React, { useState } from 'react';
import { BANKED_CLOZE_RULES, COMPLEX_SENTENCE_SLICES } from '../../data/cet6Data';
import { Split, Scissors, BookOpen, CheckCircle, Search, HelpCircle, ArrowRight, Eye, ChevronRight } from 'lucide-react';

export const Cet6ClozeAndSyntax: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'cloze' | 'syntax'>('syntax');
  const [selectedSentenceId, setSelectedSentenceId] = useState<string>(COMPLEX_SENTENCE_SLICES[0].id);
  const [showFullSyntaxTree, setShowFullSyntaxTree] = useState<boolean>(true);

  const selectedSentence = COMPLEX_SENTENCE_SLICES.find(s => s.id === selectedSentenceId) || COMPLEX_SENTENCE_SLICES[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部总览与主标签切换 */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 text-xs font-bold rounded-md border border-sky-100">
                ExamCraft 风格 · 语法内核
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                从“全蒙一个字母”到“5分钟锁定14分” + 斩断长难句迷宫
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              选词填空秒杀 ＆ 真题重难长难句语法树
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              针对琪琪单词用百词斩背但长难句看不懂、选词填空没时间做全蒙的痛点，用词性预判法和句法主干剥离法降维打击！
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveSection('syntax')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                activeSection === 'syntax'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>真题重难长难句 (ExamCraft)</span>
            </button>
            <button
              onClick={() => setActiveSection('cloze')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                activeSection === 'cloze'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>选词填空秒杀四步法</span>
            </button>
          </div>
        </div>

        {/* ================= SECTION 1: 真题重难长难句语法树拆解 (ExamCraft 风格) ================= */}
        {activeSection === 'syntax' && (
          <div className="mt-6 space-y-6">
            {/* 句子选择列表 */}
            <div className="flex flex-wrap gap-2">
              {COMPLEX_SENTENCE_SLICES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSentenceId(s.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-2 ${
                    selectedSentenceId === s.id
                      ? 'bg-indigo-900 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>长难句 {idx + 1}</span>
                  <span className="text-[10px] opacity-80 truncate max-w-[120px]">{s.examSource.split('·')[0]}</span>
                </button>
              ))}
            </div>

            {/* 当前长难句展示卡片 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              {/* 顶部出处 */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-slate-700">{selectedSentence.examSource}</span>
                </div>
                <span className="text-xs text-indigo-600 font-medium">{selectedSentence.paragraphSnippet}</span>
              </div>

              <div className="p-6 space-y-6">
                {/* 英文原句 */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    真题长难句实景呈现 (Original Sentence)
                  </div>
                  <div className="p-4 bg-slate-900 text-white rounded-xl font-serif text-base md:text-lg leading-relaxed shadow-inner">
                    {selectedSentence.originalSentence}
                  </div>
                </div>

                {/* 考场 5 秒速读法则（抓主干、略枝节） */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs mb-1">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>⚡ 考场 5 秒极速破解法（ExamCraft 提速军规）</span>
                  </div>
                  <p className="text-xs md:text-sm text-amber-950 font-medium leading-relaxed">
                    {selectedSentence.quickReadingRule}
                  </p>
                </div>

                {/* ExamCraft 结构拆解视觉树 (主干 vs 修饰语) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                      <Split className="w-4 h-4 text-indigo-600" />
                      <span>语法树切片剖析 (Syntax Structure Breakdown)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">色彩分层标识</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* 主语 */}
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                        核心主语 (Subject)
                      </span>
                      <p className="font-serif text-sm font-bold text-emerald-950 mt-2">
                        {selectedSentence.syntaxHighlight.mainSubject}
                      </p>
                    </div>

                    {/* 谓语动词 */}
                    <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5">
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded">
                        谓语动词 (Predicate)
                      </span>
                      <p className="font-serif text-sm font-bold text-blue-950 mt-2">
                        {selectedSentence.syntaxHighlight.mainPredicate}
                      </p>
                    </div>

                    {/* 宾语/表语 */}
                    <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3.5">
                      <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider bg-purple-100 px-2 py-0.5 rounded">
                        宾语 / 补足语 (Object)
                      </span>
                      <p className="font-serif text-sm font-bold text-purple-950 mt-2">
                        {selectedSentence.syntaxHighlight.mainObjectOrComplement}
                      </p>
                    </div>
                  </div>

                  {/* 复杂的修饰从句 / 分词短语 */}
                  {selectedSentence.syntaxHighlight.modifiers.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                      <span className="text-xs font-bold text-slate-700 block">修饰支节（定语从句 / 状语 / 非谓语）</span>
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
                </div>

                {/* 地道中文翻译 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    全文通译 (Chinese Translation)
                  </span>
                  <p className="text-sm text-slate-800 font-serif leading-relaxed">
                    {selectedSentence.translation}
                  </p>
                </div>

                {/* 句中六级核心高频词 */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    句中六级考点词汇（点击在百词斩中重点过一遍）
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
            </div>
          </div>
        )}

        {/* ================= SECTION 2: 选词填空秒杀四步法 ================= */}
        {activeSection === 'cloze' && (
          <div className="mt-6 space-y-6">
            <div className="bg-rose-50/70 border-l-4 border-rose-500 p-4 rounded-r-xl text-xs text-rose-950">
              <strong className="block text-sm font-bold text-rose-900 mb-1">
                琪琪专属军规：绝不全选一个字母！4 分钟稳拿 14.2 分！
              </strong>
              选词填空（Banked Cloze）共 10 题，每题 3.55 分。琪琪之前全部放弃或全选同一个选项，基本得 0 分。
              其实只要花 4-5 分钟：先用 1 分钟把 15 个单词标上词性（N/V/Adj/Adv），再看空格两边语法特征，有 3-4 道题是送分题！直接锁定 14.2 分，相当于总分白赚 14 分！
            </div>

            {/* 4 步秒杀法流程图 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { step: '1', title: '标词性 (1分钟)', desc: '不看文章！扫视 15 个选项，根据后缀标注 N/V/Adj/Adv 四大类。' },
                { step: '2', title: '判语法 (1分钟)', desc: '看空格前后 2 个词，判断该位置缺少名词、动词、形容词还是副词。' },
                { step: '3', title: '小框选 (2分钟)', desc: '直接去对应词性的小集合里挑选 1-2 个词，代入句意通顺即锁定！' },
                { step: '4', title: '果断走 (1分钟)', desc: '挑完 3-4 道确定题目后，剩余不确定的快速蒙同一字母，绝不死磕！' }
              ].map((flow, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <div className="w-7 h-7 bg-indigo-700 text-white rounded-full font-bold text-xs flex items-center justify-center mx-auto mb-2">
                    {flow.step}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{flow.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{flow.desc}</p>
                </div>
              ))}
            </div>

            {/* 常见词缀秒判口诀 */}
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

            {/* 空格槽位速秒口诀 */}
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
