import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TopBar } from './TopBar';
import { AppContext } from '../store/context';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    logout: vi.fn().mockResolvedValue(undefined)
  }
}));

describe('TopBar Component', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@user.com',
    avatar: 'TU'
  };

  const defaultState = {
    user: mockUser,
    businessType: 'real_estate' as const,
    theme: 'light' as const
  };

  const defaultProps = {
    setShowInstructions: vi.fn(),
    setNotification: vi.fn(),
  };

  const renderWithContext = (state = defaultState, dispatch = vi.fn()) => {
    return render(
      <AppContext.Provider value={{ state, dispatch }}>
        <TopBar {...defaultProps} />
      </AppContext.Provider>
    );
  };

  it('renders the search and business selector mapping to state', () => {
    renderWithContext();
    expect(screen.getByPlaceholderText('Search strategy...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('real_estate');
  });

  it('dispatches SET_BUSINESS_TYPE on category change', () => {
    const mockDispatch = vi.fn();
    renderWithContext(defaultState, mockDispatch);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ecommerce' } });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_BUSINESS_TYPE', payload: 'ecommerce' });
  });

  it('renders the user avatar when user is in state', () => {
    renderWithContext();
    expect(screen.getByText('TU')).toBeInTheDocument();
    expect(screen.getByTitle('Test User')).toBeInTheDocument();
  });

  it('calls api.logout and dispatches SET_USER null when logout is clicked', async () => {
    const mockDispatch = vi.fn();
    renderWithContext(defaultState, mockDispatch);

    fireEvent.click(screen.getByTitle('Log out'));

    await waitFor(() => {
      expect(api.logout).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_USER', payload: null });
    });
  });

  it('dispatches TOGGLE_THEME when theme button is clicked', () => {
    const mockDispatch = vi.fn();
    renderWithContext(defaultState, mockDispatch);

    fireEvent.click(screen.getByTitle('Toggle Dark Mode'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_THEME' });
  });
});