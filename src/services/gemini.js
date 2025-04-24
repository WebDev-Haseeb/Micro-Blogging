import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAcgromX2xUAka8JzRq8KSuoCL9-H0Xl-Y";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Helper function for API requests with timeout and retries
const safeApiRequest = async (prompt, maxRetries = 2) => {
  // Create a request config
  const config = {
    method: 'post',
    url: `${API_URL}?key=${API_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      contents: [{
        parts: [{ text: prompt }]
      }]
    },
    timeout: 15000 // 15 second timeout
  };
  
  console.log("Sending request to:", config.url.replace(API_KEY, "API_KEY_HIDDEN"));
  
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios(config);
      console.log("API response received:", response.status);
      
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        console.error("Invalid response format:", JSON.stringify(response.data, null, 2));
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      lastError = error;
      console.error(`API request failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", JSON.stringify(error.response.data, null, 2));
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const backoffTime = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }
  throw lastError;
};

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

    const result = await safeApiRequest(prompt);
    return result;
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

    const result = await safeApiRequest(prompt);
    return result;
  } catch (error) {
    console.error(`Error rewriting text in ${tone} tone:`, error);
    return `Unable to rewrite text in ${tone} tone at this time. Please try again later.`;
  }
}; 