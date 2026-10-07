/**
 * TradingView Markets Data Types
 */

export type MarketTab =
  | 'overview'
  | 'stocks'
  | 'crypto'
  | 'forex'
  | 'indices'
  | 'futures'
  | 'bonds'
  | 'heatmap';

export type AssetCategory =
  | 'stock'
  | 'crypto'
  | 'forex'
  | 'index'
  | 'future'
  | 'bond';

export type AnalystRating =
  | 'Strong Buy'
  | 'Buy'
  | 'Neutral'
  | 'Sell'
  | 'Strong Sell';

export interface MarketInstrument {
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  sector?: string;
  subSector?: string;
  exchange?: string;
  sparkline: number[];
  currency: string;
  rating: AnalystRating;
  peRatio?: number;
  divYield?: number;
  high52w?: number;
  low52w?: number;
  eps?: number;
  beta?: number;
  avgVolume?: string;
  nextEarnings?: string;
  logo?: string;
  flag?: string;
  description?: string;
  lastTickDirection?: 'up' | 'down' | 'none';
}

export interface OHLCPoint {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  marketCap: string;
  leadStock: string;
  stockCount: number;
  color: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  relatedSymbol?: string;
  readTime: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  country: string;
  flag: string;
  event: string;
  actual?: string;
  forecast: string;
  prior: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  triggered: boolean;
}
