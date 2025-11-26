import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// Import database modules
import DB from './db/index.js'
import * as jobsDB from './db/jobs.js'
import * as applicationsDB from './db/applications.js'
import * as usersDB from './db/users.js'

// Initialize Express
const app = express()

// Middlewares
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize database
await DB.initializeDatabase()

// Routes

// Health check
app.get('/', (req, res) => {
    res.json({ message: "API Working", status: "ok" })
})

// GET /api/jobs - Get all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await jobsDB.getAllJobs()
        res.json(jobs)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await usersDB.getAllUsers()
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// GET /api/applications - Get all applications
app.get('/api/applications', async (req, res) => {
    try {
        const applications = await applicationsDB.getAllApplications()
        res.json(applications)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// POST /api/applications - Create new application
app.post('/api/applications', async (req, res) => {
    try {
        const newApplication = req.body

        // Validate required fields
        if (!newApplication.jobId || !newApplication.applicantEmail) {
            return res.status(400).json({ 
                error: "Missing required fields: jobId, applicantEmail" 
            })
        }

        const application = await applicationsDB.createApplication(newApplication)

        res.status(201).json({
            message: "Application created successfully",
            application
        })
    } catch (error) {
        console.error('POST /api/applications error:', error.message)
        res.status(400).json({ error: error.message })
    }
})

// DELETE /api/applications/:id - Delete application
app.delete('/api/applications/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await applicationsDB.deleteApplication(id)

        if (!deleted) {
            return res.status(404).json({ error: "Application not found" })
        }

        res.json({ message: "Application deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// PUT /api/applications/:id - Update application
app.put('/api/applications/:id', async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body

        const application = await applicationsDB.updateApplication(id, updateData)

        if (!application) {
            return res.status(404).json({ error: "Application not found" })
        }

        res.json({
            message: "Application updated successfully",
            application
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Port
const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Database initialized with modules: jobs, applications, users`)
})

export default app