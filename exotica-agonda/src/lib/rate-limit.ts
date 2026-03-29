import { NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter for API routes.
 * Can be replaced with Redis-based solution (e.g., Upstash) in production.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
    /** Max number of requests allowed within the window */
    limit: number;
    /** Window duration in milliseconds */
    windowMs: number;
    /** Custom identifier prefix (default 'api') */
    prefix?: string;
}

export function rateLimit(config: RateLimitConfig) {
    const { limit, windowMs, prefix = 'api' } = config;

    return function checkRateLimit(identifier: string): { success: boolean; remaining: number; resetTime: number } {
        const key = `${prefix}:${identifier}`;
        const now = Date.now();

        const entry = rateLimitStore.get(key);

        if (!entry || entry.resetTime < now) {
            const newEntry: RateLimitEntry = { count: 1, resetTime: now + windowMs };
            rateLimitStore.set(key, newEntry);
            return { success: true, remaining: limit - 1, resetTime: newEntry.resetTime };
        }

        if (entry.count >= limit) {
            return { success: false, remaining: 0, resetTime: entry.resetTime };
        }

        entry.count++;
        rateLimitStore.set(key, entry);
        return { success: true, remaining: limit - entry.count, resetTime: entry.resetTime };
    };
}

// Pre-configured limiters for common use cases
export const bookingRateLimit = rateLimit({ limit: 10, windowMs: 60 * 60 * 1000, prefix: 'booking' }); // 10/hour
export const contactRateLimit = rateLimit({ limit: 20, windowMs: 60 * 60 * 1000, prefix: 'contact' });  // 20/hour
export const loginRateLimit = rateLimit({ limit: 5, windowMs: 15 * 60 * 1000, prefix: 'login' });     // 5/15min
export const generalRateLimit = rateLimit({ limit: 60, windowMs: 60 * 1000, prefix: 'general' });     // 60/min

/**
 * Get client IP from request headers (works behind proxies like Vercel)
 */
export function getClientIP(request: Request): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) return forwardedFor.split(',')[0].trim();
    const realIP = request.headers.get('x-real-ip');
    if (realIP) return realIP;
    return 'unknown';
}

/**
 * Generic rate limit helper for API routes
 * @returns NextResponse if rate limit exceeded, null otherwise
 */
export async function applyRateLimit(request: Request, limit: number = 60) {
    const ip = getClientIP(request);
    const rl = rateLimit({ limit, windowMs: 60 * 1000 })(ip);
    
    if (!rl.success) {
        return NextResponse.json(
            { error: 'Too Many Requests', message: 'Please slow down. You have exceeded your request limit.' },
            { 
                status: 429, 
                headers: { 
                    'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)),
                    'X-RateLimit-Limit': String(limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(rl.resetTime)
                } 
            }
        );
    }
    return null;
}

// Periodically clean up expired entries to prevent memory leaks (every 5 minutes)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitStore.entries()) {
            if (entry.resetTime < now) rateLimitStore.delete(key);
        }
    }, 5 * 60 * 1000);
}
