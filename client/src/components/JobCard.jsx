import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

function JobCard({ job, isNew }) {

    const navigate = useNavigate()

    // Helper function to strip HTML tags
    const stripHtml = (html) => {
        if (typeof html !== 'string') return 'Job description'
        const tmp = document.createElement('DIV')
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ''
    }

    return (
        <div className='border p-6 shadow rounded relative flex flex-col h-full'>
            {isNew && (
                <div className='absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium opacity-70'>
                    New
                </div>
            )}
            <div className='flex justify-between items-center'>
                <img className='h-8' src={assets.company_icon} alt="" />
            </div>
            <h4 className='font-medium text-xl mt-2'>{job.title}</h4>
            <div className='flex items-center gap-3 mt-2 text-xs'>
                <span className='bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>{job.location}</span>
                <span className='bg-red-50 border border-red-200 px-4 py-1.5 rounded'>{job.level}</span>
            </div>
            <p className='text-gray-500 text-sm mt-4 flex-grow'>
                {typeof job.description === 'string' 
                    ? stripHtml(job.description).slice(0, 150)
                    : job.description?.ops ? 'Job description' : job.description?.slice?.(0,150) || 'Job description'
                }
            </p>
            <div className='mt-4 flex gap-4 text-sm'>
                <button onClick={(e) => {
                    e.preventDefault()
                    if (job._id) {
                        navigate(`/apply-job/${job._id}`)
                        window.scrollTo(0, 0)
                    }
                }} className='bg-blue-600 text-white px-4 py-2 rounded'>Apply now</button>
                <button onClick={(e) => {
                    e.preventDefault()
                    if (job._id) {
                        navigate(`/apply-job/${job._id}`)
                        window.scrollTo(0, 0)
                    }
                }} className='text-gray-500 border border-gray-500 rounded px-4 py-2'>Learn more</button>
            </div>
        </div>
    );
}

export default JobCard;