import 'reflect-metadata';

import compression from 'compression';
import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { useExpressServer } from 'routing-controllers';
import swaggerUi from 'swagger-ui-express';
import { type Config, getConfig } from './modules/config';
import { AppDataSource } from './modules/database';
import { ErrorHandler } from './modules/errors';
import { MorganLoggingFormat, RequestIdKey, requestIdMiddleware } from './modules/monitoring';
import { getSwaggerSpec, SwaggerPathV1 } from './modules/swagger';
import { seedData } from './tests';

AppDataSource
  .initialize()
  .then(() => {
    console.log('[server] Data source has been initialized');

    const config: Config = getConfig();

    /** Express.js application */
    const app: Express = express();

    // Middleware that adds a unique RequestId to each request to help with troubleshooting
    app.use(requestIdMiddleware);

    // Middleware for logging
    // Include RequestId into log messages
    morgan.token(RequestIdKey, (req: Request) => (req as any)[RequestIdKey]);
    app.use(morgan(MorganLoggingFormat));

    // Middleware for securing response headers
    app.use(helmet());

    // Middleware for rate limiting
    app.use(rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 100, // Limit each IP to 100 requests per minute
    }));

    // Middleware for CORS
    app.use(cors());

    // Middleware for compressing the response
    app.use(compression());

    const controllersV1: Function[] | string[] = [__dirname + `/api/v1/**/*.controller.${config.FILE_EXT}`];

    const allControllers: Function[] | string[] = controllersV1;

    useExpressServer(app, {
      controllers: allControllers,
      middlewares: [ErrorHandler],
      defaultErrorHandler: false,
    });

    /** Swagger specification for API v1 */
    const swaggerSpecV1 = getSwaggerSpec({ version: 'v1', controllers: controllersV1 });
    app.use(SwaggerPathV1, swaggerUi.serve, swaggerUi.setup(swaggerSpecV1));

    // API status endpoint
    app.get('/', (_req: Request, res: Response) => {
      res.json({ running: true, versions: ['v1'] });
    });

    // API health endpoint
    app.get('/health', (_req: Request, res: Response) => {
      res.send('OK');
    });

    // For test purposes only
    // API endpoint to seed data if database is empty
    if (config.NODE_ENV === 'development') {
      app.get('/seed-data', async (_req: Request, res: Response) => {
        try {
          await seedData();
          res.send('Seeding of data is complete');
        } catch (error) {
          res.status(500).send('Error during seeding of data');
        }
      });
    }

    const host: string = config.HOST;
    const port: number = config.PORT;

    // Start the server on the configured port
    app.listen(port, () => {
      console.log(`[server] Server is running on http://${host}:${port}`);
      console.log(`[server] Swagger (v1) is running on http://${host}:${port}${SwaggerPathV1}`);
    });
  })
  .catch((error) => {
    console.error('[server] Data source initialization error:', error);
  });
