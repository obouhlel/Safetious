export const generateId = () => crypto.randomUUID();

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
