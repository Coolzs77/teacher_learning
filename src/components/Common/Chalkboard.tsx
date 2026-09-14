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
  // Format blackboard lines for authentic classroom presentation
  const formattedLines = React.useMemo(() => {
    if (rawMainBoard) {
      // Split raw mainboard and clean any box borders
      const lines = rawMainBoard
        .split('\n')
        .map(l => l.trimEnd())
        .filter(l => {
          const t = l.trim();
          return t && !t.includes('┌───────') && !t.includes('└───────') && !t.includes('───────────────');
        });

      return lines.map(line => {
        let clean = line.replace(/^[|│\s]+/, '  ').replace(/[|│\s]+$/, '');
        if (clean.includes(title) && clean.includes(author)) {
          return null; // Don't repeat title if already at top of blackboard
        }
        return clean;
      }).filter(Boolean) as string[];
    }

    if (mainBoardNodes && mainBoardNodes.length > 0) {
      const generated: string[] = [];
      mainBoardNodes.forEach((node, idx) => {
        generated.push(`【${node.title}】${node.tag ? ` (${node.tag})` : ''}`);
        node.points.forEach((pt, pIdx) => {
          const prefix = pIdx === node.points.length - 1 ? '  └── ' : '  ├── ';
          generated.push(`${prefix}${pt}`);
        });
        if (idx < mainBoardNodes.length - 1) generated.push('');
      });
      return generated;
    }

    return [
      `【核心脉络】`,
      `  ├── 抓住关键语句展开研读，体会作者思想情感`,
      `  ├── 分析核心表达手法，落实一课一得`,
      `  └── 指导有感情朗读，深化文本理解`,
      ``,
      `【主旨升华】 落实语文学科核心素养 · 融汇真情实感`
    ];
  }, [rawMainBoard, mainBoardNodes, title, author]);

  // Determine line color and style based on blackboard chalk conventions
  const renderChalkLine = (line: string, index: number) => {
    const trimmed = line.trim();

    // 1. Topic / Section Header (Chalk Golden Yellow)
    if (trimmed.startsWith('【') || trimmed.startsWith('一、') || trimmed.startsWith('二、') || trimmed.startsWith('三、')) {
      return (
        <div key={index} className="text-[#FFEAA7] font-bold text-sm md:text-base tracking-wide my-1 flex items-center">
          <span className="text-[#FFEAA7] mr-1.5 opacity-90">✦</span>
          <span>{trimmed}</span>
        </div>
      );
    }

    // 2. Sublimation / Theme Climax (Chalk Coral Pink/Red)
    if (trimmed.includes('主旨') || trimmed.includes('思想情怀') || trimmed.includes('情感态度') || trimmed.includes('中心立意') || trimmed.includes('写作精妙')) {
      return (
        <div key={index} className="text-[#FF7675] font-bold text-xs md:text-sm tracking-wide mt-2 pt-1 border-t border-dashed border-white/20 flex items-center">
          <span className="text-[#FF7675] mr-1.5 font-mono">★</span>
          <span>{trimmed.replace(/^[|│\s*•\-]+/, '')}</span>
        </div>
      );
    }

    // 3. Structural Branches (Chalk White / Mint Cyan)
    const isBranch = line.includes('├') || line.includes('└') || line.includes('┌') || line.includes('┼') || line.includes('➔') || line.includes('──');
    
    return (
      <div
        key={index}
        className={`font-serif text-xs md:text-[13.5px] leading-relaxed tracking-wide whitespace-pre-wrap ${
          isBranch ? 'text-[#FAF9F5]' : 'text-stone-200'
        }`}
      >
        {line.split(/(├──|└──|┌──|┼──|➔|──)/g).map((part, pIdx) => {
          if (part === '├──' || part === '└──' || part === '┌──' || part === '┼──' || part === '➔' || part === '──') {
            return (
              <span key={pIdx} className="text-[#81ECEC] font-mono font-bold select-none px-0.5">
                {part}
              </span>
            );
          }
          if (part.includes('：') || part.includes(':')) {
            const [label, ...rest] = part.split(/[:：]/);
            return (
              <span key={pIdx}>
                <span className="text-[#FFEAA7] font-medium">{label}：</span>
                <span className="text-[#FAF9F5]">{rest.join('：')}</span>
              </span>
            );
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className={`relative rounded-xl bg-[#1E2D24] border-8 border-[#3A291E] shadow-2xl p-4 md:p-6 text-[#FAF9F5] font-serif overflow-hidden select-none ${className}`}>
      {/* Authentic Chalkboard Slate Texture & Smudge Overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
        }}
      />

      {/* Classroom Blackboard Header: Large Center Title */}
      <div className="relative pb-3 border-b border-white/20 text-center space-y-1">
        <div className="text-[10px] uppercase tracking-widest text-[#81ECEC]/70 font-sans font-semibold">
          全真考场规范板书设计 · 结构图示化教学
        </div>
        <div className="flex items-center justify-center space-x-3">
          <h3 className="text-xl md:text-2xl font-bold tracking-widest text-[#FAF9F5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            《{title.replace(/[《》]/g, '')}》
          </h3>
          {author && (
            <span className="text-sm md:text-base font-normal text-[#FFEAA7] opacity-90 tracking-wider">
              {author}
            </span>
          )}
        </div>
      </div>

      {/* Blackboard Core Area: 72% Main Board + 28% Auxiliary Board */}
      <div className="relative pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 72%: 主板书区 (Authentic Slate Layout) */}
        <div className="lg:col-span-8 space-y-2 pr-0 lg:pr-3">
          <div className="flex items-center justify-between pb-1 text-[11px] text-white/50 border-b border-white/10">
            <span className="text-[#FFEAA7] font-bold flex items-center space-x-1">
              <span>【主板书 · 教学脉络与核心切片】</span>
            </span>
            <span>占黑板约 70% · 居中工整书写</span>
          </div>

          {/* Genuine Chalk Written Lines */}
          <div className="p-3.5 rounded-lg bg-black/15 border border-white/10 space-y-1.5 shadow-inner min-h-[180px]">
            {formattedLines.map((line, idx) => renderChalkLine(line, idx))}
          </div>
        </div>

        {/* Vertical Chalk Dotted Line Divider for Desktop */}
        <div className="hidden lg:block absolute top-4 bottom-0 left-[68%] border-l border-dashed border-white/25" />

        {/* Right 28%: 副板书区 (生字词、重点技法) */}
        <div className="lg:col-span-4 space-y-2 pl-0 lg:pl-3 border-t lg:border-t-0 border-white/20 pt-3 lg:pt-0">
          <div className="flex items-center justify-between pb-1 text-[11px] text-white/50 border-b border-white/10">
            <span className="text-[#FF7675] font-bold flex items-center space-x-1">
              <span>【副板书】</span>
            </span>
            <span>占约 30% · 随讲随写</span>
          </div>

          <div className="p-3 rounded-lg bg-black/25 border border-white/10 space-y-2.5 shadow-inner">
            <div className="text-[11px] text-[#FAB1A0] font-bold pb-1 border-b border-white/10 flex items-center justify-between">
              <span>生字正音 · 重点词义 · 技法</span>
              <span className="text-[10px] text-white/40">考场留存</span>
            </div>

            <div className="space-y-1.5 text-xs text-stone-200">
              {subBoard && subBoard.length > 0 ? (
                subBoard.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-1.5 group">
                    <span className="text-[#FFEAA7] font-bold text-xs select-none">▪</span>
                    <span className="group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start space-x-1.5">
                    <span className="text-[#FFEAA7] font-bold text-xs select-none">▪</span>
                    <span>重点字音：读准字音，写规范字</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <span className="text-[#FFEAA7] font-bold text-xs select-none">▪</span>
                    <span>表达技法：抓核心动词，体会修辞</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 text-[10px] text-white/50 leading-tight">
              考官考查要点：试讲时板书不可擦掉，右侧副板书随课堂互动生成并保留至结课。
            </div>
          </div>
        </div>
      </div>

      {/* Chalk Tray Simulation with Chalk Sticks */}
      <div className="mt-5 pt-2 border-t-4 border-[#2A1E16] flex items-center justify-between text-[10px] text-white/40">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-[#17221A] px-2 py-0.5 rounded border border-black/30">
            <div className="w-6 h-1.5 rounded-xs bg-[#FAF9F5] shadow-xs" title="白粉笔" />
            <div className="w-6 h-1.5 rounded-xs bg-[#FFEAA7] shadow-xs" title="黄粉笔" />
            <div className="w-6 h-1.5 rounded-xs bg-[#81ECEC] shadow-xs" title="青粉笔" />
            <div className="w-6 h-1.5 rounded-xs bg-[#FF7675] shadow-xs" title="红粉笔" />
          </div>
          <span className="hidden sm:inline">粉笔槽 · 规范书写</span>
        </div>
        <span>教资面试标准板书规范 · 层次分明 · 一课一得</span>
      </div>
    </div>
  );
};
