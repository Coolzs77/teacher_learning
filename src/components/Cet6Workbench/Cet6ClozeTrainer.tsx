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
  HelpCircle,
  Award,
  Zap,
  RotateCcw,
  BookOpen,
  BookmarkPlus
} from 'lucide-react';

interface Cet6ClozeTrainerProps {
  onAddMistake?: (item: Omit<Cet6MistakeItem, 'id' | 'createdAt' | 'isMastered'>) => void;
}

export const Cet6ClozeTrainer: React.FC<Cet6ClozeTrainerProps> = ({ onAddMistake }) => {
  const [drillTab, setDrillTab] = useState<'pos' | 'slot' | 'single' | 'full'>('pos');

  // --- 1. 词性秒判状态 ---
  const [posIndex, setPosIndex] = useState(0);
  const [posSelected, setPosSelected] = useState<string | null>(null);
  const [posFeedback, setPosFeedback] = useState<boolean | null>(null);
  const currentPosWord = POS_DRILL_WORDS[posIndex % POS_DRILL_WORDS.length];

  const handlePosCheck = (pos: 'N' | 'V' | 'Adj' | 'Adv') => {
    setPosSelected(pos);
    const isCorrect = pos === currentPosWord.correctPos;
    setPosFeedback(isCorrect);
  };

  const handleNextPos = () => {
    setPosSelected(null);
    setPosFeedback(null);
    setPosIndex(prev => prev + 1);
  };

  // --- 2. 槽位预判状态 ---
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotSelected, setSlotSelected] = useState<string | null>(null);
  const [slotRevealed, setSlotRevealed] = useState(false);
  const currentSlot = SLOT_DRILL_QUESTIONS[slotIndex % SLOT_DRILL_QUESTIONS.length];

  const handleSlotSelect = (pos: 'N' | 'V' | 'Adj' | 'Adv') => {
    setSlotSelected(pos);
    setSlotRevealed(true);
  };

  const handleNextSlot = () => {
    setSlotSelected(null);
    setSlotRevealed(false);
    setSlotIndex(prev => prev + 1);
  };

  // --- 3. 单空秒杀演练状态 ---
  const [singleIndex, setSingleIndex] = useState(0);
  const [singleSelectedLetter, setSingleSelectedLetter] = useState<string | null>(null);
  const [singleSubmitted, setSingleSubmitted] = useState(false);
  const currentSingle = SINGLE_BLANK_DRILLS[singleIndex % SINGLE_BLANK_DRILLS.length];

  // --- 4. 整篇演练状态 ---
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [activeBlank, setActiveBlank] = useState<number | null>(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSelectBlankOption = (letter: string) => {
    if (activeBlank === null || examSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [activeBlank]: letter }));
    // 自动寻找下一个未填的空
    const blanks = [26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
    const currentIndex = blanks.indexOf(activeBlank);
    const nextBlank = blanks.slice(currentIndex + 1).find(b => !userAnswers[b]);
    if (nextBlank) {
      setActiveBlank(nextBlank);
    } else {
      setActiveBlank(null);
    }
  };

  // 计算得分
  const calculateScore = () => {
    let correctCount = 0;
    const explanations = FULL_CLOZE_EXAM.blankExplanations;
    Object.keys(explanations).forEach((key) => {
      const bIdx = Number(key);
      const exp = explanations[bIdx];
      if (userAnswers[bIdx] === exp.correctLetter) {
        correctCount++;
      }
    });
    return (correctCount * 3.55).toFixed(1);
  };

  const handleAddToMistakes = (title: string, context: string, myAns: string, rightAns: string, insight: string) => {
    if (onAddMistake) {
      onAddMistake({
        type: 'cloze',
        typeLabel: '选词填空',
        title,
        sourceContext: context,
        myMistake: myAns,
        correctAnswer: rightAns,
        reason: 'pos_error',
        reasonLabel: '🏷️ 词性判断错误',
        qiqiInsight: insight
      });
      showToast('✓ 已成功存入专属错题本！');
    } else {
      // 降级存入 localStorage
      try {
        const saved = localStorage.getItem('cet6_mistakes');
        const list = saved ? JSON.parse(saved) : [];
        list.unshift({
          id: `mis-cloze-${Date.now()}`,
          type: 'cloze',
          typeLabel: '选词填空',
          title,
          sourceContext: context,
          myMistake: myAns,
          correctAnswer: rightAns,
          reason: 'pos_error',
          reasonLabel: '🏷️ 词性判断错误',
          qiqiInsight: insight,
          createdAt: new Date().toISOString().split('T')[0],
          isMastered: false
        });
        localStorage.setItem('cet6_mistakes', JSON.stringify(list));
        showToast('✓ 已存入错题本！');
      } catch (e) {
        showToast('保存成功');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast 提示 */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-emerald-400 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-emerald-500/30">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 模块主卡片 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        {/* 顶部标签 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-md border border-rose-100 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-rose-500" />
                <span>第一优先级攻坚 · 稳拿 14.2 分</span>
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                告别“全选C蒙题”，4分钟利用词性锁定送分题！
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              选词填空四步实战突击营
            </h2>
          </div>

          {/* 4 种子功能切换栏 */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 flex-wrap gap-1">
            <button
              onClick={() => setDrillTab('pos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                drillTab === 'pos'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>1. 词性秒判速测</span>
            </button>
            <button
              onClick={() => setDrillTab('slot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                drillTab === 'slot'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>2. 语法槽位速判</span>
            </button>
            <button
              onClick={() => setDrillTab('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                drillTab === 'single'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>3. 单空排除秒杀</span>
            </button>
            <button
              onClick={() => setDrillTab('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                drillTab === 'full'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>4. 真题整篇实战</span>
            </button>
          </div>
        </div>

        {/* ================= TAB 1: 词性秒判速测 ================= */}
        {drillTab === 'pos' && (
          <div className="mt-6 max-w-2xl mx-auto space-y-6">
            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-xl text-xs text-sky-950">
              <strong className="block text-sm font-bold text-sky-900 mb-1">
                训练目标：扫视单词后缀，0.5秒精准分类！
              </strong>
              选词填空第 1 步绝对不要去读文章！考场前 60 秒扫视 15 个选项，根据后缀快速在试卷上标注 N/V/Adj/Adv。请快速判断下列六级高频考点词的词性：
            </div>

            {/* 单词大卡片 */}
            <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50 text-center space-y-4 shadow-xs">
              <div className="text-xs text-slate-400 font-medium">第 {posIndex + 1} / {POS_DRILL_WORDS.length} 题</div>
              <div className="font-serif text-3xl md:text-4xl font-black text-indigo-950 tracking-wide">
                {currentPosWord.word}
              </div>

              {/* 4 个大词性按钮 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-lg mx-auto">
                {[
                  { pos: 'N', label: 'Noun (名词)', bg: 'hover:bg-amber-50 hover:border-amber-400' },
                  { pos: 'V', label: 'Verb (动词)', bg: 'hover:bg-blue-50 hover:border-blue-400' },
                  { pos: 'Adj', label: 'Adj (形容词)', bg: 'hover:bg-emerald-50 hover:border-emerald-400' },
                  { pos: 'Adv', label: 'Adv (副词)', bg: 'hover:bg-purple-50 hover:border-purple-400' }
                ].map(btn => (
                  <button
                    key={btn.pos}
                    onClick={() => handlePosCheck(btn.pos as any)}
                    disabled={posSelected !== null}
                    className={`btn-tactile py-3 px-2 rounded-xl text-xs font-bold border transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      posSelected === btn.pos
                        ? btn.pos === currentPosWord.correctPos
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-rose-600 text-white border-rose-600'
                        : posSelected !== null && btn.pos === currentPosWord.correctPos
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : `bg-white border-slate-200 text-slate-700 ${btn.bg}`
                    }`}
                  >
                    <span className="text-base font-black">{btn.pos}</span>
                    <span className="text-[10px] font-normal opacity-80">{btn.label.split(' ')[1]}</span>
                  </button>
                ))}
              </div>

              {/* 反馈与后缀规律解析 */}
              {posFeedback !== null && (
                <div className={`p-4 rounded-xl text-left border mt-4 animate-fadeIn ${
                  posFeedback ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      {posFeedback ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                      <span className="text-xs font-bold text-slate-800">
                        {posFeedback ? '回答正确！' : `回答错误！正确词性为：${currentPosWord.posLabel}`}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      词义：{currentPosWord.meaning}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    <strong>词尾密码：</strong> {currentPosWord.suffix}。{currentPosWord.ruleExplanation}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 pt-2.5">
                    <button
                      onClick={() => handleAddToMistakes(
                        `选词填空词性判断失误: ${currentPosWord.word}`,
                        currentPosWord.word,
                        `误判为 ${posSelected}`,
                        `正确为 ${currentPosWord.posLabel} (${currentPosWord.suffix})`,
                        currentPosWord.ruleExplanation
                      )}
                      className="text-xs text-slate-500 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>收录至错题本</span>
                    </button>

                    <button
                      onClick={handleNextPos}
                      className="btn-tactile bg-indigo-900 text-white text-xs px-4 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer font-medium"
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

        {/* ================= TAB 2: 语法槽位速判 ================= */}
        {drillTab === 'slot' && (
          <div className="mt-6 max-w-2xl mx-auto space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-950">
              <strong className="block text-sm font-bold text-amber-900 mb-1">
                训练目标：紧盯空格前后2个词，锁定目标词性！
              </strong>
              六级命题人在空格位置设置了极其死板的语法槽位。不需要看懂整句，只要看前后关键词即可锁定所需词性：
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-5">
              <div className="text-xs text-slate-400 font-medium">第 {slotIndex + 1} / {SLOT_DRILL_QUESTIONS.length} 题</div>

              {/* 句子展示 */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 font-serif text-base md:text-lg leading-relaxed text-slate-900 shadow-2xs">
                <span>{currentSlot.sentenceBefore} </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded font-bold underline decoration-2 decoration-rose-500 font-sans text-sm">
                  {currentSlot.blankPlaceholder}
                </span>
                <span> {currentSlot.sentenceAfter}</span>
              </div>

              <div className="text-xs font-bold text-slate-600 text-center">
                请判断空格处必须填入什么词性？
              </div>

              {/* 选项按钮 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
                {['N', 'V', 'Adj', 'Adv'].map(pos => (
                  <button
                    key={pos}
                    onClick={() => handleSlotSelect(pos as any)}
                    disabled={slotRevealed}
                    className={`btn-tactile py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      slotSelected === pos
                        ? pos === currentSlot.correctPos
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-rose-600 text-white border-rose-600'
                        : slotRevealed && pos === currentSlot.correctPos
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>

              {/* 槽位解析 */}
              {slotRevealed && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>语法线索：{currentSlot.grammarClue}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {currentSlot.reason}
                  </p>
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={handleNextSlot}
                      className="btn-tactile bg-indigo-900 text-white text-xs px-4 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer font-medium"
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

        {/* ================= TAB 3: 单空排除秒杀 ================= */}
        {drillTab === 'single' && (
          <div className="mt-6 max-w-2xl mx-auto space-y-6">
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl text-xs text-emerald-950">
              <strong className="block text-sm font-bold text-emerald-900 mb-1">
                训练目标：词性预判 + 选项词缀排除 = 15秒秒杀！
              </strong>
              体验考场真实单空攻克流程：先判断空格词性，再看选项词尾排除非对应词性的干扰项，瞬间锁定答案。
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-5">
              <div className="text-xs text-slate-400 font-medium">第 {singleIndex + 1} / {SINGLE_BLANK_DRILLS.length} 题</div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 font-serif text-base text-slate-900 leading-relaxed">
                {currentSingle.sentence}
              </div>

              {/* 4 个选项 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentSingle.options.map(opt => (
                  <button
                    key={opt.letter}
                    onClick={() => {
                      setSingleSelectedLetter(opt.letter);
                      setSingleSubmitted(true);
                    }}
                    disabled={singleSubmitted}
                    className={`btn-tactile p-3 rounded-xl text-xs text-left border transition cursor-pointer flex items-center justify-between ${
                      singleSelectedLetter === opt.letter
                        ? opt.letter === currentSingle.correctLetter
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-rose-600 text-white border-rose-600'
                        : singleSubmitted && opt.letter === currentSingle.correctLetter
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <strong className="font-mono text-sm mr-2">{opt.letter}. {opt.word}</strong>
                      <span className="text-[11px] opacity-75">[{opt.pos}] {opt.meaning}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* 三步拆解解析 */}
              {singleSubmitted && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 animate-fadeIn">
                  <div className="font-bold text-indigo-900 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>考场三步秒杀还原：</span>
                  </div>
                  <div className="space-y-1.5 text-slate-600 pl-2">
                    <p><strong>第1步（看槽位）：</strong>{currentSingle.step1SlotAnalysis}</p>
                    <p><strong>第2步（做排除）：</strong>{currentSingle.step2Elimination}</p>
                    <p><strong>第3步（代入验）：</strong>{currentSingle.step3ContextCheck}</p>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSingleSelectedLetter(null);
                        setSingleSubmitted(false);
                        setSingleIndex(prev => prev + 1);
                      }}
                      className="btn-tactile bg-indigo-900 text-white text-xs px-4 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
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

        {/* ================= TAB 4: 真题整篇实战 ================= */}
        {drillTab === 'full' && (
          <div className="mt-6 space-y-6">
            {/* 顶栏提示与战术指引 */}
            <div className="bg-gradient-to-r from-rose-50 to-indigo-50 border border-rose-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                    考场 4 分钟演练
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {FULL_CLOZE_EXAM.quickPickupTip}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  {FULL_CLOZE_EXAM.title}
                </h3>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">已填进度</span>
                  <span className="font-mono text-sm font-bold text-indigo-900">
                    {Object.keys(userAnswers).length} / 10 空
                  </span>
                </div>
                {examSubmitted ? (
                  <button
                    onClick={() => {
                      setUserAnswers({});
                      setExamSubmitted(false);
                      setActiveBlank(null);
                    }}
                    className="btn-tactile bg-slate-800 text-white text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重测一次</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setExamSubmitted(true)}
                    className="btn-tactile bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
                  >
                    提交批改 (测分)
                  </button>
                )}
              </div>
            </div>

            {/* 得分战报卡片（提交后显示） */}
            {examSubmitted && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-base">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      本次演练得分：{calculateScore()} 分 / 35.5 分满分
                    </h4>
                    <p className="text-xs text-emerald-800">
                      {Number(calculateScore()) >= 14.2
                        ? '🎉 太棒了！已突破 14.2 分及格目标线，成功把这 14 分稳稳捡回！'
                        : '重点复习标有【送分题】的 4 道题，只要做对这 4 题即可达成 14.2 分！'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 左右分栏：左侧文章带填空，右侧 15 个选项词库 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 左栏：文章篇章 */}
              <div className="lg:col-span-8 bg-slate-50/70 border border-slate-200 rounded-xl p-5 md:p-6 space-y-4">
                <div className="text-xs text-slate-400 flex items-center justify-between pb-2 border-b border-slate-200">
                  <span>点击文中的方框编号即可在右侧选择单词填入</span>
                  <span className="text-rose-600 font-bold">★ 标记为送分题</span>
                </div>

                <div className="font-serif text-sm md:text-base leading-loose text-slate-800 space-x-1">
                  {FULL_CLOZE_EXAM.passageTokens.map((token, idx) => {
                    if (!token.isBlank || !token.blankIndex) {
                      return <span key={idx}>{token.text}</span>;
                    }

                    const bIdx = token.blankIndex;
                    const ans = userAnswers[bIdx];
                    const isSelected = activeBlank === bIdx;
                    const isEasy = FULL_CLOZE_EXAM.blankExplanations[bIdx]?.difficulty.includes('送分题');

                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveBlank(bIdx)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 mx-1 rounded-lg border text-xs font-sans transition cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-indigo-600 bg-indigo-50 border-indigo-300 font-bold'
                            : ans
                            ? examSubmitted
                              ? ans === token.correctLetter
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                                : 'bg-rose-100 text-rose-900 border-rose-400 font-bold line-through'
                              : 'bg-indigo-100/70 text-indigo-950 border-indigo-200 font-bold'
                            : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'
                        }`}
                      >
                        <span className="font-mono text-[11px] text-slate-500">[{bIdx}]</span>
                        {isEasy && <span className="text-amber-500 text-[10px]" title="送分题">★</span>}
                        <span className="font-bold">
                          {ans ? `${ans}. ${FULL_CLOZE_EXAM.options.find(o => o.letter === ans)?.word}` : '请填入'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 提交后显示详细逐题深度解析 */}
                {examSubmitted && (
                  <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      逐空精细解析与考场取舍建议
                    </h4>
                    <div className="space-y-2">
                      {Object.keys(FULL_CLOZE_EXAM.blankExplanations).map((key) => {
                        const bIdx = Number(key);
                        const exp = FULL_CLOZE_EXAM.blankExplanations[bIdx];
                        const myAns = userAnswers[bIdx];
                        const isCorrect = myAns === exp.correctLetter;

                        return (
                          <div
                            key={bIdx}
                            className={`p-3 rounded-lg border text-xs ${
                              isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold font-mono text-slate-800">第 [{bIdx}] 题</span>
                                <span className="font-mono font-bold text-indigo-900">
                                  正确答案：{exp.correctLetter} ({exp.word})
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                                  {exp.pos}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  exp.difficulty.includes('送分') ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {exp.difficulty}
                                </span>
                              </div>
                              <span className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {isCorrect ? '✓ 做对 (+3.55分)' : `✗ 你的选择: ${myAns || '未填'}`}
                              </span>
                            </div>

                            <p className="text-slate-600 leading-relaxed">{exp.analysis}</p>

                            {!isCorrect && (
                              <button
                                onClick={() => handleAddToMistakes(
                                  `选词填空真题错题: 第 ${bIdx} 题`,
                                  `第 ${bIdx} 题: ${exp.word}`,
                                  myAns || '未作答',
                                  `${exp.correctLetter}. ${exp.word} (${exp.pos})`,
                                  exp.analysis
                                )}
                                className="mt-1 text-[11px] text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer"
                              >
                                <BookmarkPlus className="w-3 h-3" />
                                <span>存入错题本</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 右栏：15 个选项集合池 */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 self-start sticky top-32">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">
                    15 个词汇选项池 (A ~ O)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {activeBlank ? `正在填第 [${activeBlank}] 空` : '请在左侧选空'}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                  {FULL_CLOZE_EXAM.options.map(opt => {
                    const isUsed = Object.values(userAnswers).includes(opt.letter);

                    return (
                      <button
                        key={opt.letter}
                        onClick={() => handleSelectBlankOption(opt.letter)}
                        disabled={examSubmitted}
                        className={`w-full text-left p-2 rounded-lg border text-xs transition cursor-pointer flex items-center justify-between ${
                          isUsed
                            ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                            : activeBlank
                            ? 'hover:bg-indigo-50 hover:border-indigo-300 border-slate-200 text-slate-800'
                            : 'border-slate-100 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-indigo-900 w-4">{opt.letter}</span>
                          <span className="font-serif font-medium">{opt.word}</span>
                          <span className="text-[10px] text-slate-400">[{opt.pos}]</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{opt.meaning}</span>
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
