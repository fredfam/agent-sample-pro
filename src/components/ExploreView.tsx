import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Play, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { MarketSymbol } from '../types';
import { DisqusComments } from './DisqusComments';

export const ExploreView: React.FC = () => {
  const { markets, setActiveSymbolById, setActiveTab, toggleWatchlist, isInWatchlist } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'no-data-toggle'>('cards'); // Allows toggling sparklines or pristine screenshot match

  const categories = ['All', 'Crypto', 'Futures', 'Forex', 'Government bonds', 'Stock', 'Indices', 'Commodities'];

  const indices = markets.filter(m => m.type === 'index');
  const worldIndices = markets.filter(m => m.type === 'world_index');
  const usStocks = markets.filter(m => m.type === 'stock');
  const crypto = markets.filter(m => m.type === 'crypto');
  const forex = markets.filter(m => m.type === 'forex');
  const futures = markets.filter(m => m.type === 'futures');

  const handleCardClick = (id: string) => {
    setActiveSymbolById(id);
    setActiveTab('chart');
  };

  const renderCard = (m: MarketSymbol, cardSize: 'index' | 'world' | 'stock' = 'index') => {
    const isUp = m.change >= 0;
    const isSaved = isInWatchlist(m.id);

    return (
      <div
        key={m.id}
        onClick={() => handleCardClick(m.id)}
        className={`group relative bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between shrink-0 cursor-pointer hover:border-[#2962ff] dark:hover:border-[#2962ff] transition-all shadow-xs hover:shadow-md ${
          cardSize === 'index'
            ? 'min-w-[175px] h-[195px]'
            : cardSize === 'world'
            ? 'min-w-[215px] h-[175px]'
            : 'min-w-[200px] h-[145px]'
        }`}
      >
        {/* Top bar in card */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {m.symbol === 'NVIDIA' ? (
              <div className="w-7 h-7 bg-emerald-700 text-white rounded-full flex items-center justify-center font-bold">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
            ) : m.symbol === 'Apple' ? (
              <div className="w-7 h-7 bg-black dark:bg-white dark:text-black text-white rounded-full flex items-center justify-center font-bold text-xs">
                
              </div>
            ) : m.badgeText ? (
              <div className={`w-7 h-7 ${m.badgeBg || 'bg-blue-600'} ${m.badgeTextColor || 'text-white'} text-[11px] font-extrabold rounded-full flex items-center justify-center shrink-0`}>
                {m.badgeText}
              </div>
            ) : (
              <div className="w-7 h-7 bg-[#2962ff] text-white rounded-full flex items-center justify-center text-xs font-bold">
                {m.symbol.slice(0, 2)}
              </div>
            )}

            <div>
              <div className="font-extrabold text-gray-900 dark:text-white text-sm group-hover:text-[#2962ff] transition-colors">
                {m.symbol}
              </div>
              {cardSize === 'world' && (
                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                  {m.name}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(m.id);
            }}
            className={`p-1 rounded-full transition-colors ${
              isSaved ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Middle / Bottom Content */}
        {viewMode === 'no-data-toggle' && cardSize === 'index' ? (
          <div className="flex-grow flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 font-medium">
            No data here yet
          </div>
        ) : (
          <div className="mt-auto">
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-base font-black text-gray-900 dark:text-white font-mono tabular-nums">
                ${m.price < 10 ? m.price.toFixed(4) : m.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className={`flex items-center gap-1 text-xs font-bold mt-0.5 ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isUp ? <TrendingUp className="w-3 h-3 stroke-[2.5]" /> : <TrendingDown className="w-3 h-3 stroke-[2.5]" />}
              <span>{isUp ? '+' : ''}{m.changePercent.toFixed(2)}%</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px] font-mono">({m.change > 0 ? '+' : ''}{m.change})</span>
            </div>

            {/* Sparkline mini chart */}
            <div className="mt-2 h-6 flex items-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              {m.sparkline.map((val, idx) => {
                const min = Math.min(...m.sparkline);
                const max = Math.max(...m.sparkline);
                const heightPct = max === min ? 50 : Math.max(15, ((val - min) / (max - min)) * 100);
                return (
                  <div
                    key={idx}
                    style={{ height: `${heightPct}%` }}
                    className={`flex-1 rounded-xs transition-all ${isUp ? 'bg-emerald-500/40 group-hover:bg-emerald-500' : 'bg-rose-500/40 group-hover:bg-rose-500'}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Page Header & Filters */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Markets, everywhere
            </h1>
            <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-1 rounded-full">
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={() => setViewMode(prev => prev === 'cards' ? 'no-data-toggle' : 'cards')}
            className="text-xs text-[#2962ff] dark:text-[#2962ff] font-medium hover:underline"
          >
            {viewMode === 'cards' ? 'Minimal View' : 'Live Sparklines'}
          </button>
        </div>

        {/* Category Horizontal Filter Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-6 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-2 relative">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                selectedCategory === cat
                  ? 'text-[#2962ff] dark:text-[#2962ff] border-[#2962ff] font-bold'
                  : 'border-transparent hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
          {/* Fade effect */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-[#0f131e] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Indices Section */}
      {(selectedCategory === 'All' || selectedCategory === 'Indices') && (
        <section className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2
              onClick={() => setSelectedCategory('Indices')}
              className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1 cursor-pointer hover:text-[#2962ff] transition-colors"
            >
              Indices <ChevronRight className="w-5 h-5 text-gray-400" />
            </h2>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4">
            {indices.map((m) => renderCard(m, 'index'))}
          </div>
        </section>
      )}

      {/* World indices Section */}
      {(selectedCategory === 'All' || selectedCategory === 'Indices') && (
        <section className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2
              onClick={() => setSelectedCategory('Indices')}
              className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1 cursor-pointer hover:text-[#2962ff] transition-colors"
            >
              World indices <ChevronRight className="w-5 h-5 text-gray-400" />
            </h2>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4">
            {worldIndices.map((m) => renderCard(m, 'world'))}
          </div>
        </section>
      )}

      {/* US Stocks Section */}
      {(selectedCategory === 'All' || selectedCategory === 'Stock') && (
        <section className="mt-6">
          <div className="px-4 flex items-center gap-2 mb-3">
            {/* US Flag circle */}
            <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 24.3v463.3a24.3 24.3 0 0 1-24.3 24.3H24.3A24.3 24.3 0 0 1 0 487.6V24.3A24.3 24.3 0 0 1 24.3 0h463.3A24.3 24.3 0 0 1 512 24.3z" fill="#bd3d44" />
                <path d="M0 64h512v42H0zm0 85.3h512v42H0zm0 85.4h512v42H0zm0 85.3h512v42H0zm0 85.4h512v42H0z" fill="#fff" />
                <path d="M0 0h242v256H0z" fill="#192f5d" />
              </svg>
            </div>
            <h2
              onClick={() => setSelectedCategory('Stock')}
              className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1 cursor-pointer hover:text-[#2962ff] transition-colors"
            >
              US stocks <ChevronRight className="w-5 h-5 text-gray-400" />
            </h2>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4">
            {usStocks.map((m) => renderCard(m, 'stock'))}
          </div>
        </section>
      )}

      {/* Crypto Section */}
      {(selectedCategory === 'All' || selectedCategory === 'Crypto') && (
        <section className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2
              onClick={() => setSelectedCategory('Crypto')}
              className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1 cursor-pointer hover:text-[#2962ff] transition-colors"
            >
              Crypto <ChevronRight className="w-5 h-5 text-gray-400" />
            </h2>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4">
            {crypto.map((m) => renderCard(m, 'stock'))}
          </div>
        </section>
      )}

      {/* Forex & Futures Section */}
      {(selectedCategory === 'All' || selectedCategory === 'Forex' || selectedCategory === 'Futures') && (
        <section className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
              Futures & Forex <ChevronRight className="w-5 h-5 text-gray-400" />
            </h2>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4">
            {[...forex, ...futures].map((m) => renderCard(m, 'stock'))}
          </div>
        </section>
      )}

      {/* Embedded Discussion Forum at bottom of Landing Page */}
      <DisqusComments />
    </div>
  );
};
