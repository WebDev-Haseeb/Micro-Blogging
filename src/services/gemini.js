import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAcgromX2xUAka8JzRq8KSuoCL9-H0Xl-Y";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Maximum character limit for blog posts
const MAX_CHARACTERS = 400; // Increased for more room for valuable insights

// Helper function to sanitize input text (remove unwanted characters, ensure single line)
const sanitizeText = (text) => {
  if (!text) return "";
  // Replace line breaks with spaces to keep text in a single line
  return text.replace(/\r?\n|\r/g, ' ').trim();
};

// Helper function to enforce character limit without obvious truncation
const enforceCharacterLimit = (text) => {
  if (!text) return "";

  // If already within limit, return as is
  if (text.length <= MAX_CHARACTERS) return text;

  // Find the last sentence that fits within the character limit
  const lastPeriodIndex = text.lastIndexOf('.', MAX_CHARACTERS - 1);
  if (lastPeriodIndex > MAX_CHARACTERS * 0.7) { // Only truncate at sentence if we have a substantial amount
    return text.substring(0, lastPeriodIndex + 1);
  }

  // If no good sentence break found, truncate at word boundary
  const lastSpaceIndex = text.lastIndexOf(' ', MAX_CHARACTERS - 3);
  if (lastSpaceIndex > 0) {
    return text.substring(0, lastSpaceIndex) + "...";
  }

  // Last resort: hard truncate
  return text.substring(0, MAX_CHARACTERS - 3) + "...";
};

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
    // Sanitize input text
    const cleanText = sanitizeText(text);

    // Don't process empty text
    if (!cleanText) {
      return "";
    }

    const prompt = `
Analyze the following blog post and provide high-value, actionable insights in EXACTLY 3 bullet points covering:
1. Tone & Voice/Clarity – Analyze the writing style and clarity
2. Engagement & Impact – What will resonate with readers and standout elements
3. Improvement Opportunities – Specific ways to enhance impact

IMPORTANT FORMAT REQUIREMENTS:
- Provide EXACTLY 3 bullet points total
- Format each point like this:
  💡 TITLE IN ALL CAPS
  Short, concise explanation (1–2 sentences max)
- Ensure there’s a line break between the title and explanation
- Do NOT use asterisks, markdown, or HTML tags (e.g. <b>)
- Keep the total response neat, well spaced, and friendly to plain text rendering
- Be specific and actionable — refer to exact words, tone, or phrasing

Here’s the text:
"${cleanText}"
`;



    let result = await safeApiRequest(prompt);

    // Ensure proper formatting
    if (!result.includes('💡')) {
      // Extract insights and format them properly
      const insights = result
        .split(/\n+/)
        .filter(line => line.trim().length > 0)
        .slice(0, 3); // Ensure only 3 points

      // Build properly formatted result
      result = insights.map(insight => {
        // Try to extract a title if there is a colon or dash
        const titleMatch = insight.match(/^([^:]+)[:-]/);
        if (titleMatch) {
          const title = titleMatch[1].trim();
          const content = insight.substring(titleMatch[0].length).trim();
          return `💡 **${title}**: ${content}`;
        }
        // If no clear title, make a generic one
        return `💡 **Insight**: ${insight.trim()}`;
      }).join('\n\n');
    }

    return result;
  } catch (error) {
    console.error("Error analyzing text with Gemini:", error);
    return "Unable to analyze text at this time. Please try again later.";
  }
};

export const rewriteText = async (text, tone) => {
  try {
    // Sanitize input text
    const cleanText = sanitizeText(text);

    // Don't process empty text
    if (!cleanText) {
      return "";
    }

    // Calculate target length - should be proportional to input but not exceed max
    const targetLength = Math.min(cleanText.length * 1.2, MAX_CHARACTERS);

    // Validate tone or set default
    let toneDescription;
    const validTones = ['formal', 'informal', 'humorous'];

    // Remove any quotation marks from tone and trim whitespace
    tone = (tone || '').replace(/["']/g, '').trim().toLowerCase();

    if (!validTones.includes(tone)) {
      tone = 'informal';
    }

    switch (tone) {
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
        toneDescription = "casual, conversational, and friendly";
    }

    const prompt = `
    Rewrite the following text in a ${tone} tone (${toneDescription}).
    IMPORTANT REQUIREMENTS:
    1. Keep the same core meaning but change the style.
    2. Your response MUST NOT exceed ${targetLength} characters.
    3. The length of your response should be proportional to the input text length.
    4. Very short inputs should result in very short outputs.
    5. Do not add significant new content that isn't implied by the original.
    6. Keep the text as a single continuous paragraph without line breaks.
    7. DO NOT include quotation marks around the final text.
    
    Original text:
    "${cleanText}"
    
    Rewritten text:
    `;

    let result = await safeApiRequest(prompt);

    // Ensure result is a single line without obvious truncation
    result = sanitizeText(result);

    // Remove any quotation marks that might be around the result
    result = result.replace(/^["']|["']$/g, '');

    // Only apply character limit after removing quotes to ensure we don't cut off too much
    if (result.length > MAX_CHARACTERS) {
      result = enforceCharacterLimit(result);
    }

    return result;
  } catch (error) {
    console.error(`Error rewriting text in ${tone} tone:`, error);
    return `Unable to rewrite text in ${tone} tone at this time. Please try again later.`;
  }
}; 