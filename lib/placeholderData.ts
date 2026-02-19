import { SentimentData } from "@/components/SentimentCard";
import { Sentiment } from "@/components/SentimentBadge";

const BASE_DATA: Record<string, SentimentData> = {
  AAPL: {
    ticker: "AAPL",
    companyName: "Apple Inc. • NASDAQ",
    sentiment: "Bullish",
    score: 74,
    summary:
      "Apple continues to demonstrate strong market momentum driven by record-breaking iPhone 16 demand and accelerating growth in its Services segment, which now contributes over 25% of total revenue. Institutional investors are bullish on Apple's AI integration roadmap — including on-device generative AI features set to roll out in iOS 18.4 — with 27 of 32 analyst firms maintaining Buy or Strong Buy ratings. Short interest remains historically low at 0.6% of float, suggesting minimal bearish positioning.",
    signals: [
      { label: "14-Day RSI", value: "62.4 — Approaching Overbought", positive: true },
      { label: "50-Day SMA vs Price", value: "+8.3% Above", positive: true },
      { label: "Options Put/Call Ratio", value: "0.72 — Bullish Skew", positive: true },
      { label: "Analyst Consensus", value: "Buy (27/32 firms)", positive: true },
      { label: "Insider Activity (30d)", value: "Net Neutral", positive: null },
    ],
    sources: [
      { label: "News", count: 142, sentiment: "Bullish" },
      { label: "Social", count: 3400, sentiment: "Bullish" },
      { label: "Filings", count: 8, sentiment: "Neutral" },
    ],
    lastUpdated: "Feb 19, 2026 · 09:32 AM EST",
  },
  TSLA: {
    ticker: "TSLA",
    companyName: "Tesla, Inc. • NASDAQ",
    sentiment: "Bearish",
    score: 31,
    summary:
      "Tesla faces mounting headwinds as Q4 delivery numbers came in 6% below consensus estimates, fueling concerns about demand saturation in key markets. Competitive pressure from BYD and Rivian continues to intensify, while margin compression from aggressive price cuts weighed heavily on net income. Social media sentiment has turned increasingly negative following a series of high-profile Autopilot incidents and executive departures, contributing to a measurable uptick in short interest to 3.2% of float.",
    signals: [
      { label: "14-Day RSI", value: "38.1 — Approaching Oversold", positive: false },
      { label: "50-Day SMA vs Price", value: "-11.7% Below", positive: false },
      { label: "Options Put/Call Ratio", value: "1.48 — Bearish Skew", positive: false },
      { label: "Analyst Consensus", value: "Hold (18/34 firms)", positive: null },
      { label: "Insider Activity (30d)", value: "Net Selling", positive: false },
    ],
    sources: [
      { label: "News", count: 218, sentiment: "Bearish" },
      { label: "Social", count: 7200, sentiment: "Bearish" },
      { label: "Filings", count: 5, sentiment: "Neutral" },
    ],
    lastUpdated: "Feb 19, 2026 · 09:32 AM EST",
  },
  NVDA: {
    ticker: "NVDA",
    companyName: "NVIDIA Corporation • NASDAQ",
    sentiment: "Bullish",
    score: 88,
    summary:
      "NVIDIA remains the dominant beneficiary of the global AI infrastructure buildout, with data center revenue growing 217% year-over-year. Demand for Blackwell GPU architecture continues to significantly outpace supply, with hyperscaler customers like Microsoft, Google, and Meta committing multi-billion-dollar procurement agreements through 2027. Analyst price targets have been revised upward across the board following last quarter's blowout earnings, and the stock's technical structure remains exceptionally strong with all major moving averages trending higher.",
    signals: [
      { label: "14-Day RSI", value: "71.2 — Overbought Territory", positive: true },
      { label: "50-Day SMA vs Price", value: "+22.6% Above", positive: true },
      { label: "Options Put/Call Ratio", value: "0.51 — Strong Bull Skew", positive: true },
      { label: "Analyst Consensus", value: "Strong Buy (31/33 firms)", positive: true },
      { label: "Insider Activity (30d)", value: "Planned Sales (Rule 10b5-1)", positive: null },
    ],
    sources: [
      { label: "News", count: 304, sentiment: "Bullish" },
      { label: "Social", count: 9800, sentiment: "Bullish" },
      { label: "Filings", count: 11, sentiment: "Bullish" },
    ],
    lastUpdated: "Feb 19, 2026 · 09:32 AM EST",
  },
  MSFT: {
    ticker: "MSFT",
    companyName: "Microsoft Corporation • NASDAQ",
    sentiment: "Neutral",
    score: 54,
    summary:
      "Microsoft presents a mixed near-term picture as Copilot monetization ramps slower than initially projected, though Azure cloud revenue growth of 28% signals robust enterprise demand. The pending integration of Activision Blizzard continues to weigh on free cash flow margins, creating uncertainty among value-focused investors. While long-term fundamentals remain intact — particularly in enterprise software and AI services — the stock appears fairly valued at current multiples, with analysts largely maintaining Hold ratings pending clarity on Copilot enterprise adoption rates.",
    signals: [
      { label: "14-Day RSI", value: "51.3 — Neutral", positive: null },
      { label: "50-Day SMA vs Price", value: "+1.9% Above", positive: null },
      { label: "Options Put/Call Ratio", value: "0.98 — Balanced", positive: null },
      { label: "Analyst Consensus", value: "Hold/Buy (22/35 firms)", positive: null },
      { label: "Insider Activity (30d)", value: "Minimal Net Buying", positive: true },
    ],
    sources: [
      { label: "News", count: 97, sentiment: "Neutral" },
      { label: "Social", count: 2100, sentiment: "Neutral" },
      { label: "Filings", count: 6, sentiment: "Neutral" },
    ],
    lastUpdated: "Feb 19, 2026 · 09:32 AM EST",
  },
};

