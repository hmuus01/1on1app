/**
 * Development-only logger utility
 * Only logs in development mode to keep production console clean
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (isDev) {
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },
};
