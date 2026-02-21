import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import OpenAI from "openai";
import https from "https";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/enrich", async (req, res) => {
  try {
    const { url } = req.body;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const response = await axios.get(url, {
  httpsAgent,
  headers: {
    "User-Agent": "Mozilla/5.0"
  }
});
    const websiteText = response.data.slice(0, 8000);

    const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0.2,
  response_format: { type: "json_object" },  // 👈 ADD THIS
  messages: [
  {
    role: "system",
    content: `
You are a venture capital analyst evaluating early-stage startups.

Extract structured, investment-focused intelligence.

Be analytical, concise, and avoid marketing language.

Return ONLY valid JSON.
`
  },
  {
    role: "user",
    content: `
From the content below, extract:

1. A 2-sentence analytical summary (what they do + why it matters)
2. 3–6 concise bullet points explaining the product or value proposition
3. 5–10 relevant industry keywords
4. 2–4 derived investment signals (e.g., defensibility, scalability, market potential, technical moat)
5. An investmentScore from 1–10
6. A short scoreReasoning explaining the score
7. 2–4 potential risks

Return JSON exactly in this format:

{
  "summary": "...",
  "bullets": [],
  "keywords": [],
  "signals": [],
  "investmentScore": number,
  "scoreReasoning": "...",
  "risks": []
}

Scoring Guide:
1–3 = Weak / unclear model  
4–6 = Moderate potential  
7–8 = Strong early-stage opportunity  
9–10 = Exceptional and highly compelling  

CONTENT:
${websiteText}
`
  }
]
});

    const extracted = JSON.parse(completion.choices[0].message.content);

res.json({
  ...extracted,
  sources: [
    {
      url,
      scrapedAt: new Date().toISOString()
    }
  ]
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Enrichment failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});