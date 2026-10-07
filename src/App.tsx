/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { CategoryNav } from './components/CategoryNav';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { StocksScreen } from './components/screens/StocksScreen';
import { CryptoScreen } from './components/screens/CryptoScreen';
import { ForexScreen } from './components/screens/ForexScreen';
import { IndicesScreen } from './components/screens/IndicesScreen';
import { FuturesScreen } from './components/screens/FuturesScreen';
import { BondsScreen } from './components/screens/BondsScreen';
import { HeatmapScreen } from './components/screens/HeatmapScreen';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { ChartModal } from './components/ChartModal';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { activeTab } = useMarket();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 min-h-[calc(100vh-180px)]">
      {activeTab === 'overview' && <OverviewScreen />}
      {activeTab === 'stocks' && <StocksScreen />}
      {activeTab === 'crypto' && <CryptoScreen />}
      {activeTab === 'forex' && <ForexScreen />}
      {activeTab === 'indices' && <IndicesScreen />}
      {activeTab === 'futures' && <FuturesScreen />}
      {activeTab === 'bonds' && <BondsScreen />}
      {activeTab === 'heatmap' && <HeatmapScreen />}
    </main>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <div className="min-h-screen bg-[#131722] text-[#d1d4dc] flex flex-col font-sans transition-colors">
        <Header />
        <TickerTape />
        <CategoryNav />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />

        {/* Global Drawers & Modals */}
        <SearchModal />
        <WatchlistDrawer />
        <ChartModal />
      </div>
    </MarketProvider>
  );
}
