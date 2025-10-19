/**
 * Structured logging utility for production-grade observability
 * Supports request tracking, performance monitoring, and error correlation
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  requestId?: string;
  userId?: string;
  path?: string;
  method?: string;
  duration?: number;
  statusCode?: number;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...context,
    };

    if (this.isDevelopment) {
      // Pretty print for development
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${
        context ? JSON.stringify(context, null, 2) : ''
      }`;
    }

    // JSON for production (structured logging for log aggregators)
    return JSON.stringify(logEntry);
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, context?: LogContext): void {
    console.error(this.formatMessage('error', message, context));
  }

  // Specialized method for HTTP requests
  http(context: LogContext): void {
    const level = context.statusCode && context.statusCode >= 400 ? 'warn' : 'info';
    const message = `${context.method} ${context.path} ${context.statusCode} ${context.duration}ms`;

    if (level === 'warn') {
      this.warn(message, context);
    } else {
      this.info(message, context);
    }

    // Alert on slow queries (> 1000ms)
    if (context.duration && context.duration > 1000) {
      this.warn('Slow request detected', {
        ...context,
        alert: 'SLOW_REQUEST',
      });
    }
  }
}

export const logger = new Logger();

// Generate unique request ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
