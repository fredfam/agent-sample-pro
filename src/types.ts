export type MarketType = 'index' | 'world_index' | 'stock' | 'crypto' | 'forex' | 'futures';

export interface MarketSymbol {
  id: string;
  symbol: string;
  name: string;
  type: MarketType;
  price: number;
  change: number;
  changePercent: number;
  badgeText?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  iconType?: 'badge' | 'us_flag' | 'logo' | 'custom';
  iconUrl?: string;
  brandBg?: string;
  high24h: number;
  low24h: number;
  volume: string;
  openPrice: number;
  prevClose: number;
  marketCap?: string;
  peRatio?: number;
  dividendYield?: string;
  week52Low?: number;
  week52High?: number;
  category: string;
  sparkline: number[];
  description?: string;
}

export type TimeframeOption = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';
export type ChartStyle = 'area' | 'candles' | 'line';

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20?: number;
  ma50?: number;
  rsi?: number;
}

export interface TradeIdea {
  id: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
    reputation: number;
  };
  symbol: string;
  title: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timeframe: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
  chartData: number[];
  tags: string[];
  targetPrice?: number;
  stopLoss?: number;
}

export interface MarketNews {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
  category: string;
  relatedSymbols: string[];
}

export type ActiveTab = 'watchlist' | 'chart' | 'explore' | 'ideas' | 'menu';

