import React, { useState } from 'react';
import { TRANSLATION_DATA } from '../../data/cet6Data';
import { TRANSLATION_STEPPING_DATA } from '../../data/cet6PracticeData';
import {
  Languages,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookMarked,
  Eye,
  Edit3,
  Lightbulb
} from 'lucide-react';

interface Cet6TranslationViewProps {
  activeSubSection?: string;
  onAddMistake?: (item: any) => void;
}

export const Cet6TranslationView: React.FC<Cet6TranslationViewProps> = ({
  activeSubSection = 'practice',
  onAddMistake,
}) => {
  // 扁平化所有例句方便逐句练习
  const allSentences = TRANSLATION_STEPPING_DATA.flatMap((t) =>
    t.sentences.map((s) => ({
      ...s,
      themeTitle: t.themeTitle,
      icon: t.icon,
    }))
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userDraft, setUserDraft] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState('theme-history');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const currentSentence = allSentences[currentStepIndex % allSentences.length];
  const currentTheme = TRANSLATION_DATA.eightCoreThemes.find((t) => t.id === selectedThemeId) || TRANSLATION_DATA.eightCoreThemes[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCollectMistake = () => {
    if (onAddMistake) {
      onAddMistake({
        type: 'translation',
        typeLabel: '汉译英',
        title: `翻译练习: ${currentSentence.chinese.slice(0, 18)}...`,
        sourceContext: currentSentence.chinese,
        myMistake: userDraft || '主谓宾句式不熟练',
        correctAnswer: currentSentence.standardTranslation,
        reason: 'meaning_error',
        reasonLabel: '句型套用生疏',
        qiqiInsight: currentSentence.pitfallWarning,
      });
      showToast('已将这句练习收录到错题本！');
    }
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-wood-900 text-paper-50 px-4 py-2 rounded-xl text-xs shadow-xl flex items-center space-x-2 border border-stone-700 animate-fadeIn">
          <Check className="w-4 h-4 text-bamboo-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. 句子逐句练写 */}
      {activeSubSection === 'practice' && (
        <div className="space-y-5 animate-card-enter">
          <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly card-writing space-y-4">
            <div className="flex items-center justify-between border-b border-paper-border pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-base">{currentSentence.icon}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
                  {currentSentence.themeTitle.split(' ')[0]}
                </span>
                <span className="text-xs text-wood-500 font-mono">
                  第 {currentStepIndex + 1} / {allSentences.length} 句
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setCurrentStepIndex((prev) => (prev + 1) % allSentences.length);
                    setUserDraft('');
                    setShowAnswer(false);
                  }}
                  className="px-3 py-1 text-xs rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition cursor-pointer"
                >
                  换下一句 ➔
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-wood-500">中文待译句子：</div>
              <div className="text-base sm:text-lg font-bold text-wood-900 leading-relaxed bg-paper-50 p-4 rounded-xl border border-paper-border select-all">
                {currentSentence.chinese}
              </div>
            </div>

            {/* 抓主谓宾 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-bamboo-50 p-3 rounded-xl border border-bamboo-200 space-y-0.5">
                <span className="text-[11px] font-bold text-bamboo-800">主语（谁）：</span>
                <p className="text-xs text-bamboo-900 font-bold">{currentSentence.mainSubject}</p>
              </div>
              <div className="bg-paper-100 p-3 rounded-xl border border-paper-border space-y-0.5">
                <span className="text-[11px] font-bold text-wood-800">谓语（做了什么）：</span>
                <p className="text-xs text-wood-900 font-bold">{currentSentence.mainPredicate}</p>
              </div>
              <div className="bg-paper-100 p-3 rounded-xl border border-paper-border space-y-0.5">
                <span className="text-[11px] font-bold text-wood-800">宾语（什么对象）：</span>
                <p className="text-xs text-wood-900 font-bold">{currentSentence.mainObject}</p>
              </div>
            </div>

            {/* 推荐句型 */}
            <div className="bg-paper-50 p-3 rounded-xl border border-paper-border space-y-1">
              <span className="text-xs font-bold text-wood-700 flex items-center space-x-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>推荐套用句型：</span>
              </span>
              <p className="text-xs text-wood-900 font-mono font-bold leading-relaxed">
                {currentSentence.patternTitle}
              </p>
            </div>

            {/* 核心词汇提示 */}
            <div className="bg-paper-50 p-3 rounded-xl border border-paper-border space-y-1.5">
              <div className="text-xs text-wood-500 font-bold">参考单词直接给（点击可复制）：</div>
              <div className="flex flex-wrap gap-2">
                {currentSentence.keyVocabList.map((vocab, i) => (
                  <span
                    key={i}
                    onClick={() => handleCopy(vocab.eng, `hint-${i}`)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-paper-card border border-paper-border text-wood-800 hover:border-bamboo-400 hover:bg-paper-100 transition cursor-pointer card-vocab flex items-center space-x-1"
                    title="点击复制这个词"
                  >
                    <span>{vocab.chn}：</span>
                    <strong className="font-mono">{vocab.eng}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* 动笔试写框 */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-wood-800 flex items-center space-x-1">
                  <Edit3 className="w-3.5 h-3.5 text-bamboo-700" />
                  <span>动手敲一遍（练一遍考场才不会慌）：</span>
                </span>
                <span className="text-wood-400 font-mono">
                  {userDraft.trim() ? userDraft.trim().split(/\s+/).length : 0} 词
                </span>
              </div>
              <textarea
                value={userDraft}
                onChange={(e) => setUserDraft(e.target.value)}
                placeholder="试着在这敲出你的英文翻译..."
                rows={3}
                className="w-full p-3.5 bg-paper-50 border border-paper-border rounded-xl text-sm font-serif text-wood-900 focus:outline-none focus:ring-2 focus:ring-bamboo-500/30 focus:border-bamboo-600 transition"
              />
            </div>

            {/* 对照答案与错题收录 */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-4 py-2 rounded-xl bg-bamboo-700 hover:bg-bamboo-800 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showAnswer ? '隐藏参考范文' : '对照老师参考范文'}</span>
              </button>

              <button
                onClick={handleCollectMistake}
                className="px-3 py-2 rounded-xl bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border text-xs transition flex items-center space-x-1 cursor-pointer"
              >
                <BookMarked className="w-3.5 h-3.5 text-bamboo-700" />
                <span>记入错题本</span>
              </button>
            </div>

            {/* 范文展开与避坑 */}
            {showAnswer && (
              <div className="p-4 bg-paper-50 rounded-xl border border-bamboo-300 space-y-3 animate-card-enter">
                <div>
                  <div className="text-xs text-bamboo-800 font-bold mb-1">老师地道范文：</div>
                  <div className="text-sm font-bold text-wood-900 leading-relaxed select-all bg-paper-card p-3 rounded-lg border border-paper-border">
                    {currentSentence.standardTranslation}
                  </div>
                </div>

                <div className="text-xs text-cinnabar-800 bg-cinnabar-50 p-2.5 rounded-lg border border-cinnabar-200 leading-relaxed">
                  <strong className="font-bold">避坑提醒：</strong>
                  {currentSentence.pitfallWarning}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. 10 大常用高分句型库 */}
      {activeSubSection === 'patterns' && (
        <div className="space-y-4 animate-card-enter">
          <div className="bg-paper-card rounded-2xl p-4 sm:p-5 border border-paper-border shadow-scholarly">
            <h3 className="font-bold text-base text-wood-900">
              10 个最管用的汉译英句型（背熟直接套，避免直译）
            </h3>
            <p className="text-xs text-wood-600 mt-0.5">
              主谓宾清晰，阅卷老师给分稳，不用复杂生词也能拿高分。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {TRANSLATION_DATA.tenUniversalSentencePatterns.map((item) => (
              <div
                key={item.id}
                className="bg-paper-card rounded-xl p-4 border border-paper-border shadow-scholarly card-vocab space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-paper-border pb-2">
                  <span className="text-xs font-bold text-bamboo-800 bg-bamboo-50 px-2 py-0.5 rounded border border-bamboo-200">
                    句型 {item.id} · {item.chinesePattern}
                  </span>
                  <button
                    onClick={() => handleCopy(item.englishPattern, `pat-${item.id}`)}
                    className="text-xs text-wood-600 hover:text-wood-900 flex items-center space-x-1 px-2 py-0.5 bg-paper-100 rounded hover:bg-paper-200 transition cursor-pointer"
                  >
                    {copiedId === `pat-${item.id}` ? (
                      <span className="text-bamboo-800 font-bold">已复制</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs font-mono text-wood-900 font-bold bg-paper-50 p-2 rounded-lg border border-paper-border">
                  {item.englishPattern}
                </div>

                <div className="space-y-1 text-xs text-wood-700 bg-paper-100/50 p-2 rounded-lg">
                  <div className="text-wood-500 font-serif">例：{item.exampleChn}</div>
                  <div className="text-wood-900 font-serif font-bold select-all">
                    {item.exampleEng}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 8 大国情主题词库 */}
      {activeSubSection === 'themes' && (
        <div className="space-y-4 animate-card-enter">
          {/* 主题选择横条（单行整洁） */}
          <div className="bg-paper-card p-3 rounded-2xl border border-paper-border shadow-scholarly flex flex-wrap gap-1.5">
            {TRANSLATION_DATA.eightCoreThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedThemeId(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  selectedThemeId === t.id
                    ? 'bg-bamboo-700 text-white shadow-xs'
                    : 'bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.themeName}</span>
              </button>
            ))}
          </div>

          <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly card-planning space-y-4">
            <div className="flex items-center justify-between border-b border-paper-border pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{currentTheme.icon}</span>
                <h3 className="font-bold text-base text-wood-900">
                  {currentTheme.themeName} · 高频双语词汇
                </h3>
              </div>
              <span className="text-xs text-wood-500">点击词汇直接复制</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentTheme.keywords.map((kw, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopy(kw.eng, `theme-kw-${idx}`)}
                  className="p-3 bg-paper-50 rounded-xl border border-paper-border hover:border-bamboo-400 hover:bg-paper-card transition cursor-pointer card-vocab flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-wood-900">{kw.chn}</div>
                    <div className="text-xs text-wood-600 font-mono mt-0.5">{kw.eng}</div>
                  </div>
                  <button className="text-wood-400 hover:text-wood-800 p-1">
                    {copiedId === `theme-kw-${idx}` ? (
                      <Check className="w-4 h-4 text-bamboo-700" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-paper-border">
              <div className="text-xs text-wood-500 font-bold">考场现成可用的好句子：</div>
              <div className="space-y-1.5">
                {currentTheme.advancedExpressions.map((exp, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(exp.split(' (')[0], `exp-${i}`)}
                    className="text-xs p-2.5 bg-paper-100/70 rounded-lg border border-paper-border hover:bg-paper-100 text-wood-800 transition cursor-pointer flex items-center justify-between select-all"
                  >
                    <span>{exp}</span>
                    <span className="text-[10px] text-wood-400 shrink-0 ml-2">
                      {copiedId === `exp-${i}` ? '已复制' : '复制'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 高频替换词表 */}
      {activeSubSection === 'replacements' && (
        <div className="space-y-4 animate-card-enter">
          <div className="bg-paper-card rounded-2xl p-4 sm:p-5 border border-paper-border shadow-scholarly">
            <h3 className="font-bold text-base text-wood-900">
              别总写初中词汇！用这几个高级词替换：
            </h3>
            <p className="text-xs text-wood-600 mt-0.5">
              阅卷老师每天看几百份卷子，偶尔换上 vital、foster、enhance，老师一眼看过去分数立刻提升。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {TRANSLATION_DATA.advancedVocabularyReplacements.map((item, idx) => (
              <div
                key={idx}
                className="bg-paper-card rounded-xl p-4 border border-paper-border shadow-scholarly card-vocab space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-paper-border pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs line-through text-wood-400 font-mono">
                      {item.originalWord}
                    </span>
                    <span className="text-xs text-wood-500">({item.meaning})</span>
                    <span className="text-xs font-bold text-bamboo-800">➔ 替换为：</span>
                  </div>
                </div>

                <div className="text-sm font-bold text-bamboo-900 font-mono bg-paper-50 p-2.5 rounded-lg border border-bamboo-200">
                  {item.upgradedWords}
                </div>

                <div className="text-xs text-wood-600 bg-paper-100/60 p-2 rounded-lg">
                  <span className="font-bold text-wood-800">考场例句：</span>
                  {item.exampleUsage}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
