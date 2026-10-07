import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { Landmark, Bookmark, ArrowUpRight } from 'lucide-react';

export const BondsScreen: React.FC = () => {
  const { instruments, setSelectedInstrument, toggleWatchlist, isInWatchlist } = useMarket();

  const bonds = instruments.filter((i) => i.category === 'bond');

  // US Yield Curve points for SVG visualization
  const yieldCurveData = [
    { maturity: '1M', yield: 4.82 },
    { maturity: '3M', yield: 4.65 },
    { maturity: '6M', yield: 4.42 },
    { maturity: '1Y', yield: 4.15 },
    { maturity: '2Y', yield: 3.995 },
    { maturity: '5Y', yield: 3.98 },
    { maturity: '10Y', yield: 4.085 },
    { maturity: '30Y', yield: 4.38 },
  ];

  const minYield = 3.6;
  const maxYield = 5.0;
  const rangeYield = maxYield - minYield;
  const width = 680;
  const height = 180;

  const getCurveX = (idx: number) => 40 + (idx / (yieldCurveData.length - 1)) * (width - 80);
  const getCurveY = (y: number) => height - 30 - ((y - minYield) / rangeYield) * (height - 60);

  const curvePath = yieldCurveData
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${getCurveX(idx)} ${getCurveY(pt.yield)}`)
    .join(' ');

  // 10Y - 2Y Spread
  const spread = (4.085 - 3.995) * 100; // in bps

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Bonds & Sovereign Yields
        </h2>
        <p className="text-xs sm:text-sm text-[#787b86]">
          Global fixed income securities, sovereign benchmark yields, and term structure curve slope analysis.
        </p>
      </div>

      {/* Interactive US Treasury Yield Curve Visualizer */}
      <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a2e39] pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              US Treasury Yield Curve (Term Structure)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#787b86]">2Y/10Y Spread:</span>
            <span className="font-bold text-[#089981] font-tabular">+{spread.toFixed(1)} bps (Normalizing)</span>
          </div>
        </div>

        {/* SVG Yield Curve */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-48 select-none">
            {/* Grid Lines */}
            <line x1="40" y1={getCurveY(4.8)} x2={width - 40} y2={getCurveY(4.8)} stroke="#2a2e39" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="40" y1={getCurveY(4.4)} x2={width - 40} y2={getCurveY(4.4)} stroke="#2a2e39" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="40" y1={getCurveY(4.0)} x2={width - 40} y2={getCurveY(4.0)} stroke="#2a2e39" strokeWidth="0.75" strokeDasharray="3 3" />

            {/* Labels on Y */}
            <text x="32" y={getCurveY(4.8) + 4} fill="#787b86" fontSize="10" textAnchor="end" fontFamily="monospace">4.80%</text>
            <text x="32" y={getCurveY(4.4) + 4} fill="#787b86" fontSize="10" textAnchor="end" fontFamily="monospace">4.40%</text>
            <text x="32" y={getCurveY(4.0) + 4} fill="#787b86" fontSize="10" textAnchor="end" fontFamily="monospace">4.00%</text>

            {/* Gradient Area under curve */}
            <defs>
              <linearGradient id="bondCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2962ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`${curvePath} L ${getCurveX(yieldCurveData.length - 1)} ${height - 30} L ${getCurveX(0)} ${height - 30} Z`}
              fill="url(#bondCurveGrad)"
            />

            {/* Yield Curve Line */}
            <path d={curvePath} fill="none" stroke="#2962ff" strokeWidth="2.5" strokeLinecap="round" />

            {/* Point circles with label values */}
            {yieldCurveData.map((pt, idx) => {
              const cx = getCurveX(idx);
              const cy = getCurveY(pt.yield);

              return (
                <g key={pt.maturity}>
                  <circle cx={cx} cy={cy} r="4.5" fill="#2962ff" stroke="#ffffff" strokeWidth="1.5" />
                  <text
                    x={cx}
                    y={cy - 10}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {pt.yield.toFixed(2)}%
                  </text>
                  <text
                    x={cx}
                    y={height - 12}
                    fill="#787b86"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {pt.maturity}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Benchmark Sovereign Yields Table */}
      <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#2a2e39] bg-[#181b25]">
                <th className="py-3.5 px-4 font-semibold">Bond / Sovereign Yield</th>
                <th className="py-3.5 px-4 font-semibold text-right">Yield Rate</th>
                <th className="py-3.5 px-4 font-semibold text-right">Day's Change</th>
                <th className="py-3.5 px-4 font-semibold text-right">Change %</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden sm:table-cell">52-Week Range</th>
                <th className="py-3.5 px-4 font-semibold text-right">Policy Stance</th>
                <th className="py-3.5 px-4 font-semibold text-center">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/40">
              {bonds.map((item) => {
                const isPositive = item.change >= 0;
                const isBookmarked = isInWatchlist(item.symbol);
                const flashClass =
                  item.lastTickDirection === 'up'
                    ? 'flash-up'
                    : item.lastTickDirection === 'down'
                    ? 'flash-down'
                    : '';

                return (
                  <tr
                    key={item.symbol}
                    className={`group hover:bg-[#2a2e39]/50 transition-colors cursor-pointer ${flashClass}`}
                    onClick={() => setSelectedInstrument(item)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-blue-400">
                          {item.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-xs text-[#787b86] block">{item.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular font-bold text-white">
                      {item.price.toFixed(3)}%
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc]">
                      <span className={isPositive ? 'text-[#089981]' : 'text-[#f23645]'}>
                        {isPositive ? '+' : ''}
                        {(item.change * 100).toFixed(1)} bps
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular font-semibold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded ${
                          isPositive
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : 'bg-[#f23645]/15 text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#787b86] hidden sm:table-cell">
                      <span>{item.low52w?.toFixed(3)}%</span> - <span>{item.high52w?.toFixed(3)}%</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs font-semibold text-[#787b86]">{item.rating}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleWatchlist(item.symbol)}
                        className={`p-1.5 rounded transition-colors ${
                          isBookmarked ? 'text-[#2962ff]' : 'text-[#787b86] hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
