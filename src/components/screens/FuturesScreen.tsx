import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { Flame, Bookmark, ArrowUpDown } from 'lucide-react';

export const FuturesScreen: React.FC = () => {
  const { instruments, setSelectedInstrument, toggleWatchlist, isInWatchlist } = useMarket();

  const futures = instruments.filter((i) => i.category === 'future');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Futures & Commodities
        </h2>
        <p className="text-xs sm:text-sm text-[#787b86]">
          Real-time quotes on energy, precious metals, industrial metals, and agricultural continuous contracts.
        </p>
      </div>

      <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#2a2e39] bg-[#181b25]">
                <th className="py-3.5 px-4 font-semibold">Commodity</th>
                <th className="py-3.5 px-4 font-semibold text-right">Last Price</th>
                <th className="py-3.5 px-4 font-semibold text-right">Change</th>
                <th className="py-3.5 px-4 font-semibold text-right">Change %</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden sm:table-cell">Session Range</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden md:table-cell">Contract Volume</th>
                <th className="py-3.5 px-4 font-semibold text-right">Rating</th>
                <th className="py-3.5 px-4 font-semibold text-center">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/40">
              {futures.map((item) => {
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
                        <div className="w-8 h-8 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-amber-400">
                          {item.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                              {item.symbol}
                            </span>
                            <span className="text-[10px] text-[#787b86] uppercase font-semibold">
                              {item.exchange}
                            </span>
                          </div>
                          <span className="text-xs text-[#787b86] block">{item.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular font-bold text-white">
                      ${item.price.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc]">
                      <span className={isPositive ? 'text-[#089981]' : 'text-[#f23645]'}>
                        {isPositive ? '+' : ''}
                        {item.change.toFixed(2)}
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
                      <span>${item.low24h.toFixed(2)}</span> - <span>${item.high24h.toFixed(2)}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc] hidden md:table-cell">
                      {item.volume}
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
