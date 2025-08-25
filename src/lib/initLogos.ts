import { LogoService } from './logoService';

// Initialize the logos system with default data
export async function initializeLogos() {
  try {
    await LogoService.seedDefaultLogos();
    console.log('Logos system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize logos system:', error);
  }
}

// Call this function once when the app starts
initializeLogos();