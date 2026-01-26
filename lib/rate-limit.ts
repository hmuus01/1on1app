/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export interface RateLimitConfig {
  interval: number; // in milliseconds
  maxRequests: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}

export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.lastReset > config.interval) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.interval
    };
  }

  if (record.count >= config.maxRequests) {
    const resetIn = config.interval - (now - record.lastReset);
    return {
      success: false,
      remaining: 0,
      resetIn
    };
  }

  record.count++;
  return {
    success: true,
    remaining: config.maxRequests - record.count,
    resetIn: config.interval - (now - record.lastReset)
  };
}

export function getClientIdentifier(request?: Request): string {
  if (!request) {
    return "unknown";
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

// Pre-configured rate limiters
export const authRateLimits = {
  login: { interval: 60 * 1000, maxRequests: 5 }, // 5 attempts per minute
  signup: { interval: 60 * 1000, maxRequests: 3 }, // 3 attempts per minute
  passwordReset: { interval: 60 * 1000, maxRequests: 3 }, // 3 attempts per minute
};

export function formatResetTime(resetIn: number): string {
  const seconds = Math.ceil(resetIn / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
}
