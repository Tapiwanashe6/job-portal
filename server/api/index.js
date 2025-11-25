import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

// Test route that doesn't require DB
app.get('/', (req, res) => {
  try {
    res.json({ message: 'API Working' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  try {
    res.json({ status: 'OK' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default serverless(app);