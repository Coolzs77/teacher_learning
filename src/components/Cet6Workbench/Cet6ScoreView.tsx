import React from 'react';
import { QIQI_SCORE_DIAGNOSIS } from '../../data/cet6Data';
import { Target, TrendingUp, Clock, AlertTriangle, Sparkles, CheckCircle2, Award, ArrowRight } from 'lucide-react';

interface Cet6ScoreViewProps {
  onQuickJump?: (moduleId: string) => void;
}

export const Cet6ScoreView: React.FC<Cet6ScoreViewProps> = ({ onQuickJump }) => {
  const { candidateName, historyScores, targetScore, gapScore, tacticalPlan, timeManagementRules } = QIQI_SCORE_DIAGNOSIS;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部成绩看板 */}
      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-paper-border pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 border border-bamboo-200 text-xs font-serif font-bold">
                {candidateName}专属成绩实录
              </span>
              <span className="text-xs text-wood-400 font-serif">|</span>
              <span className="text-xs text-wood-600 font-serif">目标：一次性稳过 425 分及格线</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-wood-900 font-serif">
              六级 388 分 ➔ 425+ 分 提分明白账
            </h2>
            <p className="text-xs sm:text-sm text-wood-600 font-serif mt-1">
              距离 425 分还差 <strong className="text-cinnabar-800 text-base">+{gapScore} 分</strong>。阅读已有 164 分的基础，只要把以前完全放弃的选词填空（捡回14分）、翻译套用万能句型（提16分）、作文写好5段（提20分），总分完全可以冲到 435 分以上！
            </p>
          </div>

          {/* 进度柱状条 */}
          <div className="bg-paper-100 p-4 rounded-xl border border-paper-border shrink-0 min-w-[260px] space-y-2.5">
            <div className="flex justify-between text-xs font-serif text-wood-700">
              <span>上次考分 (2026.06)</span>
              <span className="font-bold text-wood-900">388 分</span>
            </div>
            <div className="w-full bg-paper-300 rounded-full h-2 overflow-hidden">
              <div className="bg-wood-600 h-2 rounded-full" style={{ width: `${(388 / 710) * 100}%` }}></div>
            </div>

            <div className="flex justify-between text-xs font-serif text-bamboo-800 font-bold">
              <span>本次及格线目标</span>
              <span>425 分 (+37分)</span>
            </div>
            <div className="w-full bg-paper-300 rounded-full h-2 overflow-hidden">
              <div className="bg-bamboo-700 h-2 rounded-full" style={{ width: `${(425 / 710) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* 琪琪极简备考三句心法 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-paper-50 p-3.5 rounded-xl border border-paper-border space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-wood-900 font-serif">
              <CheckCircle2 className="w-3.5 h-3.5 text-bamboo-700" />
              <span>1. 单词继续用百词斩刷</span>
            </div>
            <p className="text-[11px] text-wood-600 font-serif leading-relaxed">
              碎片时间背完即可，不用在这上面抄写。遇到长难句抓主干，不用每个词都认识。
            </p>
          </div>

          <div className="bg-paper-50 p-3.5 rounded-xl border border-paper-border space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-wood-900 font-serif">
              <CheckCircle2 className="w-3.5 h-3.5 text-bamboo-700" />
              <span>2. 选词填空绝不全蒙一个字母</span>
            </div>
            <p className="text-[11px] text-wood-600 font-serif leading-relaxed">
              花 4 分钟看词尾（-tion是名词、-ize是动词），挑 3~4 个送分空，14.2 分直接拿走！
            </p>
          </div>

          <div className="bg-paper-50 p-3.5 rounded-xl border border-paper-border space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-wood-900 font-serif">
              <CheckCircle2 className="w-3.5 h-3.5 text-bamboo-700" />
              <span>3. 作文背熟5段万能框架</span>
            </div>
            <p className="text-[11px] text-wood-600 font-serif leading-relaxed">
              个人段、他人段、社会段承上启下词背熟，考场直接往里填题目给的词，180词稳稳成型。
            </p>
          </div>
        </div>
      </div>

      {/* 各题型真实提分产出表 */}
      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly space-y-4">
        <div className="flex items-center space-x-2 border-b border-paper-border pb-3">
          <TrendingUp className="w-4 h-4 text-bamboo-700" />
          <h3 className="font-serif font-bold text-base text-wood-900">
            各题型提分产出表（哪块好拿分，就先抓哪块）
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {tacticalPlan.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition bg-paper-50/80 ${
                item.roiLevel.includes('极高')
                  ? 'border-cinnabar-200 ring-1 ring-cinnabar-200/50'
                  : 'border-paper-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-sm text-wood-900">{item.module}</span>
                <span
                  className={`text-[10px] font-serif font-medium px-2 py-0.5 rounded-full ${
                    item.roiLevel.includes('极高')
                      ? 'bg-cinnabar-50 text-cinnabar-800 border border-cinnabar-200'
                      : 'bg-paper-200 text-wood-700'
                  }`}
                >
                  {item.roiLevel.includes('极高') ? '★ 重点提分' : '稳扎稳打'}
                </span>
              </div>

              <div className="flex items-baseline space-x-2 text-xs mb-2.5">
                <span className="text-wood-500">现状: {item.currentScore}</span>
                <span className="text-bamboo-800 font-bold">➔ 目标: {item.targetScore}</span>
                <span className="ml-auto font-bold text-cinnabar-800 bg-cinnabar-50 px-1.5 py-0.2 rounded font-mono">
                  {item.pointsGain}
                </span>
              </div>

              <div className="text-xs text-wood-600 space-y-1.5 pt-2 border-t border-paper-border/60">
                <p>
                  <strong className="text-wood-800">症结：</strong>
                  {item.coreProblem}
                </p>
                <p className="bg-paper-card p-2 rounded-lg border border-paper-border leading-relaxed text-wood-800">
                  <strong className="text-bamboo-800">打法：</strong>
                  {item.breakthroughStrategy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 考场 130 分钟答题时间分配表 */}
      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly space-y-4">
        <div className="flex items-center justify-between border-b border-paper-border pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-bamboo-700" />
            <h3 className="font-serif font-bold text-base text-wood-900">
              考场 130 分钟分秒必争时间分配表
            </h3>
          </div>
          <span className="text-xs text-cinnabar-800 font-serif">
            选词填空绝不死磕超 5 分钟 · 听力必须边听边涂卡
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-serif">
            <thead>
              <tr className="bg-paper-100 text-wood-800 font-bold border-b border-paper-border">
                <th className="py-2.5 px-3">答题环节</th>
                <th className="py-2.5 px-3">时间段</th>
                <th className="py-2.5 px-3">耗时</th>
                <th className="py-2.5 px-3">考场动作</th>
                <th className="py-2.5 px-3">注意红线</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-border text-wood-700">
              {timeManagementRules.map((rule, idx) => (
                <tr key={idx} className="hover:bg-paper-50 transition">
                  <td className="py-2.5 px-3 font-bold text-wood-900 whitespace-nowrap">
                    {rule.stage}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-bamboo-800 whitespace-nowrap">
                    {rule.timeRange}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 bg-paper-200 rounded text-wood-800 font-mono">
                      {rule.durationMinutes} 分钟
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-wood-800 leading-relaxed max-w-sm">
                    {rule.action}
                  </td>
                  <td className="py-2.5 px-3 text-cinnabar-800 bg-cinnabar-50/40 max-w-xs">
                    <div className="flex items-start space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-cinnabar-700 shrink-0 mt-0.5" />
                      <span>{rule.examinerWarning}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
