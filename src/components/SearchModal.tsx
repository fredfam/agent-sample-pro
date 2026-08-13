import React, { useState } from 'react';
import { Search, X, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    markets,
    setActiveSymbolById,
    setActiveTab,
    toggleWatchlist,
    isInWatchlist
  } = useMarket();

  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filtered = markets.filter(
    m =>
      m.symbol.toLowerCase().includes(query.toLowerCase()) ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectSymbol = (id: string) => {
    setActiveSymbolById(id);
    setActiveTab('chart');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#1c202a] w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        {/* Search Header Input */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stock, crypto, index, forex or futures (e.g. NVDA, S&P 500, BTC)..."
            className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm font-medium focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              No matching markets found for "{query}"
            </div>
          ) : (
            filtered.map((m) => {
              const isUp = m.change >= 0;
              const isSaved = isInWatchlist(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => handleSelectSymbol(m.id)}
                  className="p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xs text-gray-900 dark:text-white">
                      {m.badgeText || m.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">
                        {m.symbol}
                      </div>
                      <div className="text-xs text-gray-400">
                        {m.name} • <span className="uppercase text-[10px] font-semibold text-[#2962ff]">{m.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white text-sm">
                        ${m.price < 10 ? m.price.toFixed(4) : m.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-semibold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isUp ? '+' : ''}{m.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(m.id);
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        isSaved ? 'text-amber-500' : 'text-gray-300 hover:text-gray-500'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
