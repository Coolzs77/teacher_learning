import React, { useState, useEffect } from 'react';
import { Cet6MistakeItem, MistakeReason, INITIAL_CET6_MISTAKES } from '../../data/cet6PracticeData';
import {
  BookMarked,
  Plus,
  Trash2,
  CheckCircle2,
  Filter,
  Tag,
  Sparkles,
  Lightbulb,
  RotateCcw
} from 'lucide-react';

export const Cet6MistakeView: React.FC = () => {
  const [mistakes, setMistakes] = useState<Cet6MistakeItem[]>(() => {
    try {
      const saved = localStorage.getItem('cet6_mistakes');
      return saved ? JSON.parse(saved) : INITIAL_CET6_MISTAKES;
    } catch (e) {
      return INITIAL_CET6_MISTAKES;
    }
  });

  const [activeType, setActiveType] = useState<string>('all');
  const [activeReason, setActiveReason] = useState<string>('all');
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
    setMistakes(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isMastered: !item.isMastered } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setMistakes(prev => prev.filter(item => item.id !== id));
    showToast('已从错题本移出');
  };

  const handleReset = () => {
    if (window.confirm('确定要恢复默认预置诊断错题吗？')) {
      setMistakes(INITIAL_CET6_MISTAKES);
      showToast('已恢复预置错题');
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContext.trim()) {
      alert('请填写标题和原题内容');
      return;
    }

    const typeLabels = {
      cloze: '选词填空',
      translation: '汉译英',
      syntax: '长难句',
      grammar: '核心语法'
    };

    const reasonLabels: Record<MistakeReason, string> = {
      pos_error: '🏷️ 词性看错',
      meaning_error: '🏷️ 句意理解偏差',
      vocab_unknown: '🏷️ 词汇盲区',
      careless: '🏷️ 粗心大意',
      time_short: '🏷️ 考场时间不足'
    };

    const newItem: Cet6MistakeItem = {
      id: `mis-m-${Date.now()}`,
      type: newType,
      typeLabel: typeLabels[newType],
      title: newTitle.trim(),
      sourceContext: newContext.trim(),
      myMistake: newMyMistake.trim() || '当时做错思路',
      correctAnswer: newCorrectAnswer.trim() || '正确答案与考点',
      reason: newReason,
      reasonLabel: reasonLabels[newReason],
      qiqiInsight: newInsight.trim() || '下次做题注意先看主干或词尾。',
      createdAt: new Date().toISOString().split('T')[0],
      isMastered: false
    };

    setMistakes(prev => [newItem, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewContext('');
    setNewMyMistake('');
    setNewCorrectAnswer('');
    setNewInsight('');
    showToast('✓ 错题已保存！');
  };

  const filtered = mistakes.filter(m => {
    if (activeType !== 'all' && m.type !== activeType) return false;
    if (activeReason !== 'all' && m.reason !== activeReason) return false;
    return true;
  });

  const masteredCount = mistakes.filter(m => m.isMastered).length;

  return (
    <div className="space-y-6 animate-fadeIn font-serif">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-wood-900 text-bamboo-200 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-bamboo-600">
          <Sparkles className="w-4 h-4 text-amberGold-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-paper-card rounded-2xl p-5 sm:p-6 border border-paper-border shadow-scholarly space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-paper-border pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-bamboo-100 text-bamboo-800 border border-bamboo-200 text-xs font-bold">
                第六优先级 · 错题弱点攻坚
              </span>
              <span className="text-xs text-wood-500">记错因 ➔ 提分备忘 ➔ 攻克打卡</span>
            </div>
            <h2 className="text-xl font-bold text-wood-900">
              琪琪专属六级错题本
            </h2>
            <p className="text-xs sm:text-sm text-wood-600 mt-1">
              累计记录 <strong className="text-wood-900">{mistakes.length}</strong> 道错题，已弄懂 <strong className="text-bamboo-800">{masteredCount}</strong> 道。考前专攻自己常错的薄弱点，提分最快！
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-tactile bg-bamboo-700 hover:bg-bamboo-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>记一道线下错题</span>
            </button>

            <button
              onClick={handleReset}
              title="恢复预置错题"
              className="p-2 rounded-xl border border-paper-border text-wood-400 hover:text-wood-700 hover:bg-paper-100 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 筛选控制器 */}
        <div className="space-y-2.5 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-wood-500 mr-1 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>题型：</span>
            </span>
            {[
              { key: 'all', label: '全部' },
              { key: 'cloze', label: '选词填空' },
              { key: 'translation', label: '汉译英' },
              { key: 'syntax', label: '长难句' },
              { key: 'grammar', label: '核心语法' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  activeType === tab.key
                    ? 'bg-wood-900 text-white font-bold shadow-2xs'
                    : 'bg-paper-100 text-wood-700 hover:bg-paper-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-wood-500 mr-1 flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5" />
              <span>错因：</span>
            </span>
            {[
              { key: 'all', label: '全部' },
              { key: 'pos_error', label: '🏷️ 词性看错' },
              { key: 'meaning_error', label: '🏷️ 句意理解偏差' },
              { key: 'vocab_unknown', label: '🏷️ 词汇盲区' },
              { key: 'careless', label: '🏷️ 粗心大意' },
              { key: 'time_short', label: '🏷️ 考场时间不足' }
            ].map(r => (
              <button
                key={r.key}
                onClick={() => setActiveReason(r.key)}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                  activeReason === r.key
                    ? 'bg-cinnabar-700 text-white font-bold'
                    : 'bg-paper-100 text-wood-600 hover:bg-paper-200 border border-paper-border/60'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* 错题列表 */}
        <div className="space-y-3 pt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-paper-border rounded-xl text-wood-400 text-xs">
              当前筛选下暂无错题记录
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition bg-paper-50 space-y-2.5 ${
                  item.isMastered ? 'border-bamboo-300 ring-1 ring-bamboo-200/60' : 'border-paper-border'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="bg-bamboo-100 text-bamboo-800 px-1.5 py-0.5 rounded font-bold">
                      {item.typeLabel}
                    </span>
                    <span className="bg-paper-200 text-wood-700 px-1.5 py-0.5 rounded">
                      {item.reasonLabel}
                    </span>
                    <strong className="text-wood-900 text-sm">{item.title}</strong>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleToggleMastered(item.id)}
                      className={`btn-tactile text-xs px-2 py-0.8 rounded-lg flex items-center space-x-1 cursor-pointer transition ${
                        item.isMastered
                          ? 'bg-bamboo-100 text-bamboo-900 font-bold border border-bamboo-300'
                          : 'bg-paper-200 text-wood-600 hover:bg-paper-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-bamboo-700" />
                      <span>{item.isMastered ? '已攻克' : '标记已攻克'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-wood-400 hover:text-cinnabar-800 p-0.5 cursor-pointer"
                      title="移除错题"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-paper-card rounded-lg border border-paper-border/80 font-sans text-xs text-wood-800 leading-relaxed">
                  {item.sourceContext}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 bg-cinnabar-50/60 rounded-lg border border-cinnabar-200/60">
                    <span className="font-bold text-cinnabar-900 block mb-0.5">当时错误思路：</span>
                    <p className="text-wood-800 font-sans">{item.myMistake}</p>
                  </div>

                  <div className="p-2.5 bg-bamboo-50/60 rounded-lg border border-bamboo-200/60">
                    <span className="font-bold text-bamboo-900 block mb-0.5">正确考点与答案：</span>
                    <p className="text-wood-900 font-sans font-bold">{item.correctAnswer}</p>
                  </div>
                </div>

                <div className="bg-amberGold-100/70 p-2.5 rounded-lg border border-amberGold-600/30 text-xs text-wood-900 flex items-start space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amberGold-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>琪琪提分备忘：</strong>
                    <span className="ml-1">{item.qiqiInsight}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 手动记错题模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-wood-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-card rounded-2xl max-w-lg w-full p-6 border border-paper-border shadow-scholarly-lg space-y-4 max-h-[90vh] overflow-y-auto font-serif">
            <div className="flex items-center justify-between border-b border-paper-border pb-3">
              <h3 className="font-bold text-wood-900 text-sm sm:text-base flex items-center space-x-1.5">
                <BookMarked className="w-4 h-4 text-bamboo-700" />
                <span>记一道线下试卷做错的题</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-wood-400 hover:text-wood-600 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-wood-800 block mb-1">题目简述</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="如：2026年真题选词第28题"
                  className="w-full p-2 bg-paper-50 border border-paper-border rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-wood-800 block mb-1">所属题型</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2 bg-paper-50 border border-paper-border rounded-xl text-xs"
                  >
                    <option value="cloze">选词填空</option>
                    <option value="translation">汉译英</option>
                    <option value="syntax">长难句</option>
                    <option value="grammar">核心语法</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-wood-800 block mb-1">做错原因</label>
                  <select
                    value={newReason}
                    onChange={e => setNewReason(e.target.value as any)}
                    className="w-full p-2 bg-paper-50 border border-paper-border rounded-xl text-xs"
                  >
                    <option value="pos_error">词性看错</option>
                    <option value="meaning_error">句意理解偏差</option>
                    <option value="vocab_unknown">词汇盲区</option>
                    <option value="careless">粗心大意</option>
                    <option value="time_short">考场时间不足</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-wood-800 block mb-1">原题内容</label>
                <textarea
                  rows={2}
                  value={newContext}
                  onChange={e => setNewContext(e.target.value)}
                  placeholder="输入题目句子或翻译原文..."
                  className="w-full p-2 bg-paper-50 border border-paper-border rounded-xl text-xs font-sans"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-cinnabar-800 block mb-1">当时错误思路</label>
                <input
                  type="text"
                  value={newMyMistake}
                  onChange={e => setNewMyMistake(e.target.value)}
                  placeholder="如：以为 active 是动词原形..."
                  className="w-full p-2 bg-paper-50 border border-paper-border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-bamboo-800 block mb-1">正确考点与答案</label>
                <input
                  type="text"
                  value={newCorrectAnswer}
                  onChange={e => setNewCorrectAnswer(e.target.value)}
                  placeholder="如：正确是形容词，选 proactive..."
                  className="w-full p-2 bg-paper-50 border border-paper-border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-wood-900 block mb-1">提分备忘（写给自己的一句话）</label>
                <textarea
                  rows={2}
                  value={newInsight}
                  onChange={e => setNewInsight(e.target.value)}
                  placeholder="下次做题先看词尾..."
                  className="w-full p-2 bg-paper-50 border border-paper-border rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-paper-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-tactile px-3.5 py-1.5 rounded-xl border border-paper-border text-wood-700 hover:bg-paper-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn-tactile px-3.5 py-1.5 rounded-xl bg-bamboo-700 text-white font-bold hover:bg-bamboo-800"
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
