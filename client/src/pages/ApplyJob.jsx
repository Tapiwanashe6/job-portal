import React, { useEffect, useState, useContext } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import kconvert from 'k-convert'
import moment from 'moment/moment';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';

function ApplyJob() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [JobData, setJobData] = useState(null)
    const [isApplied, setIsApplied] = useState(false)

    const {jobs, applyForJob, applications} = useContext(AppContext)

    const fetchJob = async () => {
        const data = jobs.filter(job => job._id === id)
        if (data.length !==0){
            setJobData(data[0])
            console.log(data[0])
        }
    }

    useEffect(()=>{
        if (jobs.length > 0){
            fetchJob()
        }
    },[id,jobs])

    // Check if user has already applied for this job
    useEffect(()=>{
        const hasApplied = applications.some(app => app.jobId === id)
        setIsApplied(hasApplied)
    },[applications, id])

    const handleApply = () => {
        if (JobData) {
            const success = applyForJob(JobData)
            if (success) {
                setIsApplied(true)
                alert('Application submitted successfully!')
            }
        }
    }

    return JobData ?(
        <>
            <Navbar />

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
                                        {JobData.companyId.name}
                                    </span>
                                    <span className='flex items-center gap-1'>
                                        <img src={assets.location_icon} alt="" />
                                        {JobData.location}
                                    </span>
                                    <span className='flex items-center gap-1'>
                                        <img src={assets.person_icon} alt="" />
                                        {JobData.level}
                                    </span>
                                    <span className='flex items-center gap-1'>
                                        <img src={assets.money_icon} alt="" />
                                        CTC: {kconvert.convertTo(JobData.salary)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto mx-md:tex-center'>
                            <button 
                                onClick={handleApply}
                                disabled={isApplied}
                                className={`p-2.5 px-10 text-white rounded font-medium ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isApplied ? 'Applied' : 'Apply Now'}
                            </button>
                            <p className='mt-1 text-gray-600'>Posted {moment(JobData.date).fromNow()}</p>
                        </div>

                    </div>
                    <div className='flex flex-col lg:flex-row justify-between items-start gap-12 mt-10'>
                        <div className='w-full lg:w-2/3'>
                            <h2 className='font-bold text-2xl mb-4'>Job description</h2>
                            <div className='rich-text' dangerouslySetInnerHTML={{__html:JobData.description}}></div>
                            <button 
                                onClick={handleApply}
                                disabled={isApplied}
                                className={`p-2.5 px-10 text-white rounded font-medium mt-10 ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isApplied ? 'Applied' : 'Apply Now'}
                            </button>
                        </div>
                        {/*Right Section More Jobs */}
                        <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
                            <h2>More jobs from {JobData.companyId.name}</h2>
                            {jobs.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                            .filter(job => true).slice(0,4)
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