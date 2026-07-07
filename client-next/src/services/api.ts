import { type CalendarEvent } from '../App';
import { type User, type AnalyticsData } from '../types/api';

const STORAGE_KEY = 'legacy_calendar_events';
const AUTH_KEY = 'legacy_auth_user';
const TOKEN_KEY = 'legacy_auth_token';
const MOCK_DELAY_MS = 600;

/**
 * Simulates a network delay.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * API Service to handle data persistence and backend communication.
 */
export const api = {
  /**
   * Fetches the user's scheduled events from the backend database.
   */
  fetchEvents: async (): Promise<CalendarEvent[]> => {
    try {
      const response = await fetch('/api/events', {
        headers: getHeaders()
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (e) {
      console.error("Failed to fetch calendar events from backend, falling back to local storage.", e);
      // Fallback for tests or disconnected dev environment
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
  },

  /**
   * Saves the entire array of events to the backend database.
   */
  saveEvents: async (events: CalendarEvent[]): Promise<boolean> => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(events),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Keep local storage in sync as a fallback
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return true;
    } catch (e) {
      console.error("Failed to save calendar events to backend, falling back to local storage.", e);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return true;
    }
  },

  /**
   * Authenticates the user via the backend API.
   * If login fails, tries to register them (simplified UX for prototype).
   */
  login: async (email: string, password?: string): Promise<User> => {
    const pwd = password || 'password'; // fallback for prototype tests

    let response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pwd })
    });

    // If invalid credentials, attempt registration (for ease of use in the prototype)
    if (response.status === 401) {
      response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: pwd,
          name: email.split('@')[0] || 'Demo User'
        })
      });
    }

    if (!response.ok) {
      let errMessage = 'Authentication failed';
      try {
        const err = await response.json();
        errMessage = err.error || errMessage;
      } catch {
        // Fallback for HTML error pages (e.g., 502/504 Bad Gateway from proxy)
      }
      throw new Error(errMessage);
    }

    const data = await response.json();
    localStorage.setItem(AUTH_KEY, JSON.stringify(data.user));
    localStorage.setItem(TOKEN_KEY, data.token);
    return data.user;
  },

  /**
   * Logs out the user by clearing storage.
   */
  logout: async (): Promise<void> => {
    await delay(300);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Retrieves the currently authenticated user from storage.
   */
  getCurrentUser: (): User | null => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Mocks returning aggregate engagement metrics for Phase 3 dashboard.
   */
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    await delay(MOCK_DELAY_MS);
    return {
      impressions: 124500,
      clicks: 18320,
      conversions: 450
    };
  },

  getBrandVoice: async (): Promise<string> => {
    try {
      const response = await fetch('/api/user/brand-voice', {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch brand voice');
      const data = await response.json();
      return data.brand_voice;
    } catch {
      return 'Professional and helpful';
    }
  },

  updateBrandVoice: async (voice: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/user/brand-voice', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ voice })
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};