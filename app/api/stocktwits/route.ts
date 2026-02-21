import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "ticker is required" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.stocktwits.com/api/2/streams/symbol/${ticker.toUpperCase()}.json`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch StockTwits data" },
      { status: res.status }
    );
  }

  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (data.messages ?? []).slice(0, 30).map((msg: any) => ({
    body: msg.body as string,
    sentiment: (msg.entities?.sentiment?.basic as "Bullish" | "Bearish") ?? null,
    username: (msg.user?.username as string) ?? "unknown",
    created_at: msg.created_at as string,
    likes: (msg.likes?.total as number) ?? 0,
  }));

  return NextResponse.json(messages);
}
