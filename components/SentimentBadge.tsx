export type Sentiment = "Bullish" | "Neutral" | "Bearish";

interface SentimentBadgeProps {
  sentiment: Sentiment;
  size?: "sm" | "md" | "lg";
}

const config: Record<
  Sentiment,
  { bg: string; text: string; border: string; icon: string }
> = {
  Bullish: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/30",
    icon: "▲",
  },
  Neutral: {
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/30",
    icon: "◆",
  },
  Bearish: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
    icon: "▼",
  },
};

const sizes = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-2.5 py-1 gap-1.5",
  lg: "text-base px-3 py-1.5 gap-2",
};

export default function SentimentBadge({
  sentiment,
  size = "md",
}: SentimentBadgeProps) {
  const c = config[sentiment];
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${c.bg} ${c.text} ${c.border} ${sizes[size]}`}
    >
      <span className="text-[0.65em]">{c.icon}</span>
      {sentiment}
    </span>
  );
}
