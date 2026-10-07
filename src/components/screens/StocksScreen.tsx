import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SECTOR_PERFORMANCE } from '../../data/marketData';
import { Search, ArrowUpDown, Bookmark, Filter, TrendingUp, TrendingDown } from 'lucide-react';

export const StocksScreen: React.FC = () => {
  const { instruments, setSelectedInstrument, toggleWatchlist, isInWatchlist } = useMarket();

  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'marketCap' | 'changePercent' | 'price' | 'volume'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter stocks
  const stocks = instruments.filter((i) => i.category === 'stock');

  const filteredStocks = stocks
    .filter((stock) => {
      const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
      const matchesSearch =
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesSearch;
    })
    .sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortBy === 'price') {
        valA = a.price;
        valB = b.price;
      } else if (sortBy === 'changePercent') {
        valA = a.changePercent;
        valB = b.changePercent;
      } else if (sortBy === 'marketCap') {
        // parse market cap e.g. "$3.38T" -> numeric
        const parseCap = (s?: string) => {
          if (!s) return 0;
          const num = parseFloat(s.replace(/[^0-9.]/g, ''));
          if (s.includes('T')) return num * 1000;
          if (s.includes('B')) return num;
          return num;
        };
        valA = parseCap(a.marketCap);
        valB = parseCap(b.marketCap);
      } else {
        valA = a.price;
        valB = b.price;
      }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

  const sectors = ['All', 'Technology', 'Consumer Cyclical', 'Communication Services', 'Financial'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Stocks & Equities Screener
          </h2>
          <p className="text-xs sm:text-sm text-[#787b86]">
            Filter and track leading US & global equities by sector, valuation multiples, and technical momentum.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#787b86] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs rounded-lg bg-[#1e222d] border border-[#2a2e39] text-white placeholder-[#787b86] focus:outline-hidden focus:border-[#2962ff] w-full sm:w-60"
          />
        </div>
      </div>

      {/* Sector Performance Tiles Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {SECTOR_PERFORMANCE.slice(0, 5).map((sec) => {
          const isPositive = sec.changePercent >= 0;
          return (
            <button
              key={sec.name}
              onClick={() => setSelectedSector(selectedSector === sec.name ? 'All' : sec.name)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSector === sec.name
                  ? 'bg-[#2962ff]/15 border-[#2962ff]'
                  : 'bg-[#1e222d] border-[#2a2e39] hover:border-[#363a45]'
              }`}
            >
              <span className="text-xs font-semibold text-[#d1d4dc] block truncate">{sec.name}</span>
              <div className="flex items-center justify-between mt-1.5">
                <span
                  className={`text-sm font-bold font-tabular ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {sec.changePercent.toFixed(2)}%
                </span>
                <span className="text-[10px] text-[#787b86] font-tabular">{sec.marketCap}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Sector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedSector === sec
                ? 'bg-[#2962ff] text-white'
                : 'bg-[#1e222d] text-[#787b86] hover:text-[#d1d4dc] border border-[#2a2e39]'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Screener Table */}
      <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#2a2e39] bg-[#181b25]">
                <th className="py-3.5 px-4 font-semibold">Symbol</th>
                <th
                  className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white"
                  onClick={() => {
                    setSortBy('price');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white"
                  onClick={() => {
                    setSortBy('changePercent');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white"
                  onClick={() => {
                    setSortBy('marketCap');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold text-right hidden md:table-cell">P/E (TTM)</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden sm:table-cell">Volume</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden lg:table-cell">52W Range</th>
                <th className="py-3.5 px-4 font-semibold text-right">Analyst Rating</th>
                <th className="py-3.5 px-4 font-semibold text-center">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/40">
              {filteredStocks.map((stock) => {
                const isPositive = stock.change >= 0;
                const isBookmarked = isInWatchlist(stock.symbol);
                const flashClass =
                  stock.lastTickDirection === 'up'
                    ? 'flash-up'
                    : stock.lastTickDirection === 'down'
                    ? 'flash-down'
                    : '';

                return (
                  <tr
                    key={stock.symbol}
                    className={`group hover:bg-[#2a2e39]/50 transition-colors cursor-pointer ${flashClass}`}
                    onClick={() => setSelectedInstrument(stock)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-white">
                          {stock.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                              {stock.symbol}
                            </span>
                            <span className="text-[10px] text-[#787b86] uppercase font-semibold">
                              {stock.exchange}
                            </span>
                          </div>
                          <span className="text-xs text-[#787b86] block truncate max-w-[140px] sm:max-w-[180px]">
                            {stock.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular font-bold text-white">
                      ${stock.price.toFixed(2)}
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
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc]">
                      {stock.marketCap}
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc] hidden md:table-cell">
                      {stock.peRatio ? `${stock.peRatio}x` : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-tabular text-[#d1d4dc] hidden sm:table-cell">
                      {stock.volume}
                    </td>

                    <td className="py-3.5 px-4 text-right hidden lg:table-cell">
                      {stock.low52w && stock.high52w && (
                        <div className="w-24 ml-auto">
                          <div className="flex justify-between text-[10px] text-[#787b86] font-tabular">
                            <span>{stock.low52w}</span>
                            <span>{stock.high52w}</span>
                          </div>
                          <div className="relative h-1.5 rounded-full bg-[#131722] overflow-hidden mt-0.5">
                            <div
                              className="h-full bg-[#2962ff] rounded-full"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    ((stock.price - stock.low52w) /
                                      (stock.high52w - stock.low52w)) *
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
                          stock.rating.includes('Buy')
                            ? 'text-[#089981]'
                            : stock.rating.includes('Sell')
                            ? 'text-[#f23645]'
                            : 'text-[#f59e0b]'
                        }`}
                      >
                        {stock.rating}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleWatchlist(stock.symbol)}
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
