import React, { useState, useEffect } from 'react';
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
  activeSubSection?: string;
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6ClozeView: React.FC<Cet6ClozeViewProps> = ({
  activeSubSection = 'pos',
  onAddMistake,
}) => {
  const currentSubTab = activeSubSection as 'pos' | 'slot' | 'single' | 'full';

  // 1. 词性速测
  const [posIdx, setPosIdx] = useState(0);
  const [posPicked, setPosPicked] = useState<string | null>(null);
  const currentPosWord = POS_DRILL_WORDS[posIdx % POS_DRILL_WORDS.length];

  // 2. 空格槽位速判
  const [slotIdx, setSlotIdx] = useState(0);
  const [slotPicked, setSlotPicked] = useState<string | null>(null);
  const currentSlot = SLOT_DRILL_QUESTIONS[slotIdx % SLOT_DRILL_QUESTIONS.length];

  // 3. 单题快速排除
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
    setAnswers((prev) => ({ ...prev, [activeBlank]: letter }));
    const blankList = [26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
    const curr = blankList.indexOf(activeBlank);
    const next = blankList.slice(curr + 1).find((b) => !answers[b]);
    if (next) {
      setActiveBlank(next);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    Object.entries(FULL_CLOZE_EXAM.blankExplanations).forEach(([blank, info]) => {
      if (answers[Number(blank)] === info.correctLetter) {
        correctCount += 1;
      }
    });
    return {
      count: correctCount,
      score: (correctCount * 3.55).toFixed(1),
    };
  };

  const handleSaveMistakeFromBlank = (blankNum: number) => {
    const exp = FULL_CLOZE_EXAM.blankExplanations[blankNum];
    if (!exp) return;
    if (onAddMistake) {
      onAddMistake({
        type: 'cloze',
        typeLabel: '选词填空',
        title: `选词第 ${blankNum} 空: [${exp.correctLetter}] ${exp.word}`,
        sourceContext: `第 ${blankNum} 空 · 考查词性 [${exp.pos}] · 难度 [${exp.difficulty}]`,
        myMistake: answers[blankNum] ? `我的作答: ${answers[blankNum]}` : '当时未作答或选错',
        correctAnswer: `${exp.correctLetter}. ${exp.word} (${exp.pos})`,
        reason: 'pos_error',
        reasonLabel: '🏷️ 词性看错',
        qiqiInsight: exp.analysis,
      });
      showToast(`已成功收录第 ${blankNum} 题至错题本！`);
    }
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Toast 提醒 */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-wood-900 text-paper-50 px-4 py-2 rounded-xl text-xs shadow-xl flex items-center space-x-2 border border-stone-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-bamboo-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 步骤 1：看词尾认词性 */}
      {currentSubTab === 'pos' && (
        <div className="space-y-5 animate-card-enter">
          <div className="bg-paper-card border border-paper-border rounded-2xl p-5 sm:p-6 shadow-scholarly card-practice space-y-4">
            <div className="flex items-center justify-between border-b border-paper-border pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
                  第 1 步 · 词尾训练
                </span>
                <span className="text-xs text-wood-500 font-mono">
                  第 {posIdx + 1} / {POS_DRILL_WORDS.length} 题
                </span>
              </div>
              <button
                onClick={() => {
                  setPosIdx((prev) => (prev + 1) % POS_DRILL_WORDS.length);
                  setPosPicked(null);
                }}
                className="px-3 py-1 text-xs rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition cursor-pointer"
              >
                换下一个单词 ➔
              </button>
            </div>

            <div className="text-center py-6 space-y-2 bg-paper-50 rounded-xl border border-paper-border">
              <p className="text-xs text-wood-500">只看后面几个字母，这个词是什么词性？</p>
              <h3 className="text-3xl sm:text-4xl font-bold font-mono text-wood-900 tracking-wider">
                {currentPosWord.word}
              </h3>
              <p className="text-xs text-wood-600">中文释义：{currentPosWord.meaning}</p>
            </div>

            {/* 四个词性选项按钮 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: '名词 (N)', val: 'N' },
                { label: '动词 (V)', val: 'V' },
                { label: '形容词 (Adj)', val: 'Adj' },
                { label: '副词 (Adv)', val: 'Adv' },
              ].map((btn) => {
                const isPicked = posPicked === btn.val;
                const isCorrect = btn.val === currentPosWord.correctPos;

                let btnStyle = 'bg-paper-card border-paper-border text-wood-800 hover:bg-paper-100';
                if (posPicked) {
                  if (isCorrect) {
                    btnStyle = 'bg-bamboo-700 text-white border-bamboo-800 shadow-sm animate-bounce-gentle';
                  } else if (isPicked) {
                    btnStyle = 'bg-cinnabar-100 text-cinnabar-800 border-cinnabar-300 animate-shake';
                  }
                }

                return (
                  <button
                    key={btn.val}
                    onClick={() => setPosPicked(btn.val)}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${btnStyle} active:scale-95`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* 即时反馈 */}
            {posPicked && (
              <div
                className={`p-4 rounded-xl border space-y-2 animate-card-enter ${
                  posPicked === currentPosWord.correctPos
                    ? 'bg-bamboo-50 border-bamboo-300 text-bamboo-900'
                    : 'bg-cinnabar-50 border-cinnabar-200 text-cinnabar-900'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold text-sm">
                  {posPicked === currentPosWord.correctPos ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-bamboo-700" />
                      <span>答对了！词性判断完全正确！</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-cinnabar-700" />
                      <span>选错啦，正确词性是：【{currentPosWord.posLabel}】</span>
                    </>
                  )}
                </div>
                <div className="text-xs space-y-1 pt-1 border-t border-black/10">
                  <p>
                    <strong>常考词尾规律：</strong>
                    {currentPosWord.suffix}
                  </p>
                  <p className="leading-relaxed">
                    <strong>备考提醒：</strong>
                    {currentPosWord.ruleExplanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 步骤 2：看空前后定词性 */}
      {currentSubTab === 'slot' && (
        <div className="space-y-5 animate-card-enter">
          <div className="bg-paper-card border border-paper-border rounded-2xl p-5 sm:p-6 shadow-scholarly card-practice space-y-4">
            <div className="flex items-center justify-between border-b border-paper-border pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
                  第 2 步 · 看空前后
                </span>
                <span className="text-xs text-wood-500 font-mono">
                  第 {slotIdx + 1} / {SLOT_DRILL_QUESTIONS.length} 题
                </span>
              </div>
              <button
                onClick={() => {
                  setSlotIdx((prev) => (prev + 1) % SLOT_DRILL_QUESTIONS.length);
                  setSlotPicked(null);
                }}
                className="px-3 py-1 text-xs rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition cursor-pointer"
              >
                下一题 ➔
              </button>
            </div>

            <div className="bg-paper-50 p-4 rounded-xl border border-paper-border space-y-2">
              <span className="text-xs text-wood-500">根据空格前后结构，判断此空必须填什么词性：</span>
              <p className="text-base sm:text-lg font-bold text-wood-900 leading-relaxed">
                <span>{currentSlot.sentenceBefore} </span>
                <span className="inline-block px-3 py-0.5 mx-1 bg-amber-100 text-amber-900 border border-amber-300 rounded font-mono font-bold">
                  [ 空格 ? ]
                </span>
                <span> {currentSlot.sentenceAfter}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: '名词 (N)', val: 'N' },
                { label: '动词 (V)', val: 'V' },
                { label: '形容词 (Adj)', val: 'Adj' },
                { label: '副词 (Adv)', val: 'Adv' },
              ].map((btn) => {
                const isPicked = slotPicked === btn.val;
                const isCorrect = btn.val === currentSlot.correctPos;

                let btnStyle = 'bg-paper-card border-paper-border text-wood-800 hover:bg-paper-100';
                if (slotPicked) {
                  if (isCorrect) {
                    btnStyle = 'bg-bamboo-700 text-white border-bamboo-800 shadow-sm animate-bounce-gentle';
                  } else if (isPicked) {
                    btnStyle = 'bg-cinnabar-100 text-cinnabar-800 border-cinnabar-300 animate-shake';
                  }
                }

                return (
                  <button
                    key={btn.val}
                    onClick={() => setSlotPicked(btn.val)}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${btnStyle} active:scale-95`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {slotPicked && (
              <div
                className={`p-4 rounded-xl border space-y-2 animate-card-enter ${
                  slotPicked === currentSlot.correctPos
                    ? 'bg-bamboo-50 border-bamboo-300 text-bamboo-900'
                    : 'bg-cinnabar-50 border-cinnabar-200 text-cinnabar-900'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold text-sm">
                  {slotPicked === currentSlot.correctPos ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-bamboo-700" />
                      <span>判断准确！这个空必然填【{currentSlot.posLabel}】！</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-cinnabar-700" />
                      <span>看走眼了，正确应填：【{currentSlot.posLabel}】</span>
                    </>
                  )}
                </div>
                <div className="text-xs space-y-1 pt-1 border-t border-black/10">
                  <p>
                    <strong>结构线索：</strong>
                    {currentSlot.grammarClue}
                  </p>
                  <p>
                    <strong>解题理由：</strong>
                    {currentSlot.reason}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 步骤 3：单题快速排除演练 */}
      {currentSubTab === 'single' && (
        <div className="space-y-5 animate-card-enter">
          <div className="bg-paper-card border border-paper-border rounded-2xl p-5 sm:p-6 shadow-scholarly card-practice space-y-4">
            <div className="flex items-center justify-between border-b border-paper-border pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
                  第 3 步 · 单题排除实战
                </span>
                <span className="text-xs text-wood-500 font-mono">
                  第 {singleIdx + 1} / {SINGLE_BLANK_DRILLS.length} 题
                </span>
              </div>
              <button
                onClick={() => {
                  setSingleIdx((prev) => (prev + 1) % SINGLE_BLANK_DRILLS.length);
                  setSingleLetter(null);
                }}
                className="px-3 py-1 text-xs rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition cursor-pointer"
              >
                下一道真题 ➔
              </button>
            </div>

            <div className="bg-paper-50 p-4 rounded-xl border border-paper-border">
              <div className="text-xs text-wood-500 mb-1">真题句子：</div>
              <div className="text-sm sm:text-base font-bold text-wood-900 leading-relaxed select-all">
                {currentSingle.sentence}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentSingle.options.map((opt) => {
                const isChosen = singleLetter === opt.letter;
                const isRight = opt.letter === currentSingle.correctLetter;

                let optStyle = 'bg-paper-card border-paper-border text-wood-900 hover:border-bamboo-400';
                if (singleLetter) {
                  if (isRight) {
                    optStyle = 'bg-bamboo-700 text-white border-bamboo-800 shadow-sm animate-bounce-gentle';
                  } else if (isChosen) {
                    optStyle = 'bg-cinnabar-100 text-cinnabar-800 border-cinnabar-300 animate-shake';
                  }
                }

                return (
                  <button
                    key={opt.letter}
                    onClick={() => setSingleLetter(opt.letter)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${optStyle} active:scale-95`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-full bg-paper-200 text-wood-800 flex items-center justify-center font-bold text-xs">
                        {opt.letter}
                      </span>
                      <div>
                        <span className="font-bold text-sm font-mono">{opt.word}</span>
                        <span className="text-xs ml-2 text-wood-500">[{opt.pos}]</span>
                      </div>
                    </div>
                    <span className="text-xs text-wood-500">{opt.meaning}</span>
                  </button>
                );
              })}
            </div>

            {singleLetter && (
              <div
                className={`p-4 rounded-xl border space-y-2 animate-card-enter ${
                  singleLetter === currentSingle.correctLetter
                    ? 'bg-bamboo-50 border-bamboo-300 text-bamboo-900'
                    : 'bg-cinnabar-50 border-cinnabar-200 text-cinnabar-900'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold text-sm">
                  {singleLetter === currentSingle.correctLetter ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-bamboo-700" />
                      <span>太棒了！直接排除其他选项锁定正确答案！</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-cinnabar-700" />
                      <span>做错了，正确答案是：【{currentSingle.correctLetter}】</span>
                    </>
                  )}
                </div>
                <div className="text-xs space-y-1 pt-1 border-t border-black/10">
                  <p>
                    <strong>1. 空缺词性：</strong>
                    {currentSingle.step1SlotAnalysis}
                  </p>
                  <p>
                    <strong>2. 快速排除：</strong>
                    {currentSingle.step2Elimination}
                  </p>
                  <p>
                    <strong>3. 带入检查：</strong>
                    {currentSingle.step3ContextCheck}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 步骤 4：整篇真题挑题实战 */}
      {currentSubTab === 'full' && (
        <div className="space-y-5 animate-card-enter">
          <div className="bg-paper-card border border-paper-border rounded-2xl p-5 sm:p-6 shadow-scholarly space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-border pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cinnabar-100 text-cinnabar-800 font-bold">
                    只做 4 分钟 · 挑 4 道送分题
                  </span>
                  <span className="text-xs text-wood-500">共 10 空，每题 3.55 分</span>
                </div>
                <h3 className="font-bold text-base text-wood-900 mt-1">
                  {FULL_CLOZE_EXAM.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setAnswers({});
                    setActiveBlank(null);
                    setSubmitted(false);
                  }}
                  className="px-3 py-1 text-xs rounded-lg bg-paper-100 hover:bg-paper-200 text-wood-700 border border-paper-border transition cursor-pointer flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重做整篇</span>
                </button>
              </div>
            </div>

            {/* 做题提示 */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>挑题秘诀：</strong>标有“★ 送分题”的第 26、28、31、33 题语法特征最明显（系表结构、情态动词后动词原形、副词修饰动词、名词所有格），4分钟只做这4道拿14分，其余全蒙同一个选项！
              </p>
            </div>

            {/* 真题文章阅读与填空交互 */}
            <div className="p-4 sm:p-5 bg-paper-50 rounded-xl border border-paper-border leading-loose text-sm sm:text-base text-wood-900">
              {FULL_CLOZE_EXAM.passageTokens.map((token, idx) => {
                if (!token.isBlank || !token.blankIndex) {
                  return <span key={idx}>{token.text}</span>;
                }

                const bIndex = token.blankIndex;
                const isSelected = activeBlank === bIndex;
                const userAns = answers[bIndex];
                const exp = FULL_CLOZE_EXAM.blankExplanations[bIndex];
                const isEasy = exp?.difficulty.includes('送分题');

                let blankClass = 'bg-paper-card border-paper-border text-wood-700';
                if (isSelected) {
                  blankClass = 'bg-bamboo-100 border-bamboo-600 text-bamboo-900 ring-2 ring-bamboo-400';
                } else if (userAns) {
                  blankClass = 'bg-paper-200 border-wood-500 text-wood-900 font-bold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveBlank(bIndex)}
                    className={`inline-flex items-center justify-center min-w-[56px] h-7 px-2 mx-1 border rounded-md font-mono text-xs cursor-pointer transition-all ${blankClass}`}
                  >
                    <span>{bIndex}:</span>
                    <span className="ml-1 font-bold">{userAns || '___'}</span>
                    {isEasy && <span className="text-cinnabar-700 text-[10px] ml-0.5">★</span>}
                  </button>
                );
              })}
            </div>

            {/* 待选词池（点击直接填入当前选中的空） */}
            <div className="space-y-2 pt-2">
              <div className="text-xs text-wood-600 flex justify-between items-center">
                <span>
                  {activeBlank ? (
                    <strong className="text-bamboo-800">
                      正在填写第 {activeBlank} 空（点击下方单词填入）：
                    </strong>
                  ) : (
                    <span>请先点击文章中的空格，再点击下方单词填入：</span>
                  )}
                </span>
                <span className="text-[11px] text-wood-400">已填 {Object.keys(answers).length} / 10 空</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {FULL_CLOZE_EXAM.options.map((opt) => {
                  const isUsed = Object.values(answers).includes(opt.letter);

                  return (
                    <button
                      key={opt.letter}
                      onClick={() => handleSelectOption(opt.letter)}
                      disabled={!activeBlank || submitted}
                      className={`p-2 rounded-lg border text-left transition text-xs font-serif ${
                        isUsed
                          ? 'bg-paper-100 text-wood-400 border-paper-border line-through'
                          : 'bg-paper-card border-paper-border text-wood-900 hover:border-bamboo-500 hover:bg-paper-50 cursor-pointer card-vocab'
                      }`}
                    >
                      <span className="font-bold font-mono text-bamboo-800 mr-1">
                        [{opt.letter}]
                      </span>
                      <span className="font-mono font-medium">{opt.word}</span>
                      <span className="text-[10px] text-wood-400 ml-1">({opt.pos})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 交卷判分与解析 */}
            <div className="pt-3 border-t border-paper-border flex justify-between items-center">
              {!submitted ? (
                <button
                  onClick={() => {
                    setSubmitted(true);
                    showToast('已完成批改，请查看下方逐空解析！');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-bamboo-700 hover:bg-bamboo-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  交卷看得分与送分题解析
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="text-xs">
                    <span>得分：</span>
                    <strong className="text-base text-cinnabar-800 font-mono">
                      {calculateScore().score}
                    </strong>
                    <span> 分 (做对 {calculateScore().count} / 10 题)</span>
                  </div>
                </div>
              )}
            </div>

            {/* 答案与送分题逐空分析 */}
            {submitted && (
              <div className="mt-4 space-y-3 pt-3 border-t border-paper-border animate-card-enter">
                <h4 className="font-bold text-sm text-wood-900 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-bamboo-700" />
                  <span>各题分析（重点看标星的送分题）：</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(FULL_CLOZE_EXAM.blankExplanations).map(([blankNum, exp]) => {
                    const bNum = Number(blankNum);
                    const userLetter = answers[bNum];
                    const isCorrect = userLetter === exp.correctLetter;

                    return (
                      <div
                        key={blankNum}
                        className={`p-3.5 rounded-xl border space-y-1.5 ${
                          isCorrect
                            ? 'bg-bamboo-50/70 border-bamboo-300'
                            : 'bg-paper-50 border-paper-border'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold font-mono text-wood-900">
                              第 {blankNum} 题：
                            </span>
                            <span className="font-bold text-bamboo-800 font-mono">
                              正确 [{exp.correctLetter}] {exp.word}
                            </span>
                            <span className="text-[10px] text-wood-500">({exp.pos})</span>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              exp.difficulty.includes('送分题')
                                ? 'bg-cinnabar-100 text-cinnabar-800'
                                : 'bg-paper-200 text-wood-600'
                            }`}
                          >
                            {exp.difficulty}
                          </span>
                        </div>

                        <div className="text-xs text-wood-700 leading-relaxed">
                          {exp.analysis}
                        </div>

                        <div className="flex justify-between items-center text-[11px] pt-1">
                          <span
                            className={
                              isCorrect
                                ? 'text-bamboo-800 font-bold'
                                : 'text-cinnabar-700'
                            }
                          >
                            你的选择: {userLetter || '未作答'}{' '}
                            {isCorrect ? '✓ 答对' : '✗ 答错'}
                          </span>
                          {!isCorrect && (
                            <button
                              onClick={() => handleSaveMistakeFromBlank(bNum)}
                              className="text-wood-600 hover:text-wood-900 flex items-center space-x-1 underline cursor-pointer"
                            >
                              <BookMarked className="w-3 h-3" />
                              <span>收录到错题本</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
