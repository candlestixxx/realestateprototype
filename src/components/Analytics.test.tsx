import { render, screen, waitFor } from '@testing-library/react';
import { Analytics } from './Analytics';
import { api } from '../services/api';

// Mock the API service so we don't hit the simulated delays
vi.mock('../services/api', () => ({
  api: {
    getAnalyticsData: vi.fn()
  }
}));

describe('Analytics Component', () => {
  it('renders a loading state initially', () => {
    // Return a never-resolving promise to keep it in the loading state
    vi.mocked(api.getAnalyticsData).mockReturnValue(new Promise(() => {}));

    render(<Analytics />);
    expect(screen.getByText('Loading Analytics Data...')).toBeInTheDocument();
  });

  it('renders the mocked dashboard metrics successfully', async () => {
    const mockData = {
      impressions: 10000,
      clicks: 500,
      conversions: 50
    };

    vi.mocked(api.getAnalyticsData).mockResolvedValue(mockData);

    render(<Analytics />);

    // Wait for the async API mock to resolve and update state
    await waitFor(() => {
      expect(screen.queryByText('Loading Analytics Data...')).not.toBeInTheDocument();
    });

    // Check header
    expect(screen.getByText('Analytics Overview')).toBeInTheDocument();

    // Check stats are formatted correctly
    expect(screen.getByText('10,000')).toBeInTheDocument(); // Impressions
    expect(screen.getByText('500')).toBeInTheDocument(); // Clicks
    expect(screen.getByText('50')).toBeInTheDocument(); // Conversions

    // Check engagement rate calculation (500 / 10000 = 0.05 -> 5.00%)
    expect(screen.getByText('5.00%')).toBeInTheDocument();
  });
});