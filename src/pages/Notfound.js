// src/pages/HomePage.js

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabaseClient from '../supabase';
import MyHeader from './Header';
import MySubscription from './subscription';

function NotFound() {
const navigate = useNavigate();


//Use to Scroll the page to top
useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

const handleClick = (e) => {
    navigate('/'); 
}


const storedValue = localStorage.getItem('user');

  return (
    <div className='main'>
        <MySubscription />
        <MyHeader />
        <div className="home-page">
            <div className="center">    
              <h2>You Need to Subscribe...</h2>
              <p>You Need to Subscribe to use this headline generator for further usage....</p>
              <p className="plan-soon">Plan Details will be available Soon.....</p>
            </div>
          <div className="signout">
            <a onClick={handleClick}><b>Go To Homepage</b></a>
          </div>
        </div>
        <footer className="footer-container">
            <p>© 2023. <Link href="https://GreatHeadlines.ai">GreatHeadlines.ai.</Link></p>
            <p>Made with  &lt;  3 by <Link href="https://withpulp.com">With Pulp</Link>.</p>
      </footer>
    </div>
  );
}

export default NotFound;
