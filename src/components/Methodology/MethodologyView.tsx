import React, { useState } from 'react';
import { METHODOLOGIES, Methodology } from '../../data/methodologyData';
import { LESSONS_DATA } from '../../data/lessonsData';
import { Lesson, Genre } from '../../types';
import {
  GraduationCap,
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Quote,
  ArrowRight,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';

interface MethodologyViewProps {
  onSelectLesson: (lesson: Lesson) => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onSelectLesson }) => {
  const [selectedGenreIndex, setSelectedGenreIndex] = useState<number>(0);
  const currentMethod = METHODOLOGIES[selectedGenreIndex];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-paper-card rounded-2xl border border-paper-border p-6 md:p-8 shadow-scholarly space-y-3">
        <div className="flex items-center space-x-2 text-bamboo-800 text-xs font-serif font-bold">
          <GraduationCap className="w-4 h-4" />
          <span>初中语文面试高分方法论 · 6大文体万能试讲模型</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-wood-900">
          文体通关秘籍库
        </h1>
        <p className="text-xs md:text-sm text-wood-600 font-serif leading-relaxed max-w-3xl">
          面试评委考查的是你的“文体意识”与“学科素养”。散文要有声情并茂的朗读味，文言要有文白对译的文化气，
          说明文要有客观严密的科学逻辑，小说要有细腻的人物镜头。掌握 6 大文体万能模型，任凭考题千变万化，皆可10分钟从容通关。
        </p>
      </div>

      {/* Genre Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {METHODOLOGIES.map((m, idx) => (
          <button
            key={m.genre}
            onClick={() => setSelectedGenreIndex(idx)}
            className={`btn-tactile px-4 py-2.5 rounded-xl font-serif text-xs md:text-sm font-bold border transition ${
              selectedGenreIndex === idx
                ? 'bg-bamboo-700 text-white border-bamboo-800 shadow-md ring-1 ring-bamboo-600'
                : 'bg-paper-card text-wood-700 border-paper-border hover:bg-paper-200'
            }`}
          >
            {m.genre}
          </button>
        ))}
      </div>

      {/* Active Methodology Detailed Blueprint */}
      <div className="bg-paper-card rounded-2xl border border-paper-border shadow-scholarly p-6 md:p-8 space-y-8">
        {/* Title & Tagline */}
        <div className="border-b border-paper-border pb-4 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2 py-0.5 rounded bg-bamboo-100 text-bamboo-800 border border-bamboo-200 font-serif font-bold">
              {currentMethod.genre}
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-black text-wood-900">
              {currentMethod.title}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-wood-500 font-serif italic pt-1">
            “{currentMethod.tagline}”
          </p>
        </div>

        {/* 1. 10分钟5步核心教学骨架 */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-sm text-wood-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-bamboo-700" />
            <span>一、10分钟全真时间配比与教学步骤骨架</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {currentMethod.coreFramework.map((step, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-paper-50 border border-paper-border space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-wood-500 font-mono">
                    <span className="font-bold text-bamboo-800 font-serif">{step.step}</span>
                    <span>{step.timing}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-wood-900 mt-1">
                    {step.name}
                  </h4>
                  <p className="text-[11px] text-wood-600 mt-1 leading-snug">
                    <strong>核心目标：</strong>{step.goal}
                  </p>
                </div>
                <div className="pt-2 border-t border-paper-border/60 text-[11px] text-wood-700 leading-snug">
                  {step.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 考官雷区 vs 高分技巧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deductions */}
          <div className="p-5 rounded-xl bg-cinnabar-50/70 border border-cinnabar-200 space-y-3">
            <h4 className="font-serif font-bold text-sm text-cinnabar-800 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-cinnabar-600" />
              <span>考官必扣分雷区（千万避开）</span>
            </h4>
            <div className="space-y-2 text-xs font-serif text-cinnabar-900 leading-relaxed">
              {currentMethod.examinerDeductions.map((d, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* High score */}
          <div className="p-5 rounded-xl bg-bamboo-50/70 border border-bamboo-200 space-y-3">
            <h4 className="font-serif font-bold text-sm text-bamboo-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-bamboo-700" />
              <span>考官青睐的高分制胜技巧</span>
            </h4>
            <div className="space-y-2 text-xs font-serif text-wood-900 leading-relaxed">
              {currentMethod.highScoreTechniques.map((h, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. 万能口语套路汇编 */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-sm text-wood-900 flex items-center space-x-2">
            <Quote className="w-4 h-4 text-amber-600" />
            <span>三、万能口语化台词与指令库（即学即用）</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif">
            {/* Opening */}
            <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-wood-900">万能情境导入语</span>
                <button
                  onClick={() => handleCopy(currentMethod.universalOpening, 'open')}
                  className="text-[11px] text-bamboo-700 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'open' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'open' ? '已复制' : '复制台词'}</span>
                </button>
              </div>
              <p className="text-wood-800 leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                {currentMethod.universalOpening}
              </p>
            </div>

            {/* Transition */}
            <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-wood-900">万能切片过渡语</span>
                <button
                  onClick={() => handleCopy(currentMethod.universalTransition, 'trans')}
                  className="text-[11px] text-bamboo-700 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'trans' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'trans' ? '已复制' : '复制台词'}</span>
                </button>
              </div>
              <p className="text-wood-800 leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                {currentMethod.universalTransition}
              </p>
            </div>

            {/* Reading Directive */}
            <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-wood-900">万能朗读指导口令</span>
                <button
                  onClick={() => handleCopy(currentMethod.universalReadingDirective, 'read')}
                  className="text-[11px] text-bamboo-700 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'read' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'read' ? '已复制' : '复制台词'}</span>
                </button>
              </div>
              <p className="text-wood-800 leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                {currentMethod.universalReadingDirective}
              </p>
            </div>

            {/* Homework */}
            <div className="p-4 rounded-xl bg-paper-50 border border-paper-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-wood-900">万能分层课后作业</span>
                <button
                  onClick={() => handleCopy(currentMethod.universalHomework, 'hw')}
                  className="text-[11px] text-bamboo-700 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'hw' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'hw' ? '已复制' : '复制台词'}</span>
                </button>
              </div>
              <p className="text-wood-800 leading-relaxed bg-white p-3 rounded-lg border border-paper-border">
                {currentMethod.universalHomework}
              </p>
            </div>
          </div>
        </div>

        {/* 4. 万能板书骨架结构 */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-sm text-wood-900">
            四、万能结构化板书骨架模板
          </h3>
          <div className="blackboard-chalk rounded-xl p-4">
            <pre className="font-mono text-xs md:text-sm text-stone-100 whitespace-pre-wrap leading-relaxed">
              {currentMethod.blackboardModel}
            </pre>
          </div>
        </div>

        {/* 5. 代表篇目即学即练 */}
        <div className="pt-4 border-t border-paper-border space-y-3">
          <h4 className="font-serif font-bold text-sm text-wood-900">
            五、推荐配套即学即练代表篇目（点击直达）：
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentMethod.representativeLessons.map((lessonName) => {
              const clean = lessonName.replace('《', '').replace('》', '');
              const found = LESSONS_DATA.find(l => l.title === clean || l.title.includes(clean));
              return (
                <button
                  key={lessonName}
                  onClick={() => {
                    if (found) onSelectLesson(found);
                  }}
                  className="btn-tactile flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-paper-100 hover:bg-paper-200 border border-paper-border text-xs font-serif text-wood-800 cursor-pointer"
                >
                  <span>{lessonName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-bamboo-700" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
