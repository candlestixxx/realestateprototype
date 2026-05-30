import { render, screen, fireEvent } from '@testing-library/react';
import { InstructionsModal } from './InstructionsModal';

describe('InstructionsModal Component', () => {
  it('does not render when showInstructions is false', () => {
    render(
      <InstructionsModal
        showInstructions={false}
        dontShowAgain={false}
        setDontShowAgain={vi.fn()}
        handleCloseInstructions={vi.fn()}
      />
    );

    expect(screen.queryByText('Welcome to AI Content Planner')).not.toBeInTheDocument();
  });

  it('renders correctly when showInstructions is true', () => {
    render(
      <InstructionsModal
        showInstructions={true}
        dontShowAgain={false}
        setDontShowAgain={vi.fn()}
        handleCloseInstructions={vi.fn()}
      />
    );

    expect(screen.getByText('Welcome to AI Content Planner')).toBeInTheDocument();
    expect(screen.getByText("Don't show this again")).toBeInTheDocument();
  });

  it('calls handleCloseInstructions when Got it button is clicked', () => {
    const mockClose = vi.fn();
    render(
      <InstructionsModal
        showInstructions={true}
        dontShowAgain={true}
        setDontShowAgain={vi.fn()}
        handleCloseInstructions={mockClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: "Got it, Let's go!" }));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});