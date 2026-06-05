import { TwitterApi } from 'twitter-api-v2';

export const publishToTwitter = async (content: string, accessToken: string): Promise<boolean> => {
  console.log(`[Twitter API] Attempting to publish: ${content}`);

  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      console.warn("[Twitter API] Missing TWITTER_API_KEY or TWITTER_API_SECRET in environment variables. Falling back to mock implementation.");
      return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }

  // Assuming the stored access token is actually a stringified JSON containing both token and secret for OAuth 1.0a,
  // or a Bearer token for OAuth 2.0. We will parse it if it looks like JSON.
  let tokenData = { access_token: accessToken, access_secret: '' };
  try {
      if (accessToken.startsWith('{')) {
          tokenData = JSON.parse(accessToken);
      }
  } catch (e) {
      console.error("[Twitter API] Failed to parse access token. Ensure it contains {access_token, access_secret} for v1.1 user auth.", e);
  }

  try {
    const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: tokenData.access_token,
        accessSecret: tokenData.access_secret || process.env.TWITTER_ACCESS_SECRET || '',
    });

    const v2Client = client.v2;
    const { data } = await v2Client.tweet(content);
    console.log(`[Twitter API] Successfully published tweet ID: ${data.id}`);
    return true;
  } catch (error) {
    console.error("[Twitter API] Error publishing to Twitter:", error);
    // If the error is auth related because of mock tokens, we still want to not crash the worker entirely
    return false;
  }
};
