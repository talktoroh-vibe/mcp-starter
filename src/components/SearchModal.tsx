import React, { useState, useEffect, useRef } from 'react';
import { useMarket } from '../context/MarketContext';
import { AssetCategory, MarketInstrument } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, instruments, setSelectedInstrument } = useMarket();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | AssetCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedFilter('all');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = instruments.filter((item) => {
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      (item.sector && item.sector.toLowerCase().includes(query.toLowerCase()));
    return matchesFilter && matchesQuery;
  });

  const handleSelect = (item: MarketInstrument) => {
    setSelectedInstrument(item);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const filters: { id: 'all' | AssetCategory; label: string }[] = [
    { id: 'all', label: 'All Assets' },
    { id: 'stock', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'index', label: 'Indices' },
    { id: 'future', label: 'Futures' },
    { id: 'bond', label: 'Bonds' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl bg-[#1e222d] border border-[#2a2e39] shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[#2a2e39]">
          <Search className="w-5 h-5 text-[#787b86] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbol, company name, or sector (e.g. NVDA, Bitcoin, Gold)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#787b86] focus:outline-hidden"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#787b86] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold font-tabular bg-[#131722] text-[#787b86] rounded border border-[#2a2e39]">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#2a2e39] overflow-x-auto scrollbar-none bg-[#181b25]">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFilter(f.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedFilter === f.id
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto py-2 divide-y divide-[#2a2e39]/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#787b86]">
              No instruments found matching <span className="text-white font-medium">"{query}"</span>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isPositive = item.change >= 0;

              return (
                <div
                  key={item.symbol}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#2962ff]/15 text-white' : 'hover:bg-[#2a2e39]/50 text-[#d1d4dc]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white tracking-tight">{item.symbol}</span>
                        <span className="text-[10px] uppercase font-semibold text-[#787b86] px-1.5 py-0.5 rounded bg-[#131722] border border-[#2a2e39]">
                          {item.exchange || item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#787b86] truncate max-w-[280px] sm:max-w-[340px]">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold font-tabular text-white">
                        {item.price < 2 ? item.price.toFixed(4) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {item.currency === '%' ? '%' : ''}
                      </div>
                      <div
                        className={`text-[11px] font-medium font-tabular flex items-center justify-end gap-0.5 ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#787b86] hidden sm:block" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Key Guide */}
        <div className="flex items-center justify-between px-4 py-2 text-[11px] text-[#787b86] border-t border-[#2a2e39] bg-[#131722]">
          <span>Use ↑↓ keys to navigate</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};
