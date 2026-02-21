import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "ticker is required" }, { status: 400 });
  }

  const apiKey = process.env.ALPACA_API_KEY;
  const apiSecret = process.env.ALPACA_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Alpaca API credentials not configured" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://data.alpaca.markets/v1beta1/news?symbols=${ticker.toUpperCase()}&limit=20`,
    {
      headers: {
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch news data" },
      { status: res.status }
    );
  }

  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articles = (data.news ?? []).map((article: any) => ({
    headline: article.headline as string,
    summary: article.summary as string,
    url: article.url as string,
    created_at: article.created_at as string,
    author: article.author as string,
    source: article.source as string,
  }));

  return NextResponse.json(articles);
}
