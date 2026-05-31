import { render, screen, act } from '@testing-library/react';
import { Settings } from './Settings';

vi.mock('../services/oauth', () => ({
  oauthService: {
    getConnections: vi.fn().mockResolvedValue({
      facebook: false,
      instagram: false,
      linkedin: false,
      twitter: false
    })
  }
}));

vi.mock('../services/api', () => ({
  api: {
    getBrandVoice: vi.fn().mockResolvedValue('Mocked Voice')
  }
}));

describe('Settings Component', () => {
  it('renders the AI Persona textarea', async () => {
    await act(async () => {
      render(<Settings setNotification={vi.fn()} />);
    });
    expect(screen.getByText('AI Persona & Brand Voice')).toBeInTheDocument();
  });
});
