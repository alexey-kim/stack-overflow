import type { NextFunction, Request, Response } from 'express';
import type { IncomingHttpHeaders } from 'http';
import jwt from 'jsonwebtoken';
import { getConfig } from '../config';
import { jwtMiddleware } from './Jwt.middleware';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../config');

describe('jwtMiddleware', () => {
  let req: Partial<Request> & { headers: IncomingHttpHeaders; };
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Mock config object with a secret key for JWT verification
    (getConfig as jest.Mock).mockReturnValue({ JWT_SECRET: 'test_secret' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() and attach userId to the current request when JWT token is valid', () => {
    req.headers.authorization = 'Bearer valid_token';

    // Mock JWT token verification
    (jwt.verify as jest.Mock).mockReturnValue({ userId: 123 });

    const middleware = new jwtMiddleware();
    middleware.use(req as Request, res as Response, next);

    // Check that userId is set on the request
    expect((req as any).userId).toBe(123);

    // Check that next() is called
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 403 when JWT token is invalid', () => {
    req.headers.authorization = 'Bearer invalid_token';

    // Mock an invalid JWT token verification
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid JWT token');
    });

    const middleware = new jwtMiddleware();
    middleware.use(req as Request, res as Response, next);

    // Expect a 403 response with a specific error message
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });

    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization header does not start with Bearer', () => {
    req.headers.authorization = 'Non-Bearer invalid_format';

    const middleware = new jwtMiddleware();
    middleware.use(req as Request, res as Response, next);

    // Expect a 401 response with a specific error message
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });

    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization header is missing', () => {
    const middleware = new jwtMiddleware();
    middleware.use(req as Request, res as Response, next);

    // Expect a 401 response with a specific error message
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });

    expect(next).not.toHaveBeenCalled();
  });
});
