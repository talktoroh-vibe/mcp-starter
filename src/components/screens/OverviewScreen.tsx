import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SECTOR_PERFORMANCE, LATEST_NEWS, ECONOMIC_CALENDAR } from '../../data/marketData';
import { MarketInstrument } from '../../types/market';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Flame,
  Globe2,
  Calendar,
  Layers,
  ChevronRight,
  Bookmark,
} from 'lucide-react';

export const OverviewScreen: React.FC = () => {
  const { instruments, setSelectedInstrument, setActiveTab, toggleWatchlist, isInWatchlist } =
    useMarket();

  const [moversTab, setMoversTab] = useState<'gainers' | 'losers' | 'active'>('gainers');

  // Key hero indices/assets
  const heroSymbols = ['SPX', 'NDX', 'DJI', 'BTC/USD', 'GOLD', 'CL1!'];
  const heroInstruments = heroSymbols
    .map((sym) => instruments.find((i) => i.symbol === sym))
    .filter(Boolean) as MarketInstrument[];

  // Filter movers
  const gainers = [...instruments].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...instruments].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const mostActive = [...instruments].filter((i) => i.category === 'stock' || i.category === 'crypto').slice(0, 5);

  const displayedMovers =
    moversTab === 'gainers' ? gainers : moversTab === 'losers' ? losers : mostActive;

  // Mini sparkline renderer
  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 110;
    const height = 36;

    const pathData = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathData}
          fill="none"
          stroke={isPositive ? '#089981' : '#f23645'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero: Global Markets At a Glance */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Markets Overview
            </h2>
            <p className="text-xs sm:text-sm text-[#787b86]">
              Real-time quotes, technical sentiment, and institutional flow across global asset classes.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('heatmap')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#2962ff] hover:underline"
          >
            <span>View Market Heatmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Hero Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {heroInstruments.map((item) => {
            const isPositive = item.change >= 0;
            const flashClass =
              item.lastTickDirection === 'up'
                ? 'flash-up'
                : item.lastTickDirection === 'down'
                ? 'flash-down'
                : '';

            return (
              <div
                key={item.symbol}
                onClick={() => setSelectedInstrument(item)}
                className={`group p-3.5 rounded-xl bg-[#1e222d] border border-[#2a2e39] hover:border-[#363a45] transition-all cursor-pointer flex flex-col justify-between ${flashClass}`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#787b86] mb-1">
                    <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[#787b86]">
                      {item.exchange || item.category}
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white font-tabular truncate">
                    {item.price < 2 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-xs font-semibold font-tabular flex items-center gap-0.5 mt-0.5 ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </div>
                </div>

                <div className="pt-3 flex justify-center">
                  {renderSparkline(item.sparkline, isPositive)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Market Movers & Sector Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Movers Card (2 Columns) */}
        <div className="lg:col-span-2 rounded-xl bg-[#1e222d] border border-[#2a2e39] p-5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Today's Market Movers</h3>
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center gap-1 bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
              <button
                onClick={() => setMoversTab('gainers')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  moversTab === 'gainers'
                    ? 'bg-[#089981] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setMoversTab('losers')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  moversTab === 'losers'
                    ? 'bg-[#f23645] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Top Losers
              </button>
              <button
                onClick={() => setMoversTab('active')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  moversTab === 'active'
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Most Active
              </button>
            </div>
          </div>

          {/* Movers Table */}
          <div className="overflow-x-auto divide-y divide-[#2a2e39]/50 flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#787b86] border-b border-[#2a2e39]/60">
                  <th className="py-3 px-2 font-medium">Symbol</th>
                  <th className="py-3 px-2 font-medium text-right">Price</th>
                  <th className="py-3 px-2 font-medium text-right">Change</th>
                  <th className="py-3 px-2 font-medium text-right">Volume</th>
                  <th className="py-3 px-2 font-medium text-right">Rating</th>
                  <th className="py-3 px-2 font-medium text-center">Watch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/30">
                {displayedMovers.map((item) => {
                  const isPositive = item.change >= 0;
                  const isBookmarked = isInWatchlist(item.symbol);

                  return (
                    <tr
                      key={item.symbol}
                      className="group hover:bg-[#2a2e39]/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedInstrument(item)}
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-[11px] text-white">
                            {item.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                              {item.symbol}
                            </span>
                            <span className="text-[11px] text-[#787b86] block truncate max-w-[120px] sm:max-w-[180px]">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-tabular font-semibold text-white">
                        {item.price < 2
                          ? item.price.toFixed(4)
                          : item.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </td>
                      <td className="py-3 px-2 text-right font-tabular font-semibold">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded ${
                            isPositive
                              ? 'bg-[#089981]/15 text-[#089981]'
                              : 'bg-[#f23645]/15 text-[#f23645]'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-tabular text-[#d1d4dc]">
                        {item.volume}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span
                          className={`text-[11px] font-semibold ${
                            item.rating.includes('Buy')
                              ? 'text-[#089981]'
                              : item.rating.includes('Sell')
                              ? 'text-[#f23645]'
                              : 'text-[#787b86]'
                          }`}
                        >
                          {item.rating}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleWatchlist(item.symbol)}
                          className={`p-1.5 rounded transition-colors ${
                            isBookmarked
                              ? 'text-[#2962ff]'
                              : 'text-[#787b86] hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Performance Card (1 Column) */}
        <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2962ff]" />
                <h3 className="text-base font-bold text-white tracking-tight">Sector Performance</h3>
              </div>
              <button
                onClick={() => setActiveTab('stocks')}
                className="text-xs text-[#2962ff] hover:underline"
              >
                All Sectors
              </button>
            </div>

            <div className="space-y-3">
              {SECTOR_PERFORMANCE.slice(0, 6).map((sec) => {
                const isPositive = sec.changePercent >= 0;

                return (
                  <div key={sec.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{sec.name}</span>
                      <span
                        className={`font-bold font-tabular ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {sec.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="relative h-1.5 rounded-full bg-[#131722] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isPositive ? 'bg-[#089981]' : 'bg-[#f23645]'
                        }`}
                        style={{
                          width: `${Math.min(Math.abs(sec.changePercent) * 35, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#2a2e39] mt-4 flex items-center justify-between text-xs text-[#787b86]">
            <span>Leading Sector:</span>
            <span className="font-bold text-[#089981]">Technology (+2.14%)</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Market News & Economic Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Market News (2 Columns) */}
        <div className="lg:col-span-2 rounded-xl bg-[#1e222d] border border-[#2a2e39] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-4">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#2962ff]" />
              <h3 className="text-base font-bold text-white tracking-tight">Market News & Flows</h3>
            </div>
            <span className="text-xs text-[#787b86]">Curated Financial Feed</span>
          </div>

          <div className="divide-y divide-[#2a2e39]/50">
            {LATEST_NEWS.map((news) => (
              <div
                key={news.id}
                className="py-3.5 first:pt-0 last:pb-0 hover:bg-[#2a2e39]/20 transition-colors p-2 rounded-lg"
              >
                <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#d1d4dc]">{news.source}</span>
                    <span aria-hidden="true">·</span>
                    <span>{news.timeAgo}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#2962ff] font-medium">{news.category}</span>
                  </div>
                  {news.relatedSymbol && (
                    <button
                      onClick={() => {
                        const target = instruments.find((i) => i.symbol === news.relatedSymbol);
                        if (target) setSelectedInstrument(target);
                      }}
                      className="px-1.5 py-0.5 rounded bg-[#131722] border border-[#2a2e39] font-bold text-white hover:border-[#2962ff]"
                    >
                      {news.relatedSymbol}
                    </button>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-white leading-snug hover:text-[#2962ff] cursor-pointer transition-colors">
                  {news.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Calendar (1 Column) */}
        <div className="rounded-xl bg-[#1e222d] border border-[#2a2e39] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39] mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Economic Calendar</h3>
            </div>
            <span className="text-xs text-[#787b86]">Macro Events</span>
          </div>

          <div className="space-y-3">
            {ECONOMIC_CALENDAR.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg bg-[#131722] border border-[#2a2e39] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span>{event.flag}</span>
                    <span>{event.event}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      event.impact === 'High'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {event.impact}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#787b86] font-tabular">
                  <span>{event.time}</span>
                  <div className="flex items-center gap-2">
                    {event.actual && (
                      <span>
                        Act: <span className="font-bold text-white">{event.actual}</span>
                      </span>
                    )}
                    <span>
                      Exp: <span className="text-[#d1d4dc]">{event.forecast}</span>
                    </span>
                    <span>
                      Prev: <span className="text-[#787b86]">{event.prior}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
