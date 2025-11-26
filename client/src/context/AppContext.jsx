import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import { useUser } from '@clerk/clerk-react';
import * as apiClient from '../utils/apiClient.js';

const AppContext = createContext();

export default AppContext;

export const AppContextProvider = (props) => {
    const { user } = useUser()
    const [searchFilter,setSearchFilter] = useState({
        title:'',
        location:''
    })
        
    const [isSearched,setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)

    const [recruiterData, setRecruiterData] = useState(null)

    const [applications, setApplications] = useState([])

    //function to fetch jobs from static data or api
    const fetchJobs = async () => {
        try {
            const apiJobs = await apiClient.apiGetJobs()
            setJobs(apiJobs)
        } catch (error) {
            console.error('Failed to fetch jobs, using fallback:', error)
            // Fallback to static data if API fails
            setJobs(jobsData)
        }
    }

    // Clean up old applications without email on app load
    useEffect(() => {
        const savedApplications = localStorage.getItem('jobApplications')
        if (savedApplications) {
            try {
                const allApps = JSON.parse(savedApplications)
                // Remove applications that don't have applicantEmail (old data)
                const cleanedApps = allApps.filter(app => 
                    app.applicantEmail && 
                    typeof app.applicantEmail === 'string' &&
                    app.applicantEmail.includes('@')
                )
                if (cleanedApps.length !== allApps.length) {
                    console.log(`Cleaned ${allApps.length - cleanedApps.length} invalid applications from localStorage`)
                    localStorage.setItem('jobApplications', JSON.stringify(cleanedApps))
                }
            } catch (e) {
                console.error('Error cleaning applications:', e)
            }
        }
    }, [])

    // Load applications from API or localStorage on mount
    useEffect(()=>{
        const loadApplications = async () => {
            try {
                const allApps = await apiClient.apiGetApplications()
                setApplications(allApps)
            } catch (error) {
                console.error('Failed to load applications:', error)
                // Fallback to localStorage
                const savedApplications = localStorage.getItem('jobApplications')
                if (savedApplications) {
                    try {
                        setApplications(JSON.parse(savedApplications))
                    } catch (e) {
                        console.error('Error parsing localStorage:', e)
                        setApplications([])
                    }
                }
            }
        }
        
        loadApplications()
        
        // Check if recruiter is logged in
        const isRecruiterLoggedIn = localStorage.getItem('recruiterLoggedIn')
        if (isRecruiterLoggedIn === 'true') {
            const recruiter = localStorage.getItem('recruiterAccount')
            if (recruiter) {
                try {
                    setRecruiterData(JSON.parse(recruiter))
                } catch (e) {
                    console.error('Error loading recruiter data:', e)
                }
            }
        }
    },[])

    // Function to apply for a job
    const applyForJob = async (jobData) => {
        try {
            const companyName = typeof jobData.companyId === 'object' ? (jobData.companyId.name || 'Company') : jobData.companyId
            const companyId = typeof jobData.companyId === 'object' ? (jobData.companyId._id || jobData.companyId.email) : jobData.companyId
            
            const applicationData = {
                jobId: jobData._id,
                jobTitle: jobData.title,
                company: companyName,
                companyId: companyId,
                location: jobData.location,
                salary: jobData.salary,
                logo: jobData.companyId?.logo,
                date: new Date().toISOString(),
                status: 'Applied',
                applicantName: jobData.applicantName,
                applicantEmail: jobData.applicantEmail,
                resume: jobData.resume
            }

            // Use API client to create application
            const createdApp = await apiClient.apiCreateApplication(applicationData)
            
            const updatedApplications = [...applications, createdApp]
            setApplications(updatedApplications)
            
            return true
        } catch (error) {
            console.error('Error applying for job:', error)
            throw error
        }
    }

    // Function to get all applications
    const getApplications = () => {
        return applications
    }

    // Function to delete application
    const deleteApplication = async (applicationId) => {
        try {
            await apiClient.apiDeleteApplication(applicationId)
            const updatedApplications = applications.filter(app => app._id !== applicationId)
            setApplications(updatedApplications)
            return true
        } catch (error) {
            console.error('Error deleting application:', error)
            throw error
        }
    }

    // Function to update application (especially resume)
    const updateApplication = async (applicationId, updatedData) => {
        try {
            await apiClient.apiUpdateApplication(applicationId, updatedData)
            const updatedApplications = applications.map(app => 
                app._id === applicationId ? { ...app, ...updatedData } : app
            )
            setApplications(updatedApplications)
            return true
        } catch (error) {
            console.error('Error updating application:', error)
            throw error
        }
    }

    // Function to logout recruiter
    const logoutRecruiter = () => {
        localStorage.removeItem('recruiterLoggedIn')
        setRecruiterData(null)
        setShowRecruiterLogin(false)
    }

    useEffect(()=>{
        fetchJobs()
    },[])

    const value = {
        setSearchFilter,searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin,setShowRecruiterLogin,
        recruiterData, setRecruiterData,
        applications, setApplications,
        applyForJob, getApplications, deleteApplication, updateApplication,
        logoutRecruiter
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

 