"use client";

import { useEffect, useState } from "react";
import { Sentiment } from "./SentimentBadge";

interface SentimentGaugeProps {
  score: number; // 0–100
  sentiment: Sentiment;
}

function getColor(sentiment: Sentiment) {
  if (sentiment === "Bullish") return "#22c55e";
  if (sentiment === "Bearish") return "#ef4444";
  return "#6b7280";
}

function getGradient(sentiment: Sentiment) {
  if (sentiment === "Bullish")
    return "from-green-900/20 via-green-800/10 to-transparent";
  if (sentiment === "Bearish")
    return "from-red-900/20 via-red-800/10 to-transparent";
  return "from-gray-800/20 via-gray-700/10 to-transparent";
}

export default function SentimentGauge({
  score,
  sentiment,
}: SentimentGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 900;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const color = getColor(sentiment);
  const gradient = getGradient(sentiment);

  // Arc parameters
  const radius = 80;
  const cx = 100;
  const cy = 100;
  const startAngle = 210; // degrees
  const sweep = 240; // 330 - 210 = 240 degree total arc

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function describeArc(fromAngle: number, toAngle: number) {
    const start = polarToCartesian(fromAngle);
    const end = polarToCartesian(toAngle);
    const largeArc = toAngle - fromAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  const progressAngle = startAngle + (displayScore / 100) * sweep;
  const trackPath = describeArc(startAngle, startAngle + sweep);
  const progressPath = describeArc(startAngle, progressAngle);

  return (
    <div className={`relative flex flex-col items-center`}>
      {/* Glow backdrop */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-radial ${gradient} blur-2xl opacity-60`}
      />
      <svg viewBox="0 0 200 160" className="w-56 h-44 relative">
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="#1e2d52"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={progressPath}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color}80)`,
            transition: "stroke 0.3s ease",
          }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize="36"
          fontWeight="700"
          fill="white"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          {displayScore}
        </text>
        <text
          x={cx}
          y={cy + 30}
          textAnchor="middle"
          fontSize="11"
          fill="#64748b"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          letterSpacing="2"
        >
          OUT OF 100
        </text>
        {/* Scale labels */}
        <text x="22" y="148" fontSize="9" fill="#334155" textAnchor="middle">
          0
        </text>
        <text x="178" y="148" fontSize="9" fill="#334155" textAnchor="middle">
          100
        </text>
      </svg>
    </div>
  );
}
