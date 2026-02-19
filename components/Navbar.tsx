"use client";

import { useState, FormEvent } from "react";

interface NavbarProps {
  onSearch: (ticker: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim().toUpperCase();
    if (trimmed) {
      onSearch(trimmed);
      setInput("");
    }
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[#1e2d52] bg-[#0d1428] backdrop-blur-sm shadow-lg shadow-black/30">
      {/* Brand */}
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/40">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <polyline
              points="2,13 6,8 10,11 16,4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="12,4 16,4 16,8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white">
            SentimentIQ
          </span>
          <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-600/30 uppercase tracking-wider">
            Beta
          </span>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter ticker symbol..."
            className="w-72 pl-9 pr-4 py-2.5 rounded-lg bg-[#111c35] border border-[#1e2d52] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-900/30 active:scale-95"
        >
          Analyze
        </button>
      </form>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
        <div className="h-4 w-px bg-[#1e2d52]" />
        <span className="text-xs text-slate-500">Feb 19, 2026</span>
      </div>
    </header>
  );
}
