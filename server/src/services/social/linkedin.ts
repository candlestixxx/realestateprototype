export const publishToLinkedIn = async (content: string, mockToken: string): Promise<boolean> => {
  console.log(`[LinkedIn API] Publishing via token ${mockToken}: ${content}`);
  // TODO: Replace with actual LinkedIn Rest API fetch request
  return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};
