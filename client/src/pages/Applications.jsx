import React, { useState, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';
import AppContext from '../context/AppContext';
import { toast } from 'react-toastify';

function Applications(props) {

    const { user } = useUser()
    const [isEdit, setIsEdit] = useState(false)
    const [resume, setResume] = useState(null)
    const [showResumeModal, setShowResumeModal] = useState(false)
    const [selectedResume, setSelectedResume] = useState(null)
    const [editingAppId, setEditingAppId] = useState(null)
    const [editResume, setEditResume] = useState(null)
    const {applications, deleteApplication, updateApplication, recruiterData} = useContext(AppContext)

    // Get user's applications (filtered by user email or recruiter email)
    const userApplications = applications.filter(app => {
        if (!app.applicantEmail) return false
        
        // If Clerk user is logged in, show their applications
        if (user && user.primaryEmailAddress?.emailAddress) {
            return app.applicantEmail === user.primaryEmailAddress?.emailAddress
        }
        
        // If recruiter is logged in, show their applications
        if (recruiterData && recruiterData.email) {
            return app.applicantEmail === recruiterData.email
        }
        
        return false
    })

    // Load saved resume from localStorage on mount and whenever it might change
    useEffect(() => {
        // Try to load saved CV first
        let savedResume = localStorage.getItem('userCV')
        // If not found, try userResume (legacy)
        if (!savedResume) {
            savedResume = localStorage.getItem('userResume')
        }
        if (savedResume) {
            setResume(savedResume)
        }
    }, [user?.primaryEmailAddress?.emailAddress, recruiterData?.email])

    const handleDelete = async (applicationId) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await deleteApplication(applicationId);
                toast.success('Application deleted successfully')
            } catch (error) {
                toast.error('Failed to delete application')
                console.error('Delete error:', error)
            }
        }
    }

    const viewResume = (resumeData) => {
        if (!resumeData) {
            alert('No resume available')
            return
        }
        setSelectedResume(resumeData)
        setShowResumeModal(true)
    }

    const handleEditResume = (applicationId, currentResume) => {
        setEditingAppId(applicationId)
        setEditResume(currentResume)
    }

    const handleCancelEditResume = () => {
        setEditingAppId(null)
        setEditResume(null)
    }

    const handleUploadNewResume = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setEditResume(event.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSaveEditResume = (applicationId) => {
        if (editResume) {
            // Save to localStorage - use userCV for consistency with ApplyModal
            localStorage.setItem('userCV', editResume)
            localStorage.setItem('userResume', editResume) // Also save to legacy key
            setResume(editResume)
            setEditingAppId(null)
            setEditResume(null)
        }
    }

    return (
        <div>
            <Navbar />
            <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
                {/* Resume section - show for both Clerk users and recruiters */}
                {(user || recruiterData) && (
                    <>
                        <h2 className='text-xl font-semibold'>Your Resume</h2>
                        <div className='flex gap-2 mb-6 mt-3'>
                            {
                                editingAppId
                                ? <>
                                    <label className='flex items-center' htmlFor="resumeUpload">
                                        <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>Select Resume</p>
                                        <input id='resumeUpload' onChange={handleUploadNewResume} accept='.pdf,.doc,.docx' type="file" hidden />
                                        <img src={assets.profile_upload_icon} alt="" />
                                    </label>
                                    <button onClick={() => handleSaveEditResume(editingAppId)} className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>
                                    <button onClick={handleCancelEditResume} className='bg-gray-100 border border-gray-300 rounded-lg px-4 py-2'>Cancel</button>
                                </>
                                : <div className='flex gap-2'>
                                   <button onClick={() => viewResume(resume)} className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'>
                                    View Resume
                                    </button> 
                                    <button onClick={()=> setEditingAppId('main')} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>
                                        Edit
                                    </button>
                                </div>
                            }
                        </div>
                    </>
                )}
                <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
                {userApplications && userApplications.length > 0 ? (
                <table className='min-w-full bg-white border rounded-lg'>
                    <thead>
                        <tr>
                            <th className='py-3 px-4 border-b text-left'>Company</th>
                            <th className='py-3 px-4 border-b text-left'>Job Title</th>
                            <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
                            <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                            <th className='py-3 px-4 border-b text-left'>Status</th>
                            <th className='py-3 px-4 border-b text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userApplications.map((job,index)=>(
                            <tr key={index}>
                                <td className='py-3 px-4 flex items-center gap-2 border-b'>
                                    <img className='w-8 h-8' src={assets.company_icon} alt="" />
                                    {job.company}
                                </td>
                                <td className='py-2 px-4 border-b'>{job.jobTitle}</td>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
                                <td className='py-2 px-4 border-b'>
                                    <span className={`px-4 py-1.5 rounded ${job.status === 'Accepted' ? 'bg-green-100 text-green-700' : job.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {job.status}
                                    </span>                                 
                                </td>
                                <td className='py-2 px-4 border-b text-center'>
                                    <button onClick={() => handleDelete(job._id)} className='hover:opacity-75 transition' title='Delete application'>
                                        <svg className='w-5 h-5 inline text-red-500' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                                            <path fillRule='evenodd' d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z' clipRule='evenodd'></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                    <div className='text-center py-12'>
                        <p className='text-gray-500 text-lg mb-4'>You haven't applied for any jobs yet</p>
                        <a href='/' className='text-blue-600 hover:underline font-medium'>Browse available jobs</a>
                    </div>
                )}
            </div>

            {/* Resume View Modal */}
            {showResumeModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg w-full max-w-2xl h-[90vh] flex flex-col'>
                        <div className='flex justify-between items-center p-4 border-b'>
                            <h2 className='text-xl font-bold'>Resume</h2>
                            <button onClick={() => setShowResumeModal(false)} className='text-gray-500 hover:text-gray-700 text-2xl'>✕</button>
                        </div>
                        <div className='flex-1 overflow-auto'>
                            {selectedResume && selectedResume.startsWith('data:') ? (
                                <iframe src={selectedResume} className='w-full h-full border-none' />
                            ) : (
                                <div className='p-8 text-center text-gray-600'>
                                    <p>Resume not available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Applications;