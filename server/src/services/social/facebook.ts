export const publishToFacebook = async (content: string, mockToken: string): Promise<boolean> => {
  console.log(`[Facebook API] Publishing via token ${mockToken}: ${content}`);
  // TODO: Replace with actual Facebook Graph API fetch request
  return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};
