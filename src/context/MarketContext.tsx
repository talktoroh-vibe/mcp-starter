import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketInstrument, MarketTab, PriceAlert } from '../types/market';
import { INITIAL_INSTRUMENTS } from '../data/marketData';

interface MarketContextType {
  instruments: MarketInstrument[];
  activeTab: MarketTab;
  setActiveTab: (tab: MarketTab) => void;
  selectedInstrument: MarketInstrument | null;
  setSelectedInstrument: (inst: MarketInstrument | null) => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  isWatchlistOpen: boolean;
  setIsWatchlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  liveSimulation: boolean;
  setLiveSimulation: (enabled: boolean) => void;
  alerts: PriceAlert[];
  addAlert: (symbol: string, targetPrice: number, condition: 'above' | 'below') => void;
  removeAlert: (id: string) => void;
  openSymbolChart: (symbol: string) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const WATCHLIST_STORAGE_KEY = 'tv_markets_watchlist';
const ALERTS_STORAGE_KEY = 'tv_markets_alerts';
const THEME_STORAGE_KEY = 'tv_markets_theme';

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instruments, setInstruments] = useState<MarketInstrument[]>(INITIAL_INSTRUMENTS);
  const [activeTab, setActiveTab] = useState<MarketTab>('overview');
  const [selectedInstrument, setSelectedInstrument] = useState<MarketInstrument | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [liveSimulation, setLiveSimulation] = useState(true);

  // Watchlist state with localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['NVDA', 'BTC/USD', 'SPX', 'AAPL', 'GOLD', 'EUR/USD'];
    } catch {
      return ['NVDA', 'BTC/USD', 'SPX', 'AAPL', 'GOLD', 'EUR/USD'];
    }
  });

  // Alerts state
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return (saved as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Persist watchlist
  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error(e);
    }
  }, [watchlist]);

  // Persist alerts
  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [alerts]);

  // Persist & apply theme
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market tick simulator (resembles live WebSockets)
  useEffect(() => {
    if (!liveSimulation) return;

    const interval = setInterval(() => {
      setInstruments(prev => {
        // Pick 2-4 random instruments to update per tick
        const countToUpdate = Math.floor(Math.random() * 3) + 2;
        const indicesToUpdate = new Set<number>();
        while (indicesToUpdate.size < countToUpdate) {
          indicesToUpdate.add(Math.floor(Math.random() * prev.length));
        }

        return prev.map((item, idx) => {
          if (!indicesToUpdate.has(idx)) {
            // Clear last tick animation after a cycle
            if (item.lastTickDirection) {
              return { ...item, lastTickDirection: 'none' };
            }
            return item;
          }

          // Compute micro tick delta
          const volatilityFactor = item.category === 'crypto' ? 0.003 : item.category === 'stock' ? 0.0015 : 0.0006;
          const pctChange = (Math.random() - 0.49) * volatilityFactor;
          const newPrice = Number((item.price * (1 + pctChange)).toFixed(item.price < 2 ? 4 : 2));
          const tickDir: 'up' | 'down' = newPrice >= item.price ? 'up' : 'down';
          const newChange = Number((item.change + (newPrice - item.price)).toFixed(item.price < 2 ? 4 : 2));
          const newChangePct = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));
          const newHigh = Math.max(item.high24h, newPrice);
          const newLow = Math.min(item.low24h, newPrice);

          // Update sparkline tail
          const newSparkline = [...item.sparkline.slice(1), newPrice];

          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePct,
            high24h: newHigh,
            low24h: newLow,
            sparkline: newSparkline,
            lastTickDirection: tickDir,
          };
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [liveSimulation]);

  // Keep selected instrument in sync with live ticking data
  useEffect(() => {
    if (selectedInstrument) {
      const updated = instruments.find(i => i.symbol === selectedInstrument.symbol);
      if (updated && updated.price !== selectedInstrument.price) {
        setSelectedInstrument(updated);
      }
    }
  }, [instruments, selectedInstrument]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const isInWatchlist = (symbol: string) => watchlist.includes(symbol);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addAlert = (symbol: string, targetPrice: number, condition: 'above' | 'below') => {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbol,
      targetPrice,
      condition,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      triggered: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const openSymbolChart = (symbol: string) => {
    const found = instruments.find(i => i.symbol === symbol);
    if (found) {
      setSelectedInstrument(found);
    }
  };

  return (
    <MarketContext.Provider
      value={{
        instruments,
        activeTab,
        setActiveTab,
        selectedInstrument,
        setSelectedInstrument,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        isWatchlistOpen,
        setIsWatchlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        theme,
        toggleTheme,
        liveSimulation,
        setLiveSimulation,
        alerts,
        addAlert,
        removeAlert,
        openSymbolChart,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
