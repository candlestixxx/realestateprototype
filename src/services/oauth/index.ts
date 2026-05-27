/**
 * Simulates a network delay for OAuth handshakes.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

export interface OAuthConnectionState {
  facebook: boolean;
  instagram: boolean;
  linkedin: boolean;
  twitter: boolean;
}

const OAUTH_STORAGE_KEY = 'legacy_oauth_connections';

export const oauthService = {
  /**
   * Fetches the current connection status from localStorage.
   */
  getConnections: (): OAuthConnectionState => {
    const saved = localStorage.getItem(OAUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse oauth connections", e);
      }
    }
    return {
      facebook: false,
      instagram: false,
      linkedin: false,
      twitter: false
    };
  },

  /**
   * Simulates the OAuth connection flow (redirect to provider, token exchange, save to DB).
   */
  connectPlatform: async (platform: SocialPlatform): Promise<boolean> => {
    // Simulate OAuth redirect and token exchange latency
    await delay(1500);

    const connections = oauthService.getConnections();
    connections[platform] = true;
    localStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(connections));

    return true;
  },

  /**
   * Simulates revoking a token and disconnecting a platform.
   */
  disconnectPlatform: async (platform: SocialPlatform): Promise<boolean> => {
    // Simulate revocation request to provider
    await delay(800);

    const connections = oauthService.getConnections();
    connections[platform] = false;
    localStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(connections));

    return true;
  }
};