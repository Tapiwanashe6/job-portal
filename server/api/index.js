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

// Initialize DB connection once
let dbConnected = false;

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      // Continue anyway to avoid crashing - some routes may not need DB
    }
  }
  next();
});

// Routes
app.get('/', (req, res) => res.send('API Working'));
app.get('/debug-sentry', (req, res) => { 
  throw new Error('My first Sentry error!'); 
});
app.post('/webhooks', clerkWebhooks);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  Sentry.captureException(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Export handler for Vercel
export const handler = serverless(app);