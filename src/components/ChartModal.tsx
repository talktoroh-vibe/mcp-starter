import React, { useState, useMemo, useRef } from 'react';
import { useMarket } from '../context/MarketContext';
import { generateCandles } from '../data/marketData';
import { OHLCPoint } from '../types/market';
import {
  X,
  Bookmark,
  Share2,
  TrendingUp,
  TrendingDown,
  Layers,
  Activity,
  Maximize2,
  BarChart2,
  LineChart,
} from 'lucide-react';

export const ChartModal: React.FC = () => {
  const { selectedInstrument, setSelectedInstrument, toggleWatchlist, isInWatchlist } = useMarket();

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [chartType, setChartType] = useState<'candlestick' | 'area'>('candlestick');
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Generate authentic candles based on instrument price and selected timeframe
  const candles: OHLCPoint[] = useMemo(() => {
    if (!selectedInstrument) return [];
    return generateCandles(selectedInstrument.price, timeframe, 50);
  }, [selectedInstrument?.symbol, timeframe, selectedInstrument?.price]);

  if (!selectedInstrument) return null;

  const isPositive = selectedInstrument.change >= 0;
  const isBookmarked = isInWatchlist(selectedInstrument.symbol);

  // Compute Moving Averages
  const ma20 = useMemo(() => {
    return candles.map((_, idx, arr) => {
      if (idx < 19) return null;
      const slice = arr.slice(idx - 19, idx + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / 20;
    });
  }, [candles]);

  const ma50 = useMemo(() => {
    return candles.map((_, idx, arr) => {
      if (idx < 29) return null; // shorter smoothing for 50-candle set
      const slice = arr.slice(idx - 29, idx + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / 30;
    });
  }, [candles]);

  // Compute RSI values
  const rsi = useMemo(() => {
    const period = 14;
    return candles.map((_, idx, arr) => {
      if (idx < period) return 50;
      let gains = 0;
      let losses = 0;
      for (let i = idx - period + 1; i <= idx; i++) {
        const change = arr[i].close - arr[i - 1].close;
        if (change >= 0) gains += change;
        else losses += Math.abs(change);
      }
      if (losses === 0) return 100;
      const rs = gains / losses;
      return 100 - 100 / (1 + rs);
    });
  }, [candles]);

  // SVG Chart Geometry calculations
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map((c) => c.volume));

  const chartWidth = 760;
  const chartHeight = 320;
  const paddingBottom = 40;
  const plotHeight = chartHeight - paddingBottom;
  const candleSlotWidth = chartWidth / candles.length;
  const candleBodyWidth = Math.max(candleSlotWidth * 0.65, 4);

  const getY = (val: number) => {
    return plotHeight - ((val - minPrice) / priceRange) * (plotHeight - 30) - 15;
  };

  // Hovered candle info
  const activeCandle = hoverIndex !== null ? candles[hoverIndex] : candles[candles.length - 1];

  // Mouse move handler for interactive crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const index = Math.floor((x / rect.width) * candles.length);
    if (index >= 0 && index < candles.length) {
      setHoverIndex(index);
    }
  };

  // Technical Analysis Meter pointer degrees
  const getRatingDegrees = (rating: string) => {
    switch (rating) {
      case 'Strong Sell':
        return -75;
      case 'Sell':
        return -35;
      case 'Neutral':
        return 0;
      case 'Buy':
        return 35;
      case 'Strong Buy':
        return 75;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-5xl my-auto rounded-2xl bg-[#1e222d] border border-[#2a2e39] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar of Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2a2e39] bg-[#181b25]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-extrabold text-sm text-white">
              {selectedInstrument.symbol.slice(0, 3)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  {selectedInstrument.symbol}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#787b86] px-1.5 py-0.5 rounded bg-[#131722] border border-[#2a2e39]">
                  {selectedInstrument.exchange || selectedInstrument.category}
                </span>
                <span className="text-xs text-[#787b86] hidden sm:inline">
                  {selectedInstrument.name}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-white font-tabular">
                  {selectedInstrument.price < 2
                    ? selectedInstrument.price.toFixed(4)
                    : selectedInstrument.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  {selectedInstrument.currency === '%' ? '%' : ` ${selectedInstrument.currency}`}
                </span>
                <span
                  className={`text-xs font-semibold font-tabular flex items-center ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {selectedInstrument.change >= 0 ? selectedInstrument.change.toFixed(2) : selectedInstrument.change.toFixed(2)} (
                  {isPositive ? '+' : ''}
                  {selectedInstrument.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(selectedInstrument.symbol)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-[#2962ff]/15 border-[#2962ff] text-[#2962ff]'
                  : 'bg-[#131722] border-[#2a2e39] text-[#787b86] hover:text-white'
              }`}
              title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedInstrument(null)}
              className="p-2 rounded-lg bg-[#131722] border border-[#2a2e39] text-[#787b86] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chart Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 border-b border-[#2a2e39] bg-[#131722]">
          {/* Timeframe Selectors */}
          <div className="flex items-center gap-1 bg-[#1e222d] p-1 rounded-lg border border-[#2a2e39]">
            {(['1D', '5D', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type & Indicator Toggles */}
          <div className="flex items-center gap-2">
            {/* Chart Style */}
            <div className="flex items-center bg-[#1e222d] p-1 rounded-lg border border-[#2a2e39]">
              <button
                onClick={() => setChartType('candlestick')}
                className={`p-1.5 rounded transition-colors ${
                  chartType === 'candlestick'
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
                title="Candlestick Chart"
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`p-1.5 rounded transition-colors ${
                  chartType === 'area'
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
                title="Area / Line Chart"
              >
                <LineChart className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Indicator Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowMA20(!showMA20)}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                  showMA20
                    ? 'bg-[#2962ff]/20 border-[#2962ff] text-[#2962ff]'
                    : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                MA 20
              </button>
              <button
                onClick={() => setShowMA50(!showMA50)}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                  showMA50
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                MA 50
              </button>
              <button
                onClick={() => setShowBollinger(!showBollinger)}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                  showBollinger
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                BB
              </button>
              <button
                onClick={() => setShowRSI(!showRSI)}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                  showRSI
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                RSI
              </button>
            </div>
          </div>
        </div>

        {/* OHLC Interactive Status HUD */}
        {activeCandle && (
          <div className="flex items-center gap-4 px-5 py-1.5 bg-[#181b25] border-b border-[#2a2e39]/50 text-[11px] text-[#787b86] font-tabular overflow-x-auto scrollbar-none">
            <span className="text-white font-medium">{activeCandle.time}</span>
            <span>
              O: <span className="text-[#d1d4dc]">{activeCandle.open.toFixed(2)}</span>
            </span>
            <span>
              H: <span className="text-[#089981]">{activeCandle.high.toFixed(2)}</span>
            </span>
            <span>
              L: <span className="text-[#f23645]">{activeCandle.low.toFixed(2)}</span>
            </span>
            <span>
              C: <span className="text-[#d1d4dc]">{activeCandle.close.toFixed(2)}</span>
            </span>
            <span>
              Vol: <span className="text-[#d1d4dc]">{(activeCandle.volume / 1000).toFixed(0)}K</span>
            </span>
          </div>
        )}

        {/* Scrollable Body: Chart + Technical Gauge + Stats */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Main SVG Interactive Chart */}
          <div className="relative w-full rounded-xl bg-[#131722] border border-[#2a2e39] p-3 overflow-hidden">
            {/* Price horizontal grid lines */}
            <div className="absolute inset-y-3 right-3 flex flex-col justify-between pointer-events-none text-[10px] text-[#787b86] font-tabular select-none pr-1">
              <span>{maxPrice.toFixed(2)}</span>
              <span>{((maxPrice + minPrice) / 2).toFixed(2)}</span>
              <span>{minPrice.toFixed(2)}</span>
            </div>

            <svg
              ref={svgRef}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-[320px] select-none cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Background horizontal grid lines */}
              <line x1="0" y1={plotHeight * 0.25} x2={chartWidth} y2={plotHeight * 0.25} stroke="#2a2e39" strokeWidth="0.75" strokeDasharray="3 3" />
              <line x1="0" y1={plotHeight * 0.5} x2={chartWidth} y2={plotHeight * 0.5} stroke="#2a2e39" strokeWidth="0.75" strokeDasharray="3 3" />
              <line x1="0" y1={plotHeight * 0.75} x2={chartWidth} y2={plotHeight * 0.75} stroke="#2a2e39" strokeWidth="0.75" strokeDasharray="3 3" />

              {/* Volume Bars */}
              {candles.map((candle, idx) => {
                const x = idx * candleSlotWidth + (candleSlotWidth - candleBodyWidth) / 2;
                const volHeight = (candle.volume / maxVolume) * 45;
                const volY = plotHeight - volHeight;
                const isGreen = candle.close >= candle.open;

                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x}
                    y={volY}
                    width={candleBodyWidth}
                    height={volHeight}
                    fill={isGreen ? 'rgba(8, 153, 129, 0.25)' : 'rgba(242, 54, 69, 0.25)'}
                  />
                );
              })}

              {/* Bollinger Bands Shaded Area */}
              {showBollinger && (
                <path
                  d={candles
                    .map((c, idx) => {
                      const x = idx * candleSlotWidth + candleSlotWidth / 2;
                      const yUpper = getY(c.close * 1.025);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${yUpper}`;
                    })
                    .join(' ') +
                    candles
                      .slice()
                      .reverse()
                      .map((c, revIdx) => {
                        const idx = candles.length - 1 - revIdx;
                        const x = idx * candleSlotWidth + candleSlotWidth / 2;
                        const yLower = getY(c.close * 0.975);
                        return `L ${x} ${yLower}`;
                      })
                      .join(' ') +
                    ' Z'}
                  fill="rgba(168, 85, 247, 0.08)"
                  stroke="rgba(168, 85, 247, 0.3)"
                  strokeWidth="1"
                />
              )}

              {/* Area Chart Mode */}
              {chartType === 'area' && (
                <>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2962ff" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={
                      candles
                        .map((c, idx) => {
                          const x = idx * candleSlotWidth + candleSlotWidth / 2;
                          const y = getY(c.close);
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ') +
                      ` L ${chartWidth} ${plotHeight} L 0 ${plotHeight} Z`
                    }
                    fill="url(#areaGradient)"
                  />
                  <path
                    d={candles
                      .map((c, idx) => {
                        const x = idx * candleSlotWidth + candleSlotWidth / 2;
                        const y = getY(c.close);
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Candlestick Chart Mode */}
              {chartType === 'candlestick' &&
                candles.map((candle, idx) => {
                  const x = idx * candleSlotWidth + (candleSlotWidth - candleBodyWidth) / 2;
                  const centerX = idx * candleSlotWidth + candleSlotWidth / 2;
                  const isGreen = candle.close >= candle.open;
                  const color = isGreen ? '#089981' : '#f23645';

                  const yHigh = getY(candle.high);
                  const yLow = getY(candle.low);
                  const yOpen = getY(candle.open);
                  const yClose = getY(candle.close);

                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);

                  return (
                    <g key={`candle-${idx}`}>
                      {/* Upper & lower wick line */}
                      <line
                        x1={centerX}
                        y1={yHigh}
                        x2={centerX}
                        y2={yLow}
                        stroke={color}
                        strokeWidth="1.5"
                      />
                      {/* Real body */}
                      <rect
                        x={x}
                        y={bodyTop}
                        width={candleBodyWidth}
                        height={bodyHeight}
                        fill={color}
                        rx="1"
                      />
                    </g>
                  );
                })}

              {/* MA 20 Line */}
              {showMA20 && (
                <path
                  d={ma20
                    .map((val, idx) => {
                      if (val === null) return '';
                      const x = idx * candleSlotWidth + candleSlotWidth / 2;
                      const y = getY(val);
                      return `${idx === 19 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="1.8"
                />
              )}

              {/* MA 50 Line */}
              {showMA50 && (
                <path
                  d={ma50
                    .map((val, idx) => {
                      if (val === null) return '';
                      const x = idx * candleSlotWidth + candleSlotWidth / 2;
                      const y = getY(val);
                      return `${idx === 29 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                />
              )}

              {/* Hover Crosshair */}
              {hoverIndex !== null && (
                <>
                  {/* Vertical Crosshair Line */}
                  <line
                    x1={hoverIndex * candleSlotWidth + candleSlotWidth / 2}
                    y1={0}
                    x2={hoverIndex * candleSlotWidth + candleSlotWidth / 2}
                    y2={plotHeight}
                    stroke="#787b86"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  {/* Horizontal Crosshair Line */}
                  <line
                    x1={0}
                    y1={getY(candles[hoverIndex].close)}
                    x2={chartWidth}
                    y2={getY(candles[hoverIndex].close)}
                    stroke="#787b86"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  {/* Price marker on axis */}
                  <rect
                    x={chartWidth - 55}
                    y={getY(candles[hoverIndex].close) - 9}
                    width={55}
                    height={18}
                    fill="#2962ff"
                    rx="3"
                  />
                  <text
                    x={chartWidth - 28}
                    y={getY(candles[hoverIndex].close) + 4}
                    fill="#ffffff"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {candles[hoverIndex].close.toFixed(2)}
                  </text>
                </>
              )}
            </svg>

            {/* Time labels on bottom axis */}
            <div className="flex justify-between px-2 pt-2 border-t border-[#2a2e39]/50 text-[10px] text-[#787b86] font-tabular">
              <span>{candles[0]?.time}</span>
              <span>{candles[Math.floor(candles.length / 2)]?.time}</span>
              <span>{candles[candles.length - 1]?.time}</span>
            </div>
          </div>

          {/* RSI Sub-Panel (if toggled) */}
          {showRSI && (
            <div className="p-3 rounded-xl bg-[#131722] border border-[#2a2e39]">
              <div className="flex items-center justify-between text-xs text-[#787b86] mb-1 font-semibold">
                <span>RSI (14)</span>
                <span className="font-tabular text-emerald-400">
                  {rsi[hoverIndex ?? rsi.length - 1]?.toFixed(1)}
                </span>
              </div>
              <svg viewBox={`0 0 ${chartWidth} 60`} className="w-full h-14">
                {/* Overbought 70 and Oversold 30 levels */}
                <line x1="0" y1="18" x2={chartWidth} y2="18" stroke="#f23645" strokeWidth="0.75" strokeDasharray="3 3" />
                <line x1="0" y1="42" x2={chartWidth} y2="42" stroke="#089981" strokeWidth="0.75" strokeDasharray="3 3" />
                {/* RSI curve */}
                <path
                  d={rsi
                    .map((val, idx) => {
                      const x = idx * candleSlotWidth + candleSlotWidth / 2;
                      const y = 60 - (val / 100) * 60;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          )}

          {/* TradingView Technical Analysis Speedometer Gauge & Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Technical Gauge Meter */}
            <div className="p-4 rounded-xl bg-[#131722] border border-[#2a2e39] flex flex-col items-center justify-between text-center">
              <div className="w-full flex items-center justify-between text-xs font-bold text-[#787b86] uppercase tracking-wider mb-2">
                <span>Technical Analysis</span>
                <span className="text-[#2962ff]">1D</span>
              </div>

              {/* Gauge Meter Arch SVG */}
              <div className="relative w-44 h-24 my-2">
                <svg viewBox="0 0 160 85" className="w-full h-full">
                  {/* Gauge Arc Background */}
                  <path
                    d="M 15 80 A 65 65 0 0 1 145 80"
                    fill="none"
                    stroke="#2a2e39"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Color Segments */}
                  <path
                    d="M 15 80 A 65 65 0 0 1 45 35"
                    fill="none"
                    stroke="#f23645"
                    strokeWidth="12"
                  />
                  <path
                    d="M 45 35 A 65 65 0 0 1 80 15"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="12"
                  />
                  <path
                    d="M 80 15 A 65 65 0 0 1 115 35"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                  />
                  <path
                    d="M 115 35 A 65 65 0 0 1 145 80"
                    fill="none"
                    stroke="#089981"
                    strokeWidth="12"
                  />

                  {/* Needle */}
                  <g
                    transform={`rotate(${getRatingDegrees(selectedInstrument.rating)}, 80, 80)`}
                    className="transition-transform duration-500 ease-out"
                  >
                    <line x1="80" y1="80" x2="80" y2="25" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="80" cy="80" r="5" fill="#ffffff" />
                  </g>
                </svg>
              </div>

              {/* Rating text */}
              <div className="mt-1">
                <div
                  className={`text-base font-extrabold ${
                    selectedInstrument.rating.includes('Buy')
                      ? 'text-[#089981]'
                      : selectedInstrument.rating.includes('Sell')
                      ? 'text-[#f23645]'
                      : 'text-[#f59e0b]'
                  }`}
                >
                  {selectedInstrument.rating}
                </div>
                <div className="flex items-center gap-4 text-[11px] text-[#787b86] font-tabular mt-2">
                  <span>Sell: 2</span>
                  <span>Neutral: 5</span>
                  <span>Buy: 17</span>
                </div>
              </div>
            </div>

            {/* Key Statistics Grid */}
            <div className="md:col-span-2 p-4 rounded-xl bg-[#131722] border border-[#2a2e39] space-y-4">
              <h4 className="text-xs font-bold text-[#787b86] uppercase tracking-wider">
                Key Statistics & Fundamentals
              </h4>

              {/* 52-Week Range Bar */}
              {selectedInstrument.high52w && selectedInstrument.low52w && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#787b86] font-tabular">
                    <span>52W Low: ${selectedInstrument.low52w}</span>
                    <span className="font-semibold text-white">52W Range</span>
                    <span>52W High: ${selectedInstrument.high52w}</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-[#1e222d] border border-[#2a2e39] overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-[#2962ff] rounded-full"
                      style={{
                        left: '0%',
                        width: `${Math.min(
                          Math.max(
                            ((selectedInstrument.price - selectedInstrument.low52w) /
                              (selectedInstrument.high52w - selectedInstrument.low52w)) *
                              100,
                            5
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stats Table */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2 rounded bg-[#1e222d]/60 border border-[#2a2e39]/40">
                  <span className="text-[#787b86] block text-[11px]">Market Cap</span>
                  <span className="font-bold text-white font-tabular">
                    {selectedInstrument.marketCap || 'N/A'}
                  </span>
                </div>
                <div className="p-2 rounded bg-[#1e222d]/60 border border-[#2a2e39]/40">
                  <span className="text-[#787b86] block text-[11px]">P/E Ratio</span>
                  <span className="font-bold text-white font-tabular">
                    {selectedInstrument.peRatio ? `${selectedInstrument.peRatio}x` : 'N/A'}
                  </span>
                </div>
                <div className="p-2 rounded bg-[#1e222d]/60 border border-[#2a2e39]/40">
                  <span className="text-[#787b86] block text-[11px]">Dividend Yield</span>
                  <span className="font-bold text-white font-tabular">
                    {selectedInstrument.divYield !== undefined ? `${selectedInstrument.divYield}%` : 'N/A'}
                  </span>
                </div>
                <div className="p-2 rounded bg-[#1e222d]/60 border border-[#2a2e39]/40">
                  <span className="text-[#787b86] block text-[11px]">Volume (24h)</span>
                  <span className="font-bold text-white font-tabular">{selectedInstrument.volume}</span>
                </div>
                <div className="p-2 rounded bg-[#1e222d]/60 border border-[#2a2e39]/40">
                  <span className="text-[#787b86] block text-[11px]">Beta</span>
                  <span className="font-bold text-white font-tabular">{selectedInstrument.beta || '1.00'}</span>
                </div>
                <div className="p-2 rounded bg-[#1e222d]/60 border border-[#2a2e39]/40">
                  <span className="text-[#787b86] block text-[11px]">Next Earnings</span>
                  <span className="font-bold text-white font-tabular">
                    {selectedInstrument.nextEarnings || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* About Company / Asset Bio */}
          {selectedInstrument.description && (
            <div className="p-4 rounded-xl bg-[#131722] border border-[#2a2e39] space-y-2">
              <h4 className="text-xs font-bold text-[#787b86] uppercase tracking-wider">
                About {selectedInstrument.name}
              </h4>
              <p className="text-xs sm:text-sm text-[#d1d4dc] leading-relaxed">
                {selectedInstrument.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
