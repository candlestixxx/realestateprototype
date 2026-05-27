import { type CalendarEvent } from '../App';

const STORAGE_KEY = 'legacy_calendar_events';
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
   * Fetches the user's scheduled events from the database (mocked via localStorage).
   */
  fetchEvents: async (): Promise<CalendarEvent[]> => {
    await delay(MOCK_DELAY_MS);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse calendar events", e);
        return [];
      }
    }
    // Return default seed data if none exists
    return [
      { id: '1', day: 14, month: 3, year: 2026, time: '10:00 AM', title: 'Luxury Villa Listing', type: 'listing' },
      { id: '2', day: 15, month: 3, year: 2026, time: '02:30 PM', title: 'Market Report: Beverly Hills', type: 'report' },
    ];
  },

  /**
   * Saves the entire array of events to the database.
   */
  saveEvents: async (events: CalendarEvent[]): Promise<boolean> => {
    await delay(MOCK_DELAY_MS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return true;
  }
};