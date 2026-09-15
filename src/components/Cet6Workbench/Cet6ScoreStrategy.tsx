import React from 'react';
import { QIQI_SCORE_DIAGNOSIS, BANKED_CLOZE_RULES } from '../../data/cet6Data';
import { Target, TrendingUp, Clock, AlertTriangle, CheckCircle2, Zap, Award, Sparkles } from 'lucide-react';

export const Cet6ScoreStrategy: React.FC = () => {
  const { candidateName, historyScores, targetScore, gapScore, tacticalPlan, timeManagementRules } = QIQI_SCORE_DIAGNOSIS;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 顶部战报卡片：成绩诊断与差距分析 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-full border border-rose-500/30 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>{candidateName}专属 · 提分精密作战方案</span>
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                及格线 425 分 · 目标突破
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              六级 388 分 ➔ 425+ 分 逆袭攻坚模型
            </h2>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl leading-relaxed font-sans">
              经过两次实战积累，阅读基础已稳步攀升至 <strong className="text-white">164 分</strong>。距离 425 及格线仅差 <strong className="text-amber-400 text-lg">+{gapScore} 分</strong>！
              通过激活此前完全放弃的选词填空（+14分）、套用五段万能骨架与插空词库锁定写作（+20分）、活用10大句型攻克翻译（+16分），
              预计总提分空间高达 <strong className="text-emerald-400 text-lg">+{14 + 20 + 16} 分</strong>，冲刺 <strong className="text-emerald-300 text-lg">435~445 分</strong> 胜券在握！
            </p>
          </div>

          {/* 成绩对比柱状图仪表盘 */}
          <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-xl border border-slate-700/60 shrink-0 min-w-[280px]">
            <div className="text-xs text-slate-400 mb-3 font-medium flex items-center justify-between">
              <span>两次战绩 vs 冲刺目标</span>
              <Target className="w-4 h-4 text-rose-400" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">2025.12 首次试水</span>
                  <span className="font-mono text-slate-400">374 分</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: `${(374 / 710) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-200 font-bold">2026.06 第二次沉淀</span>
                  <span className="font-mono text-sky-400 font-bold">388 分 (+14)</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${(388 / 710) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-300 font-bold flex items-center space-x-1">
                    <span>本次目标通关线</span>
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">425+ 分 (+37)</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden relative">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full" style={{ width: `${(425 / 710) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] text-slate-400 flex items-center justify-between">
              <span>标准总分: 710 分</span>
              <span className="text-emerald-400 font-semibold">通过率稳居前列</span>
            </div>
          </div>
        </div>
      </div>

      {/* 各题型提分产出比 (ROI) 策略卡片 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">各模块精准增分路径 (ROI 投产比矩阵)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tacticalPlan.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-5 border transition-all hover:shadow-md bg-white ${
                item.roiLevel.includes('极高')
                  ? 'border-rose-200 ring-1 ring-rose-300/40 shadow-xs'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm md:text-base">{item.module}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.roiLevel.includes('极高')
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : item.roiLevel.includes('高')
                      ? 'bg-sky-100 text-sky-800 border border-sky-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.roiLevel}
                </span>
              </div>

              <div className="flex items-baseline space-x-2 mb-3">
                <span className="text-xs text-slate-500">现状: {item.currentScore}</span>
                <span className="text-xs font-bold text-emerald-600">➔ 目标: {item.targetScore}</span>
                <span className="ml-auto text-xs font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  {item.pointsGain}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <p>
                  <strong className="text-slate-700">现状瓶颈：</strong>
                  {item.coreProblem}
                </p>
                <p className="text-indigo-900 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/60 leading-relaxed">
                  <strong className="text-indigo-700">战术解法：</strong>
                  {item.breakthroughStrategy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 考场 130 分钟严苛时间节律分配表 */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">考场 130 分钟分秒必争节律表</h3>
          <span className="text-xs text-slate-500 font-normal">（绝不拖堂、绝不在选词填空死磕超5分钟）</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">阶段环节</th>
                <th className="py-2.5 px-3">时间段</th>
                <th className="py-2.5 px-3">耗时</th>
                <th className="py-2.5 px-3">核心操作动作</th>
                <th className="py-2.5 px-3">考场高危纪律红线</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {timeManagementRules.map((rule, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {rule.stage}
                  </td>
                  <td className="py-3 px-3 font-mono text-indigo-700 font-medium whitespace-nowrap">
                    {rule.timeRange}
                  </td>
                  <td className="py-3 px-3 font-medium whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono">
                      {rule.durationMinutes} min
                    </span>
                  </td>
                  <td className="py-3 px-3 leading-relaxed text-slate-700 font-sans max-w-xs md:max-w-md">
                    {rule.action}
                  </td>
                  <td className="py-3 px-3 text-rose-700 font-medium bg-rose-50/40 max-w-xs">
                    <div className="flex items-start space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{rule.examinerWarning}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 琪琪日常复习行动指南 */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5">
        <h4 className="font-bold text-amber-900 text-sm flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-amber-600" />
          <span>琪琪独家·轻量化高效备考心法</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-amber-900/90 leading-relaxed">
          <div className="bg-white/80 p-3 rounded-lg border border-amber-200/50">
            <strong className="block text-amber-950 mb-1">1. 单词继续用百词斩</strong>
            <p>不需要花整块时间机械抄单词，碎片时间刷完百词斩六级核心词即可。重点关注动词和形容词词缀！</p>
          </div>
          <div className="bg-white/80 p-3 rounded-lg border border-amber-200/50">
            <strong className="block text-amber-950 mb-1">2. 作文直接默写万能骨架</strong>
            <p>万能 5 段框架已将逻辑承接词全部打磨完毕，考前只需练习 3 篇真题，把对应的插空语料熟练替换进去。</p>
          </div>
          <div className="bg-white/80 p-3 rounded-lg border border-amber-200/50">
            <strong className="block text-amber-950 mb-1">3. 选词填空绝不全蒙一个字母</strong>
            <p>考试时先标 15 个词性，靠语法空位挑出 3-4 个送分题稳稳拿到 14 分，剩下再蒙，14 分白捡到手！</p>
          </div>
        </div>
      </div>
    </div>
  );
};
