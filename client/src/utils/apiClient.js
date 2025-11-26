/**
 * API Client with Dual Mode
 * Switches between real backend API and simulated API (localStorage)
 * Set VITE_USE_REAL_API=true in .env.local to use real API
 * Set VITE_USE_REAL_API=false to use simulated API (default)
 */

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const FAKE_API_DELAY = parseInt(import.meta.env.VITE_FAKE_API_DELAY || '300')

console.log('🔧 API Mode:', USE_REAL_API ? '🌐 Real Backend' : '💾 Simulated (localStorage)')
console.log('   API URL:', API_URL)
console.log('   Fake Delay:', FAKE_API_DELAY + 'ms')

/**
 * Simulate network delay
 */
const simulateNetworkDelay = (ms = FAKE_API_DELAY) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Log API activity
 */
const logAPI = (method, endpoint, data = null) => {
    const timestamp = new Date().toLocaleTimeString()
    if (USE_REAL_API) {
        console.log(`📡 [${timestamp}] ${method} ${endpoint}`, data ? data : '')
    } else {
        console.log(`💾 [${timestamp}] (Simulated) ${method} ${endpoint}`, data ? data : '')
    }
}

/**
 * Get all jobs
 */
export const apiGetJobs = async () => {
    logAPI('GET', '/jobs')

    if (USE_REAL_API) {
        try {
            const response = await fetch(`${API_URL}/jobs`)
            if (!response.ok) throw new Error('Failed to fetch jobs')
            const data = await response.json()
            console.log('✓ Jobs received:', data.length)
            return data
        } catch (error) {
            console.error('❌ Error fetching jobs:', error)
            throw error
        }
    } else {
        // Simulated API with localStorage + static data
        await simulateNetworkDelay()
        
        // Import static jobs from assets
        const { jobsData } = await import('../assets/assets.js')
        
        // Get recruiter jobs from localStorage
        const recruiterJobs = JSON.parse(localStorage.getItem('recruiterJobs') || '[]')
        
        // Combine both
        const allJobs = [...jobsData, ...recruiterJobs]
        console.log('✓ Jobs loaded:', allJobs.length, '(static:', jobsData.length, '+ recruiter:', recruiterJobs.length + ')')
        return allJobs
    }
}

/**
 * Get all applications
 */
export const apiGetApplications = async () => {
    logAPI('GET', '/applications')

    if (USE_REAL_API) {
        try {
            const response = await fetch(`${API_URL}/applications`)
            if (!response.ok) throw new Error('Failed to fetch applications')
            const data = await response.json()
            console.log('✓ Applications received:', data.length)
            return data
        } catch (error) {
            console.error('❌ Error fetching applications:', error)
            throw error
        }
    } else {
        // Simulated API with localStorage
        await simulateNetworkDelay()
        const apps = JSON.parse(localStorage.getItem('jobApplications') || '[]')
        console.log('✓ Applications loaded from localStorage:', apps.length)
        return apps
    }
}

/**
 * Create new application
 */
export const apiCreateApplication = async (appData) => {
    logAPI('POST', '/applications', appData)

    if (USE_REAL_API) {
        try {
            const response = await fetch(`${API_URL}/applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appData)
            })
            if (!response.ok) throw new Error('Failed to create application')
            const data = await response.json()
            console.log('✓ Application created:', data.application?._id)
            return data.application
        } catch (error) {
            console.error('❌ Error creating application:', error)
            throw error
        }
    } else {
        // Simulated API with localStorage
        await simulateNetworkDelay()

        // Check for duplicates
        const apps = JSON.parse(localStorage.getItem('jobApplications') || '[]')
        const alreadyExists = apps.some(
            app => app.jobId === appData.jobId && app.applicantEmail === appData.applicantEmail
        )

        if (alreadyExists) {
            console.error('❌ Duplicate application detected')
            throw new Error('Already applied for this job')
        }

        // Create new application
        const newApp = {
            _id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...appData,
            status: appData.status || 'Pending',
            createdAt: new Date().toISOString()
        }

        apps.push(newApp)
        localStorage.setItem('jobApplications', JSON.stringify(apps))
        console.log('✓ Application saved to localStorage:', newApp._id)
        return newApp
    }
}

/**
 * Update application
 */
export const apiUpdateApplication = async (id, updateData) => {
    logAPI('PUT', `/applications/${id}`, updateData)

    if (USE_REAL_API) {
        try {
            const response = await fetch(`${API_URL}/applications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            })
            if (!response.ok) throw new Error('Failed to update application')
            const data = await response.json()
            console.log('✓ Application updated:', id)
            return data.application
        } catch (error) {
            console.error('❌ Error updating application:', error)
            throw error
        }
    } else {
        // Simulated API with localStorage
        await simulateNetworkDelay()

        const apps = JSON.parse(localStorage.getItem('jobApplications') || '[]')
        const index = apps.findIndex(app => app._id === id)

        if (index === -1) {
            console.error('❌ Application not found:', id)
            throw new Error('Application not found')
        }

        apps[index] = {
            ...apps[index],
            ...updateData,
            updatedAt: new Date().toISOString()
        }

        localStorage.setItem('jobApplications', JSON.stringify(apps))
        console.log('✓ Application updated in localStorage:', id)
        return apps[index]
    }
}

/**
 * Delete application
 */
export const apiDeleteApplication = async (id) => {
    logAPI('DELETE', `/applications/${id}`)

    if (USE_REAL_API) {
        try {
            const response = await fetch(`${API_URL}/applications/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete application')
            console.log('✓ Application deleted:', id)
            return true
        } catch (error) {
            console.error('❌ Error deleting application:', error)
            throw error
        }
    } else {
        // Simulated API with localStorage
        await simulateNetworkDelay()

        const apps = JSON.parse(localStorage.getItem('jobApplications') || '[]')
        const index = apps.findIndex(app => app._id === id)

        if (index === -1) {
            console.error('❌ Application not found:', id)
            throw new Error('Application not found')
        }

        apps.splice(index, 1)
        localStorage.setItem('jobApplications', JSON.stringify(apps))
        console.log('✓ Application deleted from localStorage:', id)
        return true
    }
}

export default {
    apiGetJobs,
    apiGetApplications,
    apiCreateApplication,
    apiUpdateApplication,
    apiDeleteApplication,
    USE_REAL_API,
    API_URL
}
