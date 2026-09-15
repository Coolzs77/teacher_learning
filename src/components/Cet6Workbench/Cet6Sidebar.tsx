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
  BookOpen,
  ChevronDown,
  ChevronRight,
  Target
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

export interface Cet6SidebarProps {
  activeModule: Cet6ModuleId;
  activeSubSection: string;
  onSelectModule: (id: Cet6ModuleId, subSection?: string) => void;
  onCollapse: () => void;
  onSwitchToChinese?: () => void;
}

export interface Cet6MenuItem {
  id: Cet6ModuleId;
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  tag: string;
  tagType: 'bamboo' | 'cinnabar' | 'wood';
  subSections?: { id: string; label: string }[];
}

export const Cet6Sidebar: React.FC<Cet6SidebarProps> = ({
  activeModule,
  activeSubSection,
  onSelectModule,
  onCollapse,
  onSwitchToChinese,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [activeModule]: true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const menuItems: Cet6MenuItem[] = [
    {
      id: 'score',
      icon: <TrendingUp className="w-4 h-4" />,
      title: '1. 提分账本与时间表',
      subTitle: '离及格差37分，考场130分钟怎么掐表',
      tag: '目标',
      tagType: 'bamboo',
      subSections: [
        { id: 'plan', label: '各题型提分推演（多拿37分）' },
        { id: 'time', label: '考场130分钟时间表（分秒必争）' },
      ],
    },
    {
      id: 'cloze',
      icon: <Scissors className="w-4 h-4" />,
      title: '2. 选词填空：挑送分题',
      subTitle: '看词尾认词性，4分钟拿稳14分',
      tag: '必做',
      tagType: 'cinnabar',
      subSections: [
        { id: 'pos', label: '① 看词尾认词性（名动形副）' },
        { id: 'slot', label: '② 看空前后确定缺什么词' },
        { id: 'single', label: '③ 单题快速排除练习' },
        { id: 'full', label: '④ 真题整篇挑题实战' },
      ],
    },
    {
      id: 'translation',
      icon: <Languages className="w-4 h-4" />,
      title: '3. 汉译英：套句型写',
      subTitle: '定主谓宾套句型，不用生词拿高分',
      tag: '提分',
      tagType: 'cinnabar',
      subSections: [
        { id: 'practice', label: '① 逐句动笔试写（范文对照）' },
        { id: 'patterns', label: '② 10 个常用加分句型' },
        { id: 'themes', label: '③ 8 大常考国情词汇' },
        { id: 'replacements', label: '④ 替换高级好词' },
      ],
    },
    {
      id: 'writing',
      icon: <PenTool className="w-4 h-4" />,
      title: '4. 5段作文模板与仿写',
      subTitle: '背熟5段框架，填词写满180词',
      tag: '保底',
      tagType: 'bamboo',
      subSections: [
        { id: 'template', label: '① 5 段核心背诵框架' },
        { id: 'drafting', label: '② 在线填词试写（实时计词）' },
        { id: 'essays', label: '③ 近年真题范文参考' },
        { id: 'vocab', label: '④ 常用连接词与加分词' },
      ],
    },
    {
      id: 'syntax',
      icon: <Split className="w-4 h-4" />,
      title: '5. 长难句：抓主谓宾',
      subTitle: '跳过从句修饰，5秒看懂谁做了什么',
      tag: '阅读',
      tagType: 'wood',
      subSections: [
        { id: 'step1', label: '① 原文与速读提示' },
        { id: 'step2', label: '② 找出主谓宾主干' },
        { id: 'step3', label: '③ 展开从句补充细节' },
        { id: 'step4', label: '④ 中文翻译与重点词' },
      ],
    },
    {
      id: 'grammar',
      icon: <Zap className="w-4 h-4" />,
      title: '6. 常考语法小练习',
      subTitle: '非谓语、定语从句、倒装句真题实测',
      tag: '常考',
      tagType: 'wood',
      subSections: [
        { id: 'all', label: '全部真题语法题' },
        { id: 'nonfinite', label: '非谓语动词 (doing/done)' },
        { id: 'clause', label: '定语从句 (which/where)' },
        { id: 'inversion', label: '倒装与强调句' },
        { id: 'subjunctive', label: '虚拟语气' },
      ],
    },
    {
      id: 'mistakes',
      icon: <BookMarked className="w-4 h-4" />,
      title: '7. 琪琪的错题本',
      subTitle: '做错的记在这，少踩重复的坑',
      tag: '攻坚',
      tagType: 'wood',
      subSections: [
        { id: 'all', label: '全部错题归纳' },
        { id: 'cloze', label: '选词填空错题' },
        { id: 'translation', label: '汉译英错题' },
        { id: 'syntax', label: '长难句与语法错题' },
      ],
    },
    {
      id: 'emergency',
      icon: <ShieldAlert className="w-4 h-4" />,
      title: '8. 考场卡壳急救包',
      subTitle: '没话说套例子，脑子空了默写5句',
      tag: '急救',
      tagType: 'cinnabar',
      subSections: [
        { id: 'examples', label: '① 举例卡壳套句（3类）' },
        { id: 'fiveSteps', label: '② 大脑空白保底 5 步法' },
        { id: 'essentialTen', label: '③ 考前20分钟必看 10 句' },
      ],
    },
  ];

  const filteredItems = menuItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subSections?.some((s) => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-paper-card rounded-2xl border border-paper-border shadow-scholarly flex flex-col max-h-[calc(100vh-40px)] sticky top-6 z-20 font-serif transition-all">
      {/* 顶部一键切回教资按钮 */}
      {onSwitchToChinese && (
        <div className="p-3 border-b border-paper-border bg-paper-100/80 rounded-t-2xl">
          <button
            onClick={onSwitchToChinese}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-paper-card hover:bg-paper-200 text-wood-700 hover:text-wood-900 text-xs font-serif border border-paper-border transition shadow-xs cursor-pointer group"
          >
            <span className="flex items-center space-x-1.5 font-bold text-bamboo-800">
              <BookOpen className="w-3.5 h-3.5 text-bamboo-700 group-hover:-translate-x-0.5 transition-transform" />
              <span>切换回 · 初中语文教资备考</span>
            </span>
            <span className="text-[10px] text-wood-500 bg-paper-100 px-1.5 py-0.5 rounded border border-paper-border">
              158篇
            </span>
          </button>
        </div>
      )}

      {/* 六级头部：专属备考目标与收起按键 */}
      <div className="p-3.5 border-b border-paper-border flex items-center justify-between bg-paper-50">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-bamboo-700 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
            <Target className="w-4 h-4 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-serif font-bold text-xs text-wood-900 truncate">
                英语六级备考
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cinnabar-100 text-cinnabar-800 font-bold">
                差37分
              </span>
            </div>
            <p className="text-[10px] text-wood-500 truncate">琪琪专属：388 ➔ 425+ 分冲刺</p>
          </div>
        </div>

        <button
          onClick={onCollapse}
          className="p-1.5 rounded-lg hover:bg-paper-200 text-wood-600 hover:text-wood-900 transition cursor-pointer flex items-center text-xs"
          title="收起备考目录"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* 搜索框 */}
      <div className="p-3 border-b border-paper-border bg-paper-50/50">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-wood-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索题型、词尾、句型..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-paper-card border border-paper-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-bamboo-600 font-serif text-wood-900 placeholder:text-wood-400"
          />
        </div>
      </div>

      {/* 模块手风琴列表 */}
      <div className="p-2 space-y-1 overflow-y-auto flex-1 scrollbar-thin">
        {filteredItems.map((item) => {
          const isActive = activeModule === item.id;
          const isExpanded = expandedModules[item.id] || isActive;

          return (
            <div key={item.id} className="rounded-xl overflow-hidden transition-all">
              {/* 一级模块按钮 */}
              <div
                onClick={() => {
                  onSelectModule(item.id, item.subSections?.[0]?.id);
                  setExpandedModules((prev) => ({ ...prev, [item.id]: true }));
                }}
                className={`w-full flex items-start space-x-2.5 p-2.5 rounded-xl text-left transition cursor-pointer ${
                  isActive
                    ? 'bg-bamboo-700 text-white shadow-sm'
                    : 'bg-paper-card hover:bg-paper-100 text-wood-800'
                }`}
              >
                <div
                  className={`mt-0.5 shrink-0 ${
                    isActive ? 'text-white' : 'text-bamboo-700'
                  }`}
                >
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs truncate">
                      {item.title}
                    </span>
                    <div className="flex items-center space-x-1 shrink-0 ml-1">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-serif ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.tagType === 'cinnabar'
                            ? 'bg-cinnabar-100 text-cinnabar-800'
                            : 'bg-bamboo-100 text-bamboo-800'
                        }`}
                      >
                        {item.tag}
                      </span>
                      {item.subSections && (
                        <button
                          onClick={(e) => toggleExpand(item.id, e)}
                          className="p-0.5 hover:bg-black/10 rounded transition"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-[11px] font-serif truncate mt-0.5 ${
                      isActive ? 'text-white/80' : 'text-wood-500'
                    }`}
                  >
                    {item.subTitle}
                  </p>
                </div>
              </div>

              {/* 二级子菜单展开（手风琴树状） */}
              {isExpanded && item.subSections && (
                <div className="ml-6 pl-2 my-1 border-l border-paper-border/80 space-y-0.5 animate-fadeIn">
                  {item.subSections.map((sub) => {
                    const isSubActive = isActive && activeSubSection === sub.id;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => onSelectModule(item.id, sub.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-serif transition flex items-center justify-between cursor-pointer ${
                          isSubActive
                            ? 'bg-bamboo-100 text-bamboo-900 font-bold border border-bamboo-300 shadow-2xs'
                            : 'text-wood-600 hover:text-wood-900 hover:bg-paper-100'
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                        {isSubActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-bamboo-700 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部贴地气鼓励语 */}
      <div className="p-3 border-t border-paper-border bg-paper-100/50 rounded-b-2xl text-center">
        <p className="text-[11px] text-wood-500 font-serif">
          每天练 15 分钟，把 37 分一点点捡回来！
        </p>
      </div>
    </aside>
  );
};
