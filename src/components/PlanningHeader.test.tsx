import { render, screen, fireEvent } from '@testing-library/react';
import { PlanningHeader } from './PlanningHeader';
import { AppContext } from '../store/context';
import { vi } from 'vitest';

describe('PlanningHeader Component', () => {
  const defaultState = {
    user: { id: '1', name: 'Test', email: 'test@test.com', avatar: 'T' },
    businessType: 'real_estate' as const,
    theme: 'light' as const
  };

  const defaultProps = {
    selectedDates: [] as Date[],
    setSelectedDates: vi.fn(),
    aiSearchTopic: '',
    setAiSearchTopic: vi.fn(),
    attachments: [],
    setAttachments: vi.fn(),
    isGenerating: false,
    handleAiGenerate: vi.fn(),
    handleQuickTool: vi.fn(),
  };

  const renderWithContext = (props = defaultProps) => {
    return render(
      <AppContext.Provider value={{ state: defaultState, dispatch: vi.fn() }}>
        <PlanningHeader {...props} />
      </AppContext.Provider>
    );
  };

  it('renders correctly with 0 dates selected', () => {
    renderWithContext();
    expect(screen.getByText("Let's plan your Social Media Content")).toBeInTheDocument();
    expect(screen.queryByText('Days Selected')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('What would you like your content to focus on this week?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument();
  });

  it('renders correctly with dates selected', () => {
    const props = {
      ...defaultProps,
      selectedDates: [new Date(), new Date()]
    };
    renderWithContext(props);
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 Days Selected
    expect(screen.getByPlaceholderText('Schedule content for 2 days...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bulk Schedule' })).toBeInTheDocument();
  });

  it('calls handleAiGenerate when Generate button is clicked', () => {
    const mockGenerate = vi.fn();
    renderWithContext({ ...defaultProps, handleAiGenerate: mockGenerate });

    fireEvent.click(screen.getByRole('button', { name: 'Generate' }));
    expect(mockGenerate).toHaveBeenCalledTimes(1);
  });

  it('disables the generate button while isGenerating is true', () => {
    renderWithContext({ ...defaultProps, isGenerating: true });

    const generateBtn = screen.getByRole('button', { name: 'Generating...' });
    expect(generateBtn).toBeDisabled();
    expect(generateBtn).toHaveClass('loading');
  });

  it('calls setAiSearchTopic when input changes', () => {
    const mockSetTopic = vi.fn();
    renderWithContext({ ...defaultProps, setAiSearchTopic: mockSetTopic });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Strategy' } });
    expect(mockSetTopic).toHaveBeenCalledWith('New Strategy');
  });
});