
import { GoogleGenAI, Type } from "@google/genai";
import { LearningLevel, CourseUnit, AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || "" });

export const getAIPedagogyResponse = async (
  level: LearningLevel,
  unit: CourseUnit,
  userInput: string,
  context: string
): Promise<AIResponse> => {
  const model = level === LearningLevel.WISE ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';

  const systemInstructions: Record<LearningLevel, string> = {
    [LearningLevel.DUMMIES]: `You are an expert law professor for 15-year-olds. Explain complex legal concepts using ONLY analogies and stories from media (Netflix, YouTubers, etc.). Avoid jargon. Be concise. One thought at a time. After evaluating user input, give a score from 0-100 and a simple encouragement.`,
    [LearningLevel.SMARTIES]: `You are a Socratic legal mentor. Do not give answers. Ask questions to lead the student to identify rights, subjects, and conflicts. Evaluate their logic structure. Check for coherence. Provide specific professional improvement suggestions.`,
    [LearningLevel.WISE]: `You are a Senior Media Lawyer. The user is your associate. Evaluate their strategy in a complex multi-layered case. Focus on risk management, ethical implications, and legal strategy. Simulate consequences of their decisions.`
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      feedback: { type: Type.STRING, description: "Direct feedback to the user." },
      score: { type: Type.NUMBER, description: "Score from 0 to 100 based on reasoning quality." },
      logicCheck: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of logical points covered or missed."
      },
      suggestions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Actionable tips to improve legal reasoning."
      },
      nextStep: { type: Type.STRING, description: "A bridge to the next concept or case evolution." }
    },
    required: ["feedback", "score"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Context: ${context}\nUser Input: ${userInput}`,
      config: {
        systemInstruction: systemInstructions[level],
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      feedback: "Communication link to the legal matrix interrupted. Try rephrasing.", 
      score: 0 
    };
  }
};

export const generateLessonSeed = async (level: LearningLevel, unit: CourseUnit): Promise<any> => {
  const prompt = `Generate a level ${level} lesson for the unit "${unit}". 
  If level is DUMMIES: provide a concept name, a brilliant analogy, and a recall question.
  If level is SMARTIES: provide a realistic media case scenario involving a conflict.
  If level is WISE: provide a complex, multi-layered legal dilemma with 3 possible strategic directions.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  metadata: { type: Type.STRING, description: "Analogy for Dummies, Scenario for Smarties, Dilemma for Wise" },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
          }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Lesson Generation Error:", error);
    // Fallback content to prevent getting stuck
    return {
      title: `${unit} - Core Concepts`,
      content: `Let's explore the fundamental principles of ${unit}. In this module, we analyze how legal frameworks adapt to the evolving media landscape.`,
      metadata: "Think of law as the operating system of society; it needs regular updates to handle new technology.",
      options: level === LearningLevel.WISE ? ["Strategic Litigation", "Regulatory Compliance", "Ethical Negotiation"] : []
    };
  }
};