function generateFallback(ticker: string): SentimentData {
  const sentiments: Sentiment[] = ["Bullish", "Neutral", "Bearish"];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const score =
    sentiment === "Bullish"
      ? Math.floor(Math.random() * 30) + 60
      : sentiment === "Bearish"
      ? Math.floor(Math.random() * 30) + 10
      : Math.floor(Math.random() * 20) + 40;

  return {
    ticker,
    companyName: `${ticker} • NYSE/NASDAQ`,
    sentiment,
    score,
    summary:
      "Sentiment analysis is synthesizing data from news articles, SEC filings, and social media signals. Early indicators suggest a " +
      sentiment.toLowerCase() +
      " tilt with a score of " +
      score +
      "/100. Institutional positioning appears cautious pending next earnings report. Options market activity shows balanced skew. Full deep-dive analysis will be available once more data points are aggregated from primary and secondary sources.",
    signals: [
      { label: "14-Day RSI", value: "Calculating...", positive: null },
      { label: "50-Day SMA vs Price", value: "Calculating...", positive: null },
      { label: "Options Put/Call Ratio", value: "Calculating...", positive: null },
      { label: "Analyst Consensus", value: "Pending data", positive: null },
      { label: "Insider Activity (30d)", value: "Pending data", positive: null },
    ],
    sources: [
      { label: "News", count: Math.floor(Math.random() * 80) + 10, sentiment },
      { label: "Social", count: Math.floor(Math.random() * 800) + 100, sentiment: "Neutral" },
      { label: "Filings", count: Math.floor(Math.random() * 5) + 1, sentiment: "Neutral" },
    ],
    lastUpdated: "Feb 19, 2026 · 09:32 AM EST",
  };
}

export function getSentimentData(ticker: string): SentimentData {
  return BASE_DATA[ticker.toUpperCase()] ?? generateFallback(ticker.toUpperCase());
}
