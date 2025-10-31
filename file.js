// === Step 8: Simple Express server to hide API key ===
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ⚠️ Replace with your Gemini API key (kept safe here)
const API_KEY = "YOUR_API_KEY_HERE";
const MODEL = "gemini-1.5-flash";

app.post("/api/gemini", async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        }),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Error calling Gemini API." });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
