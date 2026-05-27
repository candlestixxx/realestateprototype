import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from './Login';

describe('Login Component', () => {
  it('renders the login form', () => {
    const mockOnLoginSuccess = vi.fn();
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByText('Universal AI Content Engine')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('displays an error if email is not provided', () => {
    const mockOnLoginSuccess = vi.fn();
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(submitButton);

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });
});