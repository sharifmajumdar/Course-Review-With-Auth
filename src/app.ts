import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

// Routes
app.use('/api', router);

// Test
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Sharif!');
});

// Golbal error handler
app.use(globalErrorHandler);

// Not found API
app.use(notFound);

export default app;
