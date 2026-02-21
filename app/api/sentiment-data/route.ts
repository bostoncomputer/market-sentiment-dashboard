import { NextRequest, NextResponse } from "next/server";

interface NewsArticle {
  headline: string;
  summary: string;
  url: string;
  created_at: string;
  author: string;
  source: string;
}

interface StockTwitsMessage {
  body: string;
  sentiment: "Bullish" | "Bearish" | null;
  username: string;
  created_at: string;
  likes: number;
}

async function fetchStocktwits(ticker: string): Promise<StockTwitsMessage[]> {
  try {
    const res = await fetch(
      `https://api.stocktwits.com/api/2/streams/symbol/${ticker}.json`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.messages ?? []).slice(0, 30).map((msg: any) => ({
      body: msg.body as string,
      sentiment:
        (msg.entities?.sentiment?.basic as "Bullish" | "Bearish") ?? null,
      username: (msg.user?.username as string) ?? "unknown",
      created_at: msg.created_at as string,
      likes: (msg.likes?.total as number) ?? 0,
    }));
  } catch {
    return [];
  }
}

async function fetchAlpacaNews(ticker: string): Promise<NewsArticle[]> {
  const apiKey = process.env.ALPACA_API_KEY;
  const apiSecret = process.env.ALPACA_API_SECRET;
  if (!apiKey || !apiSecret) return [];

  try {
    const res = await fetch(
      `https://data.alpaca.markets/v1beta1/news?symbols=${ticker}&limit=20`,
      {
        headers: {
          "APCA-API-KEY-ID": apiKey,
          "APCA-API-SECRET-KEY": apiSecret,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.news ?? []).map((article: any) => ({
      headline: article.headline as string,
      summary: article.summary as string,
      url: article.url as string,
      created_at: article.created_at as string,
      author: article.author as string,
      source: article.source as string,
    }));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "ticker is required" }, { status: 400 });
  }

  const normalizedTicker = ticker.toUpperCase();

  const [news, stocktwits] = await Promise.all([
    fetchAlpacaNews(normalizedTicker),
    fetchStocktwits(normalizedTicker),
  ]);

  return NextResponse.json({
    ticker: normalizedTicker,
    news,
    stocktwits,
    fetched_at: new Date().toISOString(),
  });
}
