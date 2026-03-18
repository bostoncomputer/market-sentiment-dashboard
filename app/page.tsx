"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1e] text-slate-200">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-[#1e2d52] bg-[#0d1428]/90 backdrop-blur-sm shadow-lg shadow-black/30">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/40">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <polyline points="2,13 6,8 10,11 16,4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="12,4 16,4 16,8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">SentimentIQ</span>
                <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-600/30 uppercase tracking-wider">Beta</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">Stock Market Sentiment Analysis</p>
            </div>
          </div>

          {/* Nav CTA */}
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-900/30"
            >
              Open Dashboard
            </Link>
          ) : (
            <button
              onClick={handleSignIn}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-900/30"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          {/* Background glow blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute top-20 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-600/8 blur-3xl" />
            <div className="absolute top-32 right-1/4 w-[250px] h-[250px] rounded-full bg-violet-600/8 blur-3xl" />
          </div>

          <div className="relative max-w-screen-xl mx-auto px-6 py-28 sm:py-36 text-center">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Powered by Claude AI · Live Market Data
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
              AI-Powered Stock Market
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Sentiment Analysis
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-10">
              Get instant Claude AI sentiment scores for any stock — powered by live news and social data.
              Know whether the market is <span className="text-green-400 font-semibold">Bullish</span>,{" "}
              <span className="text-red-400 font-semibold">Bearish</span>, or{" "}
              <span className="text-slate-300 font-semibold">Neutral</span> in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-base font-bold transition-all shadow-2xl shadow-blue-900/40 hover:shadow-blue-700/40 hover:-translate-y-0.5"
                >
                  Open Dashboard
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-base font-bold transition-all shadow-2xl shadow-blue-900/40 hover:shadow-blue-700/40 hover:-translate-y-0.5"
                >
                  Try Free — Sign in with Google
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
              <span className="text-xs text-slate-600">No signup required · Instant results</span>
            </div>

            {/* Popular tickers quick-link row */}
            <div className="mt-16 flex items-center justify-center gap-3 flex-wrap">
              {["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "GOOGL", "META", "SPY"].map((ticker) => (
                <Link
                  key={ticker}
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-lg bg-[#111c35] border border-[#1e2d52] text-xs font-bold text-slate-400 hover:text-white hover:border-blue-500/40 transition-colors"
                >
                  {ticker}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Everything you need to read the market
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              SentimentIQ aggregates multiple data sources and distills them into a single, actionable score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 — Live Market Data */}
            <div className="group relative rounded-2xl border border-[#1e2d52] bg-[#111c35] p-8 overflow-hidden hover:border-blue-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Market Data</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Real-time news from Alpaca Markets and social sentiment from StockTwits — aggregated and ready for analysis the moment you search.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#0d1428] border border-[#1e2d52] text-slate-500">Alpaca News</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#0d1428] border border-[#1e2d52] text-slate-500">StockTwits</span>
              </div>
            </div>

            {/* Feature 2 — Claude AI Analysis */}
            <div className="group relative rounded-2xl border border-[#1e2d52] bg-[#111c35] p-8 overflow-hidden hover:border-indigo-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Claude AI Analysis</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Anthropic&apos;s Claude Sonnet reads every headline and social post, then produces a calibrated sentiment score and plain-English narrative — not just a number.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#0d1428] border border-[#1e2d52] text-slate-500">Claude Sonnet</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#0d1428] border border-[#1e2d52] text-slate-500">Real-time scoring</span>
              </div>
            </div>

            {/* Feature 3 — Instant Insights */}
            <div className="group relative rounded-2xl border border-[#1e2d52] bg-[#111c35] p-8 overflow-hidden hover:border-violet-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Insights</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Bullish, Bearish, or Neutral ratings delivered with a sentiment gauge, market signal breakdown, and AI narrative — everything on one clean card.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-500">Bullish</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-500">Bearish</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#0d1428] border border-[#1e2d52] text-slate-500">Neutral</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="max-w-screen-xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Simple, transparent pricing</h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              Start free. Upgrade when you&apos;re ready for more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free tier */}
            <div className="relative rounded-2xl border border-[#1e2d52] bg-[#111c35] p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-slate-500 text-sm">/ month</span>
                </div>
                <p className="text-slate-500 text-sm mt-2">Perfect for exploring market sentiment.</p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {[
                  "5 analyses per day",
                  "Alpaca News + StockTwits data",
                  "Claude AI sentiment scoring",
                  "Bullish / Bearish / Neutral ratings",
                  "AI narrative summaries",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full text-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-900/30"
                >
                  Open Dashboard
                </Link>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full text-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-900/30"
                >
                  Get Started — Sign in with Google
                </button>
              )}
            </div>

            {/* Pro tier */}
            <div className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-[#111c35] p-8 flex flex-col overflow-hidden">
              {/* Coming soon badge */}
              <div className="absolute top-5 right-5">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$9.99</span>
                  <span className="text-slate-500 text-sm">/ month</span>
                </div>
                <p className="text-slate-500 text-sm mt-2">For active traders who need more.</p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {[
                  "Unlimited analyses",
                  "Priority analysis queue",
                  "Everything in Free",
                  "Advanced signal breakdown",
                  "Historical sentiment tracking",
                  "Email alerts (coming soon)",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="w-full text-center px-6 py-3 rounded-xl bg-indigo-600/30 text-indigo-400 font-bold text-sm cursor-not-allowed border border-indigo-500/20"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1e2d52] bg-[#0d1428]">
        <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600">
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <polyline points="2,13 6,8 10,11 16,4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="12,4 16,4 16,8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>
              SentimentIQ by{" "}
              <a
                href="https://bostoncomputerai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
              >
                Boston Computer AI
              </a>
            </span>
          </div>

          <p className="text-center sm:text-right text-slate-700">
            Not financial advice. For informational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
