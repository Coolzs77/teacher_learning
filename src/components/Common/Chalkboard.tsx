import React from 'react';

interface ChalkNode {
  title: string;
  points: string[];
  tag?: string;
}

interface ChalkboardProps {
  title: string;
  author: string;
  mainBoardNodes?: ChalkNode[];
  rawMainBoard?: string;
  subBoard: string[];
  className?: string;
}

export const Chalkboard: React.FC<ChalkboardProps> = ({
  title,
  author,
  mainBoardNodes,
  rawMainBoard,
  subBoard,
  className = ''
}) => {
  // Parse rawMainBoard if mainBoardNodes not directly passed
  const parsedNodes: ChalkNode[] = mainBoardNodes || (() => {
    if (!rawMainBoard) {
      return [
        { title: '教学重点', points: ['抓住核心词句展开研读', '体会情感表达与写作技法'] },
        { title: '教学过程', points: ['初读感知 -> 精读品味 -> 朗读深化'] },
        { title: '思想主旨', points: ['理解作者思想情怀，落实一课一得'] }
      ];
    }

    // Clean up ASCII borders from raw string
    const lines = rawMainBoard
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.includes('┌') && !l.includes('└') && !l.includes('─') && !l.includes('│'));

    const nodes: ChalkNode[] = [];
    let currentCategory: ChalkNode | null = null;

    for (const line of lines) {
      const cleanLine = line.replace(/^[|│├├──└──\s*]+/, '').replace(/[|│]+$/, '').trim();
      if (!cleanLine || cleanLine.includes(title)) continue;

      if (cleanLine.startsWith('【') && cleanLine.endsWith('】')) {
        if (currentCategory) nodes.push(currentCategory);
        currentCategory = { title: cleanLine.replace(/[【】]/g, ''), points: [] };
      } else if (currentCategory) {
        currentCategory.points.push(cleanLine);
      } else {
        nodes.push({ title: '核心板书', points: [cleanLine] });
      }
    }

    if (currentCategory) nodes.push(currentCategory);
    return nodes.length > 0 ? nodes : [
      { title: '核心要点', points: lines.slice(1) }
    ];
  })();

  return (
    <div className={`relative rounded-2xl bg-[#1A2820] border-8 border-[#3D2C20] shadow-2xl p-6 md:p-8 text-[#FAF9F5] font-serif overflow-hidden select-none ${className}`}>
      {/* Chalkboard Slate Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Board Header: Title & Author Calligraphy */}
      <div className="relative pb-5 border-b border-white/20 flex flex-wrap items-baseline justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-widest text-[#7ED6DF]/80 font-sans font-semibold">
            初中语文试讲结构化板书设计
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-wider text-[#F9F7E8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            《{title.replace(/[《》]/g, '')}》
            {author && <span className="text-lg md:text-xl font-normal text-[#F9F7E8]/80 ml-3">· {author}</span>}
          </h3>
        </div>

        <div className="flex items-center space-x-3 text-xs text-white/60">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 text-[#FFEAA7] border border-white/15">
            ✏️ 规范粉笔书写 · 重点突出
          </span>
        </div>
      </div>

      {/* Main Grid: Left 70% Main Board + Right 30% Sub Board */}
      <div className="relative pt-6 grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {/* Left 70%: 主板书区 (Main Blackboard) */}
        <div className="lg:col-span-7 space-y-4 pr-0 lg:pr-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FCEBA4] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFEAA7] inline-block" />
              <span>【主板书区 · 教学脉络与核心切片】</span>
            </span>
            <span className="text-[11px] text-white/50">居中书写，占黑板约 70%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedNodes.map((node, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-white/25 bg-white/[0.04] p-4 backdrop-blur-sm space-y-2.5 shadow-inner"
              >
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <h4 className="font-bold text-sm md:text-base text-[#FFEAA7] tracking-wide flex items-center space-x-2">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-[#FFEAA7]/20 text-[#FFEAA7] font-mono">
                      0{idx + 1}
                    </span>
                    <span>{node.title}</span>
                  </h4>
                  {node.tag && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {node.tag}
                    </span>
                  )}
                </div>

                <ul className="space-y-1.5 text-xs md:text-sm text-stone-200 leading-relaxed">
                  {node.points.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-start space-x-2">
                      <span className="text-[#55E6C1] select-none text-xs mt-0.5">▪</span>
                      <span className="flex-1">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Chalk Divider for Desktop */}
        <div className="hidden lg:block absolute top-6 bottom-0 left-[70%] border-l-2 border-dashed border-white/20" />

        {/* Right 30%: 副板书区 (Auxiliary Blackboard) */}
        <div className="lg:col-span-3 space-y-4 pl-0 lg:pl-4 border-t lg:border-t-0 border-white/20 pt-4 lg:pt-0">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF7675] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF7675] inline-block" />
              <span>【副板书区】</span>
            </span>
            <span className="text-[11px] text-white/50">占约 30%</span>
          </div>

          <div className="rounded-xl border border-white/20 bg-black/20 p-4 space-y-3 shadow-inner">
            <div className="text-xs text-[#FAB1A0] font-bold pb-1 border-b border-white/10">
              难字注音 · 词义释难 · 技法小结
            </div>

            <ul className="space-y-2 text-xs md:text-sm text-stone-200">
              {subBoard.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 group">
                  <span className="text-[#FF7675] font-bold select-none">•</span>
                  <span className="group-hover:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-white/10 text-[11px] text-white/40 italic">
              提示：考场试讲时，随讲随写难读生字与词义，试讲结束前保留在副板书区域。
            </div>
          </div>
        </div>
      </div>

      {/* Chalk Tray Simulation */}
      <div className="mt-8 pt-3 border-t-4 border-[#2A1E16] flex items-center justify-between text-[11px] text-white/40">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <div className="w-8 h-2 rounded-sm bg-[#F5F5F0] shadow-sm" title="白粉笔" />
            <div className="w-8 h-2 rounded-sm bg-[#FFEAA7] shadow-sm" title="黄粉笔" />
            <div className="w-8 h-2 rounded-sm bg-[#55E6C1] shadow-sm" title="绿粉笔" />
          </div>
          <span>黑板下沿槽位 · 规范示范</span>
        </div>
        <span>一课一得 · 师生互动板书</span>
      </div>
    </div>
  );
};
