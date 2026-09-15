import React, { useState, useEffect } from 'react';
import { LessonCustomData } from '../../utils/lessonVariants';
import { X, Save, RotateCcw, Edit3, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface LessonEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  author: string;
  initialData: LessonCustomData;
  onSave: (data: LessonCustomData) => void;
  onReset: () => void;
  isCustomized: boolean;
}

export const LessonEditModal: React.FC<LessonEditModalProps> = ({
  isOpen,
  onClose,
  lessonTitle,
  author,
  initialData,
  onSave,
  onReset,
  isCustomized,
}) => {
  const [formData, setFormData] = useState<LessonCustomData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof LessonCustomData, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-wood-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-3xl max-h-[90vh] bg-paper-card border border-paper-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-paper-border flex items-center justify-between bg-paper-100/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-bamboo-700 text-white flex items-center justify-center shadow-sm">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-wood-900">
                  自定义修改《{lessonTitle}》教学设计
                </h2>
                {isCustomized && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-serif font-bold">
                    已有定制
                  </span>
                )}
              </div>
              <p className="text-xs text-wood-600 font-serif">
                作者：{author} · 修改后仅对当前课文生效，保存到本地离线存储
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-paper-200 text-wood-600 hover:text-wood-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-wood-900 font-serif">
          {/* Section 1: 导入语 */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-wood-900 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-bamboo-700" />
              <span>1. 课堂导入语示范（口语化试讲台词，建议1.5分钟以内）</span>
            </label>
            <textarea
              rows={4}
              value={formData.importScript || ''}
              onChange={(e) => handleChange('importScript', e.target.value)}
              placeholder="例如：上课，同学们好，请坐！生活中有许多美好的瞬间..."
              className="w-full p-3 bg-white border border-paper-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-bamboo-600 leading-relaxed font-serif"
            />
          </div>

          {/* Section 2: 教学重难点 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-wood-900">
                2. 教学重点（紧扣考纲要求）
              </label>
              <textarea
                rows={3}
                value={formData.keyPoints || ''}
                onChange={(e) => handleChange('keyPoints', e.target.value)}
                placeholder="例如：品味课文中修辞手法的表达效果，学会有感情地朗读..."
                className="w-full p-2.5 bg-white border border-paper-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-bamboo-600 leading-relaxed font-serif"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-wood-900">
                3. 教学难点（突破点）
              </label>
              <textarea
                rows={3}
                value={formData.difficulties || ''}
                onChange={(e) => handleChange('difficulties', e.target.value)}
                placeholder="例如：体会作者在字里行间所寄寓的思想感情..."
                className="w-full p-2.5 bg-white border border-paper-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-bamboo-600 leading-relaxed font-serif"
              />
            </div>
          </div>

          {/* Section 3: 核心切片范围与标题 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-wood-900">
                4. 建议精讲段落切片范围
              </label>
              <input
                type="text"
                value={formData.sliceRange || ''}
                onChange={(e) => handleChange('sliceRange', e.target.value)}
                placeholder="例如：第3-5自然段（重点春景描摹）"
                className="w-full p-2.5 bg-white border border-paper-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-wood-900">
                5. 核心切片探究主题
              </label>
              <input
                type="text"
                value={formData.sliceTitle || ''}
                onChange={(e) => handleChange('sliceTitle', e.target.value)}
                placeholder="例如：抓关键词句，展开多维画面品析"
                className="w-full p-2.5 bg-white border border-paper-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
              />
            </div>
          </div>

          {/* Section 4: 试讲探究提问与师生对话 */}
          <div className="space-y-3 p-4 bg-paper-50 rounded-xl border border-paper-border">
            <h3 className="text-xs sm:text-sm font-bold text-wood-900 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-bamboo-700" />
              <span>6. 核心研讨师生对话示范（设问、预设回答与评价追问）</span>
            </h3>

            <div className="space-y-1">
              <span className="text-xs font-bold text-wood-700">【教师提问设计】：</span>
              <textarea
                rows={2}
                value={formData.teacherQuestion || ''}
                onChange={(e) => handleChange('teacherQuestion', e.target.value)}
                placeholder="教师抛出的主问题或研讨指令..."
                className="w-full p-2.5 bg-white border border-paper-border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-700">【预设学生回答】：</span>
              <textarea
                rows={2}
                value={formData.studentAnswer || ''}
                onChange={(e) => handleChange('studentAnswer', e.target.value)}
                placeholder="学生代表回答发言..."
                className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-bamboo-800">【教师评价与点拨追问】：</span>
              <textarea
                rows={2}
                value={formData.teacherFeedback || ''}
                onChange={(e) => handleChange('teacherFeedback', e.target.value)}
                placeholder="教师对学生回答的积极理答与追问启发..."
                className="w-full p-2.5 bg-white border border-paper-border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif"
              />
            </div>
          </div>

          {/* Section 5: 黑板板书设计 */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-wood-900 flex items-center justify-between">
              <span>7. 黑板主板书内容（支持纯文本与分行符号呈现）</span>
              <span className="text-[11px] text-wood-500 font-normal">
                每行一条，可在黑板组件中实时渲染
              </span>
            </label>
            <textarea
              rows={5}
              value={formData.mainBoard || ''}
              onChange={(e) => handleChange('mainBoard', e.target.value)}
              placeholder={`例如：\n《春》写景赏析\n┌─ 春草图：草软如毯（生机）\n├─ 春花图：繁花似锦（色彩）\n└─ 春风图：抚面温润（情思）\n【主旨】：热爱自然 · 拥抱希望`}
              className="w-full p-3 bg-white border border-paper-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-paper-border bg-paper-100/70 flex flex-wrap items-center justify-between gap-3">
          <div>
            <button
              onClick={onReset}
              className="btn-tactile flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-paper-200 hover:bg-rose-100 hover:text-rose-800 text-wood-700 text-xs font-serif transition cursor-pointer"
              title="清除自定义修改，恢复考纲默认教案"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>恢复考纲默认教案</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-wood-700 text-xs font-serif transition cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="btn-tactile flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-bamboo-700 hover:bg-bamboo-800 text-white text-xs font-serif font-bold shadow transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存本课修改</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
