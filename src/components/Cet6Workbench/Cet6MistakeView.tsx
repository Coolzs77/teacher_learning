import React, { useState, useEffect } from 'react';
import { Cet6MistakeItem, MistakeReason, INITIAL_CET6_MISTAKES } from '../../data/cet6PracticeData';
import {
  BookMarked,
  Plus,
  Trash2,
  CheckCircle2,
  Tag,
  Check,
  RotateCcw
} from 'lucide-react';

interface Cet6MistakeViewProps {
  activeSubSection?: string;
}

export const Cet6MistakeView: React.FC<Cet6MistakeViewProps> = ({
  activeSubSection = 'all',
}) => {
  const [mistakes, setMistakes] = useState<Cet6MistakeItem[]>(() => {
    try {
      const saved = localStorage.getItem('cet6_mistakes');
      return saved ? JSON.parse(saved) : INITIAL_CET6_MISTAKES;
    } catch (e) {
      return INITIAL_CET6_MISTAKES;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 表单状态
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'cloze' | 'translation' | 'syntax' | 'grammar'>('cloze');
  const [newContext, setNewContext] = useState('');
  const [newMyMistake, setNewMyMistake] = useState('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('');
  const [newReason, setNewReason] = useState<MistakeReason>('pos_error');
  const [newInsight, setNewInsight] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('cet6_mistakes', JSON.stringify(mistakes));
    } catch (e) {}
  }, [mistakes]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleToggleMastered = (id: string) => {
    setMistakes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isMastered: !item.isMastered } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setMistakes((prev) => prev.filter((item) => item.id !== id));
    showToast('已从错题本移出');
  };

  const handleAddManualMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContext.trim()) {
      showToast('请完整填写错题题目与题目背景');
      return;
    }

    const typeLabels: Record<string, string> = {
      cloze: '选词填空',
      translation: '汉译英',
      syntax: '长难句',
      grammar: '语法题',
    };

    const reasonLabels: Record<MistakeReason, string> = {
      pos_error: '词性看错',
      meaning_error: '句意理解偏差',
      vocab_unknown: '词汇盲区',
      careless: '粗心看错',
      time_short: '时间不够',
    };

    const newItem: Cet6MistakeItem = {
      id: 'mistake-' + Date.now(),
      type: newType,
      typeLabel: typeLabels[newType],
      title: newTitle,
      sourceContext: newContext,
      myMistake: newMyMistake || '未记录错选',
      correctAnswer: newCorrectAnswer || '见解析',
      reason: newReason,
      reasonLabel: reasonLabels[newReason],
      qiqiInsight: newInsight || '考前过两遍，不踩重复坑',
      createdAt: new Date().toISOString().split('T')[0],
      isMastered: false,
    };

    setMistakes([newItem, ...mistakes]);
    setIsModalOpen(false);
    showToast('已添加新错题！');

    setNewTitle('');
    setNewContext('');
    setNewMyMistake('');
    setNewCorrectAnswer('');
    setNewInsight('');
  };

  // 根据左侧栏子菜单过滤
  const filteredMistakes = mistakes.filter((m) => {
    if (activeSubSection === 'all') return true;
    if (activeSubSection === 'cloze') return m.type === 'cloze';
    if (activeSubSection === 'translation') return m.type === 'translation';
    if (activeSubSection === 'syntax') return m.type === 'syntax' || m.type === 'grammar';
    return true;
  });

  const masteredCount = mistakes.filter((m) => m.isMastered).length;

  return (
    <div className="space-y-6 font-serif">
      {/* Toast 提醒 */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-wood-900 text-paper-50 px-4 py-2 rounded-xl text-xs shadow-xl flex items-center space-x-2 border border-stone-700 animate-fadeIn">
          <Check className="w-4 h-4 text-bamboo-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 顶部总览卡片 */}
      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly card-planning flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-card-enter">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 font-bold">
              查漏补缺
            </span>
            <span className="text-xs text-wood-500">考前过两遍，少踩重复的坑</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-wood-900">
            琪琪专属错题本（共 {mistakes.length} 道，已攻克 {masteredCount} 道）
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-bamboo-700 hover:bg-bamboo-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>手动记一道错题</span>
        </button>
      </div>

      {/* 错题卡片列表 */}
      <div className="space-y-4 animate-card-enter">
        {filteredMistakes.length === 0 ? (
          <div className="p-8 text-center bg-paper-card rounded-2xl border border-paper-border text-wood-500 text-xs">
            当前分类下暂无错题。在平时的练习中点击“收录到错题本”，做错的题就会自动沉淀在这里。
          </div>
        ) : (
          filteredMistakes.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all card-rescue space-y-3 relative overflow-hidden ${
                item.isMastered
                  ? 'bg-paper-50/60 border-paper-border opacity-70'
                  : 'bg-paper-card border-paper-border shadow-scholarly'
              }`}
            >
              {/* 攻克盖章动效 */}
              {item.isMastered && (
                <div className="absolute right-8 top-5 border-2 border-cinnabar-700 text-cinnabar-700 px-3 py-1 rounded font-bold text-xs transform -rotate-12 animate-stamp select-none pointer-events-none">
                  【已弄懂攻克】
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-border pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-wood-800 text-paper-50 text-xs font-bold">
                    {item.typeLabel}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 font-medium">
                    {item.reasonLabel}
                  </span>
                  <span className="font-bold text-sm text-wood-900">{item.title}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleMastered(item.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 cursor-pointer ${
                      item.isMastered
                        ? 'bg-paper-200 text-wood-700 hover:bg-paper-300'
                        : 'bg-bamboo-100 text-bamboo-900 hover:bg-bamboo-200 border border-bamboo-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-bamboo-700" />
                    <span>{item.isMastered ? '撤销攻克' : '标记已弄懂'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-wood-400 hover:text-cinnabar-700 transition cursor-pointer"
                    title="从错题本移出"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 题目上下文 */}
              <div className="text-xs bg-paper-50 p-3 rounded-xl border border-paper-border leading-relaxed text-wood-900 select-all">
                {item.sourceContext}
              </div>

              {/* 当时我的错误 vs 正确答案 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-cinnabar-50 rounded-lg border border-cinnabar-200 text-cinnabar-900">
                  <strong>当时我做错：</strong>
                  <span>{item.myMistake}</span>
                </div>
                <div className="p-2.5 bg-bamboo-50 rounded-lg border border-bamboo-200 text-bamboo-900">
                  <strong>正确答案：</strong>
                  <span>{item.correctAnswer}</span>
                </div>
              </div>

              {/* 考前提醒 */}
              <div className="text-xs text-wood-600 bg-paper-100/50 p-2 rounded-lg">
                <span className="font-bold text-wood-800">考前提醒：</span>
                {item.qiqiInsight}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 手动新增错题 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-paper-card rounded-2xl border border-paper-border shadow-2xl max-w-lg w-full p-6 space-y-4 animate-card-enter">
            <h3 className="font-bold text-lg text-wood-900">手动记一道错题</h3>

            <form onSubmit={handleAddManualMistake} className="space-y-3 text-xs">
              <div>
                <label className="text-wood-700 font-bold block mb-1">题型分类：</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full p-2 rounded-lg bg-paper-50 border border-paper-border font-serif text-wood-900"
                >
                  <option value="cloze">选词填空</option>
                  <option value="translation">汉译英</option>
                  <option value="syntax">长难句</option>
                  <option value="grammar">语法真题</option>
                </select>
              </div>

              <div>
                <label className="text-wood-700 font-bold block mb-1">错因标签：</label>
                <select
                  value={newReason}
                  onChange={(e: any) => setNewReason(e.target.value)}
                  className="w-full p-2 rounded-lg bg-paper-50 border border-paper-border font-serif text-wood-900"
                >
                  <option value="pos_error">词性看错</option>
                  <option value="meaning_error">句意理解偏差</option>
                  <option value="vocab_unknown">词汇盲区（生词）</option>
                  <option value="careless">粗心看串行</option>
                  <option value="time_short">考场时间不够瞎蒙</option>
                </select>
              </div>

              <div>
                <label className="text-wood-700 font-bold block mb-1">错题简题：</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例如 2026年6月卷一 Section A 第28空"
                  className="w-full p-2 rounded-lg bg-paper-50 border border-paper-border font-serif text-wood-900"
                />
              </div>

              <div>
                <label className="text-wood-700 font-bold block mb-1">题目原句或背景：</label>
                <textarea
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  rows={2}
                  placeholder="把错题原句粘贴在这里..."
                  className="w-full p-2 rounded-lg bg-paper-50 border border-paper-border font-serif text-wood-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-cinnabar-800 font-bold block mb-1">当时错选：</label>
                  <input
                    type="text"
                    value={newMyMistake}
                    onChange={(e) => setNewMyMistake(e.target.value)}
                    placeholder="例如 选了 A (副词)"
                    className="w-full p-2 rounded-lg bg-paper-50 border border-paper-border font-serif text-wood-900"
                  />
                </div>
                <div>
                  <label className="text-bamboo-800 font-bold block mb-1">正确答案：</label>
                  <input
                    type="text"
                    value={newCorrectAnswer}
                    onChange={(e) => setNewCorrectAnswer(e.target.value)}
                    placeholder="例如 正确是 C (动词原形)"
                    className="w-full p-2 rounded-lg bg-paper-50 border border-paper-border font-serif text-wood-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-wood-700 font-bold block mb-1">考前提醒（一句话防踩坑）：</label>
                <input
                  type="text"
                  value={newInsight}
                  onChange={(e) => setNewInsight(e.target.value)}
                  placeholder="例如情态动词后面必须用动词原形，不要被副词带跑"
                  className="w-full p-2 rounded-lg bg-paper-50 border border-paper-border font-serif text-wood-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-paper-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-paper-100 hover:bg-paper-200 text-wood-700 font-serif"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-bamboo-700 hover:bg-bamboo-800 text-white font-bold font-serif shadow-xs"
                >
                  保存错题
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
