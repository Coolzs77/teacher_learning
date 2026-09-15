import React, { useState, useEffect } from 'react';
import { WRITING_FRAMEWORK_DATA } from '../../data/cet6Data';
import {
  PenTool,
  Check,
  Copy,
  BookOpen,
  Sparkles,
  Award,
  CheckCircle2,
  RotateCcw,
  Edit3
} from 'lucide-react';

interface Cet6WritingViewProps {
  activeSubSection?: string;
}

export const Cet6WritingView: React.FC<Cet6WritingViewProps> = ({
  activeSubSection = 'template',
}) => {
  const currentSub = (activeSubSection === 'template'
    ? 'framework'
    : activeSubSection === 'drafting'
    ? 'drafting'
    : activeSubSection === 'essays'
    ? 'exams'
    : 'vocab') as 'framework' | 'drafting' | 'exams' | 'vocab';

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
    setMastered((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const selectedExam = WRITING_FRAMEWORK_DATA.realExamEssays.find((e) => e.id === selectedExamId) || WRITING_FRAMEWORK_DATA.realExamEssays[0];
  const fullText = [p1, p2, p3, p4, p5].filter(Boolean).join('\n\n');
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  const masteredCount = [1, 2, 3, 4, 5].filter((i) => mastered[i]).length;

  return (
    <div className="space-y-6 font-serif">
      {/* 1. 核心背诵框架 */}
      {currentSub === 'framework' && (
        <div className="space-y-5 animate-card-enter">
          {/* 背诵打卡进度卡片 */}
          <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly card-planning">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-paper-border pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
                    考前必背
                  </span>
                  <span className="text-xs text-wood-500">考场直接往里填词，180词写满</span>
                </div>
                <h3 className="font-bold text-lg text-wood-900 mt-1">
                  作文 5 段思路：引言 ➔ 个人 ➔ 他人 ➔ 社会 ➔ 总结
                </h3>
              </div>

              <div className="flex items-center space-x-2 bg-paper-50 px-3.5 py-2 rounded-xl border border-paper-border self-start sm:self-auto">
                <span className="text-xs text-wood-600">背诵进度：</span>
                <span className="text-base font-mono font-bold text-bamboo-800">
                  {masteredCount} / 5 段
                </span>
                <span className="text-xs text-cinnabar-800 font-bold">
                  ({Math.round((masteredCount / 5) * 100)}%)
                </span>
              </div>
            </div>

            {/* 逐段卡片展示与打卡 */}
            <div className="space-y-3.5 mt-4">
              {WRITING_FRAMEWORK_DATA.universalFiveParagraphs.map((para) => {
                const isDone = Boolean(mastered[para.paraIndex]);

                return (
                  <div
                    key={para.paraIndex}
                    className={`p-4 rounded-xl border transition-all card-writing space-y-3 ${
                      isDone
                        ? 'bg-paper-50 border-bamboo-400/80'
                        : 'bg-paper-card border-paper-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-wood-800 text-paper-50 font-bold">
                          第 {para.paraIndex} 段
                        </span>
                        <span className="text-xs font-bold text-wood-900">
                          {para.layerTitle}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopy(`para-${para.paraIndex}`, para.englishTemplate)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition cursor-pointer flex items-center space-x-1"
                        >
                          {copiedKey === `para-${para.paraIndex}` ? (
                            <>
                              <Check className="w-3 h-3 text-bamboo-700" />
                              <span className="text-bamboo-800 font-bold">已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>复制</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => toggleMastered(para.paraIndex)}
                          className={`text-xs px-3 py-1 rounded-lg font-bold transition flex items-center space-x-1 cursor-pointer ${
                            isDone
                              ? 'bg-bamboo-700 text-white shadow-xs'
                              : 'bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isDone ? '已背熟 ✓' : '标记已背熟'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-paper-50 rounded-lg border border-paper-border text-xs sm:text-sm text-wood-900 leading-relaxed font-serif select-all">
                      {para.englishTemplate}
                    </div>

                    <div className="text-xs text-wood-600 bg-paper-100/60 p-2.5 rounded-lg leading-relaxed">
                      <span className="font-bold text-wood-800">中文思路：</span>
                      {para.chineseTranslation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. 在线试写练习（实时计词） */}
      {currentSub === 'drafting' && (
        <div className="space-y-5 animate-card-enter">
          <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly card-writing space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-paper-border pb-4">
              <div>
                <h3 className="font-bold text-base text-wood-900">
                  在线填词实战（把题目给的词填进去，看看字数够不够）
                </h3>
                <p className="text-xs text-wood-600 mt-0.5">
                  六级要求 150 - 200 词，写够 180 词最稳妥。
                </p>
              </div>

              {/* 实时字数监控 */}
              <div className="flex items-center space-x-3 bg-paper-50 px-4 py-2.5 rounded-xl border border-paper-border self-start sm:self-auto shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-wood-500">当前总字数</div>
                  <div className="text-2xl font-bold font-mono text-wood-900">{wordCount}</div>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    wordCount >= 150 && wordCount <= 220
                      ? 'bg-bamboo-700 text-white'
                      : wordCount < 150
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-cinnabar-100 text-cinnabar-800'
                  }`}
                >
                  {wordCount >= 150 && wordCount <= 220
                    ? '字数达标！(150~200词)'
                    : wordCount < 150
                    ? `还差 ${150 - wordCount} 词及格`
                    : '略长，建议适当删减'}
                </div>
              </div>
            </div>

            {/* 作文话题输入 */}
            <div className="space-y-1 bg-paper-50 p-3 rounded-xl border border-paper-border">
              <label className="text-xs text-wood-600 font-bold">试卷给出的题目/核心话题：</label>
              <input
                type="text"
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                placeholder="例如 The Importance of Persistence..."
                className="w-full px-3 py-1.5 bg-paper-card border border-paper-border rounded-lg text-xs font-serif text-wood-900 focus:outline-none focus:ring-1 focus:ring-bamboo-600"
              />
            </div>

            {/* 5 段输入框 */}
            <div className="space-y-3 pt-2">
              {[
                { title: '第 1 段：引言段（亮明话题与态度）', val: p1, set: setP1 },
                { title: '第 2 段：对个人（学到能力、不怕挫折）', val: p2, set: setP2 },
                { title: '第 3 段：对他人（树立榜样 + 举个生活小例子）', val: p3, set: setP3 },
                { title: '第 4 段：对社会（长远社会价值与推动力）', val: p4, set: setP4 },
                { title: '第 5 段：结尾段（总结呼吁与展望）', val: p5, set: setP5 },
              ].map((sec, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-wood-800">{sec.title}</span>
                    <span className="text-wood-400 font-mono">
                      {sec.val.trim() ? sec.val.trim().split(/\s+/).length : 0} 词
                    </span>
                  </div>
                  <textarea
                    value={sec.val}
                    onChange={(e) => sec.set(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-paper-50 border border-paper-border rounded-xl text-xs sm:text-sm font-serif text-wood-900 focus:outline-none focus:ring-2 focus:ring-bamboo-500/30 focus:border-bamboo-600 transition"
                  />
                </div>
              ))}
            </div>

            {/* 一键拷贝全文 */}
            <div className="flex justify-between items-center pt-3 border-t border-paper-border">
              <button
                onClick={() => {
                  setP1('');
                  setP2('');
                  setP3('');
                  setP4('');
                  setP5('');
                }}
                className="px-3 py-1.5 rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 text-xs border border-paper-border transition cursor-pointer flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>清空重新写</span>
              </button>

              <button
                onClick={() => handleCopy('fullEssay', fullText)}
                className="px-4 py-2 rounded-xl bg-bamboo-700 hover:bg-bamboo-800 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                {copiedKey === 'fullEssay' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已复制全文 180 词</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制整篇作文（考场模拟）</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 真题范文参考 */}
      {currentSub === 'exams' && (
        <div className="space-y-4 animate-card-enter">
          {/* 真题切换选择器 */}
          <div className="bg-paper-card p-3 rounded-2xl border border-paper-border shadow-scholarly flex flex-wrap gap-2">
            {WRITING_FRAMEWORK_DATA.realExamEssays.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedExamId === exam.id
                    ? 'bg-bamboo-700 text-white shadow-xs'
                    : 'bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border'
                }`}
              >
                {exam.title}
              </button>
            ))}
          </div>

          <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly card-planning space-y-4">
            <div className="border-b border-paper-border pb-3">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
                {selectedExam.chineseTopic}
              </span>
              <h3 className="font-bold text-base text-wood-900 mt-1">
                题目要求：{selectedExam.examPrompt}
              </h3>
            </div>

            {/* 5 段范文逐段展示 */}
            <div className="space-y-3">
              {[
                { label: '第 1 段 (引出话题)', eng: selectedExam.studentSampleEssay.para1Eng, chn: selectedExam.studentSampleEssay.para1Chn },
                { label: '第 2 段 (个人成长)', eng: selectedExam.studentSampleEssay.para2Eng, chn: selectedExam.studentSampleEssay.para2Chn },
                { label: '第 3 段 (他人影响与日常举例)', eng: selectedExam.studentSampleEssay.para3Eng, chn: selectedExam.studentSampleEssay.para3Chn },
                { label: '第 4 段 (社会长远价值)', eng: selectedExam.studentSampleEssay.para4Eng, chn: selectedExam.studentSampleEssay.para4Chn },
                { label: '第 5 段 (总结展望)', eng: selectedExam.studentSampleEssay.para5Eng, chn: selectedExam.studentSampleEssay.para5Chn },
              ].map((item, i) => (
                <div key={i} className="p-3.5 bg-paper-50 rounded-xl border border-paper-border space-y-1.5 card-writing">
                  <div className="text-xs font-bold text-bamboo-800">{item.label}</div>
                  <div className="text-xs sm:text-sm text-wood-900 leading-relaxed select-all">
                    {item.eng}
                  </div>
                  <div className="text-xs text-wood-500 pt-1 border-t border-paper-border/60">
                    {item.chn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. 常用替换好词 */}
      {currentSub === 'vocab' && (
        <div className="space-y-4 animate-card-enter">
          <div className="bg-paper-card rounded-2xl p-4 sm:p-5 border border-paper-border shadow-scholarly">
            <h3 className="font-bold text-base text-wood-900">
              作文提分加分词（挑一两个写进去，阅卷老师给分更高）
            </h3>
            <p className="text-xs text-wood-600 mt-0.5">
              点击词组可直接复制，替换到上面的填词练习框里。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {WRITING_FRAMEWORK_DATA.pluginVocabBanks.map((cat, idx) => (
              <div
                key={idx}
                className="bg-paper-card rounded-xl p-4 border border-paper-border shadow-scholarly card-vocab space-y-3"
              >
                <div className="flex items-center space-x-2 border-b border-paper-border pb-2">
                  <span className="text-base">{cat.icon}</span>
                  <h4 className="font-bold text-xs text-wood-900">{cat.category}</h4>
                </div>

                <div className="space-y-1.5">
                  {cat.phrases.map((p, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => handleCopy(`vocab-${idx}-${pIdx}`, p.eng)}
                      className="p-2 bg-paper-50 hover:bg-paper-100 rounded-lg border border-paper-border transition cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold font-mono text-wood-900">{p.eng}</div>
                        <div className="text-[11px] text-wood-500">{p.chn}</div>
                      </div>
                      <span className="text-[10px] text-wood-400">
                        {copiedKey === `vocab-${idx}-${pIdx}` ? '已复制' : '复制'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
