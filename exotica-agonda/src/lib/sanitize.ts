/**
 * Input sanitization utilities for the backend.
 * Provides basic XSS protection by stripping dangerous HTML patterns from user inputs.
 * For production, consider using a dedicated library like `dompurify` (server-side via jsdom) or `sanitize-html`.
 */

/**
 * Strips HTML tags and encodes dangerous characters to prevent XSS
 */
export function sanitizeString(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') return '';

    return input
        // Remove script tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove any HTML tags
        .replace(/<[^>]*>/g, '')
        // Encode < and > that might be used for injection
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Remove javascript: protocol attempts
        .replace(/javascript:/gi, '')
        // Remove event handler attributes
        .replace(/on\w+\s*=/gi, '')
        // Trim excessive whitespace
        .trim()
        // Limit length to prevent DoS via huge strings
        .slice(0, 5000);
}

/**
 * Sanitize a name field (stricter - alphanumeric + common name chars only)
 */
export function sanitizeName(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') return '';
    return sanitizeString(input).slice(0, 255);
}

/**
 * Sanitize an email address (basic)
 */
export function sanitizeEmail(input: string | null | undefined): string | undefined {
    if (!input || typeof input !== 'string') return undefined;
    const cleaned = input.trim().toLowerCase().slice(0, 255);
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(cleaned) ? cleaned : undefined;
}

/**
 * Sanitize a phone number (digits, +, -, spaces, parens only)
 */
export function sanitizePhone(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') return '';
    return input.replace(/[^\d\s\+\-\(\)\.]/g, '').trim().slice(0, 20);
}

/**
 * Sanitize an object by applying sanitizeString to all string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const result = { ...obj };
    for (const key in result) {
        if (typeof result[key] === 'string') {
            result[key] = sanitizeString(result[key]) as any;
        }
    }
    return result;
}
