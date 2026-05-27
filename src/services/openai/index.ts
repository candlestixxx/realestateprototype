import OpenAI from 'openai';
import { type AIGenerationRequest, type AIGenerationResponse } from '../../types/api';

// Note: In a real production application, the OpenAI API key should NEVER be exposed in the frontend.
// It should be stored on a secure backend server (Node.js, Python, etc.) that proxies the request.
// For the purpose of this prototype and Phase 2 milestone, we are calling it directly from the client.
// Ensure you have VITE_OPENAI_API_KEY set in your .env file.
export const generateAIContent = async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'mock_key_for_tests';
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required since we are running this in the browser
  });

  try {
    const prompt = `
      You are an expert social media manager for a ${request.businessType} business.
      Generate a highly engaging social media post based on the following topic:
      "${request.topic}"

      The content must be formatted as a JSON array where each object represents a post for a specific date.
      Since the user selected ${request.targetDates.length} dates, generate exactly ${request.targetDates.length} distinct posts.

      Return the array of objects in the following format:
      [
        {
          "title": "A short, catchy title for the internal calendar",
          "content": "The actual social media copy, including emojis and relevant hashtags.",
          "type": "social" // Must be one of: 'listing', 'report', 'social'
        }
      ]

      Ensure the response is ONLY valid JSON. Do not include markdown blocks like \`\`\`json.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional social media content generator. You only output valid JSON arrays."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const responseContent = response.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No content received from OpenAI");
    }

    // Parse the JSON response
    const parsedPosts = JSON.parse(responseContent);

    // Map the parsed posts to the CalendarEvent structure, assigning dates
    const generatedEvents: AIGenerationResponse['events'] = parsedPosts.map((post: { title?: string, type?: 'listing' | 'report' | 'social', content: string }, index: number) => {
      const targetDateStr = request.targetDates[index] || request.targetDates[0];
      const targetDate = new Date(targetDateStr);

      return {
        id: Math.random().toString(36).substr(2, 9),
        day: targetDate.getDate(),
        month: targetDate.getMonth(),
        year: targetDate.getFullYear(),
        time: "09:00 AM", // Default time
        title: post.title || `AI Generated: ${request.topic}`,
        type: post.type || 'social',
        content: post.content,
        approved: false // Content must be reviewed by the user first
      };
    });

    return {
      success: true,
      events: generatedEvents
    };

  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      success: false,
      events: [],
      error: error instanceof Error ? error.message : "An unknown error occurred during AI generation."
    };
  }
};
