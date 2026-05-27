import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { AppContext } from '../store/context';
import { vi } from 'vitest';

describe('Dashboard Component', () => {
  const defaultState = {
    user: { id: '1', name: 'Test', email: 'test@test.com', avatar: 'T' },
    businessType: 'real_estate' as const,
    theme: 'light' as const
  };

  const defaultProps = {
    isLoadingData: false,
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

  const renderWithContext = (props = defaultProps) => {
    return render(
      <AppContext.Provider value={{ state: defaultState, dispatch: vi.fn() }}>
        <Dashboard {...props} />
      </AppContext.Provider>
    );
  };

  it('renders Command Center header', () => {
    renderWithContext();
    expect(screen.getByText('Command Center')).toBeInTheDocument();
    expect(screen.getByText('Overview of your authority footprint.')).toBeInTheDocument();
  });

  it('renders stats grid based on global context (real_estate)', () => {
    renderWithContext();
    expect(screen.getByText('AI Generations')).toBeInTheDocument();
    expect(screen.getByText('MLS Synced')).toBeInTheDocument();
    expect(screen.getByText('Reach')).toBeInTheDocument();
  });

  it('renders loading state for mini calendar when isLoadingData is true', () => {
    renderWithContext({ ...defaultProps, isLoadingData: true });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders Calendar component when not loading', () => {
    renderWithContext();
    // We expect the default month header format (e.g. March 2026) to show
    expect(screen.getByText('March 2026')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });
});