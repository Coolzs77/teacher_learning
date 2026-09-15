import React, { useState } from 'react';
import {
  POS_DRILL_WORDS,
  SLOT_DRILL_QUESTIONS,
  SINGLE_BLANK_DRILLS,
  FULL_CLOZE_EXAM,
  Cet6MistakeItem
} from '../../data/cet6PracticeData';
import {
  Scissors,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookMarked,
  Award,
  AlertCircle
} from 'lucide-react';

interface Cet6ClozeViewProps {
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6ClozeView: React.FC<Cet6ClozeViewProps> = ({ onAddMistake }) => {
  const [subTab, setSubTab] = useState<'pos' | 'slot' | 'single' | 'full'>('pos');

  // 1. 词性速测
  const [posIdx, setPosIdx] = useState(0);
  const [posPicked, setPosPicked] = useState<string | null>(null);
  const currentPosWord = POS_DRILL_WORDS[posIdx % POS_DRILL_WORDS.length];

  // 2. 空格槽位速判
  const [slotIdx, setSlotIdx] = useState(0);
  const [slotPicked, setSlotPicked] = useState<string | null>(null);
  const currentSlot = SLOT_DRILL_QUESTIONS[slotIdx % SLOT_DRILL_QUESTIONS.length];

  // 3. 单空秒杀排除
  const [singleIdx, setSingleIdx] = useState(0);
  const [singleLetter, setSingleLetter] = useState<string | null>(null);
  const currentSingle = SINGLE_BLANK_DRILLS[singleIdx % SINGLE_BLANK_DRILLS.length];

  // 4. 整篇演练
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [activeBlank, setActiveBlank] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleSelectOption = (letter: string) => {
    if (activeBlank === null || submitted) return;
    setAnswers(prev => ({ ...prev, [activeBlank]: letter }));
    const blankList = [26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
    const curr = blankList.indexOf(activeBlank);
    const next = blankList.slice(curr + 1).find(b => !answers[b]);
    if (next) {
      setActiveBlank(next);
    } else {
      setActiveBlank(null);
    }
  };

  const calculateScore = () => {
    let count = 0;
    const expMap = FULL_CLOZE_EXAM.blankExplanations;
    Object.keys(expMap).forEach(k => {
      const b = Number(k);
      if (answers[b] === expMap[b].correctLetter) {
        count++;
      }
    });
    return (count * 3.55).toFixed(1);
  };

  const handleSaveMistake = (title: string, context: string, myErr: string, correct: string, tip: string) => {
    if (onAddMistake) {
      onAddMistake({
        type: 'cloze',
        typeLabel: '选词填空',
        title,
        sourceContext: context,
        myMistake: myErr,
        correctAnswer: correct,
        reason: 'pos_error',
        reasonLabel: '🏷️ 词性看错',
        qiqiInsight: tip
      });
      showToast('✓ 已收录到错题本！');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-wood-900 text-bamboo-200 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-bamboo-600">
          <Sparkles className="w-4 h-4 text-amberGold-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 模块顶部导航与说明 */}
      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-paper-border pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-cinnabar-50 text-cinnabar-800 border border-cinnabar-200 text-xs font-serif font-bold">
                第一优先级 · 保底多拿 14 分
              </span>
              <span className="text-xs text-wood-500 font-serif">4分钟搞定 3~4 个送分题</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-wood-900">
              选词填空四步实战突击营
            </h2>
            <p className="text-xs sm:text-sm text-wood-600 font-serif mt-1">
              先看单词后缀标词性，再看空格前后抓线索。不需要把文章全部读懂，挑出有把握的空先拿分！
            </p>
          </div>

          {/* 四个步骤子标签 */}
          <div className="flex items-center bg-paper-100 p-1.5 rounded-xl border border-paper-border shrink-0 flex-wrap gap-1">
            <button
              onClick={() => setSubTab('pos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif transition cursor-pointer ${
                subTab === 'pos'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              1. 看词尾认词性
            </button>
            <button
              onClick={() => setSubTab('slot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif transition cursor-pointer ${
                subTab === 'slot'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              2. 看空前后找线索
            </button>
            <button
              onClick={() => setSubTab('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif transition cursor-pointer ${
                subTab === 'single'
                  ? 'bg-bamboo-700 text-white font-bold shadow-sm'
                  : 'text-wood-700 hover:bg-paper-200'
              }`}
            >
              3. 单空排除演练
            </button>
            <button
              onClick={() => setSubTab('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif transition cursor-pointer flex items-center space-x-1 ${
                subTab === 'full'
                  ? 'bg-cinnabar-700 text-white font-bold shadow-sm'
                  : 'text-cinnabar-800 hover:bg-cinnabar-50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>4. 真题整篇练习</span>
            </button>
          </div>
        </div>

        {/* ================= 子标签 1: 看词尾认词性 ================= */}
        {subTab === 'pos' && (
          <div className="max-w-xl mx-auto space-y-5 py-2">
            <div className="bg-paper-50 border-l-4 border-bamboo-700 p-3.5 rounded-r-xl text-xs text-wood-700 font-serif leading-relaxed">
              <strong>练习方法：</strong> 不看整篇文章！先看单词后几个字母，快速点选是名词、动词、形容词还是副词。
            </div>

            <div className="bg-paper-50 rounded-2xl p-6 border border-paper-border text-center space-y-4 shadow-sm">
              <span className="text-[11px] text-wood-400 font-serif">
                第 {posIdx + 1} / {POS_DRILL_WORDS.length} 题
              </span>
              <div className="font-serif text-3xl font-black text-wood-900 tracking-wide">
                {currentPosWord.word}
              </div>

              {/* 四个词性按钮 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-md mx-auto pt-2">
                {[
                  { pos: 'N', label: 'Noun (名词)' },
                  { pos: 'V', label: 'Verb (动词)' },
                  { pos: 'Adj', label: 'Adj (形容词)' },
                  { pos: 'Adv', label: 'Adv (副词)' },
                ].map(b => {
                  const isPicked = posPicked === b.pos;
                  const isRight = b.pos === currentPosWord.correctPos;

                  return (
                    <button
                      key={b.pos}
                      onClick={() => setPosPicked(b.pos)}
                      disabled={posPicked !== null}
                      className={`btn-tactile py-2.5 px-2 rounded-xl text-xs border transition cursor-pointer font-serif flex flex-col items-center justify-center ${
                        isPicked
                          ? isRight
                            ? 'bg-bamboo-700 text-white border-bamboo-700 font-bold'
                            : 'bg-cinnabar-700 text-white border-cinnabar-700 font-bold'
                          : posPicked !== null && isRight
                          ? 'bg-bamboo-100 text-bamboo-900 border-bamboo-300 font-bold'
                          : 'bg-paper-card border-paper-border text-wood-800 hover:bg-paper-100'
                      }`}
                    >
                      <span className="text-sm font-bold">{b.pos}</span>
                      <span className="text-[10px] opacity-80">{b.label.split(' ')[1]}</span>
                    </button>
                  );
                })}
              </div>

              {/* 答案反馈与词尾总结 */}
              {posPicked !== null && (
                <div className={`p-4 rounded-xl text-left border text-xs font-serif space-y-2 animate-fadeIn ${
                  posPicked === currentPosWord.correctPos
                    ? 'bg-bamboo-50 border-bamboo-200'
                    : 'bg-cinnabar-50 border-cinnabar-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-bold">
                      {posPicked === currentPosWord.correctPos ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-bamboo-700" />
                          <span className="text-bamboo-800">回答正确！</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-cinnabar-700" />
                          <span className="text-cinnabar-800">
                            看错了！正确词性为：{currentPosWord.posLabel}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-wood-600">释义：{currentPosWord.meaning}</span>
                  </div>

                  <p className="text-wood-800 leading-relaxed">
                    <strong>词尾规律：</strong> {currentPosWord.suffix}。{currentPosWord.ruleExplanation}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-paper-border/60">
                    <button
                      onClick={() => handleSaveMistake(
                        `选词填空词性看错: ${currentPosWord.word}`,
                        currentPosWord.word,
                        `当时误选了 ${posPicked}`,
                        `正确为 ${currentPosWord.posLabel}`,
                        currentPosWord.ruleExplanation
                      )}
                      className="text-wood-600 hover:text-bamboo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>加入错题本</span>
                    </button>

                    <button
                      onClick={() => {
                        setPosPicked(null);
                        setPosIdx(prev => prev + 1);
                      }}
                      className="btn-tactile bg-bamboo-700 text-white px-3.5 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer font-bold"
                    >
                      <span>下一题</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 子标签 2: 看空前后找线索 ================= */}
        {subTab === 'slot' && (
          <div className="max-w-xl mx-auto space-y-5 py-2">
            <div className="bg-paper-50 border-l-4 border-bamboo-700 p-3.5 rounded-r-xl text-xs text-wood-700 font-serif leading-relaxed">
              <strong>练习方法：</strong> 盯住空格前面和后面的单词，判断这个坑需要填入什么词性。
            </div>

            <div className="bg-paper-50 rounded-2xl p-6 border border-paper-border space-y-4 shadow-sm">
              <span className="text-[11px] text-wood-400 font-serif block">
                第 {slotIdx + 1} / {SLOT_DRILL_QUESTIONS.length} 题
              </span>

              <div className="p-4 bg-paper-card rounded-xl border border-paper-border font-serif text-base text-wood-900 leading-relaxed">
                <span>{currentSlot.sentenceBefore} </span>
                <span className="px-2 py-0.5 bg-paper-200 text-cinnabar-800 font-bold border-b-2 border-cinnabar-700">
                  {currentSlot.blankPlaceholder}
                </span>
                <span> {currentSlot.sentenceAfter}</span>
              </div>

              <div className="text-xs font-bold text-wood-700 font-serif text-center">
                请选出这个空格必须填入什么词性？
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-md mx-auto">
                {['N', 'V', 'Adj', 'Adv'].map(pos => (
                  <button
                    key={pos}
                    onClick={() => setSlotPicked(pos)}
                    disabled={slotPicked !== null}
                    className={`btn-tactile py-2 px-3 rounded-xl text-xs font-bold font-serif border transition cursor-pointer ${
                      slotPicked === pos
                        ? pos === currentSlot.correctPos
                          ? 'bg-bamboo-700 text-white border-bamboo-700'
                          : 'bg-cinnabar-700 text-white border-cinnabar-700'
                        : slotPicked !== null && pos === currentSlot.correctPos
                        ? 'bg-bamboo-100 text-bamboo-900 border-bamboo-300'
                        : 'bg-paper-card border-paper-border text-wood-800 hover:bg-paper-100'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>

              {slotPicked !== null && (
                <div className="bg-paper-card p-4 rounded-xl border border-paper-border text-xs font-serif space-y-2 animate-fadeIn">
                  <div className="font-bold text-wood-900 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amberGold-600" />
                    <span>语法线索：{currentSlot.grammarClue}</span>
                  </div>
                  <p className="text-wood-700 leading-relaxed">{currentSlot.reason}</p>
                  <div className="flex justify-end pt-2 border-t border-paper-border/60">
                    <button
                      onClick={() => {
                        setSlotPicked(null);
                        setSlotIdx(prev => prev + 1);
                      }}
                      className="btn-tactile bg-bamboo-700 text-white px-3.5 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer font-bold"
                    >
                      <span>下一题</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 子标签 3: 单空排除演练 ================= */}
        {subTab === 'single' && (
          <div className="max-w-xl mx-auto space-y-5 py-2">
            <div className="bg-paper-50 border-l-4 border-bamboo-700 p-3.5 rounded-r-xl text-xs text-wood-700 font-serif leading-relaxed">
              <strong>练习方法：</strong> 真实考场节奏：先看空格需要什么词性，再看四个选项的词尾排除掉其他词性，15秒干脆利落挑出答案。
            </div>

            <div className="bg-paper-50 rounded-2xl p-6 border border-paper-border space-y-4 shadow-sm">
              <span className="text-[11px] text-wood-400 font-serif block">
                第 {singleIdx + 1} / {SINGLE_BLANK_DRILLS.length} 题
              </span>

              <div className="p-4 bg-paper-card rounded-xl border border-paper-border font-serif text-base text-wood-900 leading-relaxed">
                {currentSingle.sentence}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentSingle.options.map(opt => (
                  <button
                    key={opt.letter}
                    onClick={() => setSingleLetter(opt.letter)}
                    disabled={singleLetter !== null}
                    className={`btn-tactile p-3 rounded-xl text-xs font-serif text-left border transition cursor-pointer flex items-center justify-between ${
                      singleLetter === opt.letter
                        ? opt.letter === currentSingle.correctLetter
                          ? 'bg-bamboo-700 text-white border-bamboo-700 font-bold'
                          : 'bg-cinnabar-700 text-white border-cinnabar-700 font-bold'
                        : singleLetter !== null && opt.letter === currentSingle.correctLetter
                        ? 'bg-bamboo-100 text-bamboo-900 border-bamboo-300 font-bold'
                        : 'bg-paper-card border-paper-border text-wood-800 hover:bg-paper-100'
                    }`}
                  >
                    <div>
                      <strong className="mr-1.5 font-mono">{opt.letter}. {opt.word}</strong>
                      <span className="text-[11px] opacity-75">[{opt.pos}] {opt.meaning}</span>
                    </div>
                  </button>
                ))}
              </div>

              {singleLetter !== null && (
                <div className="bg-paper-card p-4 rounded-xl border border-paper-border text-xs font-serif space-y-2 animate-fadeIn">
                  <div className="font-bold text-bamboo-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>做题三步回顾：</span>
                  </div>
                  <div className="space-y-1 text-wood-700 pl-2">
                    <p><strong>第一步（找线索）：</strong>{currentSingle.step1SlotAnalysis}</p>
                    <p><strong>第二步（排除项）：</strong>{currentSingle.step2Elimination}</p>
                    <p><strong>第三步（代入验）：</strong>{currentSingle.step3ContextCheck}</p>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-paper-border/60">
                    <button
                      onClick={() => {
                        setSingleLetter(null);
                        setSingleIdx(prev => prev + 1);
                      }}
                      className="btn-tactile bg-bamboo-700 text-white px-3.5 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer font-bold"
                    >
                      <span>下一题</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 子标签 4: 真题整篇练习 ================= */}
        {subTab === 'full' && (
          <div className="space-y-4 pt-1">
            <div className="bg-paper-100 border border-paper-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-serif">
              <div>
                <span className="text-xs text-cinnabar-800 font-bold bg-cinnabar-50 border border-cinnabar-200 px-2 py-0.5 rounded">
                  ★ 重点标记题为送分题
                </span>
                <h3 className="font-bold text-wood-900 text-sm mt-1">
                  {FULL_CLOZE_EXAM.title}
                </h3>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs text-wood-600">
                  已填: <strong className="font-mono text-bamboo-800">{Object.keys(answers).length}</strong>/10
                </span>

                {submitted ? (
                  <button
                    onClick={() => {
                      setAnswers({});
                      setSubmitted(false);
                      setActiveBlank(null);
                    }}
                    className="btn-tactile bg-wood-800 text-white text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重新做一遍</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSubmitted(true)}
                    className="btn-tactile bg-bamboo-700 hover:bg-bamboo-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer"
                  >
                    提交批改
                  </button>
                )}
              </div>
            </div>

            {submitted && (
              <div className="bg-bamboo-50 border border-bamboo-200 rounded-xl p-4 flex items-center space-x-3 font-serif animate-fadeIn">
                <div className="w-9 h-9 rounded-xl bg-bamboo-700 text-white font-bold flex items-center justify-center text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-bamboo-900">
                    测算得分：{calculateScore()} 分 / 满分 35.5 分
                  </h4>
                  <p className="text-xs text-bamboo-700">
                    {Number(calculateScore()) >= 14.2
                      ? '恭喜达到保底及格线！4分钟拿下这些送分题，提分目标就完成了！'
                      : '先把带【★】的4道送分题看熟，只要这4道做对，14.2分就到手了。'}
                  </p>
                </div>
              </div>
            )}

            {/* 左右分栏布局 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* 左侧文章 */}
              <div className="lg:col-span-8 bg-paper-50 p-5 rounded-2xl border border-paper-border space-y-4 font-serif">
                <div className="text-xs text-wood-500 border-b border-paper-border pb-2 flex justify-between">
                  <span>点击文中带方括号的题号，在右侧选择单词填入</span>
                  <span className="text-cinnabar-800 font-bold">★ 为必做送分题</span>
                </div>

                <div className="text-sm md:text-base leading-loose text-wood-900">
                  {FULL_CLOZE_EXAM.passageTokens.map((token, idx) => {
                    if (!token.isBlank || !token.blankIndex) {
                      return <span key={idx}>{token.text}</span>;
                    }

                    const b = token.blankIndex;
                    const ans = answers[b];
                    const isSelected = activeBlank === b;
                    const isEasy = FULL_CLOZE_EXAM.blankExplanations[b]?.difficulty.includes('送分');

                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveBlank(b)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 mx-1 rounded-lg border text-xs font-serif transition cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-bamboo-700 bg-paper-card border-bamboo-700 font-bold'
                            : ans
                            ? submitted
                              ? ans === token.correctLetter
                                ? 'bg-bamboo-100 text-bamboo-900 border-bamboo-300 font-bold'
                                : 'bg-cinnabar-50 text-cinnabar-900 border-cinnabar-300 font-bold line-through'
                              : 'bg-paper-200 text-wood-900 border-paper-border font-bold'
                            : 'bg-paper-card border-paper-border text-wood-600 hover:border-bamboo-600'
                        }`}
                      >
                        <span className="font-mono text-wood-500">[{b}]</span>
                        {isEasy && <span className="text-amberGold-600 font-bold">★</span>}
                        <span className="font-bold">
                          {ans ? `${ans}. ${FULL_CLOZE_EXAM.options.find(o => o.letter === ans)?.word}` : '填空'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 提交后逐题解析 */}
                {submitted && (
                  <div className="pt-4 border-t border-paper-border space-y-2.5">
                    <span className="text-xs font-bold text-wood-800 block">逐题详细解析：</span>
                    {Object.keys(FULL_CLOZE_EXAM.blankExplanations).map(key => {
                      const b = Number(key);
                      const exp = FULL_CLOZE_EXAM.blankExplanations[b];
                      const myAns = answers[b];
                      const isRight = myAns === exp.correctLetter;

                      return (
                        <div
                          key={b}
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            isRight ? 'bg-bamboo-50/70 border-bamboo-200' : 'bg-cinnabar-50/70 border-cinnabar-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold font-mono">[{b}]</span>
                              <span className="font-bold text-wood-900">
                                正确答案：{exp.correctLetter}. {exp.word} [{exp.pos}]
                              </span>
                              {exp.difficulty.includes('送分') && (
                                <span className="text-[10px] bg-amberGold-100 text-wood-900 px-1.5 rounded font-bold">
                                  送分题
                                </span>
                              )}
                            </div>
                            <span className={isRight ? 'text-bamboo-800 font-bold' : 'text-cinnabar-800 font-bold'}>
                              {isRight ? '✓ 正确' : `✗ 选了: ${myAns || '未答'}`}
                            </span>
                          </div>

                          <p className="text-wood-700 leading-relaxed">{exp.analysis}</p>

                          {!isRight && (
                            <button
                              onClick={() => handleSaveMistake(
                                `选词填空第${b}空: ${exp.word}`,
                                `第${b}空考点词: ${exp.word}`,
                                myAns || '未作答',
                                `${exp.correctLetter}. ${exp.word}`,
                                exp.analysis
                              )}
                              className="text-[11px] text-bamboo-800 hover:underline flex items-center space-x-1 pt-1 cursor-pointer"
                            >
                              <BookMarked className="w-3 h-3" />
                              <span>收进错题本</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 右侧选项栏 */}
              <div className="lg:col-span-4 bg-paper-card p-4 rounded-2xl border border-paper-border shadow-sm space-y-2 sticky top-24">
                <div className="flex items-center justify-between pb-2 border-b border-paper-border font-serif">
                  <span className="text-xs font-bold text-wood-900">15个单词选项池</span>
                  <span className="text-[11px] text-wood-500">
                    {activeBlank ? `当前正在填 [${activeBlank}] 空` : '请在左侧点空'}
                  </span>
                </div>

                <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
                  {FULL_CLOZE_EXAM.options.map(opt => {
                    const isUsed = Object.values(answers).includes(opt.letter);

                    return (
                      <button
                        key={opt.letter}
                        onClick={() => handleSelectOption(opt.letter)}
                        disabled={submitted}
                        className={`w-full text-left p-2 rounded-xl border text-xs font-serif transition cursor-pointer flex items-center justify-between ${
                          isUsed
                            ? 'bg-paper-100 text-wood-400 border-paper-border line-through'
                            : activeBlank
                            ? 'bg-paper-card hover:bg-bamboo-50 hover:border-bamboo-300 border-paper-border text-wood-900'
                            : 'bg-paper-card border-paper-border/60 text-wood-700'
                        }`}
                      >
                        <div>
                          <strong className="font-mono text-wood-900 mr-1.5">{opt.letter}.</strong>
                          <span className="font-bold mr-1">{opt.word}</span>
                          <span className="text-[10px] text-wood-400">[{opt.pos}]</span>
                        </div>
                        <span className="text-[11px] text-wood-500">{opt.meaning}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
