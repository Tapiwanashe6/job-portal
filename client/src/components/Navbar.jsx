import React, { useContext } from 'react';
import { assets } from '../assets/assets.js';
import {useClerk, UserButton, useUser} from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext.jsx';

function Navbar(props) {

    const {openSignIn} = useClerk();
    const {user} = useUser();

    const navigate = useNavigate()

    const {setShowRecruiterLogin, recruiterData, logoutRecruiter} = useContext(AppContext)

    return (
        <div className='shadow py-4'>
           <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
             <div onClick={()=> navigate('/')} className='cursor-pointer flex items-center gap-2'>
                <span className='text-2xl'>🛡️</span>
                <span className='text-xl'>
                    <span className='font-bold text-black'>Job</span>
                    <span className='text-gray-800'>Guaranteed</span>
                </span>
             </div>
             {
             recruiterData
             ?<div className='flex items-center gap-3'>
                <Link to={'/dashboard'} className='text-gray-600'>Dashboard</Link>
                <Link to={'/applications'} className='text-gray-600'>Applied Jobs</Link>
                <p className='max-sm:hidden text-sm'>Welcome, {recruiterData.name}!</p>
                <button onClick={logoutRecruiter} className='text-gray-600 px-4 py-2 border border-gray-300 rounded-lg'>Logout</button>
             </div>
             : user
             ?<div className='flex items-center gap-3'>
                <Link to={'/applications'}>Applied Jobs</Link>
                <p className='max-sm:hidden'>Hi, {user.firstName + ' ' + user.lastName}!</p>
                <UserButton />
             </div>
             :
            <div className='flex gap-4 max-sm:text-xs'>
                <button onClick={e => setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
                <button onClick={ e => openSignIn()} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
            </div>
            }
           </div>
        </div>
    );
}

export default Navbar