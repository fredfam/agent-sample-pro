import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: AI Market Technical Breakdown using Gemini
  app.post("/api/ai-analysis", async (req, res) => {
    try {
      const { symbol, name, price, changePercent, high24h, low24h, category, timeframe } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          analysis: `**Technical Breakdown for ${symbol} (${name})**\n\n• **Market Sentiment**: ${
            changePercent >= 0 ? "Bullish Momentum" : "Bearish Consolidation"
          } at $${price}.\n• **Key Levels**: Resistance $${high24h}, Support $${low24h}.\n• **Strategy**: Accumulate near structural dip levels with strict stop losses.`
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze the market instrument "${symbol}" (${name}, category: ${category}).
Price: $${price}, 24h Change: ${changePercent}%, 24h High: $${high24h}, 24h Low: $${low24h}, Timeframe: ${timeframe}.
Provide a concise, professional 4-bullet technical trading analysis including market sentiment, key support/resistance levels, RSI/Moving average interpretation, and actionable risk-managed strategy. Keep it concise in bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      res.json({ analysis: response.text });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: "Failed to generate AI analysis", details: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Precision Markets Server running on http://localhost:${PORT}`);
  });
}

startServer();
