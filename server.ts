import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // Server-side Gemini TTS route for natural Gentleman Macho Male & Warm Female voices
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, gender } = req.body as {
        text?: string;
        gender?: "pria" | "wanita";
      };

      if (!text || !text.trim()) {
        res.status(400).json({ error: "Teks tidak boleh kosong" });
        return;
      }

      const isMale = gender === "pria";
      // 'Charon' is a deep, resonant, gentleman baritone male voice; 'Kore' is a warm female voice
      const voiceName = isMale ? "Charon" : "Kore";
      const voiceStyle = isMale
        ? "Deep baritone, warm, gentleman, macho, calm, authoritative, and polite Indonesian male voice"
        : "Warm, friendly, clear, and polite Indonesian female voice";

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: text.trim(),
                speechMetadata: {
                  style: voiceStyle
                }
              }
            ]
          }
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName
              }
            }
          }
        }
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || "audio/wav";

      if (!base64Audio) {
        res.status(500).json({ error: "Tidak ada data audio yang dihasilkan" });
        return;
      }

      res.json({
        audioBase64: base64Audio,
        mimeType
      });
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : "Gagal menghasilkan suara TTS";
      console.error("TTS API Error:", errMessage);
      res.status(500).json({ error: errMessage });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mitra NetraQu server running on http://localhost:${PORT}`);
  });
}

startServer();
