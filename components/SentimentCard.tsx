"use client";

import SentimentBadge, { Sentiment } from "./SentimentBadge";
import SentimentGauge from "./SentimentGauge";

export interface SentimentData {
  ticker: string;
  companyName: string;
  sentiment: Sentiment;
  score: number;
  summary: string;
  signals: {
    label: string;
    value: string;
    positive: boolean | null; // null = neutral
  }[];
  sources: {
    label: string;
    count: number;
    sentiment: Sentiment;
  }[];
  lastUpdated: string;
}

interface SentimentCardProps {
  data: SentimentData;
}

function SignalRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive: boolean | null;
}) {
  const valueColor =
    positive === true
      ? "text-green-400"
      : positive === false
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1e2d52]/60 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}

function SourcePill({
  label,
  count,
  sentiment,
}: {
  label: string;
  count: number;
  sentiment: Sentiment;
}) {
  const color =
    sentiment === "Bullish"
      ? "text-green-400 bg-green-500/10 border-green-500/20"
      : sentiment === "Bearish"
      ? "text-red-400 bg-red-500/10 border-red-500/20"
      : "text-gray-400 bg-gray-500/10 border-gray-500/20";

  return (
    <div className={`flex flex-col items-center rounded-lg border px-3 py-2 ${color}`}>
      <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">
        {label}
      </span>
      <span className="text-lg font-bold mt-0.5">{count}</span>
      <span className="text-[10px] opacity-60 mt-0.5">{sentiment}</span>
    </div>
  );
}

export default function SentimentCard({ data }: SentimentCardProps) {
  const accentColor =
    data.sentiment === "Bullish"
      ? "from-green-500/10 to-transparent"
      : data.sentiment === "Bearish"
      ? "from-red-500/10 to-transparent"
      : "from-gray-500/10 to-transparent";

  const borderColor =
    data.sentiment === "Bullish"
      ? "border-green-500/20"
      : data.sentiment === "Bearish"
      ? "border-red-500/20"
      : "border-gray-500/20";

  return (
    <div
      className={`relative rounded-2xl border ${borderColor} bg-[#111c35] overflow-hidden shadow-2xl shadow-black/40`}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accentColor} pointer-events-none`}
      />

      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-4xl font-black tracking-tight text-white">
                {data.ticker}
              </h1>
              <SentimentBadge sentiment={data.sentiment} size="lg" />
            </div>
            <p className="text-slate-400 text-sm">{data.companyName}</p>
            <p className="text-slate-600 text-xs mt-1">
              Last updated: {data.lastUpdated}
            </p>
          </div>

          {/* Source pills */}
          <div className="flex gap-2">
            {data.sources.map((src) => (
              <SourcePill key={src.label} {...src} />
            ))}
          </div>
        </div>

        {/* Main content: Gauge + Details */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Gauge */}
          <div className="flex flex-col items-center justify-center lg:w-64 shrink-0">
            <div className="text-xs uppercase tracking-widest text-slate-600 mb-2">
              Sentiment Score
            </div>
            <SentimentGauge score={data.score} sentiment={data.sentiment} />
            <div className="text-center mt-2">
              <div
                className={`text-2xl font-bold ${
                  data.sentiment === "Bullish"
                    ? "text-green-400"
                    : data.sentiment === "Bearish"
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {data.score > 65
                  ? "Strong Signal"
                  : data.score > 40
                  ? "Moderate Signal"
                  : "Weak Signal"}
              </div>
              <p className="text-xs text-slate-600 mt-1">Confidence rating</p>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 flex flex-col gap-6">
            {/* AI Narrative */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-4 rounded-full bg-blue-500" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  AI Narrative Summary
                </h3>
              </div>
              <blockquote className="text-slate-300 text-sm leading-relaxed border-l-2 border-blue-500/30 pl-4 italic">
                {data.summary}
              </blockquote>
            </div>

            {/* Signals */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-4 rounded-full bg-indigo-500" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Market Signals
                </h3>
              </div>
              <div className="rounded-xl bg-[#0d1428] border border-[#1e2d52] px-4 py-1">
                {data.signals.map((signal) => (
                  <SignalRow key={signal.label} {...signal} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
