import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { documentsRouter } from './routes/documents';
import { templatesRouter } from './routes/templates';
import { recordsRouter } from './routes/records';
import { orgRouter } from './routes/org';
import { webhooksRouter } from './routes/webhooks';
import { billingRouter } from './routes/billing';
import { handlePaystackWebhook } from './routes/paystack-webhook';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './lib/logger';
import { startWorker } from './services/worker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Paystack webhook — standard JSON body, verified via HMAC-SHA512
app.post('/api/webhooks/paystack', express.json(), handlePaystackWebhook);

app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down.' },
});
app.use('/api/', limiter);

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/records', recordsRouter);
app.use('/api/org', orgRouter);
app.use('/api/billing', billingRouter);
app.use('/api/webhooks', webhooksRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`FormIQ API running on port ${PORT}`);
  startWorker();
});

export default app;
