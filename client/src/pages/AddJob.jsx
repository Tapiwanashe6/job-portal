import React, { useEffect, useRef, useState, useContext } from 'react';
import Quill from 'quill';
import { JobCategories, JobLocations } from '../assets/assets';
import 'quill/dist/quill.snow.css';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function AddJob(props) {

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Bangalore')
    const [category, setCategory] = useState('Programming')
    const [level, setLevel] = useState('Beginner level')
    const [salary, setSalary] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const editorRef = useRef(null)
    const quillRef = useRef(null)
    const navigate = useNavigate()
    const { recruiterData } = useContext(AppContext)

    useEffect(()=>{
        //Initiate Qill only once
        if (!quillRef.current && editorRef.current){
            quillRef.current = new Quill(editorRef.current,{
                theme:'snow',
            })
        }
    },[])

    const getCompanyName = () => {
        return localStorage.getItem('recruiterCompanyName') || 'Company'
    }

    const handleAddJob = async (e) => {
        e.preventDefault()
        
        if (!title.trim()) {
            toast.error('Please enter job title')
            return
        }

        const description = quillRef.current?.getContents()
        if (!description || description.ops.length === 0) {
            toast.error('Please enter job description')
            return
        }

        setIsSubmitting(true)

        try {
            // Get company name from localStorage
            const companyName = localStorage.getItem('recruiterCompanyName') || 'Company'
            let recruiterEmail = 'recruiter@company.com'
            
            try {
                const recruiterAccount = localStorage.getItem('recruiterAccount')
                if (recruiterAccount) {
                    recruiterEmail = JSON.parse(recruiterAccount).email || recruiterEmail
                }
            } catch (e) {
                console.error('Error parsing recruiter account:', e)
            }
            
            const newJob = {
                _id: Date.now().toString(),
                title,
                description: quillRef.current.getContents(),
                category,
                location,
                level,
                salary: parseInt(salary),
                companyId: { 
                    name: companyName,
                    email: recruiterEmail,
                    _id: recruiterEmail
                },
                date: new Date().toISOString(),
                applicants: 0
            }

            // Save to localStorage
            const existingJobs = JSON.parse(localStorage.getItem('recruiterJobs') || '[]')
            existingJobs.push(newJob)
            localStorage.setItem('recruiterJobs', JSON.stringify(existingJobs))

            toast.success('Job posted successfully!')
            navigate('/dashboard/manage-jobs')
        } catch (error) {
            console.error('Error adding job:', error)
            toast.error('Failed to post job')
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return (
        <form onSubmit={handleAddJob} className='container p-4 flex flex-col w-full items-start gap-3'>

            <div className='w-full bg-blue-50 border border-blue-200 p-4 rounded mb-4'>
                <p className='text-sm text-gray-600'>Posting as: <span className='font-semibold text-gray-800'>{getCompanyName()}</span></p>
            </div>

            <div className='w-full'>
                <p className='mb-2'>Job Title</p>
                <input type="text" placeholder='Type here' 
                    onChange={e => setTitle(e.target.value)} value={title}
                    required
                    className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'              
                 />
            </div>

            <div className='w-full max-w-lg'>
                <p className='my-2'>Job Description</p>
                <div ref={editorRef}>

                </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

                <div>
                    <p className='mb-2'>Job Category</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setCategory(e.target.value)}>
                        {JobCategories.map((category,index)=>(
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className='mb-2'>Job Location</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLocation(e.target.value)}>
                        {JobLocations.map((Location,index)=>(
                            <option key={index} value={Location}>{Location}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className='mb-2'>Job Level</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLevel(e.target.value)}>
                        <option value="Beginner level">Beginner level</option>
                        <option value="Intermediate level">Intermediate level</option>
                        <option value="Senior level">Senior level</option>
                    </select>
                </div>

            </div>

            <div>
                <p className='mb-2'>Job Salary</p>
                <input min={0} className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]' onChange={e => setSalary(e.target.value)} type="Number"  placeholder='2500'/>
            </div>
            
            <button type='submit' disabled={isSubmitting} className='w-28 py-3 mt-4 bg-black text-white rounded disabled:bg-gray-400'>
                {isSubmitting ? 'Adding...' : 'ADD'}
            </button>
        </form>
    );
}

export default AddJob;