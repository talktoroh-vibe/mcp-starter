import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { LayoutGrid, Coins, Layers, ArrowUpRight } from 'lucide-react';

export const HeatmapScreen: React.FC = () => {
  const { instruments, setSelectedInstrument } = useMarket();
  const [heatmapType, setHeatmapType] = useState<'stocks' | 'crypto'>('stocks');

  const stocks = instruments.filter((i) => i.category === 'stock');
  const crypto = instruments.filter((i) => i.category === 'crypto');

  // Group stocks by sector
  const sectors = ['Technology', 'Communication Services', 'Consumer Cyclical', 'Financial'];

  const getHeatmapColor = (changePercent: number) => {
    if (changePercent >= 3.0) return 'bg-[#089981] hover:brightness-110';
    if (changePercent >= 1.0) return 'bg-[#0a8672] hover:brightness-110';
    if (changePercent > 0.0) return 'bg-[#0d6b5c] hover:brightness-110';
    if (changePercent === 0.0) return 'bg-[#2a2e39] hover:brightness-110';
    if (changePercent > -1.0) return 'bg-[#991b1b] hover:brightness-110';
    if (changePercent > -3.0) return 'bg-[#c52834] hover:brightness-110';
    return 'bg-[#f23645] hover:brightness-110';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Market Heatmap
          </h2>
          <p className="text-xs sm:text-sm text-[#787b86]">
            Visual treemap of global asset capitalization and real-time performance distribution.
          </p>
        </div>

        {/* Heatmap Type Switcher */}
        <div className="flex items-center gap-1 bg-[#1e222d] p-1 rounded-lg border border-[#2a2e39]">
          <button
            onClick={() => setHeatmapType('stocks')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              heatmapType === 'stocks'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>S&P 500 Equities</span>
          </button>
          <button
            onClick={() => setHeatmapType('crypto')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              heatmapType === 'crypto'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-[#d1d4dc]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Cryptocurrency</span>
          </button>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#1e222d] border border-[#2a2e39] text-xs">
        <span className="text-[#787b86] font-medium hidden sm:inline">Performance Spectrum</span>
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <span className="text-[11px] text-[#f23645] font-semibold">-3%</span>
          <span className="w-5 h-3.5 rounded-xs bg-[#f23645]"></span>
          <span className="w-5 h-3.5 rounded-xs bg-[#c52834]"></span>
          <span className="w-5 h-3.5 rounded-xs bg-[#991b1b]"></span>
          <span className="w-5 h-3.5 rounded-xs bg-[#2a2e39]"></span>
          <span className="w-5 h-3.5 rounded-xs bg-[#0d6b5c]"></span>
          <span className="w-5 h-3.5 rounded-xs bg-[#0a8672]"></span>
          <span className="w-5 h-3.5 rounded-xs bg-[#089981]"></span>
          <span className="text-[11px] text-[#089981] font-semibold">+3%</span>
        </div>
      </div>

      {/* Main Heatmap Container */}
      {heatmapType === 'stocks' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sectors.map((sectorName) => {
            const sectorStocks = stocks.filter((s) => s.sector === sectorName);
            if (sectorStocks.length === 0) return null;

            return (
              <div
                key={sectorName}
                className="rounded-xl bg-[#1e222d] border border-[#2a2e39] p-3 flex flex-col space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#787b86] uppercase tracking-wider pb-1 border-b border-[#2a2e39]">
                  <span className="truncate max-w-[170px]">{sectorName}</span>
                  <span className="text-[10px] text-[#2962ff]">{sectorStocks.length} stocks</span>
                </div>

                {/* Sub-grid of stocks in sector */}
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {sectorStocks.map((stock) => {
                    const isPositive = stock.change >= 0;
                    const colorClass = getHeatmapColor(stock.changePercent);

                    return (
                      <div
                        key={stock.symbol}
                        onClick={() => setSelectedInstrument(stock)}
                        className={`group p-3 rounded-lg text-white font-bold flex flex-col justify-between transition-all cursor-pointer shadow-xs min-h-[95px] ${colorClass}`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-extrabold tracking-tight">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] opacity-80 font-normal">
                            {stock.marketCap}
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-semibold font-tabular">
                            ${stock.price.toFixed(2)}
                          </div>
                          <div className="text-xs font-extrabold font-tabular">
                            {isPositive ? '+' : ''}
                            {stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Crypto Treemap Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {crypto.map((coin) => {
            const isPositive = coin.change >= 0;
            const colorClass = getHeatmapColor(coin.changePercent);

            return (
              <div
                key={coin.symbol}
                onClick={() => setSelectedInstrument(coin)}
                className={`p-5 rounded-xl text-white font-bold flex flex-col justify-between transition-all cursor-pointer shadow-md min-h-[140px] ${colorClass}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight">{coin.symbol}</span>
                    <span className="text-xs font-medium opacity-80">{coin.name}</span>
                  </div>
                  <span className="text-xs opacity-90 font-tabular">{coin.marketCap}</span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <span className="text-xs opacity-75 block">Price</span>
                    <span className="text-base sm:text-lg font-bold font-tabular">
                      ${coin.price < 2 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs opacity-75 block">24h Change</span>
                    <span className="text-base sm:text-lg font-extrabold font-tabular">
                      {isPositive ? '+' : ''}
                      {coin.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
