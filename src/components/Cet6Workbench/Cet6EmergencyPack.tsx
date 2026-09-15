import React, { useState } from 'react';
import { EMERGENCY_PACK_DATA } from '../../data/cet6Data';
import { ShieldAlert, Copy, Check, Clock, AlertOctagon, HeartHandshake, Sparkles } from 'lucide-react';

export const Cet6EmergencyPack: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 顶部醒目标识 */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-rose-950 font-serif">
              考场急救包与考前 20 分钟冲刺锦囊
            </h2>
            <p className="text-xs text-rose-800/80">
              当紧张、卡壳、大脑空白时，深呼吸！照着这里的保底方案写，保住基本盘分！
            </p>
          </div>
        </div>
      </div>

      {/* 一、举例卡壳急救 */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800">一、 举例卡壳急救 (A relevant example...)</h3>
        </div>
        <p className="text-xs text-slate-500">
          考场上写例子千万不要去苦想具体的人名、地名或编造复杂的虚构故事。直接背诵以下万能抽象概括句作为举例段结尾：
        </p>

        <div className="space-y-3">
          {EMERGENCY_PACK_DATA.exampleFallbacks.map((ex, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {ex.level}
                </span>
                <button
                  onClick={() => handleCopy(`ex-${idx}`, ex.eng)}
                  className="text-xs text-slate-400 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer p-1"
                >
                  {copiedKey === `ex-${idx}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制句子</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-serif text-sm md:text-base font-bold text-indigo-950 mb-1">
                {ex.eng}
              </div>
              <div className="text-xs text-slate-500">
                {ex.chn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 二、大脑彻底空白保底套句 */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          <h3 className="text-base font-bold text-slate-800">二、 考场大脑彻底空白保底 5 步套句</h3>
        </div>
        <p className="text-xs text-slate-500">
          如果不幸完全看不懂具体背景，请按顺序依次将以下 5 个句子填入 5 段骨架中。它们语法绝对自洽且主题中立，能保住稳健基本分：
        </p>

        <div className="space-y-3">
          {EMERGENCY_PACK_DATA.blankMindGuaranteedFiveSteps.map((b, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
                  {b.step} · {b.slotTitle}
                </span>
                <button
                  onClick={() => handleCopy(`blank-${idx}`, b.eng)}
                  className="text-xs text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                >
                  {copiedKey === `blank-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="font-serif text-sm font-bold text-slate-900 mb-1">
                {b.eng}
              </div>
              <div className="text-xs text-slate-500">
                {b.chn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 三、考前最后 20 分钟必背 10 句 */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">三、 考前最后 20 分钟必背 10 句</h3>
          </div>
          <button
            onClick={() => {
              const fullText = EMERGENCY_PACK_DATA.lastTwentyMinutesEssentialTen
                .map(t => `${t.index}. ${t.eng}\n   ${t.chn}`)
                .join('\n\n');
              handleCopy('all-ten', fullText);
            }}
            className="btn-tactile text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
          >
            {copiedKey === 'all-ten' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>一键复制全部10句</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {EMERGENCY_PACK_DATA.lastTwentyMinutesEssentialTen.map((sen) => (
            <div key={sen.index} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {sen.index}
                </span>
                <div>
                  <div className="font-serif text-sm md:text-base font-medium text-slate-900">
                    {sen.eng}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {sen.chn}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(`sen-${sen.index}`, sen.eng)}
                className="shrink-0 text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
              >
                {copiedKey === `sen-${sen.index}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
