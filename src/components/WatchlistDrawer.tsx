import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { X, Trash2, Plus, Bell, Check, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export const WatchlistDrawer: React.FC = () => {
  const {
    isWatchlistOpen,
    setIsWatchlistOpen,
    watchlist,
    toggleWatchlist,
    instruments,
    setSelectedInstrument,
    alerts,
    addAlert,
    removeAlert,
  } = useMarket();

  const [activeTab, setActiveTab] = useState<'watchlist' | 'alerts'>('watchlist');
  const [alertSymbol, setAlertSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [alertSuccess, setAlertSuccess] = useState(false);

  if (!isWatchlistOpen) return null;

  const watchlistItems = watchlist
    .map((sym) => instruments.find((i) => i.symbol === sym))
    .filter(Boolean);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertSymbol || !targetPrice) return;
    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum)) return;

    addAlert(alertSymbol.toUpperCase(), priceNum, condition);
    setAlertSuccess(true);
    setTargetPrice('');
    setTimeout(() => setAlertSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWatchlistOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1e222d] border-l border-[#2a2e39] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2e39]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`text-sm font-bold tracking-tight pb-1 border-b-2 transition-colors ${
                  activeTab === 'watchlist'
                    ? 'border-[#2962ff] text-white'
                    : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Watchlist ({watchlist.length})
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`text-sm font-bold tracking-tight pb-1 border-b-2 transition-colors flex items-center gap-1.5 ml-3 ${
                  activeTab === 'alerts'
                    ? 'border-[#2962ff] text-white'
                    : 'border-transparent text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                Alerts ({alerts.length})
              </button>
            </div>

            <button
              onClick={() => setIsWatchlistOpen(false)}
              className="p-1 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'watchlist' ? (
              watchlistItems.length === 0 ? (
                <div className="py-16 px-6 text-center text-sm text-[#787b86]">
                  <p className="mb-2 font-medium text-white">Your Watchlist is empty</p>
                  <p className="text-xs">
                    Click the bookmark icon on any symbol or search for stocks, crypto, and indices to add them here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#2a2e39]/50">
                  {watchlistItems.map((item) => {
                    if (!item) return null;
                    const isPositive = item.change >= 0;

                    return (
                      <div
                        key={item.symbol}
                        className="group flex items-center justify-between px-4 py-3 hover:bg-[#2a2e39]/40 transition-colors"
                      >
                        <button
                          onClick={() => {
                            setSelectedInstrument(item);
                            setIsWatchlistOpen(false);
                          }}
                          className="flex items-center gap-3 text-left flex-1 min-w-0"
                        >
                          <div className="w-8 h-8 rounded bg-[#131722] border border-[#2a2e39] flex items-center justify-center font-bold text-xs text-white shrink-0">
                            {item.symbol.slice(0, 3)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-white">{item.symbol}</div>
                            <div className="text-xs text-[#787b86] truncate max-w-[130px]">
                              {item.name}
                            </div>
                          </div>
                        </button>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-xs sm:text-sm font-semibold text-white font-tabular">
                              {item.price < 2
                                ? item.price.toFixed(4)
                                : item.price.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                            </div>
                            <div
                              className={`text-[11px] font-medium font-tabular flex items-center justify-end ${
                                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {item.changePercent.toFixed(2)}%
                            </div>
                          </div>

                          <button
                            onClick={() => toggleWatchlist(item.symbol)}
                            title="Remove from watchlist"
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-[#787b86] hover:text-[#f23645] hover:bg-[#131722] transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="p-5 space-y-6">
                {/* Create Alert Form */}
                <form
                  onSubmit={handleCreateAlert}
                  className="p-4 rounded-xl bg-[#131722] border border-[#2a2e39] space-y-3"
                >
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#787b86]">
                    Set Price Alert
                  </h4>

                  <div className="space-y-2">
                    <label className="text-xs text-[#d1d4dc] block">Symbol</label>
                    <select
                      value={alertSymbol}
                      onChange={(e) => setAlertSymbol(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[#1e222d] border border-[#2a2e39] text-white focus:outline-hidden focus:border-[#2962ff]"
                    >
                      <option value="">Select an instrument...</option>
                      {instruments.map((i) => (
                        <option key={i.symbol} value={i.symbol}>
                          {i.symbol} - {i.name} (${i.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-[#d1d4dc] block mb-1">Condition</label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#1e222d] border border-[#2a2e39] text-white focus:outline-hidden focus:border-[#2962ff]"
                      >
                        <option value="above">Crosses Above (≥)</option>
                        <option value="below">Crosses Below (≤)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-[#d1d4dc] block mb-1">Target Price</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 150.00"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#1e222d] border border-[#2a2e39] text-white font-tabular focus:outline-hidden focus:border-[#2962ff]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-lg bg-[#2962ff] hover:bg-[#1e4bd8] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {alertSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Alert Created!</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>Create Alert</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Active Alerts List */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#787b86] mb-3">
                    Active Alerts ({alerts.length})
                  </h4>
                  {alerts.length === 0 ? (
                    <p className="text-xs text-[#787b86]">No active alerts set yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#131722] border border-[#2a2e39] text-xs"
                        >
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{alert.symbol}</span>
                              <span className="text-[#787b86] font-normal">
                                {alert.condition === 'above' ? '≥' : '≤'} ${alert.targetPrice}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#787b86]">Created {alert.createdAt}</span>
                          </div>
                          <button
                            onClick={() => removeAlert(alert.id)}
                            className="p-1 text-[#787b86] hover:text-[#f23645] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
