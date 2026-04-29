import { GoogleGenAI, Type } from "@google/genai";
import { AIQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDynamicQuestion(topic: string): Promise<AIQuestion> {
  const prompt = `Generate a unique sociology case study and a multiple-choice question based on the topic: "${topic}".
  Focus on Indonesian contexts if possible.
  The question should be challenging and focus on critical thinking, not just memorization.
  Include 4 options, a correct answer, and a short explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            context: { type: Type.STRING, description: "A short scenario or case study (2-3 sentences)" },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "4 options as strings"
            },
            correctAnswer: { type: Type.STRING, description: "Must match one of the options exactly" },
            explanation: { type: Type.STRING, description: "Why that answer is correct in sociology terms" }
          },
          required: ["id", "context", "question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to generate AI question:", error);
    // Fallback question
    return {
      id: "fallback-1",
      context: "Di sebuah desa, masyarakat bergotong-royong membangun jembatan tanpa dibayar. Mereka melakukannya karena merasa memiliki kewajiban bersama.",
      question: "Jenis solidaritas apa yang digambarkan dalam skenario tersebut menurut Emile Durkheim?",
      options: ["Solidaritas Organik", "Solidaritas Mekanik", "Solidaritas Fungsional", "Solidaritas Koersif"],
      correctAnswer: "Solidaritas Mekanik",
      explanation: "Solidaritas mekanik didasarkan pada kesamaan perasaan, nilai, dan norma kolektif yang kuat, sering ditemukan pada masyarakat tradisional."
    };
  }
}
