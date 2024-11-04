import type { NextFunction, Request, Response } from 'express';
import { v7 as uuidv7 } from 'uuid';
import { RequestIdKey } from './Monitoring.constants';

/** Middleware that adds a unique RequestId to each request to help with troubleshooting */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId: string = uuidv7();

  // Attach RequestId to the current request
  (req as any)[RequestIdKey] = requestId;

  // Add RequestId to response headers
  res.setHeader('X-Request-Id', requestId);

  next();
};
