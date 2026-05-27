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
    approved: boolean;
  }[];
  error?: string;
}