import React, { useState, useEffect } from 'react';
import { WRITING_FRAMEWORK_DATA } from '../../data/cet6Data';
import {
  PenTool,
  Check,
  Copy,
  BookOpen,
  Layers,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Send,
  RotateCcw,
  Sliders
} from 'lucide-react';

export const Cet6WritingModule: React.FC = () => {
  const [subTab, setSubTab] = useState<'framework' | 'drafting' | 'exams' | 'vocab'>('framework');
  const [selectedExamId, setSelectedExamId] = useState<string>('essay-1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 逐段默写掌握度（1~5段）
  const [masteredParas, setMasteredParas] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('cet6_writing_mastery');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // 仿写工坊状态
  const [draftPrompt, setDraftPrompt] = useState<string>('The Chinese Dream and Youth Responsibility');
  const [draftP1, setDraftP1] = useState<string>('The Chinese Dream is a shared aspiration for national rejuvenation, which requires the active participation of contemporary youth. I find this statement both insightful and convincing. From my perspective, the message it conveys deserves serious consideration, especially among young people who are shaping their future.');
  const [draftP2, setDraftP2] = useState<string>('First and foremost, striving for the Chinese Dream inspires individuals to pursue their aspirations with determination. It not only enables them to realize their full potential, but also equips them with the ability to overcome setbacks and embrace challenges. As a result, they can better adapt to the ever-changing society and cope with various challenges in life.');
  const [draftP3, setDraftP3] = useState<string>('In addition, dedicated young people can set positive examples for their peers. People who possess this quality are generally more likely to inspire those around them to strive for excellence, thereby creating a positive impact on those around them. A relevant example can be found in our daily lives, where many ordinary individuals achieve extraordinary progress through persistent effort and selfless contribution.');
  const [draftP4, setDraftP4] = useState<string>('Last but not least, youth responsibility provides an inexhaustible momentum for the prosperity of the nation. In the long run, it contributes not only to personal growth but also to the advancement of society as a whole.');
  const [draftP5, setDraftP5] = useState<string>('Taking all these factors into account, I firmly believe that this idea should be valued and put into practice. Only by doing so can we become a better version of ourselves and embrace a more promising future.');

  useEffect(() => {
    try {
      localStorage.setItem('cet6_writing_mastery', JSON.stringify(masteredParas));
    } catch (e) {}
  }, [masteredParas]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleMastered = (paraIndex: number) => {
    setMasteredParas(prev => ({
      ...prev,
      [paraIndex]: !prev[paraIndex]
    }));
  };

  const selectedExam = WRITING_FRAMEWORK_DATA.realExamEssays.find(e => e.id === selectedExamId) || WRITING_FRAMEWORK_DATA.realExamEssays[0];

  const fullDraftText = [draftP1, draftP2, draftP3, draftP4, draftP5].filter(Boolean).join('\n\n');
  const wordCount = fullDraftText.trim() ? fullDraftText.trim().split(/\s+/).length : 0;

  const masteredCount = [1, 2, 3, 4, 5].filter(idx => masteredParas[idx]).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 模块顶部介绍 */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100">
                第三优先级攻坚 · 写作锁定 75+ 分
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                万能 5 段底层骨架 · 逐段背诵打卡 · 考场实景仿写
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              万能 5 段式作文体系与仿写工坊
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              考场上直接默写固定骨架与逻辑连接词，仅需将带有标记的槽位替换为对应语料，180词一次成型，稳拿高分！
            </p>
          </div>

          {/* 四合一子标签切换 */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start lg:self-auto flex-wrap gap-1">
            <button
              onClick={() => setSubTab('framework')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'framework'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. 核心默写骨架</span>
            </button>
            <button
              onClick={() => setSubTab('drafting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'drafting'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>2. 仿写演练工坊</span>
            </button>
            <button
              onClick={() => setSubTab('exams')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'exams'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3. 真题拆解演练</span>
            </button>
            <button
              onClick={() => setSubTab('vocab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'vocab'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>4. 系统插空词库</span>
            </button>
          </div>
        </div>

        {/* ================= SUBTAB 1: 核心默写骨架 ================= */}
        {subTab === 'framework' && (
          <div className="mt-6 space-y-6">
            {/* 默写掌握进度指示条 */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {masteredCount}/5
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">
                    5 段式核心默写骨架掌握进度：{Math.round((masteredCount / 5) * 100)}%
                  </h4>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    每段均可点击“已掌握/需复习”打卡。考前必须做到 5/5 全部熟记于心！
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-48 bg-white border border-indigo-200 h-2.5 rounded-full overflow-hidden shrink-0">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(masteredCount / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-900 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>阅卷老师采分点说明：</strong> 加粗的连词（如 First and foremost, In addition, Last but not least）与高阶从句是评分踩分点。
                在考场上，仅需将带有 <span className="text-indigo-700 font-bold underline decoration-dashed decoration-rose-500 underline-offset-2">虚线插槽</span> 的部分替换为当前主题词。
              </div>
            </div>

            <div className="space-y-5">
              {WRITING_FRAMEWORK_DATA.universalFiveParagraphs.map((para) => {
                const isMastered = !!masteredParas[para.paraIndex];

                return (
                  <div
                    key={para.paraIndex}
                    className={`border rounded-xl p-5 transition-all bg-white relative group ${
                      isMastered ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          isMastered ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                        }`}>
                          {para.paraIndex}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">{para.layerTitle}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                          {para.layerBadge}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleMastered(para.paraIndex)}
                          className={`btn-tactile text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition ${
                            isMastered
                              ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isMastered ? '已熟练掌握' : '标记已掌握'}</span>
                        </button>

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
                              <span>复制段落</span>
                            </>
                          )}
                        </button>
                      </div>
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
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SUBTAB 2: 交互式仿写演练工坊 ================= */}
        {subTab === 'drafting' && (
          <div className="mt-6 space-y-6">
            {/* 顶栏控制：字数指示器与操作按钮 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${
                  wordCount >= 150 && wordCount <= 200
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : wordCount > 200
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  <span>当前总字数：{wordCount} 词</span>
                  {wordCount >= 150 && wordCount <= 200 && <span>(完美黄金字数！)</span>}
                </div>
                <span className="text-xs text-slate-500 hidden md:inline">
                  六级作文要求：150 ~ 200 词
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const fullText = `Title: ${draftPrompt}\n\n${fullDraftText}`;
                    handleCopy('full-draft', fullText);
                  }}
                  className="btn-tactile bg-indigo-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  {copiedKey === 'full-draft' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>复制完整 5 段作文</span>
                </button>
              </div>
            </div>

            {/* 5 段输入框 */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  1. 引入段 (引入原题观点 + insightful and convincing)
                </label>
                <textarea
                  rows={3}
                  value={draftP1}
                  onChange={e => setDraftP1(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-serif text-xs md:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  2. 个人成长层 (First and foremost + not only... but also...)
                </label>
                <textarea
                  rows={3}
                  value={draftP2}
                  onChange={e => setDraftP2(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-serif text-xs md:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  3. 他人影响层 (In addition + A relevant example...)
                </label>
                <textarea
                  rows={3}
                  value={draftP3}
                  onChange={e => setDraftP3(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-serif text-xs md:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  4. 社会价值层 (Last but not least + contributes to the advancement of society)
                </label>
                <textarea
                  rows={3}
                  value={draftP4}
                  onChange={e => setDraftP4(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-serif text-xs md:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  5. 总结升华段 (Taking all these factors into account + Only by doing so...)
                </label>
                <textarea
                  rows={3}
                  value={draftP5}
                  onChange={e => setDraftP5(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl font-serif text-xs md:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SUBTAB 3: 真题拆解演练 ================= */}
        {subTab === 'exams' && (
          <div className="mt-6 space-y-6">
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

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">真题命题要求 (Exam Prompt)</div>
              <div className="font-serif text-sm text-slate-800 italic">{selectedExam.examPrompt}</div>
              <div className="text-xs text-indigo-700 font-medium mt-1">核心立意方向：{selectedExam.chineseTopic}</div>
            </div>

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

        {/* ================= SUBTAB 4: 系统插空词库 ================= */}
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
