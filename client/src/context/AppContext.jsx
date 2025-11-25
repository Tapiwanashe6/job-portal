import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

const AppContext = createContext();

export default AppContext;

export const AppContextProvider = (props) => {
    const [searchFilter,setSearchFilter] = useState({
        title:'',
        location:''
    })
        
    const [isSearched,setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)

    const [applications, setApplications] = useState([])

    //function to fetch jobs
    const fetchJobs = async () => {
        setJobs(jobsData)
    }

    // Load applications from localStorage on mount
    useEffect(()=>{
        const savedApplications = localStorage.getItem('jobApplications')
        if (savedApplications) {
            setApplications(JSON.parse(savedApplications))
        }
    },[])

    // Function to apply for a job
    const applyForJob = (jobData) => {
        const application = {
            _id: Date.now().toString(), // unique id based on timestamp
            jobId: jobData._id,
            jobTitle: jobData.title,
            company: jobData.companyId.name,
            companyId: jobData.companyId._id,
            location: jobData.location,
            salary: jobData.salary,
            logo: jobData.companyId.logo,
            date: new Date().toISOString(),
            status: 'Applied' // default status
        }

        const updatedApplications = [...applications, application]
        setApplications(updatedApplications)
        localStorage.setItem('jobApplications', JSON.stringify(updatedApplications))
        return true
    }

    // Function to get all applications
    const getApplications = () => {
        return applications
    }

    useEffect(()=>{
        fetchJobs()
    },[])

    const value = {
        setSearchFilter,searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin,setShowRecruiterLogin,
        applications, setApplications,
        applyForJob, getApplications
    }
    return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
);
}


 