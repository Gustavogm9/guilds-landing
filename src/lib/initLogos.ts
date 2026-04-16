import { LogoService } from './logoService';
import { logger } from './logger';

const log = logger.scope('initLogos');

// Initialize the logos system with default data
export async function initializeLogos() {
  try {
    await LogoService.seedDefaultLogos();
    log.info('Logos system initialized successfully');
  } catch (error) {
    log.error('Failed to initialize logos system', { metadata: { error } });
  }
}

// Call this function once when the app starts
initializeLogos();