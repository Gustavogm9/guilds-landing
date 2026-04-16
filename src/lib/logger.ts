/**
 * Structured Logger Utility
 * 
 * Centralizes logging with structured output, levels, and context.
 * Ready for future integration with external services (Sentry, LogRocket, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    component?: string;
    action?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: Error;
}

// Environment check
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Log level colors for development console
const levelColors: Record<LogLevel, string> = {
    debug: '#8B8B8B',
    info: '#2196F3',
    warn: '#FF9800',
    error: '#F44336',
};

const levelEmojis: Record<LogLevel, string> = {
    debug: '🔍',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
};

/**
 * Format log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
    const parts = [entry.timestamp];

    if (entry.context?.component) {
        parts.push(`[${entry.context.component}]`);
    }

    if (entry.context?.action) {
        parts.push(`(${entry.context.action})`);
    }

    parts.push(entry.message);

    return parts.join(' ');
}

/**
 * Send log to external service (placeholder for future integration)
 * Uncomment and configure when integrating with Sentry, LogRocket, etc.
 */
// async function sendToExternalService(entry: LogEntry): Promise<void> {
//   if (entry.level === 'error') {
//     // Example: Sentry.captureException(entry.error || new Error(entry.message));
//   }
// }

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    // Skip debug logs in production
    if (level === 'debug' && isProduction) {
        return;
    }

    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        context,
        error,
    };

    const formattedMessage = formatLogEntry(entry);

    if (isDevelopment) {
        // Development: colorful console output
        const color = levelColors[level];
        const emoji = levelEmojis[level];

        const styles = `color: ${color}; font-weight: bold;`;

        switch (level) {
            case 'debug':
                console.log(`%c${emoji} [DEBUG] ${formattedMessage}`, styles, context?.metadata || '');
                break;
            case 'info':
                console.info(`%c${emoji} [INFO] ${formattedMessage}`, styles, context?.metadata || '');
                break;
            case 'warn':
                console.warn(`%c${emoji} [WARN] ${formattedMessage}`, styles, context?.metadata || '');
                break;
            case 'error':
                console.error(`%c${emoji} [ERROR] ${formattedMessage}`, styles, error || context?.metadata || '');
                break;
        }
    } else {
        // Production: structured JSON output for external services
        const logObject = {
            ...entry,
            error: error ? { message: error.message, stack: error.stack } : undefined,
        };

        switch (level) {
            case 'info':
                console.info(JSON.stringify(logObject));
                break;
            case 'warn':
                console.warn(JSON.stringify(logObject));
                break;
            case 'error':
                console.error(JSON.stringify(logObject));
                // Future: sendToExternalService(entry);
                break;
        }
    }
}

/**
 * Logger API
 */
export const logger = {
    /**
     * Debug level - development only, stripped in production
     */
    debug: (message: string, context?: LogContext) => {
        log('debug', message, context);
    },

    /**
     * Info level - general information
     */
    info: (message: string, context?: LogContext) => {
        log('info', message, context);
    },

    /**
     * Warn level - potential issues
     */
    warn: (message: string, context?: LogContext) => {
        log('warn', message, context);
    },

    /**
     * Error level - errors and exceptions
     */
    error: (error: Error | string, context?: LogContext) => {
        const errorObj = typeof error === 'string' ? new Error(error) : error;
        log('error', errorObj.message, context, errorObj);
    },

    /**
     * Create a scoped logger for a specific component
     */
    scope: (component: string) => ({
        debug: (message: string, context?: Omit<LogContext, 'component'>) =>
            logger.debug(message, { ...context, component }),
        info: (message: string, context?: Omit<LogContext, 'component'>) =>
            logger.info(message, { ...context, component }),
        warn: (message: string, context?: Omit<LogContext, 'component'>) =>
            logger.warn(message, { ...context, component }),
        error: (error: Error | string, context?: Omit<LogContext, 'component'>) =>
            logger.error(error, { ...context, component }),
    }),
};

export type { LogContext, LogLevel, LogEntry };
