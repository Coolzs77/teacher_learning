import React, { useState } from 'react';
import { TRANSLATION_DATA } from '../../data/cet6Data';
import { TRANSLATION_STEPPING_DATA, TranslationTopicStepping, SteppingSentence, Cet6MistakeItem } from '../../data/cet6PracticeData';
import {
  Languages,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Zap,
  ArrowRight,
  Eye,
  AlertTriangle,
  Send,
  BookmarkPlus,
  RotateCcw
} from 'lucide-react';

interface Cet6TranslationWorkshopProps {
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6TranslationWorkshop: React.FC<Cet6TranslationWorkshopProps> = ({ onAddMistake }) => {
  const [subTab, setSubTab] = useState<'stepping' | 'patterns' | 'themes' | 'upgrade'>('stepping');
  
  // 台阶演练状态
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TRANSLATION_STEPPING_DATA[0].id);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [userDraft, setUserDraft] = useState<string>('');
  const [showSteppingHints, setShowSteppingHints] = useState<boolean>(true);
  const [showEvaluation, setShowEvaluation] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 句型与主题状态
  const [selectedThemeId, setSelectedThemeId] = useState<string>('theme-culture');

  const currentTopic = TRANSLATION_STEPPING_DATA.find(t => t.id === selectedTopicId) || TRANSLATION_STEPPING_DATA[0];
  const currentSentence = currentTopic.sentences[activeSentenceIndex] || currentTopic.sentences[0];
  const selectedTheme = TRANSLATION_DATA.eightCoreThemes.find(t => t.id === selectedThemeId) || TRANSLATION_DATA.eightCoreThemes[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveToMistakes = (sentence: SteppingSentence) => {
    const data = {
      type: 'translation' as const,
      typeLabel: '汉译英',
      title: `翻译台阶真题: ${sentence.chinese.slice(0, 18)}...`,
      sourceContext: sentence.chinese,
      myMistake: userDraft || '考场初期构思句型欠佳',
      correctAnswer: sentence.standardTranslation,
      reason: 'meaning_error' as const,
      reasonLabel: '🏷️ 句意理解偏差 / 句式单薄',
      qiqiInsight: `${sentence.patternTitle}。避坑提示：${sentence.pitfallWarning}`
    };

    if (onAddMistake) {
      onAddMistake(data);
    } else {
      try {
        const saved = localStorage.getItem('cet6_mistakes');
        const list = saved ? JSON.parse(saved) : [];
        list.unshift({
          ...data,
          id: `mis-trans-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          isMastered: false
        });
        localStorage.setItem('cet6_mistakes', JSON.stringify(list));
      } catch (e) {}
    }
    showToast('✓ 已收录至专属错题/金句库！');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-emerald-400 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-emerald-500/30">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        {/* 顶部标签切换 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-md border border-rose-100">
                第二优先级攻坚 · 冲刺 70+ 分
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                汉译英台阶拆解 ➔ 核心词汇提示 ➔ 万能句型 ➔ 逐句比对
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              汉译英台阶演练工坊与高分语料库
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              翻译拉开分差的不是生僻字，而是主谓宾骨架的稳固度！杜绝中式直译，用台阶法逐步搭起地道学术长句。
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start lg:self-auto flex-wrap gap-1">
            <button
              onClick={() => setSubTab('stepping')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'stepping'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>1. 汉译英台阶演练</span>
            </button>
            <button
              onClick={() => setSubTab('patterns')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'patterns'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>2. 10 大万能句型</span>
            </button>
            <button
              onClick={() => setSubTab('themes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'themes'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3. 8 大国情主题词库</span>
            </button>
            <button
              onClick={() => setSubTab('upgrade')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'upgrade'
                  ? 'bg-indigo-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>4. 高分学术替换词</span>
            </button>
          </div>
        </div>

        {/* ================= SUBTAB 1: 汉译英台阶演练工坊 ================= */}
        {subTab === 'stepping' && (
          <div className="mt-6 space-y-6">
            {/* 主题选择横条 */}
            <div className="flex flex-wrap gap-2 pb-2">
              {TRANSLATION_STEPPING_DATA.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setActiveSentenceIndex(0);
                    setUserDraft('');
                    setShowEvaluation(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                    selectedTopicId === topic.id
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{topic.icon}</span>
                  <span>{topic.themeTitle.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* 句子切换标签 */}
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <span className="text-xs text-slate-400 font-medium">句子切片:</span>
              {currentTopic.sentences.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSentenceIndex(idx);
                    setUserDraft('');
                    setShowEvaluation(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activeSentenceIndex === idx
                      ? 'bg-indigo-100 text-indigo-900 font-bold border border-indigo-200'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  第 {idx + 1} 句
                </button>
              ))}
            </div>

            {/* 核心台阶演练卡片 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs space-y-6 p-6">
              {/* 中文原句呈现 */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  中文真题原句 (Chinese Prompt)
                </span>
                <div className="p-4 bg-slate-900 text-white rounded-xl font-serif text-base md:text-lg leading-relaxed shadow-inner">
                  {currentSentence.chinese}
                </div>
              </div>

              {/* 台阶 1: 中文原句主干剖析与修饰语剥离 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>台阶 1 · 句子主干切片 (抓核心，定主干)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">先找主谓宾，再挂修饰语</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                      核心主语 (Subject)
                    </span>
                    <p className="text-xs font-bold text-emerald-950 mt-1.5">
                      {currentSentence.mainSubject}
                    </p>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded">
                      核心谓语 (Predicate)
                    </span>
                    <p className="text-xs font-bold text-blue-950 mt-1.5">
                      {currentSentence.mainPredicate}
                    </p>
                  </div>

                  <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider bg-purple-100 px-2 py-0.5 rounded">
                      核心宾语 (Object)
                    </span>
                    <p className="text-xs font-bold text-purple-950 mt-1.5">
                      {currentSentence.mainObject}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
                  <strong className="text-slate-800 mr-1.5">修饰成分定位：</strong>
                  <span>{currentSentence.modifiersInfo}</span>
                </div>
              </div>

              {/* 台阶 2 & 3: 核心词汇提示与万能句型匹配 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 词汇提示 */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    台阶 2 · 核心考点词汇提炼
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentSentence.keyVocabList.map((kv, kvIdx) => (
                      <div key={kvIdx} className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
                        <span className="text-slate-500 mr-1">{kv.chn}:</span>
                        <strong className="font-mono text-indigo-900">{kv.eng}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 句型匹配 */}
                <div className="border border-slate-200 rounded-xl p-4 bg-indigo-50/40 border-indigo-100 space-y-2">
                  <span className="text-xs font-bold text-indigo-900 block">
                    台阶 3 · 推荐万能句型骨架
                  </span>
                  <p className="font-serif text-xs font-bold text-indigo-950 leading-relaxed">
                    {currentSentence.patternTitle}
                  </p>
                </div>
              </div>

              {/* 台阶 4: 用户实战自测输入区 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    台阶 4 · 琪琪实战自测打卡 (动手写，才能破除提笔忘字)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    已写 {userDraft.trim().split(/\s+/).filter(Boolean).length} 词
                  </span>
                </div>

                <textarea
                  value={userDraft}
                  onChange={(e) => setUserDraft(e.target.value)}
                  placeholder="在此输入你尝试翻译的英文句子，输入完成后点击‘提交比对考官高分范文’..."
                  rows={3}
                  className="w-full p-3.5 border border-slate-200 rounded-xl text-xs md:text-sm font-serif leading-relaxed text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setUserDraft(currentSentence.standardTranslation);
                      setShowEvaluation(true);
                    }}
                    className="text-xs text-slate-500 hover:text-indigo-600 cursor-pointer"
                  >
                    一键填入标准范文试读
                  </button>

                  <button
                    onClick={() => setShowEvaluation(true)}
                    className="btn-tactile bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>提交比对考官高分范文</span>
                  </button>
                </div>
              </div>

              {/* 台阶 5: 考官范文对比与避坑指南 (提交后展开) */}
              {showEvaluation && (
                <div className="pt-4 border-t border-slate-200 space-y-4 animate-fadeIn">
                  {/* 对比展示 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                      <span className="text-xs font-bold text-slate-500 block">你的实战试写：</span>
                      <p className="font-serif text-sm text-slate-800 italic leading-relaxed">
                        {userDraft || '（未输入译文）'}
                      </p>
                    </div>

                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 block">考官级标准范文：</span>
                        <button
                          onClick={() => handleCopy(`std-${currentSentence.id}`, currentSentence.standardTranslation)}
                          className="text-xs text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedKey === `std-${currentSentence.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>复制范文</span>
                        </button>
                      </div>
                      <p className="font-serif text-sm font-bold text-emerald-950 leading-relaxed">
                        {currentSentence.standardTranslation}
                      </p>
                    </div>
                  </div>

                  {/* 避坑雷区提示 */}
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-950 space-y-1">
                    <div className="flex items-center space-x-1 font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>考场高危扣分雷区：</span>
                    </div>
                    <p className="leading-relaxed pl-5">
                      {currentSentence.pitfallWarning}
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleSaveToMistakes(currentSentence)}
                      className="btn-tactile bg-slate-900 text-white text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <BookmarkPlus className="w-4 h-4 text-amber-400" />
                      <span>将本句及反思收录进错题本</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SUBTAB 2: 10 大万能句型 ================= */}
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

        {/* ================= SUBTAB 3: 8 大国情主题词库 ================= */}
        {subTab === 'themes' && (
          <div className="mt-6 space-y-6">
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

        {/* ================= SUBTAB 4: 高分替换词 ================= */}
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
