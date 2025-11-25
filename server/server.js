import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node"
import clerkWebhooks from "./controllers/webhooks.js"

// Initialize Express
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Connect to database with error handling
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }
  next();
});

// Routes
app.get('/', (req, res) => res.send("API Working"))
app.get("/debug-sentry", (req, res) => {
    throw new Error("My first Sentry error!")
})
app.post('/webhooks', clerkWebhooks)

Sentry.setupExpressErrorHandler(app)

// Port
const PORT = process.env.PORT || 5000

// Start server for local development only
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})