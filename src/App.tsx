import React from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ExploreView } from './components/ExploreView';
import { ChartView } from './components/ChartView';
import { WatchlistView } from './components/WatchlistView';
import { IdeasView } from './components/IdeasView';
import { MenuView } from './components/MenuView';
import { SearchModal } from './components/SearchModal';
import { GetStartedModal } from './components/GetStartedModal';

const AppContent: React.FC = () => {
  const { activeTab } = useMarket();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f131e] text-gray-900 dark:text-[#e3e2e6] font-sans antialiased transition-colors flex flex-col">
      <Header />

      <main className="flex-grow">
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'chart' && <ChartView />}
        {activeTab === 'watchlist' && <WatchlistView />}
        {activeTab === 'ideas' && <IdeasView />}
        {activeTab === 'menu' && <MenuView />}
      </main>

      <BottomNav />
      <SearchModal />
      <GetStartedModal />
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <AppContent />
    </MarketProvider>
  );
}
