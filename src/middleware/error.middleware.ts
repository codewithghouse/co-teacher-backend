
import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("CRITICAL ERROR:", err);

    const statusCode = err.status || 500;
    const message = err.message || "An unexpected error occurred in the system.";

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
