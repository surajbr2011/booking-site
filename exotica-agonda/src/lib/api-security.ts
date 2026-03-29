import { NextResponse } from 'next/server';

/**
 * Basic security headers and input sanitization middleware layer.
 * This can be composed with our `withErrorHandler`.
 * 
 * NOTE: For full Next.js security, configure headers in next.config.js as well.
 */
export function withSecurity(handler: Function) {
    return async (request: Request, ...args: any[]) => {
        // 1. Basic Content-Type check for POST/PUT/PATCH methods
        if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
            const contentType = request.headers.get('content-type') || '';
            if (!contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
                return NextResponse.json({ error: 'Unsupported Media Type' }, { status: 415 });
            }
        }

        // 2. We can add additional sanitization helpers here or 
        // rely heavily on Zod schemas (like we did in /api/bookings) which is the absolute best practice
        // for deep input sanitization in TypeScript apps.

        // 3. Execute Handler
        const response = await handler(request, ...args);

        // Ensure response is actually a NextResponse instance before appending headers,
        // though Next.js usually handles standard Response objects fine.
        if (response instanceof NextResponse || response instanceof Response) {
            // 4. Inject Security Headers dynamically on API responses
            response.headers.set('X-XSS-Protection', '1; mode=block');
            response.headers.set('X-Frame-Options', 'DENY');
            response.headers.set('X-Content-Type-Options', 'nosniff');
            response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        }

        return response;
    };
}
