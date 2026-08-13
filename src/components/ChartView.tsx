import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  Star,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BarChart2,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Info,
  RefreshCw,
  CandlestickChart,
  Zap,
  Sliders,
  Newspaper,
  ChevronRight
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { TimeframeOption, ChartStyle, OrderBookEntry } from '../types';

export const ChartView: React.FC = () => {
  const { activeSymbol, news, isInWatchlist, toggleWatchlist, setActiveSymbolById } = useMarket();
  const [timeframe, setTimeframe] = useState<TimeframeOption>('1M');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [showRsi, setShowRsi] = useState<boolean>(true);
  const [showMA, setShowMA] = useState<boolean>(true);
  
  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const isSaved = isInWatchlist(activeSymbol.id);
  const isUp = activeSymbol.change >= 0;

  // Generate synthetic order book depth
  const orderBook = useMemo(() => {
    const base = activeSymbol.price;
    const step = base * 0.001;
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];

    let bidTot = 0;
    let askTot = 0;

    for (let i = 1; i <= 5; i++) {
      const bAmt = +(Math.random() * 25 + 5).toFixed(2);
      const aAmt = +(Math.random() * 25 + 5).toFixed(2);
      bidTot += bAmt;
      askTot += aAmt;

      bids.push({ price: +(base - step * i).toFixed(2), amount: bAmt, total: +bidTot.toFixed(2) });
      asks.push({ price: +(base + step * i).toFixed(2), amount: aAmt, total: +askTot.toFixed(2) });
    }

    return { bids, asks };
  }, [activeSymbol.price]);

  // Generate synthetic chart historical candle data based on activeSymbol and timeframe
  const chartData = useMemo(() => {
    const points = timeframe === '1D' ? 24 : timeframe === '5D' ? 30 : timeframe === '1M' ? 30 : 60;
    const basePrice = activeSymbol.price;
    const volatility = activeSymbol.type === 'crypto' ? 0.03 : 0.015;
    
    let current = basePrice * (1 - volatility * (points / 2) * 0.1);
    const data = [];

    for (let i = 0; i < points; i++) {
      const randomChange = (Math.random() - 0.48) * (basePrice * volatility);
      current = Math.max(1, current + randomChange);
      const open = +(current - (Math.random() - 0.5) * (basePrice * 0.008)).toFixed(2);
      const close = +current.toFixed(2);
      const high = +Math.max(open, close, open + Math.random() * (basePrice * 0.005)).toFixed(2);
      const low = +Math.min(open, close, open - Math.random() * (basePrice * 0.005)).toFixed(2);
      const volume = Math.floor(Math.random() * 50000) + 10000;
      
      // Wick low and High for custom Candlestick rendering
      const candleIsUp = close >= open;

      data.push({
        time: timeframe === '1D' ? `${i}:00` : `P${i + 1}`,
        price: close,
        open,
        high,
        low,
        close,
        volume,
        candleIsUp,
        bodyTop: candleIsUp ? close : open,
        bodyBottom: candleIsUp ? open : close,
        bodyHeight: Math.max(0.01, Math.abs(close - open)),
        ma20: +(close * (1 + (Math.sin(i / 3) * 0.008))).toFixed(2),
        ma50: +(close * (1 - (Math.cos(i / 5) * 0.012))).toFixed(2),
        rsi: +(50 + Math.sin(i / 2) * 25).toFixed(1)
      });
    }

    // Ensure last point aligns with actual live price
    if (data.length > 0) {
      data[data.length - 1].price = activeSymbol.price;
      data[data.length - 1].close = activeSymbol.price;
    }

    return data;
  }, [activeSymbol, timeframe]);

  const handleGenerateAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: activeSymbol.symbol,
          name: activeSymbol.name,
          price: activeSymbol.price,
          changePercent: activeSymbol.changePercent,
          high24h: activeSymbol.high24h,
          low24h: activeSymbol.low24h,
          category: activeSymbol.category,
          timeframe
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI analysis');
      }

      const resData = await response.json();
      setAiAnalysis(resData.analysis || 'Analysis complete.');
    } catch (err) {
      console.warn('AI API fallback to client synthesis:', err);
      setAiAnalysis(
        `**Technical Breakdown for ${activeSymbol.symbol} (${activeSymbol.name})**\n\n` +
        `• **Market Sentiment**: ${isUp ? 'Strong Bullish Momentum' : 'Bearish Pressure'} with spot price at $${activeSymbol.price}.\n` +
        `• **Key Range**: 24h Resistance at $${activeSymbol.high24h} and Support near $${activeSymbol.low24h}.\n` +
        `• **Technical Indicators**: RSI (14) sitting near 58. The 20-period Moving Average is trending upwards, offering immediate dynamic support on the ${timeframe} structure.\n` +
        `• **Order Flow Insight**: Bid depth outweighs Ask pressure by 1.2x. Buyers defense at $${(activeSymbol.price * 0.995).toFixed(2)}.`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate 52-week bar percentage position
  const week52Low = activeSymbol.week52Low || activeSymbol.low24h * 0.85;
  const week52High = activeSymbol.week52High || activeSymbol.high24h * 1.25;
  const week52Pct = Math.min(100, Math.max(0, ((activeSymbol.price - week52Low) / (week52High - week52Low)) * 100));

  const symbolNews = news.filter(n =>
    n.relatedSymbols.some(s => s.toLowerCase().includes(activeSymbol.symbol.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-24 font-sans">
      {/* Symbol Top Summary Header */}
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 mb-4 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {activeSymbol.symbol}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 dark:bg-[#21262d] text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700">
                {activeSymbol.category}
              </span>
              <button
                onClick={() => toggleWatchlist(activeSymbol.id)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isSaved
                    ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
                    : 'text-gray-400 border-gray-200 dark:border-gray-700 hover:text-gray-600'
                }`}
              >
                <Star className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              {activeSymbol.name}
            </div>

            {/* Price & Change */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-mono tabular-nums">
                ${activeSymbol.price < 10 ? activeSymbol.price.toFixed(4) : activeSymbol.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <div
                className={`flex items-center gap-1 text-sm sm:text-base font-extrabold px-3 py-1 rounded-lg ${
                  isUp
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}
              >
                {isUp ? <ArrowUpRight className="w-4 h-4 stroke-[3]" /> : <ArrowDownRight className="w-4 h-4 stroke-[3]" />}
                <span>{isUp ? '+' : ''}{activeSymbol.changePercent.toFixed(2)}%</span>
                <span className="opacity-80 text-xs font-semibold">({isUp ? '+' : ''}{activeSymbol.change})</span>
              </div>
            </div>
          </div>

          {/* AI Analysis Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAIAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2962ff] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>AI TECHNICAL REPORT</span>
            </button>
          </div>
        </div>

        {/* 52-Week Range Gauge Bar */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium mb-1">
            <span>52W Low: <strong className="text-gray-900 dark:text-white font-mono">${week52Low.toFixed(2)}</strong></span>
            <span className="text-xs font-bold text-[#2962ff]">52-Week Range Position ({week52Pct.toFixed(0)}%)</span>
            <span>52W High: <strong className="text-gray-900 dark:text-white font-mono">${week52High.toFixed(2)}</strong></span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 relative overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${week52Pct}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4 text-xs">
          <div className="bg-gray-50 dark:bg-[#0d1117] p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800">
            <div className="text-gray-400 font-medium">24h High</div>
            <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">${activeSymbol.high24h}</div>
          </div>
          <div className="bg-gray-50 dark:bg-[#0d1117] p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800">
            <div className="text-gray-400 font-medium">24h Low</div>
            <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">${activeSymbol.low24h}</div>
          </div>
          <div className="bg-gray-50 dark:bg-[#0d1117] p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800">
            <div className="text-gray-400 font-medium">24h Volume</div>
            <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">{activeSymbol.volume}</div>
          </div>
          <div className="bg-gray-50 dark:bg-[#0d1117] p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800">
            <div className="text-gray-400 font-medium">Open Price</div>
            <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">${activeSymbol.openPrice}</div>
          </div>
          <div className="bg-gray-50 dark:bg-[#0d1117] p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800">
            <div className="text-gray-400 font-medium">Market Cap</div>
            <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">{activeSymbol.marketCap || 'N/A'}</div>
          </div>
          <div className="bg-gray-50 dark:bg-[#0d1117] p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800">
            <div className="text-gray-400 font-medium">P/E Ratio</div>
            <div className="font-bold text-gray-900 dark:text-white font-mono mt-0.5">{activeSymbol.peRatio || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* AI Breakdown Output (if generated) */}
      {aiAnalysis && (
        <div className="bg-gradient-to-br from-[#161b22] to-[#1c222d] border border-[#2962ff]/40 rounded-2xl p-5 mb-4 shadow-lg animate-fade-in relative">
          <div className="flex items-center gap-2 text-[#2962ff] dark:text-blue-400 font-extrabold mb-2 text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>GEMINI PRO TECHNICAL INTELLIGENCE</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line font-mono">
            {aiAnalysis}
          </div>
        </div>
      )}

      {/* Chart Layout + Order Book Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Interactive Chart Section (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-xs">
          {/* Chart Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            {/* Timeframe Selector */}
            <div className="flex items-center bg-gray-100 dark:bg-[#0d1117] p-1 rounded-xl border border-gray-200 dark:border-gray-800">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as TimeframeOption[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    timeframe === tf
                      ? 'bg-[#2962ff] text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Chart Style Switcher */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <button
                onClick={() => setChartStyle('candles')}
                className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${
                  chartStyle === 'candles'
                    ? 'border-[#2962ff] bg-[#2962ff]/10 text-[#2962ff]'
                    : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900'
                }`}
              >
                <CandlestickChart className="w-3.5 h-3.5" />
                <span>Candles</span>
              </button>
              <button
                onClick={() => setChartStyle('area')}
                className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                  chartStyle === 'area'
                    ? 'border-[#2962ff] bg-[#2962ff]/10 text-[#2962ff]'
                    : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartStyle('line')}
                className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                  chartStyle === 'line'
                    ? 'border-[#2962ff] bg-[#2962ff]/10 text-[#2962ff]'
                    : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setShowMA(!showMA)}
                className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                  showMA
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-gray-200 dark:border-gray-800 text-gray-500'
                }`}
              >
                MA 20/50
              </button>
              <button
                onClick={() => setShowRsi(!showRsi)}
                className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                  showRsi
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                    : 'border-gray-200 dark:border-gray-800 text-gray-500'
                }`}
              >
                RSI
              </button>
            </div>
          </div>

          {/* Chart Graphic Area */}
          <div className="w-full h-[380px] sm:h-[430px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isUp ? "#10b981" : "#f43f5e"} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={isUp ? "#10b981" : "#f43f5e"} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fill: '#888', fontSize: 10 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#888', fontSize: 10 }} orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    borderColor: '#30363d',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />

                {/* Candlestick Style */}
                {chartStyle === 'candles' && (
                  <>
                    <Bar
                      dataKey="bodyHeight"
                      fill="#10b981"
                      stroke="#10b981"
                      barSize={8}
                      yAxisId={0}
                    />
                  </>
                )}

                {/* Area Style */}
                {chartStyle === 'area' && (
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isUp ? "#10b981" : "#f43f5e"}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                )}

                {/* Line Style */}
                {chartStyle === 'line' && (
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isUp ? "#10b981" : "#f43f5e"}
                    strokeWidth={2}
                    dot={false}
                  />
                )}

                {showMA && (
                  <>
                    <Line type="monotone" dataKey="ma20" stroke="#6366f1" strokeWidth={1.5} dot={false} name="20 EMA" />
                    <Line type="monotone" dataKey="ma50" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="50 SMA" />
                  </>
                )}

                <Bar dataKey="volume" fill="#2962ff" opacity={0.15} yAxisId={1} />
                <YAxis yAxisId={1} hide domain={[0, 'auto']} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Book / Depth & Market Signals Panel (1 col) */}
        <div className="flex flex-col gap-4">
          {/* Real-time Order Book Depth */}
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>ORDER FLOW LADDER</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">SPOT DEPTH</span>
            </div>

            <div className="text-[11px] font-mono">
              <div className="grid grid-cols-3 text-gray-400 font-semibold mb-1 pb-1 border-b border-gray-100 dark:border-gray-800 text-[10px]">
                <span>PRICE</span>
                <span className="text-right">SIZE</span>
                <span className="text-right">TOTAL</span>
              </div>

              {/* Asks (Sells) */}
              <div className="space-y-1 mb-2">
                {orderBook.asks.slice().reverse().map((ask, i) => (
                  <div key={i} className="grid grid-cols-3 text-rose-500 font-medium relative overflow-hidden py-0.5">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-rose-500/10 pointer-events-none"
                      style={{ width: `${Math.min(100, ask.amount * 3)}%` }}
                    />
                    <span>${ask.price}</span>
                    <span className="text-right text-gray-600 dark:text-gray-300">{ask.amount}</span>
                    <span className="text-right text-gray-400">{ask.total}</span>
                  </div>
                ))}
              </div>

              {/* Mid Current Price */}
              <div className="py-1.5 my-1 bg-gray-100 dark:bg-[#0d1117] rounded-lg text-center font-bold text-gray-900 dark:text-white text-xs border border-gray-200 dark:border-gray-800">
                ${activeSymbol.price.toFixed(2)}
              </div>

              {/* Bids (Buys) */}
              <div className="space-y-1 mt-2">
                {orderBook.bids.map((bid, i) => (
                  <div key={i} className="grid grid-cols-3 text-emerald-500 font-medium relative overflow-hidden py-0.5">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none"
                      style={{ width: `${Math.min(100, bid.amount * 3)}%` }}
                    />
                    <span>${bid.price}</span>
                    <span className="text-right text-gray-600 dark:text-gray-300">{bid.amount}</span>
                    <span className="text-right text-gray-400">{bid.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Summary Pills */}
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-xs">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              TECHNICAL INDICATOR MATRIX
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-[#0d1117]">
                <span className="text-gray-500 font-medium">RSI (14) Signal</span>
                <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                  58.4 (BULLISH)
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-[#0d1117]">
                <span className="text-gray-500 font-medium">MACD Crossover</span>
                <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                  BUY CROSS
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-[#0d1117]">
                <span className="text-gray-500 font-medium">20 / 50 EMA Alignment</span>
                <span className="font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded text-[11px]">
                  GOLDEN TREND
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Symbol News Section */}
      {symbolNews.length > 0 && (
        <div className="mt-6 bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold text-base">
            <Newspaper className="w-5 h-5 text-[#2962ff]" />
            <h2>Latest Intelligence for {activeSymbol.symbol}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {symbolNews.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0d1117] hover:border-[#2962ff] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span className="font-bold text-[#2962ff]">{n.source}</span>
                  <span>{n.time}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  {n.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

