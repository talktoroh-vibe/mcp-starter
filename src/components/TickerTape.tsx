import React from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketInstrument } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TickerTape: React.FC = () => {
  const { instruments, setSelectedInstrument } = useMarket();

  // Curated list for the ticker tape marquee
  const tapeSymbols = ['SPX', 'NDX', 'DJI', 'BTC/USD', 'ETH/USD', 'GOLD', 'CL1!', 'EUR/USD', 'US10Y', 'NVDA', 'AAPL', 'TSLA'];
  const tapeItems = tapeSymbols
    .map(sym => instruments.find(i => i.symbol === sym))
    .filter((item): item is MarketInstrument => Boolean(item));

  // Double the list for seamless continuous infinite marquee scroll
  const marqueeList = [...tapeItems, ...tapeItems];

  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 48;
    const height = 16;

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
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="w-full bg-[#131722] border-b border-[#2a2e39] overflow-hidden select-none py-1.5 relative group">
      <div className="flex animate-ticker whitespace-nowrap will-change-transform">
        {marqueeList.map((item, index) => {
          const isPositive = item.change >= 0;
          const flashClass =
            item.lastTickDirection === 'up'
              ? 'flash-up'
              : item.lastTickDirection === 'down'
              ? 'flash-down'
              : '';

          return (
            <button
              key={`${item.symbol}-${index}`}
              onClick={() => setSelectedInstrument(item)}
              className={`inline-flex items-center gap-2.5 px-4 py-1 border-r border-[#2a2e39]/60 hover:bg-[#1e222d] transition-colors rounded cursor-pointer ${flashClass}`}
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white tracking-tight">{item.symbol}</span>
                <span className="text-[10px] text-[#787b86] truncate max-w-[80px]">
                  {item.name}
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-[#d1d4dc] font-tabular">
                  {item.price < 2 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {item.currency === '%' ? '%' : ''}
                </span>
                <span
                  className={`text-[10px] font-medium font-tabular flex items-center justify-end gap-0.5 ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="hidden sm:block pl-1">
                {renderSparkline(item.sparkline, isPositive)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
