import { type CalendarEvent } from '../App';
import { type User, type AnalyticsData } from '../types/api';

const STORAGE_KEY = 'legacy_calendar_events';
const AUTH_KEY = 'legacy_auth_user';
const MOCK_DELAY_MS = 600;

/**
 * Simulates a network delay.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API Service to handle data persistence asynchronously.
 */
export const api = {
  /**
   * Fetches the user's scheduled events from the backend database.
   */
  fetchEvents: async (): Promise<CalendarEvent[]> => {
    try {
      const response = await fetch('/api/events');
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
        headers: {
          'Content-Type': 'application/json',
        },
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
   * Mocks a login authentication request.
   */
  login: async (email: string): Promise<User> => {
    await delay(1000); // Slightly longer delay for "auth"
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0] || 'Demo User',
      email: email,
      avatar: (email.split('@')[0] || 'D').substring(0, 2).toUpperCase()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  /**
   * Mocks a logout authentication request.
   */
  logout: async (): Promise<void> => {
    await delay(MOCK_DELAY_MS);
    localStorage.removeItem(AUTH_KEY);
  },

  /**
   * Retrieves the currently authenticated mock user from storage.
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
  }
};