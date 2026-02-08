
import React from 'react';

interface RadarChartProps {
  dimensions: string[];
  strategyA: number[];
  strategyB: number[];
  labels: { a: string; b: string };
}

const RadarChart: React.FC<RadarChartProps> = ({ dimensions, strategyA, strategyB, labels }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = (Math.PI * 2) / dimensions.length;

  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const generatePath = (data: number[]) => {
    return data
      .map((val, i) => {
        const p = getPoint(i, val);
        return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
      })
      .join(' ') + ' Z';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 shadow-inner">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid */}
        {[2, 4, 6, 8, 10].map((tick) => (
          <path
            key={tick}
            d={dimensions.map((_, i) => {
              const p = getPoint(i, tick);
              return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
            }).join(' ') + ' Z'}
            className="fill-none stroke-zinc-800/50 stroke-1"
          />
        ))}

        {/* Axes */}
        {dimensions.map((dim, i) => {
          const p = getPoint(i, 10);
          const labelP = getPoint(i, 12);
          return (
            <g key={dim}>
              <line
                x1={center}
                y1={center}
                x2={p.x}
                y2={p.y}
                className="stroke-zinc-800 stroke-1"
              />
              <text
                x={labelP.x}
                y={labelP.y}
                textAnchor="middle"
                className="fill-zinc-600 text-[9px] font-bold uppercase tracking-tighter"
                dominantBaseline="middle"
              >
                {dim}
              </text>
            </g>
          );
        })}

        {/* Strategy B Path (Amber) */}
        <path
          d={generatePath(strategyB)}
          className="fill-amber-500/10 stroke-amber-500/60 stroke-2 transition-all duration-700"
        />
        {strategyB.map((val, i) => {
          const p = getPoint(i, val);
          return <circle key={i} cx={p.x} cy={p.y} r="3" className="fill-amber-500 shadow-xl" />;
        })}

        {/* Strategy A Path (Indigo) */}
        <path
          d={generatePath(strategyA)}
          className="fill-indigo-500/20 stroke-indigo-500 stroke-2 transition-all duration-700"
        />
        {strategyA.map((val, i) => {
          const p = getPoint(i, val);
          return <circle key={i} cx={p.x} cy={p.y} r="3" className="fill-indigo-500" />;
        })}
      </svg>
      
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{labels.a}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{labels.b}</span>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
