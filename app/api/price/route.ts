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
      { error: "Alpaca credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://data.alpaca.markets/v2/stocks/${encodeURIComponent(
        ticker.toUpperCase()
      )}/snapshot`,
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
        { error: "Failed to fetch price from Alpaca" },
        { status: res.status }
      );
    }

    const data = await res.json();

    const price: number | null = data.latestTrade?.p ?? data.latestQuote?.bp ?? null;
    const prevClose: number | null = data.prevDailyBar?.c ?? null;
    const change =
      price !== null && prevClose !== null ? price - prevClose : null;
    const changePercent =
      change !== null && prevClose ? (change / prevClose) * 100 : null;

    return NextResponse.json({ price, change, changePercent });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
