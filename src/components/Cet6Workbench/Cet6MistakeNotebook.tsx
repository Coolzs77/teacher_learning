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
  AlertTriangle,
  Lightbulb,
  Search,
  RotateCcw
} from 'lucide-react';

export const Cet6MistakeNotebook: React.FC = () => {
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 新增错题表单
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
    showToast('已从错题本移除');
  };

  const handleResetToDefault = () => {
    if (window.confirm('确定要恢复默认预置诊断错题吗？')) {
      setMistakes(INITIAL_CET6_MISTAKES);
      showToast('已恢复预置错题');
    }
  };

  const handleCreateMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContext.trim()) {
      alert('请至少填写错题标题与题目内容');
      return;
    }

    const typeLabels = {
      cloze: '选词填空',
      translation: '汉译英',
      syntax: '长难句',
      grammar: '核心语法'
    };

    const reasonLabels: Record<MistakeReason, string> = {
      pos_error: '🏷️ 词性判断错误',
      meaning_error: '🏷️ 句意理解偏差',
      vocab_unknown: '🏷️ 词汇/句式盲区',
      careless: '🏷️ 粗心大意',
      time_short: '🏷️ 考场时间不足'
    };

    const newItem: Cet6MistakeItem = {
      id: `mis-manual-${Date.now()}`,
      type: newType,
      typeLabel: typeLabels[newType],
      title: newTitle.trim(),
      sourceContext: newContext.trim(),
      myMistake: newMyMistake.trim() || '做错选项/翻译语病',
      correctAnswer: newCorrectAnswer.trim() || '见正确解析',
      reason: newReason,
      reasonLabel: reasonLabels[newReason],
      qiqiInsight: newInsight.trim() || '下次做此类题先看主干或词尾特征。',
      createdAt: new Date().toISOString().split('T')[0],
      isMastered: false
    };

    setMistakes(prev => [newItem, ...prev]);
    setIsModalOpen(false);
    // 清空表单
    setNewTitle('');
    setNewContext('');
    setNewMyMistake('');
    setNewCorrectAnswer('');
    setNewInsight('');
    showToast('✓ 错题录入成功！');
  };

  // 过滤逻辑
  const filteredMistakes = mistakes.filter(item => {
    if (activeType !== 'all' && item.type !== activeType) return false;
    if (activeReason !== 'all' && item.reason !== activeReason) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.sourceContext.toLowerCase().includes(q) ||
        item.qiqiInsight.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const masteredCount = mistakes.filter(m => m.isMastered).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-emerald-400 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 border border-emerald-500/30">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 顶部总览卡片 */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-md border border-rose-100 flex items-center space-x-1">
                <BookMarked className="w-3.5 h-3.5 text-rose-500" />
                <span>精准归因 · 弱项歼灭</span>
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                从“错题盲目重看”到“分类归因提分点悟”
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              琪琪专属六级错题本与弱点攻坚
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              累计收录 <strong className="text-slate-800 font-mono">{mistakes.length}</strong> 道错题，已攻克 <strong className="text-emerald-600 font-mono">{masteredCount}</strong> 道。支持按题型与错误根因（词性判断/句意/时间等）筛选。
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-tactile bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>手动添加错题</span>
            </button>

            <button
              onClick={handleResetToDefault}
              title="恢复预置诊断错题"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 筛选控制器 */}
        <div className="space-y-3 pt-1">
          {/* 题型分类 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center space-x-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>题型：</span>
            </span>
            {[
              { key: 'all', label: '全部题型' },
              { key: 'cloze', label: '选词填空' },
              { key: 'translation', label: '汉译英' },
              { key: 'syntax', label: '长难句' },
              { key: 'grammar', label: '核心语法' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  activeType === tab.key
                    ? 'bg-indigo-900 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 错误原因分类 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center space-x-1 mr-1">
              <Tag className="w-3.5 h-3.5" />
              <span>根因：</span>
            </span>
            {[
              { key: 'all', label: '全部原因' },
              { key: 'pos_error', label: '🏷️ 词性判断错误' },
              { key: 'meaning_error', label: '🏷️ 句意理解偏差' },
              { key: 'vocab_unknown', label: '🏷️ 词汇盲区' },
              { key: 'careless', label: '🏷️ 粗心大意' },
              { key: 'time_short', label: '🏷️ 考场时间不足' }
            ].map(r => (
              <button
                key={r.key}
                onClick={() => setActiveReason(r.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  activeReason === r.key
                    ? 'bg-rose-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* 错题列表展示 */}
        <div className="space-y-4 pt-2">
          {filteredMistakes.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <BookMarked className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500">当前分类下暂无错题记录</p>
              <p className="text-xs text-slate-400 mt-1">在做选词填空、翻译或长难句时，点击“收录至错题本”即可沉淀于此！</p>
            </div>
          ) : (
            filteredMistakes.map(item => (
              <div
                key={item.id}
                className={`border rounded-2xl p-5 transition-all bg-white shadow-2xs relative ${
                  item.isMastered ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {item.typeLabel}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                      {item.reasonLabel}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleToggleMastered(item.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition ${
                        item.isMastered
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.isMastered ? '已攻克' : '标记已攻克'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="删除此错题"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 题目上下文原境 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 font-serif text-xs md:text-sm text-slate-800 mb-3 leading-relaxed">
                  {item.sourceContext}
                </div>

                {/* 做错 vs 正确答案 对照 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs">
                  <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200">
                    <span className="font-bold text-rose-900 block mb-1">❌ 当时错误思路 / 错选：</span>
                    <p className="text-rose-950 font-serif">{item.myMistake}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">✅ 考官正确答案 / 范例：</span>
                    <p className="text-emerald-950 font-serif font-bold">{item.correctAnswer}</p>
                  </div>
                </div>

                {/* 琪琪提分点悟 */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-amber-900">琪琪专属提分点悟：</strong>
                    <span className="ml-1">{item.qiqiInsight}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 手动添加错题模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-1.5">
                <BookMarked className="w-4 h-4 text-indigo-600" />
                <span>录入线下试卷做错题目</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMistake} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">错题标题简述</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="如：2026年6月真题选词填空第28题"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">所属题型</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="cloze">选词填空</option>
                    <option value="translation">汉译英</option>
                    <option value="syntax">长难句</option>
                    <option value="grammar">核心语法</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">错误根因分类</label>
                  <select
                    value={newReason}
                    onChange={e => setNewReason(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="pos_error">词性判断错误</option>
                    <option value="meaning_error">句意理解偏差</option>
                    <option value="vocab_unknown">词汇盲区</option>
                    <option value="careless">粗心大意</option>
                    <option value="time_short">考场时间不足</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">原题语境 / 句子</label>
                <textarea
                  rows={2}
                  value={newContext}
                  onChange={e => setNewContext(e.target.value)}
                  placeholder="贴入英文句子或中文翻译题干..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-serif"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-rose-800 block mb-1">我的错误回答 / 误区</label>
                <input
                  type="text"
                  value={newMyMistake}
                  onChange={e => setNewMyMistake(e.target.value)}
                  placeholder="如：误选了 B，因为以为它是形容词..."
                  className="w-full p-2.5 border border-rose-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-800 block mb-1">正确答案与考点</label>
                <input
                  type="text"
                  value={newCorrectAnswer}
                  onChange={e => setNewCorrectAnswer(e.target.value)}
                  placeholder="如：正确答案是 C. drastically (副词修饰动词)..."
                  className="w-full p-2.5 border border-emerald-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-amber-900 block mb-1">下次破局点悟 (给自己的备忘)</label>
                <textarea
                  rows={2}
                  value={newInsight}
                  onChange={e => setNewInsight(e.target.value)}
                  placeholder="一句话提醒自己下次考场怎么一眼识破..."
                  className="w-full p-2.5 border border-amber-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-tactile px-4 py-2 rounded-xl text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn-tactile px-4 py-2 rounded-xl text-xs bg-indigo-900 text-white font-bold hover:bg-indigo-800 shadow-xs cursor-pointer"
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
