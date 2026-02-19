"use client";

import SentimentBadge, { Sentiment } from "./SentimentBadge";

interface WatchlistItem {
  ticker: string;
  name: string;
  sentiment: Sentiment;
  score: number;
  change: string;
  changePositive: boolean;
}

const WATCHLIST: WatchlistItem[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    sentiment: "Bullish",
    score: 74,
    change: "+1.42%",
    changePositive: true,
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    sentiment: "Bearish",
    score: 31,
    change: "-3.17%",
    changePositive: false,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    sentiment: "Bullish",
    score: 88,
    change: "+2.05%",
    changePositive: true,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    sentiment: "Neutral",
    score: 54,
    change: "+0.22%",
    changePositive: true,
  },
];

function ScoreBar({ score, sentiment }: { score: number; sentiment: Sentiment }) {
  const color =
    sentiment === "Bullish"
      ? "bg-green-500"
      : sentiment === "Bearish"
      ? "bg-red-500"
      : "bg-gray-500";

  return (
    <div className="w-full h-1 rounded-full bg-[#1e2d52] overflow-hidden mt-2">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

interface WatchlistSidebarProps {
  activeTicker: string;
  onSelect: (ticker: string) => void;
}

export default function WatchlistSidebar({
  activeTicker,
  onSelect,
}: WatchlistSidebarProps) {
  return (
    <aside className="w-64 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Watchlist
        </h2>
        <span className="text-xs text-slate-600 border border-[#1e2d52] rounded px-1.5 py-0.5">
          {WATCHLIST.length} tickers
        </span>
      </div>

      {/* Ticker items */}
      {WATCHLIST.map((item) => {
        const isActive = item.ticker === activeTicker;
        return (
          <button
            key={item.ticker}
            onClick={() => onSelect(item.ticker)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 group ${
              isActive
                ? "bg-[#162040] border-blue-500/40 shadow-lg shadow-blue-900/20"
                : "bg-[#111c35] border-[#1e2d52] hover:border-[#2a3d6e] hover:bg-[#131f3a]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-sm tracking-wide ${
                      isActive ? "text-white" : "text-slate-200"
                    }`}
                  >
                    {item.ticker}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {item.name}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <SentimentBadge sentiment={item.sentiment} size="sm" />
                <span
                  className={`text-xs font-medium ${
                    item.changePositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            </div>

            {/* Score bar */}
            <div className="mt-2.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider">
                  Sentiment
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {item.score}/100
                </span>
              </div>
              <ScoreBar score={item.score} sentiment={item.sentiment} />
            </div>
          </button>
        );
      })}

      {/* Divider + hint */}
      <div className="mt-4 pt-4 border-t border-[#1e2d52]">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          Search any ticker above to analyze its sentiment in real time.
        </p>
      </div>
    </aside>
  );
}
