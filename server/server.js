import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node"
import clerkWebhooks from "./controllers/webhooks.js"
import serverless from 'serverless-http'

// Initialize Express
const app = express()

// Connect to database
await connectDB()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => res.send("API Working"))
app.get("/debug-sentry", (req, res) => {
    throw new Error("My first Sentry error!")
})
app.post('/webhooks', clerkWebhooks)

Sentry.setupExpressErrorHandler(app)

// Port
const PORT = process.env.PORT || 5000

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

// Export for Vercel serverless
export default serverless(app)