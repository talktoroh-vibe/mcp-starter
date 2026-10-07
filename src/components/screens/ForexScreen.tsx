import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { Globe, ArrowUpDown, Bookmark, RefreshCw } from 'lucide-react';

export const ForexScreen: React.FC = () => {
  const { instruments, setSelectedInstrument, toggleWatchlist, isInWatchlist } = useMarket();

  const forexPairs = instruments.filter((i) => i.category === 'forex');

  // Forex Matrix Currencies
  const matrixCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  const matrixRates: Record<string, Record<string, number>> = {
    USD: { USD: 1.0, EUR: 0.911, GBP: 0.764, JPY: 148.65, CAD: 1.362, AUD: 1.483 },
    EUR: { USD: 1.0975, EUR: 1.0, GBP: 0.838, JPY: 163.15, CAD: 1.494, AUD: 1.628 },
    GBP: { USD: 1.3085, EUR: 1.192, GBP: 1.0, JPY: 194.50, CAD: 1.782, AUD: 1.941 },
    JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0051, JPY: 1.0, CAD: 0.0091, AUD: 0.0099 },
    CAD: { USD: 0.734, EUR: 0.669, GBP: 0.561, JPY: 109.14, CAD: 1.0, AUD: 1.089 },
    AUD: { USD: 0.674, EUR: 0.614, GBP: 0.515, JPY: 100.18, CAD: 0.918, AUD: 1.0 },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Forex / Currencies
        </h2>
        <p className="text-xs sm:text-sm text-[#787b86]">
          Global foreign exchange rates, major cross-currency pairs, and central bank parity differentials.
        </p>
      </div>

      {/* Forex Major Pairs Table */}
      <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Major Currency Pairs</h3>
          </div>
          <span className="text-xs text-[#787b86]">Spot FX Market</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#2a2e39] bg-[#181b25]">
                <th className="py-3.5 px-4 font-semibold">Pair</th>
                <th className="py-3.5 px-4 font-semibold text-right">Bid / Rate</th>
                <th className="py-3.5 px-4 font-semibold text-right">Pip Change</th>
                <th className="py-3.5 px-4 font-semibold text-right">24h Change %</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden sm:table-cell">24h High / Low</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden md:table-cell">Volume</th>
                <th className="py-3.5 px-4 font-semibold text-right">Technical Bias</th>
                <th className="py-3.5 px-4 font-semibold text-center">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/40">
              {forexPairs.map((pair) => {
                const isPositive = pair.change >= 0;
                const isBookmarked = isInWatchlist(pair.symbol);
                const pips = (pair.change * (pair.symbol.includes('JPY') ? 100 : 10000)).toFixed(1);
                const flashClass =
                  pair.lastTickDirection === 'up'
                    ? 'flash-up'
                    : pair.lastTickDirection === 'down'
                    ? 'flash-down'
                    : '';

                return (
                  <tr
                    key={pair.symbol}
                    className={`group hover:bg-[#2a2e39]/50 transition-colors cursor-pointer ${flashClass}`}
                    onClick={() => setSelectedInstrument(pair)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-white">
                          {pair.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                            {pair.symbol}
                          </span>
                          <span className="text-xs text-[#787b86] block">{pair.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular font-bold text-white">
                      {pair.price.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc]">
                      <span className={isPositive ? 'text-[#089981]' : 'text-[#f23645]'}>
                        {isPositive ? '+' : ''}
                        {pips} pips
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
                        {pair.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#787b86] hidden sm:table-cell">
                      <span>{pair.high24h.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}</span> /{' '}
                      <span>{pair.low24h.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc] hidden md:table-cell">
                      {pair.volume}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`text-xs font-semibold ${
                          pair.rating.includes('Buy')
                            ? 'text-[#089981]'
                            : pair.rating.includes('Sell')
                            ? 'text-[#f23645]'
                            : 'text-[#f59e0b]'
                        }`}
                      >
                        {pair.rating}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleWatchlist(pair.symbol)}
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

      {/* Cross-Rates Matrix Grid */}
      <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-4">
          <h3 className="text-base font-bold text-white tracking-tight">
            Cross-Rates Matrix
          </h3>
          <span className="text-xs text-[#787b86]">Institutional Bid Quotations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#2a2e39]/50">
                <th className="py-2.5 px-3 text-left font-bold text-white">Base / Quote</th>
                {matrixCurrencies.map((c) => (
                  <th key={c} className="py-2.5 px-3 font-bold text-[#d1d4dc]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/30">
              {matrixCurrencies.map((rowCurr) => (
                <tr key={rowCurr} className="hover:bg-[#2a2e39]/20 transition-colors">
                  <td className="py-3 px-3 text-left font-bold text-white bg-[#181b25]/50">
                    {rowCurr}
                  </td>
                  {matrixCurrencies.map((colCurr) => {
                    const rate = matrixRates[rowCurr]?.[colCurr] ?? 1.0;
                    const isSelf = rowCurr === colCurr;

                    return (
                      <td
                        key={`${rowCurr}-${colCurr}`}
                        className={`py-3 px-3 font-tabular font-medium ${
                          isSelf
                            ? 'text-[#787b86] bg-[#131722]/60'
                            : 'text-white hover:text-[#2962ff] cursor-pointer'
                        }`}
                      >
                        {isSelf ? '1.0000' : rate.toFixed(rate > 50 ? 2 : 4)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
