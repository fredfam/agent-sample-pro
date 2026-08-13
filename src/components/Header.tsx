import React, { useEffect } from 'react';
import { Search, Menu as MenuIcon, Activity, Globe, Sparkles } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const Header: React.FC = () => {
  const {
    markets,
    setIsSearchOpen,
    setIsGetStartedOpen,
    setActiveTab,
    setActiveSymbolById,
    isLiveTicker,
    setIsLiveTicker,
    userAccount
  } = useMarket();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const topTapeMarkets = markets.slice(0, 8);

  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-[#0d1117] transition-colors">
      <header className="flex justify-between items-center w-full px-4 h-14 border-b border-gray-200 dark:border-gray-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('menu')}
            aria-label="Open menu"
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1.5 transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          
          <div
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2 cursor-pointer font-bold text-gray-900 dark:text-white select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2962ff] to-blue-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="hidden sm:inline-block tracking-tight text-base font-extrabold text-gray-900 dark:text-white leading-none">
                PRECISION <span className="text-[#2962ff]">MARKETS</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                Institutional Terminal
              </span>
            </div>
          </div>
        </div>

        {/* Search trigger button with keyboard shortcut */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-[#161b22] hover:bg-gray-200 dark:hover:bg-[#21262d] border border-gray-200 dark:border-gray-800 rounded-lg text-xs text-gray-500 dark:text-gray-400 transition-all"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <span>Search symbols, indices, crypto...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded text-gray-400 font-mono shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search markets"
            className="md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Live ticker status pill */}
          <button
            onClick={() => setIsLiveTicker(!isLiveTicker)}
            title={isLiveTicker ? "Live market stream running" : "Live stream paused"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
              isLiveTicker
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveTicker ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="hidden sm:inline">{isLiveTicker ? 'LIVE STREAM' : 'PAUSED'}</span>
          </button>

          {userAccount.isLoggedIn ? (
            <button
              onClick={() => setIsGetStartedOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-full text-xs font-semibold hover:bg-gray-200 dark:hover:bg-[#21262d] transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-[#2962ff] text-white flex items-center justify-center font-bold text-[10px]">
                {userAccount.name[0]}
              </div>
              <span className="max-w-[80px] truncate text-gray-800 dark:text-gray-200">{userAccount.name}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsGetStartedOpen(true)}
              className="bg-[#2962ff] hover:bg-[#1e4bd8] text-white font-semibold py-1.5 px-4 rounded-lg text-xs transition-all shadow-xs active:scale-95"
            >
              Get started
            </button>
          )}
        </div>
      </header>

      {/* Pro Ticker Tape Bar under header */}
      <div className="bg-gray-50 dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-800/80 px-2 py-1 overflow-x-auto no-scrollbar flex items-center gap-4 text-[11px] font-mono">
        <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase font-bold shrink-0 tracking-wider pl-2 border-r border-gray-200 dark:border-gray-800 pr-3">
          <Globe className="w-3 h-3 text-[#2962ff]" />
          <span>MARKET TICKER</span>
        </div>
        <div className="flex items-center gap-5 shrink-0">
          {topTapeMarkets.map((m) => {
            const isUp = m.change >= 0;
            return (
              <div
                key={m.id}
                onClick={() => {
                  setActiveSymbolById(m.id);
                  setActiveTab('chart');
                }}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
              >
                <span className="font-semibold text-gray-700 dark:text-gray-300">{m.symbol}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {m.price < 10 ? m.price.toFixed(4) : m.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className={`font-bold ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isUp ? '+' : ''}{m.changePercent.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

