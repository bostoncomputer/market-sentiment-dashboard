"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  onSearch?: (ticker: string) => void;
}

const todayLabel = new Date().toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function Navbar({ onSearch }: NavbarProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim().toUpperCase();
    if (trimmed && onSearch) {
      onSearch(trimmed);
      setInput("");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e2d52] bg-[#0d1428] backdrop-blur-sm shadow-lg shadow-black/30">
      {/* ── Desktop: single row ── */}
      <div className="hidden sm:flex items-center justify-between px-6 py-4">
        <Brand />
        {onSearch && (
          <SearchForm input={input} setInput={setInput} onSubmit={handleSubmit} wide />
        )}
        <div className="flex items-center gap-4">
          <LiveIndicator />
          {user && (
            <UserMenu
              user={user}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              onSignOut={handleSignOut}
              menuRef={menuRef}
            />
          )}
        </div>
      </div>

      {/* ── Mobile: stacked rows ── */}
      <div className="flex flex-col gap-2.5 px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          <Brand />
          {user && (
            <UserMenu
              user={user}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              onSignOut={handleSignOut}
              menuRef={menuRef}
            />
          )}
        </div>
        {onSearch && (
          <SearchForm input={input} setInput={setInput} onSubmit={handleSubmit} wide={false} />
        )}
        <LiveIndicator />
      </div>
    </header>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            SentimentIQ
          </span>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-600/30 uppercase tracking-wider">
            Beta
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-none mt-0.5">
          Stock Market Sentiment Analysis
        </p>
      </div>
    </div>
  );
}

function SearchForm({
  input,
  setInput,
  onSubmit,
  wide,
}: {
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  wide: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
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
          placeholder="Ticker symbol…"
          className={`${
            wide ? "w-56" : "w-full"
          } pl-9 pr-4 py-2.5 rounded-lg bg-[#111c35] border border-[#1e2d52] text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all`}
        />
      </div>
      <button
        type="submit"
        className="shrink-0 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-900/30 active:scale-95"
      >
        Analyze
      </button>
    </form>
  );
}

function LiveIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Live
      </div>
      <div className="h-4 w-px bg-[#1e2d52]" />
      <span className="text-xs text-slate-500">{todayLabel}</span>
    </div>
  );
}

function UserMenu({
  user,
  menuOpen,
  setMenuOpen,
  onSignOut,
  menuRef,
}: {
  user: User;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  onSignOut: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "User";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#1a2644] transition-colors"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-white">{initials}</span>
          )}
        </div>
        {/* First name — hidden on small screens */}
        <span className="hidden md:block text-sm font-medium text-slate-200 max-w-[120px] truncate">
          {fullName.split(" ")[0]}
        </span>
        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 text-slate-500 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#1e2d52] bg-[#0d1428] shadow-2xl shadow-black/50 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[#1e2d52]">
            <p className="text-sm font-semibold text-white truncate">{fullName}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-[#1a2644] transition-colors"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
