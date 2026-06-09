import axios from 'axios';

export const publishToFacebook = async (content: string, accessToken: string): Promise<boolean> => {
  console.log(`[Facebook API] Attempting to publish via token prefix ${accessToken.substring(0, 10)}...`);

  if (accessToken === 'mock-token' || !accessToken) {
    console.warn("[Facebook API] Using mock token. Falling back to mock implementation.");
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }

  try {
    // 1. Fetch user pages to get the Page ID and Page Access Token
    // In a real flow, you'd likely store the selected Page ID in the DB. We'll grab the first page.
    const accountsRes = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);

    if (!accountsRes.data.data || accountsRes.data.data.length === 0) {
        console.error("[Facebook API] No Facebook Pages found for this user.");
        return false;
    }

    const pageId = accountsRes.data.data[0].id;
    const pageAccessToken = accountsRes.data.data[0].access_token;

    // 2. Publish to the Page feed
    const publishRes = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      message: content,
      access_token: pageAccessToken
    });

    console.log(`[Facebook API] Successfully published post ID: ${publishRes.data.id}`);
    return true;
  } catch (error: any) {
    console.error("[Facebook API] Error publishing to Facebook:", error?.response?.data || error.message);
    return false;
  }
};
