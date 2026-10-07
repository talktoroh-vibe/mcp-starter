import React from 'react';
import { useMarket } from '../context/MarketContext';
import { MarketTab } from '../types/market';
import {
  BarChart3,
  TrendingUp,
  Coins,
  Globe,
  PieChart,
  Flame,
  Landmark,
  LayoutGrid,
} from 'lucide-react';

interface TabItem {
  id: MarketTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CategoryNav: React.FC = () => {
  const { activeTab, setActiveTab } = useMarket();

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'stocks', label: 'Stocks', icon: TrendingUp },
    { id: 'crypto', label: 'Crypto', icon: Coins },
    { id: 'forex', label: 'Forex', icon: Globe },
    { id: 'indices', label: 'Indices', icon: PieChart },
    { id: 'futures', label: 'Futures & Commodities', icon: Flame },
    { id: 'bonds', label: 'Bonds & Rates', icon: Landmark },
    { id: 'heatmap', label: 'Heatmap', icon: LayoutGrid },
  ];

  return (
    <div className="w-full bg-[#131722] border-b border-[#2a2e39] sticky top-14 z-30 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5 -mx-2 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#2962ff] text-white shadow-sm'
                    : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#787b86]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
