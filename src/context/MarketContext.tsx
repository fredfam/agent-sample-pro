import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketSymbol, ActiveTab, TradeIdea, MarketNews } from '../types';
import { INITIAL_MARKETS, INITIAL_IDEAS, INITIAL_NEWS } from '../data/marketData';

interface MarketContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  markets: MarketSymbol[];
  activeSymbol: MarketSymbol;
  setActiveSymbolById: (id: string) => void;
  watchlistIds: string[];
  toggleWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isGetStartedOpen: boolean;
  setIsGetStartedOpen: (open: boolean) => void;
  isLiveTicker: boolean;
  setIsLiveTicker: (live: boolean) => void;
  tradeIdeas: TradeIdea[];
  addTradeIdea: (idea: TradeIdea) => void;
  news: MarketNews[];
  userAccount: {
    isLoggedIn: boolean;
    name: string;
    email: string;
    tier: string;
  };
  setUserAccount: React.Dispatch<React.SetStateAction<{
    isLoggedIn: boolean;
    name: string;
    email: string;
    tier: string;
  }>>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore'); // Screenshot defaults to Explore tab
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default to sleek dark mode or light
  const [markets, setMarkets] = useState<MarketSymbol[]>(INITIAL_MARKETS);
  const [activeSymbol, setActiveSymbol] = useState<MarketSymbol>(INITIAL_MARKETS[0]);
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['sp500', 'nasdaq100', 'nvda', 'aapl', 'btc']);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState<boolean>(false);
  const [isLiveTicker, setIsLiveTicker] = useState<boolean>(true);
  const [tradeIdeas, setTradeIdeas] = useState<TradeIdea[]>(INITIAL_IDEAS);
  const [news] = useState<MarketNews[]>(INITIAL_NEWS);

  const [userAccount, setUserAccount] = useState({
    isLoggedIn: false,
    name: 'Investor',
    email: 'investor@precisionmarkets.com',
    tier: 'Pro Trader Free Trial'
  });

  // Sync dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Live price tick simulation
  useEffect(() => {
    if (!isLiveTicker) return;

    const interval = setInterval(() => {
      setMarkets(prevMarkets =>
        prevMarkets.map(m => {
          // Random tiny fluctuation between -0.15% and +0.15%
          const deltaPct = (Math.random() - 0.49) * 0.003;
          const newPrice = +(m.price * (1 + deltaPct)).toFixed(m.price < 10 ? 4 : 2);
          const priceDiff = +(newPrice - m.openPrice).toFixed(m.price < 10 ? 4 : 2);
          const newChangePercent = +((priceDiff / m.openPrice) * 100).toFixed(2);
          
          const newSparkline = [...m.sparkline.slice(1), newPrice];

          return {
            ...m,
            price: newPrice,
            change: priceDiff,
            changePercent: newChangePercent,
            sparkline: newSparkline,
            high24h: Math.max(m.high24h, newPrice),
            low24h: Math.min(m.low24h, newPrice)
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveTicker]);

  // Keep active symbol price in sync
  useEffect(() => {
    const updated = markets.find(m => m.id === activeSymbol.id);
    if (updated) {
      setActiveSymbol(updated);
    }
  }, [markets, activeSymbol.id]);

  const setActiveSymbolById = (id: string) => {
    const found = markets.find(m => m.id === id || m.symbol.toLowerCase() === id.toLowerCase());
    if (found) {
      setActiveSymbol(found);
    }
  };

  const toggleWatchlist = (id: string) => {
    setWatchlistIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isInWatchlist = (id: string) => watchlistIds.includes(id);

  const addTradeIdea = (idea: TradeIdea) => {
    setTradeIdeas(prev => [idea, ...prev]);
  };

  return (
    <MarketContext.Provider
      value={{
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        markets,
        activeSymbol,
        setActiveSymbolById,
        watchlistIds,
        toggleWatchlist,
        isInWatchlist,
        isSearchOpen,
        setIsSearchOpen,
        isGetStartedOpen,
        setIsGetStartedOpen,
        isLiveTicker,
        setIsLiveTicker,
        tradeIdeas,
        addTradeIdea,
        news,
        userAccount,
        setUserAccount
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
