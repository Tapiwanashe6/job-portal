import React, { useState, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';
import { assets } from '../assets/assets';
import AppContext from '../context/AppContext';
import { toast } from 'react-toastify';

function ApplyModal({ job, onClose, onApplySuccess, jobId }) {
    const { user } = useUser()
    const { recruiterData, applications } = useContext(AppContext)
    
    // Safety check - if job is not provided, show error
    if (!job) {
        return (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                <div className='bg-white rounded-lg max-w-sm w-full p-4'>
                    <p className='text-red-600'>Error: Job details not available</p>
                    <button onClick={onClose} className='mt-4 bg-blue-600 text-white px-4 py-2 rounded'>Close</button>
                </div>
            </div>
        )
    }
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cv: null
    });
    const [savedCV, setSavedCV] = useState(null);
    const [useSavedCV, setUseSavedCV] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { applyForJob } = useContext(AppContext);

    // Load saved CV from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('userCV');
        if (saved) {
            setSavedCV(saved);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCVUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    cv: event.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return;
        }
        if (!formData.email.trim()) {
            toast.error('Please enter your email');
            return;
        }

        const cvToUse = useSavedCV ? savedCV : formData.cv;
        if (!cvToUse) {
            toast.error('Please upload or select a CV');
            return;
        }

        setIsSubmitting(true);

        try {
            // Determine applicant info based on login type
            let applicantName = formData.name;
            let applicantEmail = formData.email;

            if (user) {
                // Clerk user
                applicantName = user?.firstName || formData.name;
                applicantEmail = user?.primaryEmailAddress?.emailAddress;
            } else if (recruiterData) {
                // Recruiter user
                applicantName = recruiterData.name || formData.name;
                applicantEmail = recruiterData.email;
            }

            // Check if already applied for this job
            const alreadyApplied = applications.some(app => 
                app.jobId === jobId && 
                app.applicantEmail === applicantEmail
            );

            if (alreadyApplied) {
                toast.error('You have already applied for this job');
                setIsSubmitting(false);
                return;
            }

            // Create application object with user info and CV
            const applicationData = {
                ...job,
                applicantName: applicantName,
                applicantEmail: applicantEmail,
                resume: cvToUse
            };

            await applyForJob(applicationData);
            
            // Save CV for future use
            localStorage.setItem('userCV', cvToUse);
            localStorage.setItem('userName', applicantName);
            localStorage.setItem('userEmail', applicantEmail);

            toast.success('Application submitted successfully!');
            onApplySuccess();
            onClose();
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-sm w-full p-4 max-h-fit overflow-visible'>
                {/* Header */}
                <div className='flex justify-between items-center mb-3'>
                    <h2 className='text-xl font-bold'>Apply for Job</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-700 text-xl'>✕</button>
                </div>

                <p className='text-gray-600 mb-3 text-xs'>{job.title} at {job.company || job.companyId?.name || 'Company'}</p>

                <form onSubmit={handleSubmit} className='space-y-3'>
                    {/* Name Field */}
                    <div>
                        <label className='block text-xs font-medium mb-1'>Full Name *</label>
                        <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            className='w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='John Doe'
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className='block text-xs font-medium mb-1'>Email *</label>
                        <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            className='w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='john@example.com'
                            required
                        />
                    </div>

                    {/* CV Section */}
                    <div className='border-t pt-2'>
                        <label className='block text-xs font-medium mb-2'>Upload CV *</label>

                        {/* Use Saved CV Option */}
                        {savedCV && (
                            <div className='mb-2'>
                                <label className='flex items-center gap-2 p-1.5 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer'>
                                    <input
                                        type='radio'
                                        name='cvOption'
                                        checked={useSavedCV}
                                        onChange={() => setUseSavedCV(true)}
                                    />
                                    <span className='text-xs'>Use saved CV</span>
                                </label>
                            </div>
                        )}

                        {/* Upload New CV Option */}
                        <div>
                            <label className='flex items-center gap-2 p-1.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'>
                                <input
                                    type='radio'
                                    name='cvOption'
                                    checked={!useSavedCV}
                                    onChange={() => setUseSavedCV(false)}
                                />
                                <span className='text-xs'>Upload new CV</span>
                            </label>
                            {!useSavedCV && (
                                <div className='mt-1.5'>
                                    <label htmlFor='cvUpload' className='flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500'>
                                        <img src={assets.upload_area} alt='upload' className='w-5 h-5' />
                                        <span className='text-xs text-gray-600'>
                                            {formData.cv ? 'CV Selected ✓' : 'Click to upload CV'}
                                        </span>
                                    </label>
                                    <input
                                        id='cvUpload'
                                        type='file'
                                        accept='.pdf,.doc,.docx'
                                        onChange={handleCVUpload}
                                        hidden
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex gap-2 pt-2 border-t'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className={`flex-1 px-3 py-1.5 text-sm rounded-lg font-medium text-white flex items-center justify-center gap-2 ${
                                isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplyModal;
