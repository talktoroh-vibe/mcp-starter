import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Search, Bookmark, Sun, Moon, Radio } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    watchlist,
    isWatchlistOpen,
    setIsWatchlistOpen,
    setIsSearchOpen,
    theme,
    toggleTheme,
    liveSimulation,
    setLiveSimulation,
  } = useMarket();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2a2e39] dark:border-[#2a2e39] bg-[#131722]/95 dark:bg-[#131722]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="group flex items-center gap-2.5 text-white font-bold tracking-tight text-lg"
          >
            {/* TradingView signature iconic mark */}
            <div className="flex items-center h-5 gap-0.5" aria-hidden="true">
              <span className="w-1.5 h-4 bg-[#2962ff] rounded-xs group-hover:scale-y-110 transition-transform"></span>
              <span className="w-1.5 h-2 bg-white rounded-xs"></span>
              <span className="w-1.5 h-5 bg-[#089981] rounded-xs group-hover:scale-y-110 transition-transform"></span>
            </div>
            <span className="tracking-tight text-white font-extrabold text-base">TradingView</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#787b86] border-l border-[#2a2e39] pl-2.5">
              Markets
            </span>
          </a>
        </div>

        {/* Zone 2: Primary Nav Links (Text links with subtle hover underlines) */}
        <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-[#d1d4dc]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors hover:text-white ${
              activeTab === 'overview' ? 'text-[#2962ff] font-semibold' : 'text-[#787b86]'
            }`}
          >
            Markets
          </button>
          <button
            onClick={() => setActiveTab('stocks')}
            className={`transition-colors hover:text-white ${
              activeTab === 'stocks' ? 'text-[#2962ff] font-semibold' : 'text-[#787b86]'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`transition-colors hover:text-white ${
              activeTab === 'crypto' ? 'text-[#2962ff] font-semibold' : 'text-[#787b86]'
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => setActiveTab('forex')}
            className={`transition-colors hover:text-white ${
              activeTab === 'forex' ? 'text-[#2962ff] font-semibold' : 'text-[#787b86]'
            }`}
          >
            Forex
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`transition-colors hover:text-white ${
              activeTab === 'heatmap' ? 'text-[#2962ff] font-semibold' : 'text-[#787b86]'
            }`}
          >
            Heatmap
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Market Status & Live Tick Toggle */}
          <button
            onClick={() => setLiveSimulation(!liveSimulation)}
            title={liveSimulation ? 'Live streaming active (click to pause)' : 'Streaming paused (click to resume)'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1e222d] border border-[#2a2e39] text-[11px] font-medium text-[#d1d4dc] hover:border-[#363a45] transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                liveSimulation ? 'bg-[#089981] animate-pulse' : 'bg-[#787b86]'
              }`}
            ></span>
            <span className="font-tabular">US Open</span>
            <span className="text-[10px] text-[#787b86] hidden md:inline">
              {liveSimulation ? 'LIVE' : 'PAUSED'}
            </span>
          </button>

          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] text-xs text-[#787b86] hover:text-white transition-all shadow-xs"
            aria-label="Search markets and symbols"
          >
            <Search className="w-3.5 h-3.5 text-[#787b86]" />
            <span className="hidden sm:inline">Search markets...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold font-tabular bg-[#131722] text-[#787b86] rounded border border-[#2a2e39]">
              ⌘K
            </kbd>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
            className={`relative p-2 rounded-lg border transition-colors ${
              isWatchlistOpen
                ? 'bg-[#2962ff]/15 border-[#2962ff] text-[#2962ff]'
                : 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc] hover:text-white hover:border-[#363a45]'
            }`}
            title="Open Watchlist"
            aria-label="Toggle Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2962ff] text-[10px] font-bold text-white font-tabular">
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#1e222d] border border-[#2a2e39] text-[#787b86] hover:text-white hover:border-[#363a45] transition-colors"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
