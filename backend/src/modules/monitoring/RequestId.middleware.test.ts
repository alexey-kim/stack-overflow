import express from 'express';
import request from 'supertest';
import { RequestIdKey } from './Monitoring.constants';
import { requestIdMiddleware } from './RequestId.middleware';

const createApp = () => {
  const app = express();
  app.use(requestIdMiddleware); // Use the request ID middleware

  app.get('/test', (req, res) => {
    res.json({ requestId: (req as any)[RequestIdKey] }); // Return the requestId in the response
  });

  return app;
};

describe('requestIdMiddleware', () => {
  it('should generate a unique request ID and add it to response headers', async () => {
    const app = createApp();

    const response = await request(app).get('/test');

    // Check if the response has X-Request-Id header
    expect(response.headers['x-request-id']).toBeDefined();

    // Check if the request ID in the response matches the one in the request object
    expect(response.body.requestId).toBe(response.headers['x-request-id']);
  });

  it('should generate different request IDs for different requests', async () => {
    const app = createApp();

    const response1 = await request(app).get('/test');
    const response2 = await request(app).get('/test');

    // Ensure that the request IDs are unique
    expect(response1.headers['x-request-id']).not.toEqual(response2.headers['x-request-id']);
    expect(response1.body.requestId).not.toEqual(response2.body.requestId);
  });
});
