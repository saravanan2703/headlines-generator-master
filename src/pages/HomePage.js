// src/pages/HomePage.js

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabaseClient from '../supabase';
import MyHeader from './Header';
import MySubscription from './subscription';

function HomePage() {
const navigate = useNavigate();


//Use to Scroll the page to top
useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

const handleClick = (e) => {
    navigate('/headline'); 
}


const storedValue = localStorage.getItem('user');

  return (
    <div className='main'>
        <MySubscription />
        <MyHeader />
        <div className="home-page">
            <div>    
                <img alt="home-page-hero" src={process.env.PUBLIC_URL + '/images/home-page.png'} /> 
            </div>
            <div className='content'>
                <h1>Write headlines like Don Draper in just a few seconds</h1>
                <div className='home-subtxt'>
                    <span>The world's best marketers and copywriters know that the most important part of any sales material is the headline. However, writing great headlines takes a lot of time. It's a process made up of countless rounds of testing and iteration. But what if there could be a faster way?</span>
                    <span>Great Headlines combines marketing subject matter expertise with artificial intelligence to help you write those hooky headlines, fast. Sure, you could simply go to ChatGPT and ask for it to write you a headline. But as we're sure you'll see, when you generate a headline through our app, there's a magic formula that you won't be able to replicate anywhere else.</span>
                </div>
                <div className="Submit-Button">
                    <button onClick={handleClick}>Get My Headline</button>
                </div>
            </div>
        </div>
        <footer className="footer-container">
            <p>© 2023. <Link href="https://GreatHeadlines.ai">GreatHeadlines.ai.</Link></p>
            <p>Made with  &lt;  3 by <Link href="https://withpulp.com">With Pulp</Link>.</p>
      </footer>
    </div>
  );
}

export default HomePage;
