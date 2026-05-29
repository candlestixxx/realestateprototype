export const publishToTwitter = async (content: string, mockToken: string): Promise<boolean> => {
  console.log(`[Twitter API] Publishing via token ${mockToken}: ${content}`);
  // TODO: Replace with actual Twitter v2 API fetch request
  return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};
