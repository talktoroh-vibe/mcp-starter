import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { PieChart, Globe, Bookmark, TrendingUp, TrendingDown } from 'lucide-react';

export const IndicesScreen: React.FC = () => {
  const { instruments, setSelectedInstrument, toggleWatchlist, isInWatchlist } = useMarket();
  const [regionFilter, setRegionFilter] = useState<'All' | 'Americas' | 'Europe' | 'Asia'>('All');

  const indices = instruments.filter((i) => i.category === 'index');

  const filtered = indices.filter((idx) => {
    if (regionFilter === 'All') return true;
    if (regionFilter === 'Americas') return ['SPX', 'NDX', 'DJI', 'RUT'].includes(idx.symbol);
    if (regionFilter === 'Europe') return ['DAX'].includes(idx.symbol);
    if (regionFilter === 'Asia') return ['N225'].includes(idx.symbol);
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Major World Indices
          </h2>
          <p className="text-xs sm:text-sm text-[#787b86]">
            Benchmark equity indices across Americas, Europe, Asia-Pacific, and emerging markets.
          </p>
        </div>

        {/* Region filter */}
        <div className="flex items-center gap-1 bg-[#1e222d] p-1 rounded-lg border border-[#2a2e39]">
          {(['All', 'Americas', 'Europe', 'Asia'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => setRegionFilter(reg)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                regionFilter === reg
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Indices Table */}
      <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#2a2e39] bg-[#181b25]">
                <th className="py-3.5 px-4 font-semibold">Index</th>
                <th className="py-3.5 px-4 font-semibold text-right">Value</th>
                <th className="py-3.5 px-4 font-semibold text-right">Points Change</th>
                <th className="py-3.5 px-4 font-semibold text-right">Change %</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden sm:table-cell">Intraday Range</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden md:table-cell">52W Range</th>
                <th className="py-3.5 px-4 font-semibold text-right">Rating</th>
                <th className="py-3.5 px-4 font-semibold text-center">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/40">
              {filtered.map((item) => {
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
                        <div className="w-8 h-8 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-white">
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
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc]">
                      <span className={isPositive ? 'text-[#089981]' : 'text-[#f23645]'}>
                        {isPositive ? '+' : ''}
                        {item.change.toFixed(2)} pts
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
                      <span>{item.low24h.toLocaleString()}</span> - <span>{item.high24h.toLocaleString()}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right hidden md:table-cell">
                      {item.low52w && item.high52w && (
                        <div className="w-24 ml-auto">
                          <div className="flex justify-between text-[10px] text-[#787b86] font-tabular">
                            <span>{item.low52w.toFixed(0)}</span>
                            <span>{item.high52w.toFixed(0)}</span>
                          </div>
                          <div className="relative h-1.5 rounded-full bg-[#131722] overflow-hidden mt-0.5">
                            <div
                              className="h-full bg-[#2962ff] rounded-full"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    ((item.price - item.low52w) / (item.high52w - item.low52w)) *
                                      100,
                                    5
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`text-xs font-semibold ${
                          item.rating.includes('Buy')
                            ? 'text-[#089981]'
                            : item.rating.includes('Sell')
                            ? 'text-[#f23645]'
                            : 'text-[#f59e0b]'
                        }`}
                      >
                        {item.rating}
                      </span>
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
