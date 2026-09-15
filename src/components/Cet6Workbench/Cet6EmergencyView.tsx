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

export const Cet6EmergencyView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'examples' | 'fiveSteps' | 'essentialTen'>('examples');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 模拟填词试验田
  const [practiceTopic, setPracticeTopic] = useState('online learning');
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const steps = EMERGENCY_RESCUE_PACK.blankMindGuaranteedFiveSteps;
  const currentStep = steps[selectedStepIndex];
  const replacedStepEng = currentStep.eng.replace(/\[.*?\]/, practiceTopic || '[主题词]');

  return (
    <div className="space-y-6">
      {/* 顶部保底心态卡 */}
      <div className="bg-paper-card border border-paper-border rounded-2xl p-5 shadow-scholarly flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cinnabar-100 border border-cinnabar-200 flex items-center justify-center text-cinnabar-800 shadow-sm shrink-0">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-wood-900 flex items-center gap-2">
              考场保底应急锦囊
              <span className="text-xs px-2 py-0.5 rounded-full bg-cinnabar-100 text-cinnabar-800 font-sans font-medium">
                大脑卡壳急救
              </span>
            </h2>
            <p className="text-xs text-wood-600 font-serif mt-0.5">
              考场遇阻绝不慌张：举例卡壳套用固定视角，毫无头绪默写五步保底，考前20分钟熟读10句定心丸。
            </p>
          </div>
        </div>

        {/* 锦囊三子标签 */}
        <div className="flex bg-paper-100 p-1 rounded-xl border border-paper-border w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('examples')}
            className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-serif rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'examples'
                ? 'bg-paper-card text-wood-900 shadow-sm font-bold border border-paper-border'
                : 'text-wood-600 hover:text-wood-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>举例卡壳套句</span>
          </button>
          <button
            onClick={() => setActiveSubTab('fiveSteps')}
            className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-serif rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'fiveSteps'
                ? 'bg-paper-card text-wood-900 shadow-sm font-bold border border-paper-border'
                : 'text-wood-600 hover:text-wood-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>大脑空白保底5步</span>
          </button>
          <button
            onClick={() => setActiveSubTab('essentialTen')}
            className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-serif rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'essentialTen'
                ? 'bg-paper-card text-wood-900 shadow-sm font-bold border border-paper-border'
                : 'text-wood-600 hover:text-wood-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>考前20分钟必背10句</span>
          </button>
        </div>
      </div>

      {/* 模块1：举例卡壳套句 */}
      {activeSubTab === 'examples' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs font-serif text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">阅卷老师最看重什么？</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                考场写作文，第二段通常需要举例或深入阐述。很多同学想不出具体名人事迹就憋在那里。切记：六级作文考察的是语言表达与逻辑连贯，生活小事、大学日常或概括性调查都可以作为合理论据，言之成理即可给分！
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {EMERGENCY_RESCUE_PACK.exampleFallbacks.map((item, idx) => (
              <div
                key={idx}
                className="bg-paper-card border border-paper-border rounded-xl p-5 shadow-scholarly hover:border-bamboo-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-bamboo-800 bg-bamboo-50 px-2.5 py-1 rounded-md border border-bamboo-200">
                    {item.level}
                  </span>
                  <button
                    onClick={() => handleCopy(item.eng, `ex-${idx}`)}
                    className="flex items-center gap-1 text-xs font-serif px-2.5 py-1 rounded-md bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition-colors"
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

                <div className="p-3.5 bg-paper-50 rounded-lg border border-paper-border font-serif text-sm text-wood-900 leading-relaxed select-all">
                  {item.eng}
                </div>

                <div className="text-xs font-serif text-wood-600 leading-relaxed bg-paper-100/50 p-2.5 rounded-lg">
                  <span className="font-bold text-wood-800">中文拆解与适用：</span>
                  {item.chn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 模块2：大脑空白保底5步 */}
      {activeSubTab === 'fiveSteps' && (
        <div className="space-y-4 animate-fadeIn">
          {/* 主题词互动试验田 */}
          <div className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-scholarly flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-bamboo-700" />
              <span className="text-xs font-serif font-bold text-wood-900">
                套句试验田：输入当前话题词，即时生成带入效果
              </span>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-wood-600 font-serif shrink-0">话题名词：</span>
              <input
                type="text"
                value={practiceTopic}
                onChange={(e) => setPracticeTopic(e.target.value)}
                placeholder="例如 artificial intelligence / mental resilience"
                className="text-xs font-serif px-3 py-1.5 rounded-lg border border-paper-border bg-paper-50 text-wood-900 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-bamboo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedStepIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all font-serif ${
                  selectedStepIndex === idx
                    ? 'bg-bamboo-700 text-white border-bamboo-800 shadow-md scale-[1.02]'
                    : 'bg-paper-card text-wood-800 border-paper-border hover:bg-paper-100 shadow-sm'
                }`}
              >
                <div className={`text-xs font-bold ${selectedStepIndex === idx ? 'text-bamboo-100' : 'text-bamboo-800'}`}>
                  {s.step}
                </div>
                <div className={`text-xs mt-1 truncate ${selectedStepIndex === idx ? 'text-white' : 'text-wood-600'}`}>
                  {s.slotTitle}
                </div>
              </button>
            ))}
          </div>

          {/* 当前选中的步骤详解 */}
          <div className="bg-paper-card border border-paper-border rounded-xl p-5 shadow-scholarly space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-bamboo-100 text-bamboo-800 font-serif font-bold text-xs">
                  {currentStep.step}
                </span>
                <span className="text-xs font-serif text-wood-700">{currentStep.slotTitle}</span>
              </div>
              <button
                onClick={() => handleCopy(replacedStepEng, `step-${selectedStepIndex}`)}
                className="flex items-center gap-1 text-xs font-serif px-3 py-1.5 rounded-lg bg-bamboo-700 text-white hover:bg-bamboo-800 transition-colors shadow-sm"
              >
                {copiedId === `step-${selectedStepIndex}` ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已复制生成句</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制生成句</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-wood-500 font-serif">模板原句（带占位符）：</div>
              <div className="p-3 bg-paper-100 rounded-lg text-xs font-serif text-wood-700 font-mono">
                {currentStep.eng}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-bamboo-800 font-serif font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>实时替换后（考场直接默写）：</span>
              </div>
              <div className="p-4 bg-paper-50 border border-bamboo-200 rounded-lg text-sm font-serif text-wood-900 leading-relaxed select-all">
                {replacedStepEng}
              </div>
            </div>

            <div className="text-xs font-serif text-wood-600 bg-paper-100/60 p-3 rounded-lg">
              <span className="font-bold text-wood-800">对应中文考场立意：</span>
              {currentStep.chn}
            </div>
          </div>
        </div>
      )}

      {/* 模块3：考前20分钟必背10句 */}
      {activeSubTab === 'essentialTen' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-scholarly flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-bamboo-700" />
              <span className="text-xs font-serif font-bold text-wood-900">
                考前 20 分钟快速过目（包含倒装、虚拟、分词短语三大阅卷加分句式）
              </span>
            </div>
            <span className="text-xs text-wood-500 font-serif">共 10 句规范高频句型</span>
          </div>

          <div className="space-y-3">
            {EMERGENCY_RESCUE_PACK.lastTwentyMinutesEssentialTen.map((item) => (
              <div
                key={item.index}
                className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-scholarly hover:border-bamboo-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-paper-200 text-wood-800 flex items-center justify-center font-serif text-xs font-bold shrink-0 mt-0.5">
                    {item.index}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="text-sm font-serif text-wood-900 leading-relaxed select-all">
                      {item.eng}
                    </div>
                    <div className="text-xs font-serif text-wood-600">
                      {item.chn}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item.eng, `ten-${item.index}`)}
                  className="shrink-0 flex items-center gap-1 text-xs font-serif px-2.5 py-1 rounded-md bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition-colors self-end md:self-center"
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
