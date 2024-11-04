import type { Request, Response } from 'express';
import { type ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response, _next: (err?: Error) => any) {
    // Customize the error response
    const { name, message, errors } = error;

    // Do not include 'stack' property in the response to the client
    res
      .status(error.httpCode || 500)
      .json({ name, message, errors });
  }
}
