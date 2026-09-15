import React, { useState } from 'react';
import { QIQI_SCORE_DIAGNOSIS } from '../../data/cet6Data';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
  Check,
  Target
} from 'lucide-react';
import { Cet6ModuleId } from './Cet6Sidebar';

interface Cet6ScoreViewProps {
  activeSubSection?: string;
  onNavigateToModule?: (moduleId: Cet6ModuleId, subSection?: string) => void;
}

export const Cet6ScoreView: React.FC<Cet6ScoreViewProps> = ({
  activeSubSection = 'plan',
  onNavigateToModule,
}) => {
  // 交互式提分模拟器：默认勾选提分效率最高的前三项 (选词 +14, 写作 +20, 翻译 +16 = +50分，总分 438)
  const [selectedGains, setSelectedGains] = useState<Record<string, boolean>>({
    '选词填空 (Section A)': true,
    '写作模块 (Writing)': true,
    '翻译模块 (Translation)': true,
    '长篇阅读与仔细阅读 (Reading)': false,
    '听力理解 (Listening)': false,
  });

  const baseScore = 388;
  const targetScore = 425;

  const gainValues: Record<string, { gain: number; targetModule: Cet6ModuleId; sub: string }> = {
    '选词填空 (Section A)': { gain: 14, targetModule: 'cloze', sub: 'pos' },
    '写作模块 (Writing)': { gain: 20, targetModule: 'writing', sub: 'template' },
    '翻译模块 (Translation)': { gain: 16, targetModule: 'translation', sub: 'practice' },
    '长篇阅读与仔细阅读 (Reading)': { gain: 11, targetModule: 'syntax', sub: 'step1' },
    '听力理解 (Listening)': { gain: 5, targetModule: 'score', sub: 'time' },
  };

  const totalProjectedGain = Object.entries(selectedGains).reduce((sum, [key, isChecked]) => {
    return isChecked ? sum + (gainValues[key]?.gain || 0) : sum;
  }, 0);

  const projectedScore = baseScore + totalProjectedGain;
  const isPassed = projectedScore >= targetScore;

  const toggleGain = (key: string) => {
    setSelectedGains((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 font-serif">
      {/* 动态提分推演器：动手勾选算账 */}
      {activeSubSection === 'plan' && (
        <div className="space-y-5 animate-card-enter">
          {/* 顶部互动算账卡片 */}
          <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly card-planning">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-paper-border">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
                    琪琪专属算账
                  </span>
                  <span className="text-xs text-wood-500">上次 388 分 ➔ 及格线 425 分</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-wood-900">
                  勾选下面你想攻克的题，看看能考多少分：
                </h2>
              </div>

              {/* 实时动态总分徽章 */}
              <div className="flex items-center space-x-3 bg-paper-50 p-3 rounded-xl border border-paper-border self-start md:self-auto shrink-0">
                <div className="text-right">
                  <div className="text-[11px] text-wood-500">预计得分</div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-wood-900">
                    {projectedScore}{' '}
                    <span className="text-xs font-serif text-cinnabar-700 font-normal">分</span>
                  </div>
                </div>
                <div
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isPassed
                      ? 'bg-bamboo-700 text-white shadow-xs animate-bounce-gentle'
                      : 'bg-paper-200 text-wood-700'
                  }`}
                >
                  {isPassed ? (
                    <span className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>稳过及格线！(+{projectedScore - targetScore}分)</span>
                    </span>
                  ) : (
                    <span>还差 {targetScore - projectedScore} 分及格</span>
                  )}
                </div>
              </div>
            </div>

            {/* 动态进度条 */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-wood-600">
                <span>起步 388 分</span>
                <span className="font-bold text-bamboo-800">
                  当前勾选预计：+{totalProjectedGain} 分 ➔ {projectedScore} 分
                </span>
                <span className="font-bold text-cinnabar-800">及格线 425 分</span>
              </div>
              <div className="w-full h-3.5 bg-paper-200 rounded-full overflow-hidden p-0.5 border border-paper-border">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isPassed ? 'bg-bamboo-700' : 'bg-cinnabar-600'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(10, ((projectedScore - 350) / (450 - 350)) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 提分模块卡片：极简短句，人人看得懂 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-wood-800 flex items-center space-x-1.5 px-1">
              <Sparkles className="w-4 h-4 text-bamboo-700" />
              <span>各题型怎么拿分（点击卡片勾选，直接去练）：</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {QIQI_SCORE_DIAGNOSIS.tacticalPlan.map((item) => {
                const isChecked = Boolean(selectedGains[item.module]);
                const meta = gainValues[item.module];

                return (
                  <div
                    key={item.module}
                    onClick={() => toggleGain(item.module)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer card-planning select-none flex flex-col justify-between ${
                      isChecked
                        ? 'bg-paper-50 border-bamboo-600 shadow-md ring-1 ring-bamboo-600/30'
                        : 'bg-paper-card border-paper-border opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* 标题行与打勾选择框 */}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-wood-900 truncate">
                          {item.module}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-bamboo-700 border-bamboo-800 text-white'
                              : 'border-wood-400 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      {/* 目标分数与增分 */}
                      <div className="flex items-baseline justify-between text-xs bg-paper-100 p-2 rounded-lg border border-paper-border/60">
                        <span className="text-wood-600">{item.currentScore}</span>
                        <span className="font-bold text-wood-900">➔ {item.targetScore}</span>
                        <span className="font-bold text-cinnabar-800 font-mono">
                          +{meta?.gain || item.pointsGain}分
                        </span>
                      </div>

                      {/* 说话极度接地气：之前丢分 & 这次做法 */}
                      <div className="space-y-1.5 text-xs text-wood-700">
                        <div className="flex items-start space-x-1.5">
                          <span className="text-wood-400 shrink-0 mt-0.5">•</span>
                          <p>
                            <strong className="text-wood-800">以前问题：</strong>
                            {item.coreProblem}
                          </p>
                        </div>
                        <div className="flex items-start space-x-1.5 bg-paper-card p-2 rounded-lg border border-paper-border">
                          <span className="text-bamboo-700 shrink-0 mt-0.5">✓</span>
                          <p className="text-wood-900 leading-relaxed font-bold">
                            <strong className="text-bamboo-800 font-bold">现在做法：</strong>
                            {item.breakthroughStrategy}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 立即去练按键 */}
                    {meta && onNavigateToModule && (
                      <div className="mt-3 pt-2.5 border-t border-paper-border/80 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToModule(meta.targetModule, meta.sub);
                          }}
                          className="text-xs text-bamboo-800 hover:text-bamboo-900 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                        >
                          <span>立即去练这部分</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 考场130分钟时间表 */}
      {activeSubSection === 'time' && (
        <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly space-y-4 animate-card-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-border pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-bamboo-700" />
              <h3 className="font-bold text-base text-wood-900">
                考场 130 分钟时间表（分秒必争，绝不乱了阵脚）
              </h3>
            </div>
            <span className="text-xs text-cinnabar-800 font-bold">
              选词填空只做 4 分钟 · 听力必须边听边涂卡
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper-100 text-wood-800 font-bold border-b border-paper-border">
                  <th className="py-2.5 px-3">考场环节</th>
                  <th className="py-2.5 px-3">时间段</th>
                  <th className="py-2.5 px-3">时长</th>
                  <th className="py-2.5 px-3">该干什么（简明直白）</th>
                  <th className="py-2.5 px-3 text-cinnabar-800">重要提醒</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-border">
                {QIQI_SCORE_DIAGNOSIS.timeManagementRules.map((r, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-paper-50 transition-colors ${
                      r.stage.includes('仔细阅读') || r.stage.includes('选词填空')
                        ? 'bg-paper-50/60 font-medium'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-wood-900 whitespace-nowrap">
                      {r.stage}
                    </td>
                    <td className="py-3 px-3 text-wood-600 font-mono whitespace-nowrap">
                      {r.timeRange}
                    </td>
                    <td className="py-3 px-3 text-wood-500 whitespace-nowrap">
                      {r.durationMinutes} 分钟
                    </td>
                    <td className="py-3 px-3 text-wood-900 leading-relaxed max-w-sm">
                      {r.action}
                    </td>
                    <td className="py-3 px-3 text-cinnabar-800 font-bold leading-relaxed max-w-xs">
                      {r.examinerWarning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
