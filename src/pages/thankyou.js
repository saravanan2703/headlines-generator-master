import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function ThankYouPage() {

    const navigate = useNavigate();

    const handlePayment = async (e) => {
      navigate('/'); 
    }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Thank you for your payment!</h1>
      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
      <p>Your Payment Has Been Processed successfully</p>
      <p>We appreciate your business and hope to see you again soon.</p>
      <span onClick={ handlePayment }><b>Go to HomePage</b></span>
    </div>
  );
}

export default ThankYouPage;
