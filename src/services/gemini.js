import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAcgromX2xUAka8JzRq8KSuoCL9-H0Xl-Y";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const analyzeBlogText = async (text) => {
  try {
    const prompt = `
    Analyze the following blog post and provide insights about:
    1. Tone (formal, informal, excited, etc.)
    2. Clarity (Is the message clear? Any confusing parts?)
    3. Sentiment (positive, negative, neutral)
    4. Repetition (Are there any repeated words or phrases?)
    
    Keep your response concise and structured. Here's the text:
    
    "${text}"
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error analyzing text with Gemini:", error);
    return "Unable to analyze text at this time. Please try again later.";
  }
};

export const rewriteText = async (text, tone) => {
  try {
    let toneDescription;
    
    switch (tone.toLowerCase()) {
      case 'formal':
        toneDescription = "professional, sophisticated language suitable for business or academic contexts";
        break;
      case 'informal':
        toneDescription = "casual, conversational, and friendly";
        break;
      case 'humorous':
        toneDescription = "funny, witty, and entertaining";
        break;
      default:
        toneDescription = "professional but accessible";
    }
    
    const prompt = `
    Rewrite the following text in a ${tone} tone (${toneDescription}).
    Keep the same meaning but change the style.
    Maintain approximately the same length.
    
    Original text:
    "${text}"
    
    Rewritten text:
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error(`Error rewriting text in ${tone} tone:`, error);
    return `Unable to rewrite text in ${tone} tone at this time. Please try again later.`;
  }
}; 