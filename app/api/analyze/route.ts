import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface NewsArticle {
  headline: string;
  summary?: string;
  source: string;
  created_at: string;
}

interface StockTwitsMessage {
  body: string;
  sentiment: "Bullish" | "Bearish" | null;
  username: string;
  created_at: string;
  likes: number;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let ticker: string;
  let news: NewsArticle[];
  let stocktwits: StockTwitsMessage[];

  try {
    ({ ticker, news, stocktwits } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!ticker) {
    return NextResponse.json({ error: "ticker is required" }, { status: 400 });
  }

  // Build news section
  const newsText =
    news.length > 0
      ? news
          .slice(0, 15)
          .map(
            (a, i) =>
              `${i + 1}. [${a.source}] ${a.headline}${a.summary ? ` — ${a.summary}` : ""}`
          )
          .join("\n")
      : "No news articles available.";

  // Build StockTwits section
  const bullishCount = stocktwits.filter((m) => m.sentiment === "Bullish").length;
  const bearishCount = stocktwits.filter((m) => m.sentiment === "Bearish").length;
  const topTwits = stocktwits
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10)
    .map(
      (m, i) =>
        `${i + 1}. [${m.sentiment ?? "No label"}] @${m.username}: ${m.body}`
    )
    .join("\n");

  const twitsText =
    stocktwits.length > 0
      ? `StockTwits: ${bullishCount} bullish, ${bearishCount} bearish out of ${stocktwits.length} messages.\nTop messages by engagement:\n${topTwits}`
      : "No StockTwits data available.";

  const prompt = `You are a professional financial sentiment analyst. Analyze the following market data for the stock ticker ${ticker.toUpperCase()} and return a sentiment analysis as a single JSON object.

NEWS HEADLINES:
${newsText}

SOCIAL SENTIMENT (StockTwits):
${twitsText}

Return ONLY a valid JSON object with no markdown fences, no explanation, no extra text. Use exactly this structure:
{
  "score": <integer 0-100, where 0=extremely bearish, 50=neutral, 100=extremely bullish>,
  "rating": <"Bullish" | "Neutral" | "Bearish">,
  "narrative": "<2-3 sentences explaining the overall sentiment and key drivers>",
  "signals": [
    { "label": "<2-4 word label>", "value": "<concise metric or finding>", "positive": <true | false | null> },
    { "label": "<2-4 word label>", "value": "<concise metric or finding>", "positive": <true | false | null> },
    { "label": "<2-4 word label>", "value": "<concise metric or finding>", "positive": <true | false | null> },
    { "label": "<2-4 word label>", "value": "<concise metric or finding>", "positive": <true | false | null> }
  ]
}

Rules:
- score is an integer between 0 and 100
- rating must be "Bullish" if score >= 60, "Bearish" if score <= 40, "Neutral" otherwise
- signals must have 3-4 items; positive=true means good for the stock, false=bad, null=informational
- Base your analysis strictly on the provided data; if data is sparse, say so in the narrative`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Strip any accidental markdown fences Claude might add
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const analysis = JSON.parse(cleaned);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[/api/analyze] Claude error:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}
