export const publishToInstagram = async (content: string, mockToken: string): Promise<boolean> => {
  console.log(`[Instagram API] Publishing via token ${mockToken}: ${content}`);
  // TODO: Replace with actual Instagram Graph API fetch request
  return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};
