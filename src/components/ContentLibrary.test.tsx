import { render, screen, fireEvent } from '@testing-library/react';
import { ContentLibrary } from './ContentLibrary';
import { type CalendarEvent } from '../App';

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Listing Event', type: 'listing', day: 1, month: 0, year: 2026, time: '10:00 AM', status: 'published' },
  { id: '2', title: 'Social Event 1', type: 'social', day: 2, month: 0, year: 2026, time: '11:00 AM', content: 'Social Content', status: 'scheduled' },
  { id: '3', title: 'Social Event 2', type: 'social', day: 3, month: 0, year: 2026, time: '12:00 PM', status: 'scheduled' },
];

describe('ContentLibrary Component', () => {
  it('renders the empty state when no events exist', () => {
    render(<ContentLibrary events={[]} />);
    expect(screen.getByText('No content has been generated or scheduled yet.')).toBeInTheDocument();
  });

  it('renders events and defaults to all filter', () => {
    render(<ContentLibrary events={mockEvents} />);
    expect(screen.getByText('Listing Event')).toBeInTheDocument();
    expect(screen.getByText('Social Event 1')).toBeInTheDocument();
    expect(screen.getByText('Social Event 2')).toBeInTheDocument();

    // Check Status rendering
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getAllByText('Scheduled')).toHaveLength(2);
  });

  it('filters events when a category is clicked', () => {
    render(<ContentLibrary events={mockEvents} />);

    // Click the social filter
    fireEvent.click(screen.getByRole('button', { name: 'social' }));

    // Social events should be present
    expect(screen.getByText('Social Event 1')).toBeInTheDocument();
    expect(screen.getByText('Social Event 2')).toBeInTheDocument();

    // Listing event should be hidden
    expect(screen.queryByText('Listing Event')).not.toBeInTheDocument();
  });

  it('shows empty filter state when no events match', () => {
    render(<ContentLibrary events={mockEvents} />);

    // Click the report filter
    fireEvent.click(screen.getByRole('button', { name: 'report' }));

    expect(screen.getByText('No events match the selected filter.')).toBeInTheDocument();
    expect(screen.queryByText('Listing Event')).not.toBeInTheDocument();
  });
});