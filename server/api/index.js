import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from '../config/db.js';
import clerkWebhooks from '../controllers/webhooks.js';
import '../config/instrument.js';
import * as Sentry from '@sentry/node';

const app = express();

app.use(cors());
app.use(express.json());

// Connect to DB per request
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Routes
app.get('/', (req, res) => res.send('API Working'));
app.get('/debug=sentry', (req, res) => { throw new Error('My first Sentry error!'); });
app.post('/webhooks', clerkWebhooks);

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Export handler for Vercel
export const handler = serverless(app);
