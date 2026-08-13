import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, MessageSquare, Sparkles, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { TradeIdea } from '../types';

export const IdeasView: React.FC = () => {
  const { tradeIdeas, addTradeIdea, setActiveSymbolById, setActiveTab } = useMarket();
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish'>('all');
  const [isPosting, setIsPosting] = useState<boolean>(false);

  // New post form state
  const [symbol, setSymbol] = useState<string>('NVIDIA');
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [sentiment, setSentiment] = useState<'bullish' | 'bearish'>('bullish');

  const filteredIdeas = tradeIdeas.filter(i => filter === 'all' || i.sentiment === filter);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) return;

    const newIdea: TradeIdea = {
      id: `idea-${Date.now()}`,
      author: {
        name: 'You (Trader Pro)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        handle: '@trader_pro',
        reputation: 1500
      },
      symbol,
      title,
      summary,
      sentiment,
      timeframe: '1-3 Weeks',
      likes: 1,
      commentsCount: 0,
      createdAt: 'Just now',
      chartData: [100, 102, 105, 108, 112],
      tags: ['Community', symbol]
    };

    addTradeIdea(newIdea);
    setTitle('');
    setSummary('');
    setIsPosting(false);
  };

  const handleSymbolClick = (sym: string) => {
    setActiveSymbolById(sym);
    setActiveTab('chart');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="w-7 h-7 text-amber-400" /> Market Ideas
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Community trade setups, technical chart breakdowns, and market sentiment
          </p>
        </div>

        <button
          onClick={() => setIsPosting(!isPosting)}
          className="flex items-center gap-1.5 bg-[#2962ff] hover:bg-blue-700 text-white font-medium px-3.5 py-2 rounded-xl text-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish idea</span>
        </button>
      </div>

      {/* Publish Form Drawer */}
      {isPosting && (
        <form onSubmit={handlePostSubmit} className="bg-white dark:bg-[#1c202a] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-6 animate-fade-in shadow-md">
          <h3 className="font-bold text-gray-900 dark:text-white text-base mb-3">Publish Trade Idea</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1 block">Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. NVIDIA, BTC/USD"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1 block">Sentiment</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSentiment('bullish')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                    sentiment === 'bullish'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500'
                  }`}
                >
                  Bullish
                </button>
                <button
                  type="button"
                  onClick={() => setSentiment('bearish')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                    sentiment === 'bearish'
                      ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500'
                  }`}
                >
                  Bearish
                </button>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-500 font-semibold mb-1 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NVDA Golden Cross Breakout towards $160"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-500 font-semibold mb-1 block">Technical Rationale & Summary</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Explain technical levels, support/resistance, RSI or moving average setups..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPosting(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#2962ff] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700"
            >
              Post Idea
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-3">
        {(['all', 'bullish', 'bearish'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
              filter === t
                ? 'bg-[#2962ff] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Trade Ideas List */}
      <div className="space-y-4">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs hover:border-gray-300 dark:hover:border-gray-700 transition-all"
          >
            {/* Author Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={idea.author.avatar}
                  alt={idea.author.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">
                    {idea.author.name}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {idea.author.handle} • {idea.createdAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSymbolClick(idea.symbol)}
                  className="bg-gray-100 dark:bg-[#21262d] hover:bg-gray-200 dark:hover:bg-[#30363d] px-2.5 py-1 rounded-lg text-xs font-bold font-mono text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                >
                  {idea.symbol}
                </button>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                    idea.sentiment === 'bullish'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}
                >
                  {idea.sentiment === 'bullish' ? <TrendingUp className="w-3 h-3 stroke-[2.5]" /> : <TrendingDown className="w-3 h-3 stroke-[2.5]" />}
                  {idea.sentiment}
                </span>
              </div>
            </div>

            {/* Title & Summary */}
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base mb-1 hover:text-[#2962ff] cursor-pointer transition-colors" onClick={() => handleSymbolClick(idea.symbol)}>
              {idea.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {idea.summary}
            </p>

            {/* Simulated Chart Projection Preview */}
            <div className="h-20 bg-gray-50 dark:bg-[#0d1117] rounded-xl p-2 mb-4 flex items-end gap-1 border border-gray-100 dark:border-gray-800">
              {idea.chartData.map((val, idx) => {
                const min = Math.min(...idea.chartData);
                const max = Math.max(...idea.chartData);
                const height = max === min ? 50 : ((val - min) / (max - min)) * 80 + 10;
                return (
                  <div
                    key={idx}
                    style={{ height: `${height}%` }}
                    className={`flex-1 rounded-xs ${idea.sentiment === 'bullish' ? 'bg-emerald-500/60' : 'bg-rose-500/60'}`}
                  />
                );
              })}
            </div>

            {/* Footer Stats & Interactions */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800 font-mono">
              <div className="flex gap-2">
                {idea.tags.map(tag => (
                  <span key={tag} className="text-gray-400">#{tag}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 font-sans font-semibold">
                <button className="flex items-center gap-1 hover:text-[#2962ff]">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{idea.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-[#2962ff]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{idea.commentsCount}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
