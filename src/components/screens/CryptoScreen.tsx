import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { Bookmark, Search, Coins, ArrowUpDown, PieChart } from 'lucide-react';

export const CryptoScreen: React.FC = () => {
  const { instruments, setSelectedInstrument, toggleWatchlist, isInWatchlist } = useMarket();

  const [categoryFilter, setCategoryFilter] = useState<'All' | 'L1' | 'DeFi' | 'Meme'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const cryptoInstruments = instruments.filter((i) => i.category === 'crypto');

  const filtered = cryptoInstruments.filter((c) => {
    const matchesSearch =
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const pathData = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathData}
          fill="none"
          stroke={isPositive ? '#089981' : '#f23645'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Cryptocurrency Markets
          </h2>
          <p className="text-xs sm:text-sm text-[#787b86]">
            Live quotes, 24h trading volume, and institutional liquidity across major digital assets.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#787b86] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search crypto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs rounded-lg bg-[#1e222d] border border-[#2a2e39] text-white placeholder-[#787b86] focus:outline-hidden focus:border-[#2962ff] w-full sm:w-56"
          />
        </div>
      </div>

      {/* Global Crypto Market Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
          <span className="text-xs text-[#787b86] font-medium block">Total Crypto Market Cap</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-white font-tabular">$2.28T</span>
            <span className="text-xs font-semibold text-[#089981] font-tabular">+2.45%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
          <span className="text-xs text-[#787b86] font-medium block">24h Global Volume</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-white font-tabular">$78.4B</span>
            <span className="text-xs font-semibold text-[#089981] font-tabular">+14.2%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
          <span className="text-xs text-[#787b86] font-medium block">Bitcoin Dominance (BTC.D)</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-white font-tabular">56.8%</span>
            <span className="text-xs font-semibold text-[#787b86] font-tabular">Neutral</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1e222d] border border-[#2a2e39]">
          <span className="text-xs text-[#787b86] font-medium block">Ethereum Dominance (ETH.D)</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-white font-tabular">13.6%</span>
            <span className="text-xs font-semibold text-[#f23645] font-tabular">-0.3%</span>
          </div>
        </div>
      </div>

      {/* Crypto Table */}
      <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#2a2e39] bg-[#181b25]">
                <th className="py-3.5 px-4 font-semibold">Coin</th>
                <th className="py-3.5 px-4 font-semibold text-right">Price</th>
                <th className="py-3.5 px-4 font-semibold text-right">24h Change</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden sm:table-cell">24h High / Low</th>
                <th className="py-3.5 px-4 font-semibold text-right">24h Volume</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden md:table-cell">Market Cap</th>
                <th className="py-3.5 px-4 font-semibold text-center hidden lg:table-cell">7D Trend</th>
                <th className="py-3.5 px-4 font-semibold text-right">Technical</th>
                <th className="py-3.5 px-4 font-semibold text-center">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/40">
              {filtered.map((coin) => {
                const isPositive = coin.change >= 0;
                const isBookmarked = isInWatchlist(coin.symbol);
                const flashClass =
                  coin.lastTickDirection === 'up'
                    ? 'flash-up'
                    : coin.lastTickDirection === 'down'
                    ? 'flash-down'
                    : '';

                return (
                  <tr
                    key={coin.symbol}
                    className={`group hover:bg-[#2a2e39]/50 transition-colors cursor-pointer ${flashClass}`}
                    onClick={() => setSelectedInstrument(coin)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-extrabold text-xs text-white">
                          {coin.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                            {coin.symbol}
                          </span>
                          <span className="text-xs text-[#787b86] block">{coin.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular font-bold text-white">
                      ${coin.price < 2 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                        {coin.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#787b86] hidden sm:table-cell">
                      <span>${coin.high24h.toLocaleString()}</span> /{' '}
                      <span>${coin.low24h.toLocaleString()}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc]">
                      {coin.volume}
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc] hidden md:table-cell">
                      {coin.marketCap}
                    </td>

                    <td className="py-3.5 px-4 text-center hidden lg:table-cell">
                      <div className="flex justify-center">
                        {renderSparkline(coin.sparkline, isPositive)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`text-xs font-semibold ${
                          coin.rating.includes('Buy')
                            ? 'text-[#089981]'
                            : coin.rating.includes('Sell')
                            ? 'text-[#f23645]'
                            : 'text-[#f59e0b]'
                        }`}
                      >
                        {coin.rating}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleWatchlist(coin.symbol)}
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
