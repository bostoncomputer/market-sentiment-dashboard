"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import WatchlistSidebar from "@/components/WatchlistSidebar";
import SentimentCard, { NewsArticle, StockTwitsMessage } from "@/components/SentimentCard";
import { getSentimentData } from "@/lib/placeholderData";
import { SentimentData } from "@/components/SentimentCard";

export default function Home() {
  const [activeTicker, setActiveTicker] = useState("AAPL");
  const [sentimentData, setSentimentData] = useState<SentimentData>(
    getSentimentData("AAPL")
  );
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [stocktwits, setStocktwits] = useState<StockTwitsMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(ticker: string) {
    if (ticker === activeTicker) return;
    setIsLoading(true);
    setActiveTicker(ticker);
    setSentimentData(getSentimentData(ticker));

    try {
      const res = await fetch(
        `/api/sentiment-data?ticker=${encodeURIComponent(ticker)}`
      );
      if (res.ok) {
        const data = await res.json();
        setNews(data.news ?? []);
        setStocktwits(data.stocktwits ?? []);
      }
    } catch {
      setNews([]);
      setStocktwits([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1e]">
      <Navbar onSearch={handleSearch} />

      <div className="flex flex-1 gap-6 px-6 py-6 max-w-screen-2xl mx-auto w-full">
        {/* Watchlist Sidebar */}
        <WatchlistSidebar activeTicker={activeTicker} onSelect={handleSearch} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Page title row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Market Sentiment Analysis
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                AI-powered sentiment scoring from news, social, and filings data
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 border border-[#1e2d52] rounded-lg px-3 py-2">
              <svg
                className="w-3.5 h-3.5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Live data via Alpaca &amp; StockTwits
            </div>
          </div>

          {/* Sentiment Card */}
          <div
            className={`transition-all duration-300 ${
              isLoading ? "opacity-40 scale-[0.99]" : "opacity-100 scale-100"
            }`}
          >
            <SentimentCard
              data={sentimentData}
              news={news}
              stocktwits={stocktwits}
            />
          </div>

          {/* Bottom stats row */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Data Sources"
              value="3 Active"
              sub="News · StockTwits · Filings"
              accent="blue"
            />
            <StatCard
              label="Analysis Model"
              value="NLP v2.4"
              sub="Fine-tuned on financial corpus"
              accent="indigo"
            />
            <StatCard
              label="Refresh Cadence"
              value="Every 15 min"
              sub="Real-time with live tier"
              accent="violet"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "blue" | "indigo" | "violet";
}) {
  const ring = {
    blue: "border-blue-500/20 shadow-blue-900/10",
    indigo: "border-indigo-500/20 shadow-indigo-900/10",
    violet: "border-violet-500/20 shadow-violet-900/10",
  }[accent];

  const dot = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
  }[accent];

  return (
    <div
      className={`bg-[#111c35] border rounded-xl px-4 py-3.5 shadow-lg ${ring}`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="text-xs uppercase tracking-widest text-slate-600">
          {label}
        </span>
      </div>
      <div className="text-base font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}
