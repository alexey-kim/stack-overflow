import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { ExpressMiddlewareInterface } from 'routing-controllers';
import { type Config, getConfig } from '../config';

export class jwtMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    const authHeader: string | undefined = req.headers['authorization'];

    if (authHeader?.startsWith('Bearer ')) {
      const config: Config = getConfig();

      const jwtToken: string = authHeader.split(' ')[1];

      try {
        // Attach userId to the current request
        const payload = jwt.verify(jwtToken, config.JWT_SECRET) as { userId: number; };
        (req as any).userId = payload.userId;

        next();
      } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
      }
    } else {
      res.status(401).json({ message: 'No token provided' });
    }
  }
}
