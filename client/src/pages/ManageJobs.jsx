import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function ManageJobs(props) {

    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])

    useEffect(() => {
        // Load recruiter's posted jobs from localStorage
        const recruiterJobs = JSON.parse(localStorage.getItem('recruiterJobs') || '[]')
        setJobs(recruiterJobs)
    }, [])

    const handleVisibilityToggle = (jobId, currentStatus) => {
        const updatedJobs = jobs.map(job => 
            job._id === jobId ? { ...job, visible: !currentStatus } : job
        )
        setJobs(updatedJobs)
        localStorage.setItem('recruiterJobs', JSON.stringify(updatedJobs))
    }

    const handleDeleteJob = (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            const updatedJobs = jobs.filter(job => job._id !== jobId)
            setJobs(updatedJobs)
            localStorage.setItem('recruiterJobs', JSON.stringify(updatedJobs))
        }
    }

    return (
        <div className='container p-4 max-w-5xl'>
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
                    <thead>
                        <tr>
                            <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
                            <th className='py-2 px-4 border-b text-left'>Job Title</th>
                            <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
                            <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
                            <th className='py-2 px-4 border-b text-center'>Applicants</th>
                            <th className='py-2 px-4 border-b text-left'>Visible</th>
                            <th className='py-2 px-4 border-b text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.length > 0 ? jobs.map((job, index) => (
                            <tr key={index} className='text-gray-700'>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{index + 1}</td>
                                <td className='py-2 px-4 border-b'>{job.title}</td>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                                <td className='py-2 px-4 border-b text-center'>{job.applicants || 0}</td>
                                <td>
                                    <input 
                                        className='scale-125 ml-4' 
                                        type="checkbox" 
                                        checked={job.visible !== false}
                                        onChange={() => handleVisibilityToggle(job._id, job.visible !== false)}
                                    />
                                </td>
                                <td className='py-2 px-4 border-b text-center'>
                                    <button onClick={() => handleDeleteJob(job._id)} className='text-red-600 hover:text-red-800 text-sm font-medium'>Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className='py-4 px-4 text-center text-gray-600'>No jobs posted yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className='mt-4 flex justify-end'>
                <button onClick={() => navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'>Add new job</button>
            </div>
        </div>
    );
}

export default ManageJobs;