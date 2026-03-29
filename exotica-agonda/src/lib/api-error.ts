import { NextResponse } from 'next/server';

/**
 * A Next.js API route wrapper to handle uncaught errors gracefully and standardized reporting.
 */
export function withErrorHandler(handler: (req: Request, context?: any) => Promise<NextResponse> | NextResponse) {
    return async (req: Request, context?: any) => {
        try {
            return await handler(req, context);
        } catch (error: any) {
            console.error(`[API Error] ${req.method} ${req.url}:`, error);

            const statusCode = error.statusCode || 500;
            const message = error.message || 'Internal Server Error';

            return NextResponse.json(
                { error: message, details: process.env.NODE_ENV === 'development' ? error.stack : undefined },
                { status: statusCode }
            );
        }
    };
}
