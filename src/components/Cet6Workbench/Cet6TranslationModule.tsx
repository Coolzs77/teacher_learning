import React, { useState } from 'react';
import { TRANSLATION_DATA } from '../../data/cet6Data';
import { Languages, Copy, Check, Sparkles, BookOpen, Layers, Zap } from 'lucide-react';

export const Cet6TranslationModule: React.FC = () => {
  const [subTab, setSubTab] = useState<'patterns' | 'themes' | 'upgrade'>('patterns');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('theme-culture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedTheme = TRANSLATION_DATA.eightCoreThemes.find(t => t.id === selectedThemeId) || TRANSLATION_DATA.eightCoreThemes[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        {/* 顶部标题与标签切换 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-md border border-rose-100">
                翻译冲刺 70+ 分
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                10 大万能主干句型 + 8 大国情文化高频主题语料
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              段落翻译速成与高分主题语料
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              翻译拉分的不是把每个生僻字翻对，而是用熟练的主干句型搭起语法正确的骨架，避免低级中式英语扣分！
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setSubTab('patterns')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'patterns'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>10 大万能句型</span>
            </button>
            <button
              onClick={() => setSubTab('themes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'themes'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>8 大国情主题词库</span>
            </button>
            <button
              onClick={() => setSubTab('upgrade')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'upgrade'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>高分替换词</span>
            </button>
          </div>
        </div>

        {/* ================= SUBTAB 1: 10 大万能句型骨架 ================= */}
        {subTab === 'patterns' && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TRANSLATION_DATA.tenUniversalSentencePatterns.map((pat) => (
                <div
                  key={pat.id}
                  className="border border-slate-200 rounded-xl p-4 bg-white hover:border-indigo-300 transition shadow-2xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[11px] font-bold">
                        {pat.id}
                      </span>
                      <span>{pat.chinesePattern}</span>
                    </span>
                    <button
                      onClick={() => handleCopy(`pat-${pat.id}`, pat.englishPattern)}
                      className="text-xs text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                      title="复制句型"
                    >
                      {copiedKey === `pat-${pat.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="font-serif text-sm font-bold text-indigo-900 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/60 mb-2">
                    {pat.englishPattern}
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg space-y-1">
                    <div className="text-slate-500">例句：{pat.exampleChn}</div>
                    <div className="font-serif text-slate-800 italic">{pat.exampleEng}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SUBTAB 2: 8 大国情主题词库 ================= */}
        {subTab === 'themes' && (
          <div className="mt-6 space-y-6">
            {/* 8 个主题选择卡片横栏 */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
              {TRANSLATION_DATA.eightCoreThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                    selectedThemeId === theme.id
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{theme.icon}</span>
                  <span>{theme.themeName}</span>
                </button>
              ))}
            </div>

            {/* 选中的主题语料库 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{selectedTheme.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedTheme.themeName}</h3>
                    <p className="text-xs text-slate-500">六级常考翻译题材 · 核心专有名词与地道表达</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 font-bold">
                  8 大必背主题
                </span>
              </div>

              <div className="p-5 space-y-5">
                {/* 专有名词对照表 */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    核心专有名词 (Key Terms)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {selectedTheme.keywords.map((kw, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 transition"
                      >
                        <span className="text-xs font-medium text-slate-700">{kw.chn}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-serif text-xs md:text-sm font-bold text-indigo-900">{kw.eng}</span>
                          <button
                            onClick={() => handleCopy(`kw-${selectedTheme.id}-${idx}`, kw.eng)}
                            className="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                          >
                            {copiedKey === `kw-${selectedTheme.id}-${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 进阶套句 */}
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    主题进阶加分金句 (Advanced Expressions)
                  </h4>
                  <div className="space-y-2">
                    {selectedTheme.advancedExpressions.map((exp, eIdx) => (
                      <div key={eIdx} className="p-3 bg-indigo-50/40 border border-indigo-100/60 rounded-lg flex items-center justify-between gap-3">
                        <span className="font-serif text-xs md:text-sm text-indigo-950 font-medium">{exp}</span>
                        <button
                          onClick={() => handleCopy(`exp-${selectedTheme.id}-${eIdx}`, exp)}
                          className="shrink-0 text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                        >
                          {copiedKey === `exp-${selectedTheme.id}-${eIdx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SUBTAB 3: 高分替换词库 ================= */}
        {subTab === 'upgrade' && (
          <div className="mt-6 space-y-4">
            <div className="bg-emerald-50/60 border-l-4 border-emerald-500 p-4 rounded-r-xl text-xs text-emerald-950 mb-4">
              <strong>提分法门：</strong> 阅卷老师对天天出现的 "important"、"make"、"help" 产生审美疲劳。把初中词换成六级学术词，档次立马拉升 5~8 分！
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TRANSLATION_DATA.advancedVocabularyReplacements.map((item, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400">别老用：</span>
                      <strong className="text-sm font-mono text-rose-600 line-through mr-2">{item.originalWord}</strong>
                      <span className="text-xs text-slate-600 font-medium">({item.meaning})</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      六级高分替换
                    </span>
                  </div>

                  <div className="font-serif text-sm font-bold text-indigo-900 mb-2">
                    ➔ {item.upgradedWords}
                  </div>

                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <strong>搭配实操：</strong> <span className="font-serif italic text-slate-700">{item.exampleUsage}</span>
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
