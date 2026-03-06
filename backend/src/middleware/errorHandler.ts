import type { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  const status = (err as any).status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

/**
 * Request validation middleware
 */
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        message: 'Validation error',
        details: error.details.map((d: any) => d.message),
      });
      return;
    }

    next();
  };
};

/**
 * 404 handler middleware
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
  });
};
