import axios from 'axios';

export const publishToLinkedIn = async (content: string, accessToken: string): Promise<boolean> => {
  console.log(`[LinkedIn API] Attempting to publish...`);

  if (accessToken === 'mock-token' || !accessToken) {
    console.warn("[LinkedIn API] Using mock token. Falling back to mock implementation.");
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }

  try {
    // 1. Fetch the user's URN (Person ID)
    const meRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    const personUrn = `urn:li:person:${meRes.data.sub}`;

    // 2. Publish UGC Post
    const payload = {
        author: personUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
            "com.linkedin.ugc.ShareContent": {
                shareCommentary: {
                    text: content
                },
                shareMediaCategory: "NONE"
            }
        },
        visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    };

    const publishRes = await axios.post('https://api.linkedin.com/v2/ugcPosts', payload, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json'
        }
    });

    console.log(`[LinkedIn API] Successfully published post URN: ${publishRes.data.id}`);
    return true;
  } catch (error: any) {
    console.error("[LinkedIn API] Error publishing to LinkedIn:", error?.response?.data || error.message);
    return false;
  }
};
