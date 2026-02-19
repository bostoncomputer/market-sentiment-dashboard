# Market Sentiment Dashboard

An AI-powered market sentiment analysis dashboard for stock tickers, built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Local Preview

### Prerequisites
- Node.js 18+ installed ([download](https://nodejs.org))

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads as you edit files.

### Other local commands

```bash
npm run build   # Build for production
npm run start   # Run the production build locally (run build first)
npm run lint    # Lint the codebase
```

## Deploy to Vercel

### Option 1: Vercel CLI (recommended for quick deploys)

```bash
# 1. Install the Vercel CLI globally
npm install -g vercel

# 2. From the project root, run:
vercel

# Follow the prompts to log in and configure the project.
# Vercel auto-detects Next.js — no extra config needed.

# For production deployment:
vercel --prod
```

### Option 2: Vercel Dashboard (GitHub integration)

1. Push this repo to GitHub (if not already there).
2. Go to [vercel.com/new](https://vercel.com/new) and sign in.
3. Click **Import** and select this repository.
4. Vercel will auto-detect Next.js settings — leave everything as default.
5. Click **Deploy**.

Your app will be live at a `*.vercel.app` URL within about a minute.

### Environment Variables

This project currently uses only placeholder data and requires no environment variables. If you add API integrations later, add any required variables in the Vercel dashboard under **Settings → Environment Variables**.

## Project Structure

```
app/
  layout.tsx          # Root layout and metadata
  page.tsx            # Home page
  globals.css         # Global Tailwind styles
components/
  Navbar.tsx          # Top navigation bar
  WatchlistSidebar.tsx # Ticker watchlist panel
  SentimentCard.tsx   # Per-ticker sentiment display
  SentimentGauge.tsx  # Visual gauge component
  SentimentBadge.tsx  # Bullish/Bearish/Neutral badge
lib/
  placeholderData.ts  # Mock sentiment data (AAPL, TSLA, NVDA, MSFT)
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom dark-theme palette
- **Runtime:** Node.js 18+
