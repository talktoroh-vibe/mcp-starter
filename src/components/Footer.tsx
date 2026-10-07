import React from 'react';
import { useMarket } from '../context/MarketContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useMarket();

  return (
    <footer className="w-full border-t border-[#2a2e39] bg-[#131722] py-8 text-xs text-[#787b86]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center h-4 gap-0.5" aria-hidden="true">
            <span className="w-1 h-3.5 bg-[#2962ff] rounded-xs"></span>
            <span className="w-1 h-2 bg-white rounded-xs"></span>
            <span className="w-1 h-4 bg-[#089981] rounded-xs"></span>
          </div>
          <span className="font-bold text-white tracking-tight">TradingView</span>
          <span>·</span>
          <span>Global Markets Hub</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[#787b86]">
          <button onClick={() => setActiveTab('overview')} className="hover:text-white transition-colors">
            Overview
          </button>
          <button onClick={() => setActiveTab('stocks')} className="hover:text-white transition-colors">
            Stocks
          </button>
          <button onClick={() => setActiveTab('crypto')} className="hover:text-white transition-colors">
            Crypto
          </button>
          <button onClick={() => setActiveTab('forex')} className="hover:text-white transition-colors">
            Forex
          </button>
          <button onClick={() => setActiveTab('indices')} className="hover:text-white transition-colors">
            Indices
          </button>
          <button onClick={() => setActiveTab('futures')} className="hover:text-white transition-colors">
            Futures
          </button>
          <button onClick={() => setActiveTab('bonds')} className="hover:text-white transition-colors">
            Bonds
          </button>
          <button onClick={() => setActiveTab('heatmap')} className="hover:text-white transition-colors">
            Heatmap
          </button>
        </div>

        <div className="text-[11px] text-[#787b86]">
          Quotes simulated for real-time demonstration · Market data provided for illustrative purposes
        </div>
      </div>
    </footer>
  );
};
