import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import JobLIsting from '../components/JobLIsting';
import AppDownload from '../components/AppDownload';
import Footer from '../components/Footer';

function Home(props) {
    return (
        <div>
            <Navbar />
            <Hero />
            <JobLIsting />
            <AppDownload />
            <Footer />
        </div>
    );
}

export default Home;