import React, { useState } from 'react';
import { WRITING_FRAMEWORK_DATA } from '../../data/cet6Data';
import { PenTool, Check, Copy, BookOpen, Layers, Sparkles, Lightbulb } from 'lucide-react';

export const Cet6WritingModule: React.FC = () => {
  const [subTab, setSubTab] = useState<'framework' | 'exams' | 'vocab'>('framework');
  const [selectedExamId, setSelectedExamId] = useState<string>('essay-1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedExam = WRITING_FRAMEWORK_DATA.realExamEssays.find(e => e.id === selectedExamId) || WRITING_FRAMEWORK_DATA.realExamEssays[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 模块顶部介绍 */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100">
                写作锁定 75+ 分
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                个人成长 <span className="text-rose-500">➔</span> 他人影响 <span className="text-rose-500">➔</span> 社会价值
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              万能底层逻辑 5 段式作文体系
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              考场上直接默写固定骨架与逻辑连接词，仅需将带有标记的槽位替换为对应语料，180词一次成型，稳拿高分！
            </p>
          </div>

          {/* 三合一子标签切换 */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setSubTab('framework')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'framework'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. 核心默写骨架</span>
            </button>
            <button
              onClick={() => setSubTab('exams')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'exams'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>2. 真题拆解演练</span>
            </button>
            <button
              onClick={() => setSubTab('vocab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'vocab'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>3. 系统插空词库</span>
            </button>
          </div>
        </div>

        {/* SUBTAB 1: 核心默写骨架 */}
        {subTab === 'framework' && (
          <div className="mt-6 space-y-6">
            <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-900 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>阅卷老师采分点说明：</strong> 加粗的连词（如 First and foremost, In addition, Last but not least）与高阶从句是评分踩分点。
                在考场上，仅需将带有 <span className="text-indigo-700 font-bold underline decoration-dashed decoration-rose-500 underline-offset-2">虚线插槽</span> 的部分替换为当前主题词。
              </div>
            </div>

            <div className="space-y-5">
              {WRITING_FRAMEWORK_DATA.universalFiveParagraphs.map((para) => (
                <div
                  key={para.paraIndex}
                  className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-all bg-white relative group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
                        {para.paraIndex}
                      </span>
                      <span className="font-bold text-slate-800 text-sm">{para.layerTitle}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                        {para.layerBadge}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(`para-${para.paraIndex}`, `${para.englishTemplate}\n\n${para.chineseTranslation}`)}
                      className="text-xs text-slate-400 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer transition p-1"
                      title="复制本段模板"
                    >
                      {copiedKey === `para-${para.paraIndex}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制本段</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 英文段落 */}
                  <div className="font-serif text-sm md:text-base text-slate-900 leading-relaxed pl-3 border-l-3 border-indigo-400 bg-slate-50/50 p-3 rounded-r-lg mb-2">
                    {para.englishTemplate}
                  </div>

                  {/* 中文对照 */}
                  <div className="text-xs md:text-sm text-slate-500 pl-3 border-l-3 border-slate-300 py-1">
                    {para.chineseTranslation}
                  </div>

                  {/* 插槽说明 */}
                  {para.fillSlots.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                      {para.fillSlots.map((slot) => (
                        <div key={slot.slotId} className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2 text-slate-700 w-full md:w-auto flex-1">
                          <span className="font-bold text-indigo-700 block mb-0.5">📌 {slot.slotPrompt}</span>
                          <span className="font-serif text-slate-600 italic">示范: "{slot.slotExample}"</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 2: 真题拆解演练 */}
        {subTab === 'exams' && (
          <div className="mt-6 space-y-6">
            {/* 3 套真题切换条 */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
              {WRITING_FRAMEWORK_DATA.realExamEssays.map((essay) => (
                <button
                  key={essay.id}
                  onClick={() => setSelectedExamId(essay.id)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition cursor-pointer flex items-center space-x-2 ${
                    selectedExamId === essay.id
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{essay.title}</span>
                </button>
              ))}
            </div>

            {/* 题干展示 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">真题命题要求 (Exam Prompt)</div>
              <div className="font-serif text-sm text-slate-800 italic">{selectedExam.examPrompt}</div>
              <div className="text-xs text-indigo-700 font-medium mt-1">核心立意方向：{selectedExam.chineseTopic}</div>
            </div>

            {/* 段落对照演练 */}
            <div className="space-y-4">
              {[
                { title: '段落 1 · 引入段', eng: selectedExam.studentSampleEssay.para1Eng, chn: selectedExam.studentSampleEssay.para1Chn, color: 'border-l-slate-400' },
                { title: '段落 2 · 个人成长层', eng: selectedExam.studentSampleEssay.para2Eng, chn: selectedExam.studentSampleEssay.para2Chn, color: 'border-l-blue-400' },
                { title: '段落 3 · 他人影响层', eng: selectedExam.studentSampleEssay.para3Eng, chn: selectedExam.studentSampleEssay.para3Chn, color: 'border-l-emerald-400' },
                { title: '段落 4 · 社会价值层', eng: selectedExam.studentSampleEssay.para4Eng, chn: selectedExam.studentSampleEssay.para4Chn, color: 'border-l-purple-400' },
                { title: '段落 5 · 总结升华段', eng: selectedExam.studentSampleEssay.para5Eng, chn: selectedExam.studentSampleEssay.para5Chn, color: 'border-l-rose-400' },
              ].map((p, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700">{p.title}</span>
                    <button
                      onClick={() => handleCopy(`exam-${selectedExam.id}-p${i}`, p.eng)}
                      className="text-xs text-slate-400 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === `exam-${selectedExam.id}-p${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === `exam-${selectedExam.id}-p${i}` ? '已复制' : '复制英文'}</span>
                    </button>
                  </div>
                  <div className={`font-serif text-sm md:text-base text-slate-900 leading-relaxed pl-3 border-l-4 ${p.color} mb-2`}>
                    {p.eng}
                  </div>
                  <div className="text-xs text-slate-500 pl-3">
                    {p.chn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: 系统插空词库 */}
        {subTab === 'vocab' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {WRITING_FRAMEWORK_DATA.pluginVocabBanks.map((bank, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-xs transition">
                  <div className="bg-slate-50 border-b border-slate-200 p-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{bank.icon}</span>
                      <span className="font-bold text-slate-800 text-sm">{bank.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {bank.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {bank.phrases.map((phrase, pIdx) => (
                      <div key={pIdx} className="group flex items-start justify-between gap-2 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                        <div className="min-w-0">
                          <div className="font-serif text-sm text-indigo-950 font-medium group-hover:text-indigo-700 transition">
                            {phrase.eng}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {phrase.chn}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(`vocab-${idx}-${pIdx}`, phrase.eng)}
                          className="shrink-0 p-1 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                          title="复制词组"
                        >
                          {copiedKey === `vocab-${idx}-${pIdx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
