import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY || 'mock_key_for_tests';
const openai = new OpenAI({
  apiKey: apiKey,
});

// Mock Database
let events: { id: string, day: number, month: number, year: number, time: string, title: string, type: string, status: string }[] = [
  { id: '1', day: 14, month: 3, year: 2026, time: '10:00 AM', title: 'Luxury Villa Listing', type: 'listing', status: 'scheduled' },
  { id: '2', day: 15, month: 3, year: 2026, time: '02:30 PM', title: 'Market Report: Beverly Hills', type: 'report', status: 'scheduled' },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const newEvents = req.body;
  if (!Array.isArray(newEvents)) {
    return res.status(400).json({ error: 'Expected an array of events' });
  }
  events = newEvents;
  res.json({ success: true });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { topic, businessType, targetDates } = req.body;

    if (!topic || !businessType || !targetDates || !Array.isArray(targetDates)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `
      You are an expert social media manager for a ${businessType} business.
      Generate a highly engaging social media post based on the following topic:
      "${topic}"

      The content must be formatted as a JSON array where each object represents a post for a specific date.
      Since the user selected ${targetDates.length} dates, generate exactly ${targetDates.length} distinct posts.

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

    const parsedPosts = JSON.parse(responseContent);

    const generatedEvents = parsedPosts.map((post: { title?: string, type?: 'listing' | 'report' | 'social', content: string }, index: number) => {
      const targetDateStr = targetDates[index] || targetDates[0];
      const targetDate = new Date(targetDateStr);

      return {
        id: Math.random().toString(36).substr(2, 9),
        day: targetDate.getDate(),
        month: targetDate.getMonth(),
        year: targetDate.getFullYear(),
        time: "09:00 AM",
        title: post.title || `AI Generated: ${topic}`,
        type: post.type || 'social',
        content: post.content,
        approved: false
      };
    });

    res.json({ success: true, events: generatedEvents });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred during AI generation."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});