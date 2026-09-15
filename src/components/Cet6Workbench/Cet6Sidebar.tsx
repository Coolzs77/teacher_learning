import React, { useState } from 'react';
import {
  TrendingUp,
  Scissors,
  Languages,
  PenTool,
  Split,
  Zap,
  BookMarked,
  ShieldAlert,
  PanelLeftClose,
  Search,
  CheckCircle2
} from 'lucide-react';

export type Cet6ModuleId =
  | 'score'
  | 'cloze'
  | 'translation'
  | 'writing'
  | 'syntax'
  | 'grammar'
  | 'mistakes'
  | 'emergency';

interface Cet6SidebarProps {
  activeModule: Cet6ModuleId;
  onSelectModule: (id: Cet6ModuleId) => void;
  onCollapse: () => void;
}

export const Cet6Sidebar: React.FC<Cet6SidebarProps> = ({
  activeModule,
  onSelectModule,
  onCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems: {
    id: Cet6ModuleId;
    icon: React.ReactNode;
    title: string;
    subTitle: string;
    tag: string;
    tagType: 'bamboo' | 'cinnabar' | 'wood';
  }[] = [
    {
      id: 'score',
      icon: <TrendingUp className="w-4 h-4" />,
      title: '1. 提分规划与时间表',
      subTitle: '388➔425+ 差距与130分钟节奏',
      tag: '目标',
      tagType: 'bamboo',
    },
    {
      id: 'cloze',
      icon: <Scissors className="w-4 h-4" />,
      title: '2. 选词填空4步专项',
      subTitle: '看词尾找线索，4分钟拿14分',
      tag: '重点',
      tagType: 'cinnabar',
    },
    {
      id: 'translation',
      icon: <Languages className="w-4 h-4" />,
      title: '3. 汉译英台阶演练',
      subTitle: '抓主谓宾，套句型对照试写',
      tag: '提分',
      tagType: 'cinnabar',
    },
    {
      id: 'writing',
      icon: <PenTool className="w-4 h-4" />,
      title: '4. 5段万能作文与仿写',
      subTitle: '逐段背诵打卡与180词仿写',
      tag: '保底',
      tagType: 'bamboo',
    },
    {
      id: 'syntax',
      icon: <Split className="w-4 h-4" />,
      title: '5. 真题长难句步步拆解',
      subTitle: '主谓宾剥离与5秒速读法',
      tag: '阅读',
      tagType: 'wood',
    },
    {
      id: 'grammar',
      icon: <Zap className="w-4 h-4" />,
      title: '6. 核心真题语法实战',
      subTitle: '非谓语/定从/倒装/虚拟语气',
      tag: '实战',
      tagType: 'wood',
    },
    {
      id: 'mistakes',
      icon: <BookMarked className="w-4 h-4" />,
      title: '7. 专属错题本与攻坚',
      subTitle: '按词性/句意/粗心等根因分类',
      tag: '攻坚',
      tagType: 'wood',
    },
    {
      id: 'emergency',
      icon: <ShieldAlert className="w-4 h-4" />,
      title: '8. 考场急救包与锦囊',
      subTitle: '卡壳套句与考前20分钟必背',
      tag: '急救',
      tagType: 'cinnabar',
    },
  ];

  const filteredItems = menuItems.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subTitle.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full lg:w-80 shrink-0 bg-paper-card rounded-2xl border border-paper-border shadow-scholarly flex flex-col max-h-[calc(100vh-100px)] sticky top-20 z-10 transition-all">
      {/* 侧边栏头部 */}
      <div className="p-3.5 border-b border-paper-border flex items-center justify-between bg-paper-100/80 rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-bamboo-700 text-white flex items-center justify-center text-xs font-serif font-bold">
            六
          </div>
          <div>
            <span className="font-serif font-bold text-xs text-wood-900 block leading-tight">
              六级专项备考目录
            </span>
            <span className="text-[10px] text-wood-500 font-serif">琪琪 388➔425+ 分</span>
          </div>
        </div>

        <button
          onClick={onCollapse}
          className="btn-tactile px-2 py-1 rounded-lg hover:bg-paper-200 text-wood-600 hover:text-wood-900 transition cursor-pointer flex items-center space-x-1 text-xs font-serif"
          title="收起左侧目录"
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
          <span>收起</span>
        </button>
      </div>

      {/* 搜索框 */}
      <div className="p-3 border-b border-paper-border/60 bg-paper-50">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-wood-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索题型、词尾、句型..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-paper-card border border-paper-border rounded-xl text-xs text-wood-900 placeholder:text-wood-400 font-serif focus:outline-hidden focus:ring-1 focus:ring-bamboo-600"
          />
        </div>
      </div>

      {/* 目录列表 */}
      <div className="p-2.5 space-y-1.5 overflow-y-auto flex-1">
        {filteredItems.map(item => {
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer flex items-start space-x-2.5 ${
                isActive
                  ? 'bg-bamboo-700 text-white border-bamboo-700 shadow-sm font-serif'
                  : 'bg-paper-card hover:bg-paper-100 border-paper-border/70 text-wood-800'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-paper-200 text-wood-700'
                }`}
              >
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-wood-900 font-serif'}`}>
                    {item.title}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-serif shrink-0 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.tagType === 'cinnabar'
                        ? 'bg-cinnabar-50 text-cinnabar-800 border border-cinnabar-200'
                        : item.tagType === 'bamboo'
                        ? 'bg-bamboo-100 text-bamboo-800 border border-bamboo-200'
                        : 'bg-paper-200 text-wood-600'
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>
                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    isActive ? 'text-white/80' : 'text-wood-500'
                  }`}
                >
                  {item.subTitle}
                </p>
              </div>
            </button>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-xs text-wood-400 font-serif">
            未找到相关模块
          </div>
        )}
      </div>

      {/* 底部小提示 */}
      <div className="p-3 border-t border-paper-border bg-paper-100/60 rounded-b-2xl text-[11px] text-wood-500 font-serif text-center">
        今天想练什么，就点左边哪一项
      </div>
    </div>
  );
};
