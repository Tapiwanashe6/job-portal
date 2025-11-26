import React, { useEffect, useState, useContext } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import AppContext from '../context/AppContext';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import ApplyModal from '../components/ApplyModal';
import { assets } from '../assets/assets';
import kconvert from 'k-convert'
import moment from 'moment/moment';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';

function ApplyJob() {

    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useUser()
    const { openSignIn } = useClerk()

    const [JobData, setJobData] = useState(null)
    const [isApplied, setIsApplied] = useState(false)
    const [showApplyModal, setShowApplyModal] = useState(false)

    const {jobs, applyForJob, applications, recruiterData} = useContext(AppContext)

    const fetchJob = async () => {
        // First check in context jobs
        const data = jobs.filter(job => job._id === id)
        if (data.length !== 0){
            setJobData(data[0])
            console.log(data[0])
            return
        }
        
        // Then check in recruiter jobs from localStorage
        const recruiterJobsStr = localStorage.getItem('recruiterJobs')
        if (recruiterJobsStr) {
            const recruiterJobs = JSON.parse(recruiterJobsStr)
            const recruiterJob = recruiterJobs.find(job => job._id === id)
            if (recruiterJob) {
                setJobData(recruiterJob)
                console.log(recruiterJob)
            }
        }
    }

    useEffect(()=>{
        fetchJob()
    },[id, jobs])

    // Check if user has already applied for this job
    useEffect(()=>{
        if (user) {
            const hasApplied = applications.some(app => 
                app.jobId === id && 
                app.applicantEmail && 
                app.applicantEmail === user.primaryEmailAddress?.emailAddress
            )
            setIsApplied(hasApplied)
        } else if (recruiterData) {
            // Check if recruiter has already applied
            const hasApplied = applications.some(app => 
                app.jobId === id && 
                app.applicantEmail && 
                app.applicantEmail === recruiterData.email
            )
            setIsApplied(hasApplied)
        } else {
            setIsApplied(false)
        }
    },[applications, id, user, recruiterData])

    const handleApply = () => {
        if (!user && !recruiterData) {
            openSignIn()
            return;
        }
        
        if (isApplied) {
            alert('You have already applied for this job');
            return;
        }
        setShowApplyModal(true)
    }

    const handleApplySuccess = () => {
        setIsApplied(true)
    }

    const renderDescription = () => {
        if (typeof JobData.description === 'string') {
            return JobData.description
        } else if (JobData.description?.ops) {
            // Convert Quill delta to HTML
            let html = ''
            JobData.description.ops.forEach(op => {
                if (op.insert) {
                    const text = op.insert.replace(/\n/g, '<br/>')
                    if (op.attributes?.bold) {
                        html += `<strong>${text}</strong>`
                    } else if (op.attributes?.italic) {
                        html += `<em>${text}</em>`
                    } else {
                        html += text
                    }
                }
            })
            return html
        }
        return 'No description available'
    }

    const getMoreJobs = () => {
        if (!JobData) return []
        
        const companyIdValue = typeof JobData.companyId === 'object' ? JobData.companyId._id : JobData.companyId
        const companyName = typeof JobData.companyId === 'object' ? JobData.companyId.name : JobData.companyId
        const companyEmail = typeof JobData.companyId === 'object' ? JobData.companyId.email : null
        
        // Get more jobs from context
        let moreJobs = jobs.filter(job => 
            job._id !== JobData._id && 
            (typeof job.companyId === 'object' ? job.companyId._id === companyIdValue : job.companyId === companyName)
        )
        
        // Get more jobs from localStorage recruiter jobs
        const recruiterJobsStr = localStorage.getItem('recruiterJobs')
        if (recruiterJobsStr) {
            const recruiterJobs = JSON.parse(recruiterJobsStr)
            const recruiterMoreJobs = recruiterJobs.filter(job => 
                job._id !== JobData._id && 
                (typeof job.companyId === 'object' 
                    ? (job.companyId.name === companyName || job.companyId.email === companyEmail)
                    : job.companyId === companyName)
            )
            moreJobs = [...moreJobs, ...recruiterMoreJobs]
        }
        
        return moreJobs.slice(0, 4)
    }

    const getCompanyName = () => {
        if (!JobData) return 'Company'
        
        // Handle different companyId formats
        if (typeof JobData.companyId === 'object' && JobData.companyId) {
            return JobData.companyId.name || JobData.companyId.email || localStorage.getItem('recruiterCompanyName') || 'Company'
        }
        
        return JobData.companyId || localStorage.getItem('recruiterCompanyName') || 'Company'
    }

    return JobData ?(
        <>
            <Navbar />
            {showApplyModal && (
                <ApplyModal 
                    job={JobData} 
                    onClose={() => setShowApplyModal(false)}
                    onApplySuccess={handleApplySuccess}
                    jobId={id}
                />
            )}

            <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
                <div className='bg-white text-black rounded-lg w-full'>
                    <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 bg-sky-50 border-sky-400 rounded-xl'>
                        <div className='flex flex-col md:flex-row items-center'>
                            <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={assets.company_icon} alt="" />
                            <div className='text-center md:text-left text-neutral-700'>
                                <h1 className='text-2xl sm:text-4xl font-medium'>{JobData.title}</h1>
                                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                                    <span className='flex items-center gap-1'>
                                        <img src={assets.suitcase_icon} alt="" />
                                        {getCompanyName()}
                                    </span>
                                    <span className='flex items-center gap-1'>
                                        <img src={assets.location_icon} alt="" />
                                        {JobData.location}
                                    </span>
                                    <span className='flex items-center gap-1'>
                                        <img src={assets.person_icon} alt="" />
                                        {JobData.level}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto mx-md:tex-center'>
                            <button 
                                onClick={handleApply}
                                disabled={isApplied}
                                className={`p-2.5 px-10 text-white rounded font-medium ${isApplied ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isApplied ? 'Applied ✓' : 'Apply'}
                            </button>
                            <p className='mt-1 text-gray-600'>Posted {moment(JobData.date).fromNow()}</p>
                        </div>

                    </div>
                    <div className='flex flex-col lg:flex-row justify-between items-start gap-12 mt-10'>
                        <div className='w-full lg:w-2/3'>
                            <h2 className='font-bold text-2xl mb-4'>Job description</h2>
                            <div className='rich-text' dangerouslySetInnerHTML={{__html: renderDescription()}}></div>
                            <button 
                                onClick={handleApply}
                                disabled={isApplied}
                                className={`p-2.5 px-10 text-white rounded font-medium mt-10 ${isApplied ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isApplied ? 'Applied ✓' : 'Apply Now'}
                            </button>
                        </div>
                        {/*Right Section More Jobs */}
                        <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
                            <h2 className='break-words'>More jobs from {getCompanyName()}</h2>
                            {getMoreJobs()
                            .map((job,index)=> <JobCard key={index} job={job}/>)}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    ) : (
        <Loading />
    )
}

export default ApplyJob;