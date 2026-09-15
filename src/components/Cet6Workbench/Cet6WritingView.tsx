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
  RotateCcw
} from 'lucide-react';

export const Cet6WritingView: React.FC = () => {
  const [subTab, setSubTab] = useState<'framework' | 'drafting' | 'exams' | 'vocab'>('framework');
  const [selectedExamId, setSelectedExamId] = useState('essay-1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 逐段背诵打卡状态（存储在 localStorage: cet6_writing_mastery）
  const [mastered, setMastered] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('cet6_writing_mastery');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // 仿写演练文本
  const [draftPrompt, setDraftPrompt] = useState('The Chinese Dream and Youth Responsibility');
  const [p1, setP1] = useState('The Chinese Dream is a shared aspiration for national rejuvenation, which requires the active participation of contemporary youth. I find this statement both insightful and convincing. From my perspective, the message it conveys deserves serious consideration, especially among young people who are shaping their future.');
  const [p2, setP2] = useState('First and foremost, striving for the Chinese Dream inspires individuals to pursue their aspirations with determination. It not only enables them to realize their full potential, but also equips them with the ability to overcome setbacks and embrace challenges. As a result, they can better adapt to the ever-changing society and cope with various challenges in life.');
  const [p3, setP3] = useState('In addition, dedicated young people can set positive examples for their peers. People who possess this quality are generally more likely to inspire those around them to strive for excellence, thereby creating a positive impact on those around them. A relevant example can be found in our daily lives, where many ordinary individuals achieve extraordinary progress through persistent effort and selfless contribution.');
  const [p4, setP4] = useState('Last but not least, youth responsibility provides an inexhaustible momentum for the prosperity of the nation. In the long run, it contributes not only to personal growth but also to the advancement of society as a whole.');
  const [p5, setP5] = useState('Taking all these factors into account, I firmly believe that this idea should be valued and put into practice. Only by doing so can we become a better version of ourselves and embrace a more promising future.');

  useEffect(() => {
    try {
      localStorage.setItem('cet6_writing_mastery', JSON.stringify(mastered));
    } catch (e) {}
  }, [mastered]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleMastered = (idx: number) => {
    setMastered(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const selectedExam = WRITING_FRAMEWORK_DATA.realExamEssays.find(e => e.id === selectedExamId) || WRITING_FRAMEWORK_DATA.realExamEssays[0];
  const fullText = [p1, p2, p3, p4, p5].filter(Boolean).join('\n\n');
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  const masteredCount = [1, 2, 3, 4, 5].filter(i => mastered[i]).length;

  return (
    <div className="space-y-6 animate-fadeIn font-serif">
      {/* 模块顶部卡片 */}
      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-paper-border pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 border border-bamboo-200 text-xs font-bold">
                第三优先级 · 锁定 75+ 分
              </span>
              <span className="text-xs text-wood-500">引入 ➔ 个人 ➔ 他人 ➔ 社会 ➔ 总结</span>
            </div>
            <h2 className="text-xl font-bold text-wood-900">
              万能 5 段式作文体系与仿写工坊
            </h2>
            <p className="text-xs sm:text-sm text-wood-600 mt-1">
              考场直接默写固定骨架与过渡词，把带有虚线标记的插槽替换为题目核心词，180词一次成型！
            </p>
          </div>

          <div className="flex items-center bg-paper-100 p-1.5 rounded-xl border border-paper-border shrink-0 flex-wrap gap-1">
            <button
              onClick={() => setSubTab('framework')}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                subTab === 'framework'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              1. 核心默写骨架
            </button>
            <button
              onClick={() => setSubTab('drafting')}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                subTab === 'drafting'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              2. 仿写演练工坊
            </button>
            <button
              onClick={() => setSubTab('exams')}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                subTab === 'exams'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              3. 真题拆解演练
            </button>
            <button
              onClick={() => setSubTab('vocab')}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                subTab === 'vocab'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              4. 系统插空词库
            </button>
          </div>
        </div>

        {/* ================= 子标签 1: 核心默写骨架 ================= */}
        {subTab === 'framework' && (
          <div className="space-y-4 pt-1">
            {/* 默写打卡进度条 */}
            <div className="bg-paper-100 border border-paper-border rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-bamboo-700 text-white flex items-center justify-center font-mono font-bold text-xs">
                  {masteredCount}/5
                </div>
                <div>
                  <h4 className="text-xs font-bold text-wood-900">
                    5段底层默写骨架掌握进度：{Math.round((masteredCount / 5) * 100)}%
                  </h4>
                  <p className="text-[11px] text-wood-500">
                    每段可点击“标记已掌握”打卡，考前5段必须全部默写熟练！
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-40 bg-paper-300 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-bamboo-700 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(masteredCount / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3.5">
              {WRITING_FRAMEWORK_DATA.universalFiveParagraphs.map(para => {
                const isDone = !!mastered[para.paraIndex];

                return (
                  <div
                    key={para.paraIndex}
                    className={`p-4 rounded-xl border transition bg-paper-50 ${
                      isDone ? 'border-bamboo-300 ring-1 ring-bamboo-200' : 'border-paper-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center font-mono ${
                          isDone ? 'bg-bamboo-700 text-white' : 'bg-wood-800 text-white'
                        }`}>
                          {para.paraIndex}
                        </span>
                        <span className="font-bold text-xs text-wood-900">{para.layerTitle}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-paper-200 text-wood-700 rounded">
                          {para.layerBadge}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleMastered(para.paraIndex)}
                          className={`btn-tactile text-xs px-2 py-0.8 rounded-lg flex items-center space-x-1 cursor-pointer transition ${
                            isDone
                              ? 'bg-bamboo-100 text-bamboo-900 border border-bamboo-300 font-bold'
                              : 'bg-paper-200 text-wood-700 hover:bg-paper-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-bamboo-700" />
                          <span>{isDone ? '已熟记' : '标记已掌握'}</span>
                        </button>

                        <button
                          onClick={() => handleCopy(`p-${para.paraIndex}`, `${para.englishTemplate}\n\n${para.chineseTranslation}`)}
                          className="text-wood-400 hover:text-wood-700 p-1 cursor-pointer"
                          title="复制段落"
                        >
                          {copiedKey === `p-${para.paraIndex}` ? <Check className="w-3.5 h-3.5 text-bamboo-700" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="font-sans text-xs md:text-sm text-wood-900 leading-relaxed bg-paper-card p-3 rounded-lg border border-paper-border/80 mb-2">
                      {para.englishTemplate}
                    </div>

                    <div className="text-[11px] text-wood-600 pl-2 border-l-2 border-paper-border mb-2">
                      {para.chineseTranslation}
                    </div>

                    {para.fillSlots.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-paper-border/60 text-[11px]">
                        {para.fillSlots.map(s => (
                          <div key={s.slotId} className="bg-paper-card p-2 rounded border border-paper-border flex-1 min-w-[200px]">
                            <span className="font-bold text-bamboo-800 block">📌 {s.slotPrompt}</span>
                            <span className="font-sans text-wood-600 italic">示范: "{s.slotExample}"</span>
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

        {/* ================= 子标签 2: 仿写演练工坊 ================= */}
        {subTab === 'drafting' && (
          <div className="space-y-4 pt-1">
            <div className="bg-paper-100 border border-paper-border p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  wordCount >= 150 && wordCount <= 200
                    ? 'bg-bamboo-100 text-bamboo-900 border-bamboo-300'
                    : wordCount > 200
                    ? 'bg-amberGold-100 text-wood-900 border-amberGold-600'
                    : 'bg-cinnabar-50 text-cinnabar-900 border-cinnabar-200'
                }`}>
                  当前字数：{wordCount} 词
                  {wordCount >= 150 && wordCount <= 200 && ' (★ 黄金字数！)'}
                </span>
                <span className="text-[11px] text-wood-500 hidden sm:inline">六级要求：150 ~ 200 词</span>
              </div>

              <button
                onClick={() => handleCopy('full-draft', fullText)}
                className="btn-tactile bg-bamboo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer shadow-sm"
              >
                {copiedKey === 'full-draft' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>一键复制整篇作文</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-wood-800 block mb-1">
                  1. 引入段 (点题 + insightful and convincing)
                </label>
                <textarea
                  rows={2}
                  value={p1}
                  onChange={e => setP1(e.target.value)}
                  className="w-full p-2.5 bg-paper-50 border border-paper-border rounded-xl font-sans text-xs focus:outline-hidden focus:ring-1 focus:ring-bamboo-600"
                />
              </div>

              <div>
                <label className="font-bold text-wood-800 block mb-1">
                  2. 个人成长层 (First and foremost + not only... but also...)
                </label>
                <textarea
                  rows={3}
                  value={p2}
                  onChange={e => setP2(e.target.value)}
                  className="w-full p-2.5 bg-paper-50 border border-paper-border rounded-xl font-sans text-xs focus:outline-hidden focus:ring-1 focus:ring-bamboo-600"
                />
              </div>

              <div>
                <label className="font-bold text-wood-800 block mb-1">
                  3. 他人影响层 (In addition + A relevant example...)
                </label>
                <textarea
                  rows={3}
                  value={p3}
                  onChange={e => setP3(e.target.value)}
                  className="w-full p-2.5 bg-paper-50 border border-paper-border rounded-xl font-sans text-xs focus:outline-hidden focus:ring-1 focus:ring-bamboo-600"
                />
              </div>

              <div>
                <label className="font-bold text-wood-800 block mb-1">
                  4. 社会价值层 (Last but not least + contributes to the advancement of society)
                </label>
                <textarea
                  rows={2}
                  value={p4}
                  onChange={e => setP4(e.target.value)}
                  className="w-full p-2.5 bg-paper-50 border border-paper-border rounded-xl font-sans text-xs focus:outline-hidden focus:ring-1 focus:ring-bamboo-600"
                />
              </div>

              <div>
                <label className="font-bold text-wood-800 block mb-1">
                  5. 总结升华段 (Taking all these factors into account + Only by doing so...)
                </label>
                <textarea
                  rows={2}
                  value={p5}
                  onChange={e => setP5(e.target.value)}
                  className="w-full p-2.5 bg-paper-50 border border-paper-border rounded-xl font-sans text-xs focus:outline-hidden focus:ring-1 focus:ring-bamboo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 子标签 3: 真题拆解演练 ================= */}
        {subTab === 'exams' && (
          <div className="space-y-4 pt-1">
            <div className="flex flex-wrap gap-2 pb-1 border-b border-paper-border/60">
              {WRITING_FRAMEWORK_DATA.realExamEssays.map(essay => (
                <button
                  key={essay.id}
                  onClick={() => setSelectedExamId(essay.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center space-x-1 ${
                    selectedExamId === essay.id
                      ? 'bg-wood-900 text-white font-bold shadow-sm'
                      : 'bg-paper-100 text-wood-700 hover:bg-paper-200'
                  }`}
                >
                  <PenTool className="w-3 h-3" />
                  <span>{essay.title}</span>
                </button>
              ))}
            </div>

            <div className="bg-paper-50 p-3.5 rounded-xl border border-paper-border text-xs space-y-1">
              <span className="text-wood-400 font-bold block">命题方向：</span>
              <p className="text-wood-900 font-bold">{selectedExam.chineseTopic}</p>
              <p className="text-wood-600 italic font-sans">{selectedExam.examPrompt}</p>
            </div>

            <div className="space-y-3">
              {[
                { title: '第 1 段 · 引入段', eng: selectedExam.studentSampleEssay.para1Eng, chn: selectedExam.studentSampleEssay.para1Chn },
                { title: '第 2 段 · 个人成长层', eng: selectedExam.studentSampleEssay.para2Eng, chn: selectedExam.studentSampleEssay.para2Chn },
                { title: '第 3 段 · 他人影响层', eng: selectedExam.studentSampleEssay.para3Eng, chn: selectedExam.studentSampleEssay.para3Chn },
                { title: '第 4 段 · 社会价值层', eng: selectedExam.studentSampleEssay.para4Eng, chn: selectedExam.studentSampleEssay.para4Chn },
                { title: '第 5 段 · 总结升华段', eng: selectedExam.studentSampleEssay.para5Eng, chn: selectedExam.studentSampleEssay.para5Chn },
              ].map((p, i) => (
                <div key={i} className="p-3.5 bg-paper-50 rounded-xl border border-paper-border space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-wood-800">{p.title}</span>
                    <button
                      onClick={() => handleCopy(`ex-p-${i}`, p.eng)}
                      className="text-wood-400 hover:text-wood-700 p-0.5 cursor-pointer"
                    >
                      {copiedKey === `ex-p-${i}` ? <Check className="w-3.5 h-3.5 text-bamboo-700" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="font-sans text-xs md:text-sm text-wood-900 leading-relaxed bg-paper-card p-2.5 rounded border border-paper-border/60">
                    {p.eng}
                  </p>
                  <p className="text-[11px] text-wood-600 pl-2">
                    {p.chn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 子标签 4: 系统插空词库 ================= */}
        {subTab === 'vocab' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {WRITING_FRAMEWORK_DATA.pluginVocabBanks.map((bank, idx) => (
              <div key={idx} className="p-4 bg-paper-50 rounded-xl border border-paper-border space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-paper-border">
                  <div className="flex items-center space-x-1.5">
                    <span>{bank.icon}</span>
                    <span className="font-bold text-xs text-wood-900">{bank.category}</span>
                  </div>
                  <span className="text-[10px] text-wood-500">点击右侧直接复制</span>
                </div>

                <div className="space-y-2">
                  {bank.phrases.map((ph, pIdx) => (
                    <div key={pIdx} className="flex items-start justify-between gap-2 text-xs">
                      <div>
                        <div className="font-sans font-bold text-wood-900">{ph.eng}</div>
                        <div className="text-[11px] text-wood-500">{ph.chn}</div>
                      </div>
                      <button
                        onClick={() => handleCopy(`vb-${idx}-${pIdx}`, ph.eng)}
                        className="text-wood-400 hover:text-wood-700 p-0.5 cursor-pointer shrink-0"
                      >
                        {copiedKey === `vb-${idx}-${pIdx}` ? <Check className="w-3 h-3 text-bamboo-700" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
