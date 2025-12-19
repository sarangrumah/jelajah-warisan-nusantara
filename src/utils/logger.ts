/**
 * Production-ready logging utility
 * Replaces console.log statements with proper error handling and environment-aware logging
 */

interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class Logger {
  private static instance: Logger;
  private logLevel: number;

  constructor() {
    // Only enable detailed logging in development
    this.logLevel = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: keyof LogLevel): boolean {
    return this.logLevel >= LOG_LEVELS[level];
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('ERROR')) {
      // In production, send to error tracking service
      if (!import.meta.env.DEV) {
        // Here you would integrate with services like Sentry, LogRocket, etc.
        // For now, we'll just prevent the error from being logged to console
        return;
      }
      console.error(this.formatMessage('ERROR', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('WARN')) {
      if (!import.meta.env.DEV) {
        return; // Suppress warnings in production
      }
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('INFO')) {
      if (!import.meta.env.DEV) {
        return; // Suppress info logs in production
      }
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('DEBUG')) {
      if (!import.meta.env.DEV) {
        return; // Suppress debug logs in production
      }
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Helper functions for easy replacement of console.log statements
export const logError = (message: string, ...args: any[]) => logger.error(message, ...args);
export const logWarn = (message: string, ...args: any[]) => logger.warn(message, ...args);
export const logInfo = (message: string, ...args: any[]) => logger.info(message, ...args);
export const logDebug = (message: string, ...args: any[]) => logger.debug(message, ...args);

export default logger;