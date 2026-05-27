import { render, screen } from '@testing-library/react';
import { Calendar } from './Calendar';
import { vi } from 'vitest';

describe('Calendar Component', () => {
  const defaultProps = {
    isDashboard: false,
    viewDate: new Date(2026, 2, 14), // Mar 14, 2026
    setViewDate: vi.fn(),
    calendarView: 'month' as const,
    setCalendarView: vi.fn(),
    selectedDates: [],
    scheduledEvents: [],
    isCompressed: false,
    handleMouseDownOnDate: vi.fn(),
    handleMouseEnterOnDate: vi.fn()
  };

  it('renders month view headers and grid correctly', () => {
    render(<Calendar {...defaultProps} />);

    // Check Date Title
    expect(screen.getByText('March 2026')).toBeInTheDocument();

    // Check Day Headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders week view grid correctly when not on dashboard', () => {
    render(<Calendar {...defaultProps} calendarView="week" />);

    // In March 2026, the 14th is a Saturday.
    // Week of Mar 8, 2026 should be the header
    expect(screen.getByText('Week of Mar 8')).toBeInTheDocument();

    // Ensure the specific day columns render with their numbers
    expect(screen.getByText('Sun 8')).toBeInTheDocument();
    expect(screen.getByText('Sat 14')).toBeInTheDocument();
  });

  it('hides view-switcher when on dashboard', () => {
    render(<Calendar {...defaultProps} isDashboard={true} />);
    expect(screen.queryByText('Month')).not.toBeInTheDocument();
    expect(screen.queryByText('Week')).not.toBeInTheDocument();
  });
});