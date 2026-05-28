import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, initDb } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key_123';

app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY || 'mock_key_for_tests';
const openai = new OpenAI({
  apiKey: apiKey,
});

// Define extended request type to hold the user payload
interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

// Authentication Middleware
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user as { id: string; email: string };
    next();
  });
};

// Initialize DB and start server
initDb().then(() => {
  console.log("Database initialized successfully.");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(console.error);


// --- PUBLIC ENDPOINTS ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await getDb();

    // Check if user exists
    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const id = Math.random().toString(36).substr(2, 9);
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = name.substring(0, 2).toUpperCase();

    await db.run(
      'INSERT INTO users (id, email, password, name, avatar) VALUES (?, ?, ?, ?, ?)',
      [id, email, hashedPassword, name, avatar]
    );

    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      user: { id, email, name, avatar }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// --- PROTECTED ENDPOINTS ---

// OAuth Status
app.get('/api/oauth/status', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const userId = req.user!.id;

    // Get connections for user
    const connections = await db.all('SELECT platform, connected FROM oauth_connections WHERE user_id = ?', [userId]);

    // Format response to match frontend expectations: { facebook: true, instagram: false, ... }
    const statusMap: Record<string, boolean> = {
      facebook: false,
      instagram: false,
      linkedin: false,
      twitter: false
    };

    connections.forEach((conn) => {
      statusMap[conn.platform] = conn.connected === 1;
    });

    res.json(statusMap);
  } catch (error) {
    console.error("Fetch OAuth status error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OAuth Connect
app.post('/api/oauth/connect', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { platform } = req.body;
    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }

    const db = await getDb();
    const userId = req.user!.id;

    // Simulate OAuth mock token
    const mockToken = `mock_token_${platform}_${Math.random().toString(36).substring(7)}`;

    await db.run(
      `INSERT INTO oauth_connections (user_id, platform, connected, mock_token)
       VALUES (?, ?, 1, ?)
       ON CONFLICT(user_id, platform) DO UPDATE SET connected = 1, mock_token = ?`,
      [userId, platform, mockToken, mockToken]
    );

    res.json({ success: true, platform, connected: true });
  } catch (error) {
    console.error("OAuth connect error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OAuth Disconnect
app.post('/api/oauth/disconnect', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { platform } = req.body;
    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }

    const db = await getDb();
    const userId = req.user!.id;

    await db.run(
      `UPDATE oauth_connections SET connected = 0, mock_token = NULL
       WHERE user_id = ? AND platform = ?`,
      [userId, platform]
    );

    res.json({ success: true, platform, connected: false });
  } catch (error) {
    console.error("OAuth disconnect error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/events', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const userId = req.user!.id;
    const events = await db.all('SELECT * FROM events WHERE user_id = ?', [userId]);

    // Map boolean and format for frontend
    const formattedEvents = events.map(e => ({
      ...e,
      approved: e.approved === 1
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error("Fetch events error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/events', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const newEvents = req.body;
    if (!Array.isArray(newEvents)) {
      return res.status(400).json({ error: 'Expected an array of events' });
    }

    const db = await getDb();
    const userId = req.user!.id;

    // A simple approach for this prototype: clear existing events and insert new ones
    // In production, you'd want an upsert/merge strategy.
    await db.run('DELETE FROM events WHERE user_id = ?', [userId]);

    for (const event of newEvents) {
      await db.run(
        'INSERT INTO events (id, user_id, day, month, year, time, title, type, content, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [event.id, userId, event.day, event.month, event.year, event.time, event.title, event.type, event.content, event.status]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Save events error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/generate', authenticateToken, async (req, res) => {
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
        approved: false,
        status: 'scheduled'
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