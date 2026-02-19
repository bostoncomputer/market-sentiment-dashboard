import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentimentIQ — Market Sentiment Dashboard",
  description: "Real-time AI-powered market sentiment analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0f1e] text-slate-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
