/**
 * Prepares the payload expected by the upcoming AI API layer.
 */
export interface AIGenerationRequest {
  topic: string;
  businessType: string;
  targetDates: string[]; // ISO Date strings
  attachmentsCount: number;
}

/**
 * Represents the structured data returned by the AI content generation service.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AIGenerationResponse {
  success: boolean;
  events: {
    id: string;
    day: number;
    month: number;
    year: number;
    time: string;
    title: string;
    type: 'listing' | 'report' | 'social';
    content?: string;
    approved: boolean;
  }[];
  error?: string;
}

/**
 * Mocks the structure of aggregate engagement metrics for Phase 3.
 */
export interface AnalyticsData {
  impressions: number;
  clicks: number;
  conversions: number;
}