"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SentimentCard, { NewsArticle, StockTwitsMessage } from "@/components/SentimentCard";
import { getSentimentData } from "@/lib/placeholderData";
import { SentimentData } from "@/components/SentimentCard";

export default function Home() {
  const [activeTicker, setActiveTicker] = useState("");
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [stocktwits, setStocktwits] = useState<StockTwitsMessage[]>([]);
  const [price, setPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleSearch(ticker: string) {
    if (ticker === activeTicker) return;
    setIsLoading(true);
    setActiveTicker(ticker);
    setSentimentData(null);
    setNews([]);
    setStocktwits([]);
    setPrice(null);
    setPriceChange(null);

    let fetchedNews: NewsArticle[] = [];
    let fetchedStocktwits: StockTwitsMessage[] = [];

    // Step 1: Fetch news, StockTwits, and price in parallel
    try {
      const [sentRes, priceRes] = await Promise.all([
        fetch(`/api/sentiment-data?ticker=${encodeURIComponent(ticker)}`),
        fetch(`/api/price?ticker=${encodeURIComponent(ticker)}`),
      ]);

      if (sentRes.ok) {
        const data = await sentRes.json();
        fetchedNews = data.news ?? [];
        fetchedStocktwits = data.stocktwits ?? [];
        setNews(fetchedNews);
        setStocktwits(fetchedStocktwits);
      }

      if (priceRes.ok) {
        const priceData = await priceRes.json();
        setPrice(priceData.price ?? null);
        setPriceChange(priceData.change ?? null);
      }
    } catch {
      // proceed with empty data; Claude will note data is sparse
    } finally {
      setIsLoading(false);
    }

    // Step 2: Send to Claude for analysis
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, news: fetchedNews, stocktwits: fetchedStocktwits }),
      });

      if (!res.ok) return;

      const analyzed = await res.json();

      const bullishCount = fetchedStocktwits.filter(
        (m) => m.sentiment === "Bullish"
      ).length;
      const bearishCount = fetchedStocktwits.filter(
        (m) => m.sentiment === "Bearish"
      ).length;
      const socialSentiment: SentimentData["sentiment"] =
        bullishCount > bearishCount
          ? "Bullish"
          : bearishCount > bullishCount
          ? "Bearish"
          : "Neutral";

      // Use placeholder as a base to get companyName, then override with real analysis
      const base = getSentimentData(ticker);
      setSentimentData({
        ...base,
        score: analyzed.score,
        sentiment: analyzed.rating as SentimentData["sentiment"],
        summary: analyzed.narrative,
        signals: analyzed.signals,
        lastUpdated: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sources: [
          {
            label: "News",
            count: fetchedNews.length,
            sentiment: analyzed.rating as SentimentData["sentiment"],
          },
          {
            label: "Social",
            count: fetchedStocktwits.length,
            sentiment: socialSentiment,
          },
        ],
      });
    } catch {
      // Claude failed — stay on welcome panel
    } finally {
      setIsAnalyzing(false);
    }
  }

  const isBusy = isLoading || isAnalyzing;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1e]">
      <Navbar onSearch={handleSearch} />
      <main className="flex-1 flex flex-col gap-6 px-4 sm:px-6 py-6 max-w-screen-xl mx-auto w-full">
        {/* Page title row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">
              Market Sentiment Analysis
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              AI-powered sentiment scoring from news, social, and filings data
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 border border-[#1e2d52] rounded-lg px-3 py-2 self-start sm:self-auto">
            <svg
              className="w-3.5 h-3.5 text-blue-400 shrink-0"
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

        {/* Main content: welcome panel or sentiment card */}
        {sentimentData === null ? (
          <WelcomePanel isBusy={isBusy} ticker={activeTicker} />
        ) : (
          <div className="relative">
            <SentimentCard
              data={sentimentData}
              news={news}
              stocktwits={stocktwits}
              price={price}
              priceChange={priceChange}
            />
          </div>
        )}

        {/* Bottom stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Data Sources"
            value="2 Active"
            sub="News · StockTwits"
            accent="blue"
          />
          <StatCard
            label="Analysis Model"
            value="Claude Sonnet"
            sub="claude-sonnet-4-20250514"
            accent="indigo"
          />
          <StatCard
            label="Refresh Cadence"
            value="On Demand"
            sub="Search any ticker to analyze"
            accent="violet"
          />
        </div>
      </main>
    </div>
  );
}

function WelcomePanel({ isBusy, ticker }: { isBusy: boolean; ticker: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#1e2d52] bg-[#111c35] px-6 py-16 text-center min-h-[320px]">
      {isBusy ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-slate-300 font-medium">
            {isAnalyzingLabel(ticker)}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center mb-2">
            <svg
              className="w-7 h-7 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">
            Enter a stock symbol above to get started
          </h3>
          <p className="text-sm text-slate-500">
            Analysis powered by Alpaca News, StockTwits, and Claude AI
          </p>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-sm">
            SentimentIQ is not a financial advisor. This tool is for
            informational purposes only and should not be used as the basis for
            investment decisions.
          </p>
        </div>
      )}
    </div>
  );
}

function isAnalyzingLabel(ticker: string) {
  if (!ticker) return "Loading…";
  return `Analyzing ${ticker}…`;
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
