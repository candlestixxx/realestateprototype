import { render, screen, fireEvent } from '@testing-library/react';
import { TopBar } from './TopBar';

describe('TopBar Component', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@user.com',
    avatar: 'TU'
  };

  const defaultProps = {
    selectedBusinessType: 'real_estate' as const,
    setSelectedBusinessType: vi.fn(),
    isDarkMode: false,
    setIsDarkMode: vi.fn(),
    setShowInstructions: vi.fn(),
    setNotification: vi.fn(),
    currentUser: mockUser,
    onLogout: vi.fn()
  };

  it('renders the search and business selector', () => {
    render(<TopBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search strategy...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('real_estate');
  });

  it('calls setSelectedBusinessType on change', () => {
    const mockSetSelected = vi.fn();
    render(<TopBar {...defaultProps} setSelectedBusinessType={mockSetSelected} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ecommerce' } });
    expect(mockSetSelected).toHaveBeenCalledWith('ecommerce');
  });

  it('renders the user avatar and logout button', () => {
    render(<TopBar {...defaultProps} />);
    expect(screen.getByText('TU')).toBeInTheDocument();
    expect(screen.getByTitle('Test User')).toBeInTheDocument();
  });

  it('calls onLogout when logout button is clicked', () => {
    const mockLogout = vi.fn();
    render(<TopBar {...defaultProps} onLogout={mockLogout} />);

    fireEvent.click(screen.getByTitle('Log out'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});