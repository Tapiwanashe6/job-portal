import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

function ViewApplications(props) {
    const [applications, setApplications] = useState([])
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [dropdownPos, setDropdownPos] = useState({top: 0, left: 0})

    useEffect(() => {
        // Load applications from localStorage
        const loadApplications = () => {
            let savedApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]')
            const userName = localStorage.getItem('userName') || 'Unknown Applicant'
            const userEmail = localStorage.getItem('userEmail') || 'Not provided'
            
            // Fill in missing applicant data from localStorage user data if not present
            savedApplications = savedApplications.map(app => ({
                ...app,
                applicantName: app.applicantName || userName,
                applicantEmail: app.applicantEmail || userEmail
            }))
            
            console.log('Loaded applications:', savedApplications)
            setApplications(savedApplications)
        }
        loadApplications()

        // Set up interval to check for updates
        const interval = setInterval(loadApplications, 1000)
        return () => clearInterval(interval)
    }, [])

    const handleViewResume = (resumeData) => {
        if (!resumeData) {
            toast.error('Resume not available')
            return
        }
        // Open resume in new window
        const newWindow = window.open()
        newWindow.document.write(`<iframe src="${resumeData}" style="width: 100%; height: 100%; border: none;"></iframe>`)
    }

    const handleUpdateStatus = (applicationId, newStatus) => {
        const updatedApplications = applications.map(app =>
            app._id === applicationId ? { ...app, status: newStatus } : app
        )
        setApplications(updatedApplications)
        localStorage.setItem('jobApplications', JSON.stringify(updatedApplications))
        toast.success(`Application ${newStatus.toLowerCase()}`)
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='w-full bg-white border border-gray-200 max-sm:text-sm'>
                <div className='overflow-x-auto'>
                    <table className='min-w-full'>
                        <thead>
                            <tr className='border-b bg-gray-50'>
                                <th className='py-3 px-4 text-left text-sm font-medium'>#</th>
                                <th className='py-3 px-4 text-left text-sm font-medium'>Applicant Name</th>
                                <th className='py-3 px-4 text-left text-sm font-medium'>Email</th>
                                <th className='py-3 px-4 text-left text-sm font-medium max-sm:hidden'>Job Title</th>
                                <th className='py-3 px-4 text-left text-sm font-medium'>Resume</th>
                                <th className='py-3 px-4 text-left text-sm font-medium'>Status</th>
                                <th className='py-3 px-4 text-left text-sm font-medium'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length > 0 ? applications.map((applicant, index) => (
                                <tr key={index} className='text-gray-700 border-b hover:bg-gray-50'>
                                    <td className='py-3 px-4 text-center whitespace-nowrap'>{index + 1}</td>
                                    <td className='py-3 px-4 font-medium'>{applicant.applicantName || 'N/A'}</td>
                                    <td className='py-3 px-4 text-sm'>{applicant.applicantEmail || 'N/A'}</td>
                                    <td className='py-3 px-4 max-sm:hidden'>{applicant.jobTitle || 'N/A'}</td>
                                    <td className='py-3 px-4 whitespace-nowrap'>
                                        {applicant.resume ? (
                                            <button
                                                onClick={() => handleViewResume(applicant.resume)}
                                                className='bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 font-medium'
                                            >
                                                View
                                            </button>
                                        ) : (
                                            <span className='text-gray-400 text-sm'>No resume</span>
                                        )}
                                    </td>
                                    <td className='py-3 px-4 whitespace-nowrap'>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            applicant.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                            applicant.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {applicant.status || 'Applied'}
                                        </span>
                                    </td>
                                    <td 
                                        className='py-3 px-4 whitespace-nowrap'
                                    >
                                        <button 
                                            className='text-gray-500 hover:text-gray-700 font-bold text-lg p-1'
                                            onMouseEnter={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect()
                                                setDropdownPos({
                                                    top: rect.bottom + 5,
                                                    left: rect.left - 50
                                                })
                                                setActiveDropdown(applicant._id)
                                            }}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            ⋮
                                        </button>
                                        {activeDropdown === applicant._id && (
                                            <div 
                                                className='fixed bg-white border border-gray-200 rounded shadow w-24' 
                                                style={{
                                                    zIndex: 9999, 
                                                    top: dropdownPos.top,
                                                    left: dropdownPos.left
                                                }}
                                                onMouseEnter={() => setActiveDropdown(applicant._id)}
                                                onMouseLeave={() => setActiveDropdown(null)}
                                            >
                                                <button 
                                                    onClick={() => {
                                                        handleUpdateStatus(applicant._id, 'Accepted')
                                                        setActiveDropdown(null)
                                                    }}
                                                    className='block w-full text-left px-2 py-1.5 text-green-600 hover:bg-gray-100 text-xs'
                                                >
                                                    ✓ Accept
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        handleUpdateStatus(applicant._id, 'Rejected')
                                                        setActiveDropdown(null)
                                                    }}
                                                    className='block w-full text-left px-2 py-1.5 text-red-600 hover:bg-gray-100 text-xs'
                                                >
                                                    ✕ Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className='py-8 px-4 text-center text-gray-600'>No applications yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewApplications;