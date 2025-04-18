// Local storage utility for frontend-only operation
// This replaces backend API calls with local storage operations

// Generic function to get data from local storage
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Generic function to save data to local storage
export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// Generic function to remove data from local storage
export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Get current timestamp
export function getCurrentTimestamp(): Date {
  return new Date();
}

// Mock delay to simulate network requests
export async function mockDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize default users if none exist
// This should only run on the client side
if (typeof window !== 'undefined') {
  try {
    const users = getFromStorage('users', []);
    if (users.length === 0) {
      saveToStorage('users', [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'CLIENT',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'password123',
          role: 'FREELANCER',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]);
    }
  } catch (error) {
    console.error('Error initializing users in localStorage:', error);
  }
} 