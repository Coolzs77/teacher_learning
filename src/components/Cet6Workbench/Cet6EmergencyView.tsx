import React, { useState } from 'react';
import { EMERGENCY_RESCUE_PACK } from '../../data/cet6Data';
import {
  LifeBuoy,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  PenTool,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface Cet6EmergencyViewProps {
  activeSubSection?: string;
}

export const Cet6EmergencyView: React.FC<Cet6EmergencyViewProps> = ({
  activeSubSection = 'examples',
}) => {
  const currentSub = (activeSubSection === 'fiveSteps'
    ? 'fiveSteps'
    : activeSubSection === 'essentialTen'
    ? 'essentialTen'
    : 'examples') as 'examples' | 'fiveSteps' | 'essentialTen';

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [practiceTopic, setPracticeTopic] = useState('online learning');
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const steps = EMERGENCY_RESCUE_PACK.blankMindGuaranteedFiveSteps;
  const currentStep = steps[selectedStepIndex];
  const replacedStepEng = currentStep.eng.replace(/\[.*?\]/, practiceTopic || '[话题词]');

  return (
    <div className="space-y-6 font-serif">
      {/* 模块 1：举例卡壳套句 */}
      {currentSub === 'examples' && (
        <div className="space-y-4 animate-card-enter">
          {/* 学长实在提醒 */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-xs text-amber-900 flex items-start space-x-3 card-rescue">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">💡 学长提醒：想不出名人名事，千万别在考场硬憋！</p>
              <p className="text-amber-800 leading-relaxed">
                六级作文主要看句子通不通顺、词汇准不准确。写自己大学生活、写身边普通人的小事，或者调查研究，言之有理即可拿满论证分！
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {EMERGENCY_RESCUE_PACK.exampleFallbacks.map((item, idx) => (
              <div
                key={idx}
                className="bg-paper-card border border-paper-border rounded-xl p-5 shadow-scholarly card-vocab space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-bamboo-800 bg-bamboo-50 px-2.5 py-1 rounded-md border border-bamboo-200">
                    {item.level}
                  </span>
                  <button
                    onClick={() => handleCopy(item.eng, `ex-${idx}`)}
                    className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition cursor-pointer"
                  >
                    {copiedId === `ex-${idx}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-bamboo-700" />
                        <span className="text-bamboo-800 font-bold">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制英文</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 bg-paper-50 rounded-lg border border-paper-border text-xs sm:text-sm text-wood-900 leading-relaxed select-all">
                  {item.eng}
                </div>

                <div className="text-xs text-wood-600 bg-paper-100/50 p-2.5 rounded-lg">
                  <strong className="text-wood-800">适用话题：</strong>
                  {item.chn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 模块 2：大脑空白保底 5 步法 */}
      {currentSub === 'fiveSteps' && (
        <div className="space-y-4 animate-card-enter">
          {/* 实时填词试验 */}
          <div className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-scholarly flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-planning">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-bamboo-700" />
              <span className="text-xs font-bold text-wood-900">
                套句试验田：输入题目话题词，看整句替换效果
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-wood-500 shrink-0">话题词：</span>
              <input
                type="text"
                value={practiceTopic}
                onChange={(e) => setPracticeTopic(e.target.value)}
                placeholder="例如 artificial intelligence / mental health"
                className="text-xs px-3 py-1.5 rounded-lg border border-paper-border bg-paper-50 text-wood-900 w-full sm:w-60 focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
              />
            </div>
          </div>

          {/* 5 步步骤条 */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedStepIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedStepIndex === idx
                    ? 'bg-bamboo-700 text-white border-bamboo-800 shadow-xs'
                    : 'bg-paper-card text-wood-800 border-paper-border hover:bg-paper-100'
                }`}
              >
                <div className={`text-xs font-bold ${selectedStepIndex === idx ? 'text-bamboo-100' : 'text-bamboo-800'}`}>
                  {s.step}
                </div>
                <div className={`text-[11px] truncate mt-0.5 ${selectedStepIndex === idx ? 'text-white' : 'text-wood-500'}`}>
                  {s.slotTitle}
                </div>
              </button>
            ))}
          </div>

          {/* 当前步骤详解卡片 */}
          <div className="bg-paper-card border border-paper-border rounded-xl p-5 shadow-scholarly card-writing space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-bamboo-100 text-bamboo-800 font-bold text-xs">
                {currentStep.step} · {currentStep.slotTitle}
              </span>
              <button
                onClick={() => handleCopy(replacedStepEng, `step-${selectedStepIndex}`)}
                className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-lg bg-bamboo-700 text-white hover:bg-bamboo-800 transition cursor-pointer shadow-xs"
              >
                {copiedId === `step-${selectedStepIndex}` ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制这句</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-wood-500">考场可直接默写这句：</div>
              <div className="p-3.5 bg-paper-50 border border-bamboo-200 rounded-xl text-xs sm:text-sm text-wood-900 leading-relaxed select-all font-bold">
                {replacedStepEng}
              </div>
            </div>

            <div className="text-xs text-wood-600 bg-paper-100/60 p-2.5 rounded-lg">
              <strong className="text-wood-800">中文意思：</strong>
              {currentStep.chn}
            </div>
          </div>
        </div>
      )}

      {/* 模块 3：考前 20 分钟必背 10 句 */}
      {currentSub === 'essentialTen' && (
        <div className="space-y-4 animate-card-enter">
          <div className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-scholarly flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-bamboo-700" />
              <span className="text-xs font-bold text-wood-900">
                考前 20 分钟快速过目（倒装、虚拟、分词短语加分句）
              </span>
            </div>
            <span className="text-xs text-wood-500">共 10 句</span>
          </div>

          <div className="space-y-2.5">
            {EMERGENCY_RESCUE_PACK.lastTwentyMinutesEssentialTen.map((item) => (
              <div
                key={item.index}
                className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-scholarly card-vocab flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-paper-200 text-wood-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {item.index}
                  </span>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="text-xs sm:text-sm text-wood-900 leading-relaxed font-bold select-all">
                      {item.eng}
                    </div>
                    <div className="text-xs text-wood-500">{item.chn}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item.eng, `ten-${item.index}`)}
                  className="shrink-0 flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition cursor-pointer self-end sm:self-center"
                >
                  {copiedId === `ten-${item.index}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-bamboo-700" />
                      <span className="text-bamboo-800 font-bold">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
