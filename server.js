
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })
    : null;

// Middleware
app.use(express.json());
app.use(express.static("public"));


// Gemini API endpoint
app.post("/ask", async (req, res) => {
    try {
           const { question } = req.body;

        if (typeof question !== "string" || !question.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        if (!ai) {
            return res.status(500).json({
                error: "API key missing. Check your .env file."
            });
        }

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: question.trim()
        });

        res.json({
            answer: result.text || "No answer received."
        });

    } catch (error) {
        console.error("Gemini API error:", error.message);

        res.status(500).json({
            error: "Unable to get an answer. Check your API key, quota, and server logs."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Ask Gemini running at http://localhost:${PORT}`);
});






