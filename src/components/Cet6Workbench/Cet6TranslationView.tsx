import React, { useState } from 'react';
import { TRANSLATION_DATA } from '../../data/cet6Data';
import { TRANSLATION_STEPPING_DATA, SteppingSentence, Cet6MistakeItem } from '../../data/cet6PracticeData';
import {
  Languages,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Zap,
  AlertTriangle,
  Send,
  BookMarked,
  ArrowRight
} from 'lucide-react';

interface Cet6TranslationViewProps {
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6TranslationView: React.FC<Cet6TranslationViewProps> = ({ onAddMistake }) => {
  const [subTab, setSubTab] = useState<'stepping' | 'patterns' | 'themes' | 'upgrade'>('stepping');

  // 台阶演练状态
  const [topicId, setTopicId] = useState(TRANSLATION_STEPPING_DATA[0].id);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [userDraft, setUserDraft] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 主题词库
  const [themeId, setThemeId] = useState('theme-culture');

  const currentTopic = TRANSLATION_STEPPING_DATA.find(t => t.id === topicId) || TRANSLATION_STEPPING_DATA[0];
  const currentSentence = currentTopic.sentences[sentenceIdx] || currentTopic.sentences[0];
  const selectedTheme = TRANSLATION_DATA.eightCoreThemes.find(t => t.id === themeId) || TRANSLATION_DATA.eightCoreThemes[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveMistake = (s: SteppingSentence) => {
    if (onAddMistake) {
      onAddMistake({
        type: 'translation',
        typeLabel: '汉译英',
        title: `翻译金句积累: ${s.chinese.slice(0, 18)}...`,
        sourceContext: s.chinese,
        myMistake: userDraft || '初始思路不够地道',
        correctAnswer: s.standardTranslation,
        reason: 'meaning_error',
        reasonLabel: '🏷️ 句式单薄',
        qiqiInsight: `${s.patternTitle}。避坑提醒：${s.pitfallWarning}`
      });
      showToast('✓ 已收录至翻译金句与错题库！');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-serif">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-wood-900 text-bamboo-200 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-bamboo-600">
          <Sparkles className="w-4 h-4 text-amberGold-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 模块顶部卡片 */}
      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-paper-border pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-cinnabar-50 text-cinnabar-800 border border-cinnabar-200 text-xs font-bold">
                第二优先级 · 冲刺 70+ 分
              </span>
              <span className="text-xs text-wood-500">主谓宾拆解 ➔ 万能句型套入 ➔ 动笔试写对照</span>
            </div>
            <h2 className="text-xl font-bold text-wood-900">
              汉译英台阶演练工坊与常用词库
            </h2>
            <p className="text-xs sm:text-sm text-wood-600 mt-1">
              翻译拉开分数的不是生僻词，而是句子的骨架！先把主语和动词定住，再套用句型，杜绝中式直译。
            </p>
          </div>

          <div className="flex items-center bg-paper-100 p-1.5 rounded-xl border border-paper-border shrink-0 flex-wrap gap-1">
            <button
              onClick={() => setSubTab('stepping')}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                subTab === 'stepping'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              1. 台阶拆解练习
            </button>
            <button
              onClick={() => setSubTab('patterns')}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                subTab === 'patterns'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              2. 10大万能句型
            </button>
            <button
              onClick={() => setSubTab('themes')}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                subTab === 'themes'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              3. 8大国情主题词
            </button>
            <button
              onClick={() => setSubTab('upgrade')}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                subTab === 'upgrade'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              4. 高频替换词
            </button>
          </div>
        </div>

        {/* ================= 子标签 1: 台阶实战演练 ================= */}
        {subTab === 'stepping' && (
          <div className="space-y-5 pt-1">
            {/* 主题横向切换 */}
            <div className="flex flex-wrap gap-2 pb-1 border-b border-paper-border/60">
              {TRANSLATION_STEPPING_DATA.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTopicId(t.id);
                    setSentenceIdx(0);
                    setUserDraft('');
                    setShowCompare(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center space-x-1.5 ${
                    topicId === t.id
                      ? 'bg-wood-900 text-white font-bold shadow-sm'
                      : 'bg-paper-100 text-wood-700 hover:bg-paper-200'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.themeTitle.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* 句子切片导航 */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-wood-500">句子列表：</span>
              {currentTopic.sentences.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSentenceIdx(idx);
                    setUserDraft('');
                    setShowCompare(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer ${
                    sentenceIdx === idx
                      ? 'bg-bamboo-100 text-bamboo-800 font-bold border border-bamboo-300'
                      : 'text-wood-600 hover:bg-paper-100'
                  }`}
                >
                  第 {idx + 1} 句
                </button>
              ))}
            </div>

            {/* 台阶练习主体 */}
            <div className="bg-paper-50 rounded-2xl p-5 md:p-6 border border-paper-border space-y-5">
              {/* 中文原句 */}
              <div>
                <span className="text-[11px] text-wood-400 font-bold block mb-1">
                  中文真题原句：
                </span>
                <div className="p-4 bg-paper-card text-wood-900 rounded-xl border border-paper-border text-base md:text-lg leading-relaxed shadow-xs font-bold">
                  {currentSentence.chinese}
                </div>
              </div>

              {/* 台阶 1: 主干切片 */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-wood-800 block">
                  第一步 · 划出主谓宾（先定住句子的骨架）
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div className="bg-paper-card p-3 rounded-xl border border-paper-border">
                    <span className="text-[10px] text-bamboo-800 bg-bamboo-100 px-1.5 py-0.5 rounded font-bold">
                      核心主语
                    </span>
                    <p className="text-xs font-bold text-wood-900 mt-1">{currentSentence.mainSubject}</p>
                  </div>

                  <div className="bg-paper-card p-3 rounded-xl border border-paper-border">
                    <span className="text-[10px] text-wood-800 bg-paper-200 px-1.5 py-0.5 rounded font-bold">
                      核心动词 (谓语)
                    </span>
                    <p className="text-xs font-bold text-wood-900 mt-1">{currentSentence.mainPredicate}</p>
                  </div>

                  <div className="bg-paper-card p-3 rounded-xl border border-paper-border">
                    <span className="text-[10px] text-cinnabar-800 bg-cinnabar-50 px-1.5 py-0.5 rounded font-bold">
                      核心宾语 / 结果
                    </span>
                    <p className="text-xs font-bold text-wood-900 mt-1">{currentSentence.mainObject}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-paper-card rounded-lg border border-paper-border text-xs text-wood-700">
                  <strong className="text-wood-900">修饰成分：</strong> {currentSentence.modifiersInfo}
                </div>
              </div>

              {/* 台阶 2 & 3: 词汇与句型 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-paper-card p-3.5 rounded-xl border border-paper-border space-y-1.5">
                  <span className="text-xs font-bold text-wood-800 block">第二步 · 考点词汇提示</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSentence.keyVocabList.map((kv, kIdx) => (
                      <span key={kIdx} className="text-xs bg-paper-100 px-2 py-0.5 rounded border border-paper-border text-wood-800">
                        {kv.chn}: <strong className="font-sans">{kv.eng}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-paper-card p-3.5 rounded-xl border border-paper-border space-y-1.5">
                  <span className="text-xs font-bold text-wood-800 block">第三步 · 推荐套用句型</span>
                  <p className="text-xs text-bamboo-800 font-bold font-sans">
                    {currentSentence.patternTitle}
                  </p>
                </div>
              </div>

              {/* 台阶 4: 用户自己动笔试写 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-wood-800">
                    第四步 · 琪琪动笔试写（亲手敲一遍，考场不发慌）
                  </span>
                  <span className="text-[11px] text-wood-500 font-sans">
                    已写 {userDraft.trim().split(/\s+/).filter(Boolean).length} 词
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={userDraft}
                  onChange={e => setUserDraft(e.target.value)}
                  placeholder="在这里尝试输入你翻译的英文句子..."
                  className="w-full p-3 bg-paper-card border border-paper-border rounded-xl text-xs md:text-sm font-sans focus:outline-hidden focus:ring-1 focus:ring-bamboo-600"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setUserDraft(currentSentence.standardTranslation);
                      setShowCompare(true);
                    }}
                    className="text-xs text-wood-500 hover:text-bamboo-800 cursor-pointer"
                  >
                    直接填入老师示范范文
                  </button>

                  <button
                    onClick={() => setShowCompare(true)}
                    className="btn-tactile bg-bamboo-700 hover:bg-bamboo-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>查看老师示范译文并对照</span>
                  </button>
                </div>
              </div>

              {/* 台阶 5: 对照与避坑 */}
              {showCompare && (
                <div className="pt-3 border-t border-paper-border space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-paper-card p-3.5 rounded-xl border border-paper-border space-y-1">
                      <span className="text-[11px] text-wood-500 font-bold block">你的实写译文：</span>
                      <p className="text-xs font-sans text-wood-800 italic">
                        {userDraft || '（未输入译文）'}
                      </p>
                    </div>

                    <div className="bg-bamboo-50/70 p-3.5 rounded-xl border border-bamboo-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-bamboo-900 font-bold block">老师高分示范：</span>
                        <button
                          onClick={() => handleCopy(`std-${currentSentence.id}`, currentSentence.standardTranslation)}
                          className="text-[11px] text-bamboo-800 hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedKey === `std-${currentSentence.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>复制范文</span>
                        </button>
                      </div>
                      <p className="text-xs font-sans font-bold text-bamboo-950 leading-relaxed">
                        {currentSentence.standardTranslation}
                      </p>
                    </div>
                  </div>

                  {/* 避坑提醒 */}
                  <div className="bg-cinnabar-50 p-3.5 rounded-xl border border-cinnabar-200 text-xs text-cinnabar-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-cinnabar-700" />
                      <span>考场容易扣分的地方：</span>
                    </div>
                    <p className="leading-relaxed pl-5">{currentSentence.pitfallWarning}</p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleSaveMistake(currentSentence)}
                      className="btn-tactile bg-wood-900 text-white text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <BookMarked className="w-3.5 h-3.5 text-amberGold-600" />
                      <span>存进翻译错题/金句库</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 子标签 2: 10大万能句型 ================= */}
        {subTab === 'patterns' && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TRANSLATION_DATA.tenUniversalSentencePatterns.map(pat => (
                <div key={pat.id} className="p-4 rounded-xl border border-paper-border bg-paper-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-wood-900 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-bamboo-100 text-bamboo-800 text-[11px] font-bold flex items-center justify-center font-mono">
                        {pat.id}
                      </span>
                      <span>{pat.chinesePattern}</span>
                    </span>
                    <button
                      onClick={() => handleCopy(`p-${pat.id}`, pat.englishPattern)}
                      className="text-wood-400 hover:text-wood-700 p-1 cursor-pointer"
                    >
                      {copiedKey === `p-${pat.id}` ? <Check className="w-3.5 h-3.5 text-bamboo-700" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="font-sans text-xs font-bold text-bamboo-900 bg-paper-card p-2 rounded-lg border border-paper-border">
                    {pat.englishPattern}
                  </div>

                  <div className="text-[11px] text-wood-600 bg-paper-card p-2 rounded-lg border border-paper-border space-y-0.5">
                    <div>例句：{pat.exampleChn}</div>
                    <div className="font-sans text-wood-800 italic">{pat.exampleEng}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 子标签 3: 8大国情主题词 ================= */}
        {subTab === 'themes' && (
          <div className="space-y-4 pt-1">
            <div className="flex flex-wrap gap-2 pb-1 border-b border-paper-border/60">
              {TRANSLATION_DATA.eightCoreThemes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center space-x-1 ${
                    themeId === t.id
                      ? 'bg-wood-900 text-white font-bold shadow-sm'
                      : 'bg-paper-100 text-wood-700 hover:bg-paper-200'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.themeName}</span>
                </button>
              ))}
            </div>

            <div className="bg-paper-50 p-4 rounded-xl border border-paper-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-paper-border">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{selectedTheme.icon}</span>
                  <h4 className="text-sm font-bold text-wood-900">{selectedTheme.themeName}常用词</h4>
                </div>
                <span className="text-[11px] text-wood-500">直接点右侧复制</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedTheme.keywords.map((kw, idx) => (
                  <div key={idx} className="p-2.5 bg-paper-card rounded-lg border border-paper-border flex items-center justify-between">
                    <span className="text-xs text-wood-800">{kw.chn}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-sans text-xs font-bold text-wood-900">{kw.eng}</span>
                      <button
                        onClick={() => handleCopy(`k-${selectedTheme.id}-${idx}`, kw.eng)}
                        className="text-wood-400 hover:text-wood-700 p-0.5 cursor-pointer"
                      >
                        {copiedKey === `k-${selectedTheme.id}-${idx}` ? <Check className="w-3 h-3 text-bamboo-700" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 子标签 4: 高频替换词 ================= */}
        {subTab === 'upgrade' && (
          <div className="space-y-3 pt-1">
            <div className="bg-bamboo-50 p-3.5 rounded-xl border border-bamboo-200 text-xs text-bamboo-900">
              <strong>阅卷老师采分建议：</strong> 别通篇写 important, help, make 这些初中词汇。换成 vital, foster, enhance，老师一眼看过去档次立刻提升！
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TRANSLATION_DATA.advancedVocabularyReplacements.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-paper-50 rounded-xl border border-paper-border space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-wood-400">别老写：</span>
                      <span className="line-through text-cinnabar-800 font-sans font-bold mr-1.5">{item.originalWord}</span>
                      <span className="text-wood-600">({item.meaning})</span>
                    </div>
                    <span className="text-[10px] bg-bamboo-100 text-bamboo-800 px-1.5 py-0.2 rounded font-bold">
                      推荐替换
                    </span>
                  </div>

                  <div className="font-sans text-sm font-bold text-bamboo-900">
                    ➔ {item.upgradedWords}
                  </div>

                  <div className="text-[11px] text-wood-600 bg-paper-card p-2 rounded border border-paper-border">
                    例：<span className="font-sans italic text-wood-800">{item.exampleUsage}</span>
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
