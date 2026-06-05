import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';

describe('Sidebar Component', () => {
  const defaultProps = {
    isSidebarCollapsed: false,
    setIsSidebarCollapsed: vi.fn(),
    activeTab: 'dashboard',
    setActiveTab: vi.fn(),
  };

  it('renders all navigation items', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Content Calendar')).toBeInTheDocument();
    expect(screen.getByText('Content Library')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('calls setActiveTab when a navigation item is clicked', () => {
    const mockSetActiveTab = vi.fn();
    render(<Sidebar {...defaultProps} setActiveTab={mockSetActiveTab} />);

    fireEvent.click(screen.getByText('Content Library'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('library');
  });

  it('hides text when sidebar is collapsed', () => {
    render(<Sidebar {...defaultProps} isSidebarCollapsed={true} />);

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Content Calendar')).not.toBeInTheDocument();
    // The logo abbreviation should show up instead of the full logo text
    expect(screen.getByText('L1')).toBeInTheDocument();
  });
});