import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import AppContext from '../context/AppContext.jsx';

function RecruiterLogin(props) {

    const [state,setState] = useState('Login')
    const [name,setName] = useState('')
    const [password, setPassword] = useState('')
    const [email,setEmail] = useState('')

    const [image,setImage] = useState(false)

    const [isTextDataSubmitted,setIsTextDataSubmitted] = useState(false)

    const {setShowRecruiterLogin, setRecruiterData} = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (state === "Sign Up" && !isTextDataSubmitted) {
            setIsTextDataSubmitted(true)
            return
        }

        if (state === "Sign Up" && isTextDataSubmitted) {
            // Save recruiter data to localStorage
            const recruiterData = {
                name,
                email,
                password,
                logo: image ? URL.createObjectURL(image) : null,
                createdAt: new Date().toISOString()
            }
            localStorage.setItem('recruiterAccount', JSON.stringify(recruiterData))
            localStorage.setItem('recruiterLoggedIn', 'true')
            setRecruiterData(recruiterData)
            alert('Account created successfully! You are now logged in.')
            setShowRecruiterLogin(false)
            return
        }

        if (state === "Login") {
            // Check credentials against localStorage
            const savedRecruiter = localStorage.getItem('recruiterAccount')
            if (!savedRecruiter) {
                alert('No recruiter account found. Please sign up first.')
                setState('Sign Up')
                return
            }

            const recruiterDataStored = JSON.parse(savedRecruiter)
            if (recruiterDataStored.email === email && recruiterDataStored.password === password) {
                localStorage.setItem('recruiterLoggedIn', 'true')
                setRecruiterData(recruiterDataStored)
                alert('Login successful!')
                setShowRecruiterLogin(false)
            } else {
                alert('Invalid email or password')
            }
        }
    }

    useEffect(()=>{
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = 'unset'
        }
    },[])

    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>
                { state === "Sign Up" && isTextDataSubmitted 
                ? <>

                    <div className='flex items-center gap-4 my-10'>
                        <label htmlFor="image">
                            <img className='w-16 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                            <input onChange={e => setImage(e.target.files[0])} type='file' id='image' hidden />
                        </label>
                        <p>Upload Company <br /> logo</p>
                    </div>

                </>
                : <>

                    {state !== 'Login' && (
                      <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.person_icon} alt="" />
                        <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Company Name' required/>
                    </div>  
                    )}

                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.email_icon} alt="" />
                        <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email Id' required/>
                    </div>

                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.lock_icon} alt="" />
                        <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required/>
                    </div>

                </>}

                {state === "Login" && <p className='text-sm text-blue-600 mt-4 cursor-pointer'>Forgot password</p>}
                
                <button  type='submit' className='bg-blue-600 w-full text-white py-2 rounded-full mt-4 font-medium'>
                    {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Create Account' : 'Next'}
                </button>

                    {
                        state === 'Login'
                        ? <p className='mt-5 text-center text-sm'>Don't have an account? <span className='text-blue-600 cursor-pointer font-medium' onClick={()=> setState("Sign Up")}>Sign Up</span></p>
                        : <p className='mt-5 text-center text-sm'>Already have an account? <span className='text-blue-600 cursor-pointer font-medium' onClick={()=> { setState("Login"); setIsTextDataSubmitted(false); }}>Login</span></p>
                    }

                    <img onClick={e => setShowRecruiterLogin(false)} className="absolute top-5 right-5 cursor-pointer" src={assets.cross_icon} alt="" />

            </form>
        </div>
    );
}

export default RecruiterLogin;