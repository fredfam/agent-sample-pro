import React, { useState } from 'react';
import { Star, TrendingUp, TrendingDown, Trash2, Plus, ArrowUpDown, Search, LayoutGrid, List, Download } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const WatchlistView: React.FC = () => {
  const { markets, watchlistIds, toggleWatchlist, setActiveSymbolById, setActiveTab, setIsSearchOpen } = useMarket();
  const [filterType, setFilterType] = useState<string>('all');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [viewStyle, setViewStyle] = useState<'table' | 'heatmap'>('table');

  const watchedMarkets = markets
    .filter(m => watchlistIds.includes(m.id))
    .filter(m => filterType === 'all' || m.type === filterType);

  const sortedMarkets = [...watchedMarkets].sort((a, b) => {
    return sortAsc ? a.changePercent - b.changePercent : b.changePercent - a.changePercent;
  });

  const handleRowClick = (id: string) => {
    setActiveSymbolById(id);
    setActiveTab('chart');
  };

  const handleExportCSV = () => {
    const headers = ['Symbol', 'Name', 'Type', 'Price', 'ChangePercent', '24hVolume'];
    const rows = sortedMarkets.map(m => [
      m.symbol,
      `"${m.name}"`,
      m.type,
      m.price,
      m.changePercent,
      `"${m.volume}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'precision_markets_watchlist.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-24 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" /> Watchlist
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time multi-asset tracking, sparklines, and visual heatmaps
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sortedMarkets.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#21262d] hover:bg-gray-200 dark:hover:bg-[#30363d] text-gray-700 dark:text-gray-200 font-bold px-3 py-2 rounded-xl text-xs transition-all border border-gray-200 dark:border-gray-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 bg-[#2962ff] hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add symbol</span>
          </button>
        </div>
      </div>

      {/* Filter, View Switcher & Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          {['all', 'stock', 'crypto', 'index', 'forex'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                filterType === type
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-[#161b22] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Heatmap vs Table Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-[#161b22] p-1 rounded-xl border border-gray-200 dark:border-gray-800 text-xs">
            <button
              onClick={() => setViewStyle('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewStyle === 'table' ? 'bg-[#2962ff] text-white shadow-xs' : 'text-gray-400'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewStyle('heatmap')}
              className={`p-1.5 rounded-lg transition-all ${
                viewStyle === 'heatmap' ? 'bg-[#2962ff] text-white shadow-xs' : 'text-gray-400'
              }`}
              title="Heatmap view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort % ({sortAsc ? 'Low-High' : 'High-Low'})</span>
          </button>
        </div>
      </div>

      {/* Heatmap View Mode */}
      {viewStyle === 'heatmap' && sortedMarkets.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {sortedMarkets.map((m) => {
            const isUp = m.change >= 0;
            const absChange = Math.abs(m.changePercent);
            const intensityClass = isUp
              ? absChange > 3 ? 'bg-emerald-600 dark:bg-emerald-700' : 'bg-emerald-500/80 dark:bg-emerald-800/80'
              : absChange > 3 ? 'bg-rose-600 dark:bg-rose-700' : 'bg-rose-500/80 dark:bg-rose-800/80';

            return (
              <div
                key={m.id}
                onClick={() => handleRowClick(m.id)}
                className={`${intensityClass} text-white rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-transform shadow-sm flex flex-col justify-between h-32 relative overflow-hidden`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-black text-lg">{m.symbol}</span>
                  <span className="text-[10px] font-bold uppercase opacity-80">{m.category}</span>
                </div>
                <div>
                  <div className="text-xl font-black font-mono">
                    ${m.price < 10 ? m.price.toFixed(4) : m.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs font-extrabold mt-0.5">
                    {isUp ? '+' : ''}{m.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Watchlist Table / List Mode */}
      {sortedMarkets.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your watchlist is empty</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
            Browse markets or use search to star your favorite symbols.
          </p>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex items-center gap-2 bg-[#2962ff] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
          >
            <Search className="w-4 h-4" /> Search Markets
          </button>
        </div>
      ) : viewStyle === 'table' && (
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {sortedMarkets.map((m) => {
              const isUp = m.change >= 0;
              return (
                <div
                  key={m.id}
                  onClick={() => handleRowClick(m.id)}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#21262d] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {m.badgeText || m.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">
                        {m.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                        {m.name}
                      </div>
                    </div>
                  </div>

                  {/* Sparkline mini */}
                  <div className="hidden sm:flex h-6 w-20 items-end gap-0.5">
                    {m.sparkline.map((val, idx) => {
                      const min = Math.min(...m.sparkline);
                      const max = Math.max(...m.sparkline);
                      const heightPct = max === min ? 50 : Math.max(15, ((val - min) / (max - min)) * 100);
                      return (
                        <div
                          key={idx}
                          style={{ height: `${heightPct}%` }}
                          className={`flex-1 rounded-xs ${isUp ? 'bg-emerald-500/50' : 'bg-rose-500/50'}`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white text-sm font-mono tabular-nums">
                        ${m.price < 10 ? m.price.toFixed(4) : m.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`flex items-center justify-end gap-0.5 text-xs font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isUp ? '+' : ''}{m.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(m.id);
                      }}
                      className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

