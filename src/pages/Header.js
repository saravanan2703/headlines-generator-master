import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../supabase';
import Cookies from "js-cookie";


function MyHeader() {
    const [payment, setPayment] = useState();
    const[subs,setSubs] = useState();
    const storedValue = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [ipgetaddr, setipgetaddr] = useState('');
    const[datas,setDatas] = useState({});
    const [count,setCount]= useState();

    async function getuser() { 
        if(storedValue) {
          await supabaseClient
          .from('usage_details')
          .select('*').eq('user_email', storedValue.email)
          .then(response => {
            if (response.data[0]) {
              setDatas(response.data[0]);
              setCount(response.data[0].count);
            } else {
              setDatas(0);
              setCount(0);
            }
          })
          .catch(error => console.log(error)); 
        }
      
    }

    useEffect(() => {
        getuser();
    }, [count]);

    const handleFav = (e) => {
        if(count >= 3 ) {
            window.location.href = '/favourites';
        }
        navigate('/favourites'); 
    }
    const homePage = (e) => {
        navigate('/'); 
    }
    const currentHostname = window.location.origin;

    const stripe = require('stripe')('sk_test_51MuDQuSBvlAM3fSavA0axDrUbedbq7dtyaPtMrAmwjVuCRreH8thIpL36PEEH53tqVsUeCMfcvBqPvq1FB44eSax00sVpAl4cl');
    const handleSubs = async(res, e) => {
    const {error, success}  = await stripe.checkout.sessions.create({
    line_items: [
        {price: 'price_1MvDVeSBvlAM3fSaVWbnUJ1j', quantity: 1},
    ],
    mode: 'payment',
    success_url: currentHostname+"/payment-success",
    currency: "inr",
    customer_email:storedValue.email,
    }).then((res)=>{
        setPayment(res.url) 
    });
    navigate('/success',{state:{success}});  
    }

    useEffect(() => { 

    const fetchUsers = async () => {
        if(storedValue) {
            const { data, error } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('user_email', storedValue.email)
            const targetDate = new Date(data.end_date);
            const currentDate = new Date();
            const oneDay = 1000 * 60 * 60 * 24; // number of milliseconds in one day
            const starts = targetDate.getTime();
            const end = currentDate.getTime();
            const diffInMs = starts - end;
            const diffInDays = Math.round(diffInMs / oneDay);
            setSubs(diffInDays)
        }
    }

    if (payment) {
        window.location.href = payment;
    }
    fetchUsers();
    }, [payment]);
    const handleSignOut = () => {
        supabaseClient.auth.signOut().then(() => {
            localStorage.removeItem('user');
            navigate('/login'); 
          }).catch((error) => {
            console.error(error);
          });
    }

    const handleSignin = () => {
        navigate('/login'); 
    }

    return(
        <>
        <div className="headline-logo">
        <img alt="logo" src={process.env.PUBLIC_URL + '/images/logo.png'} onClick={homePage} /> 
        </div>
        <div className='signout favourites-items'>
            {storedValue && <a className="favourites-link" onClick={handleFav}><b>View Favourite List</b></a>}
            {!storedValue && <a className="favourites-link" onClick={handleSignin}><b>Login</b></a>}

            {/*{subs > 0 ? <a className="signout-link"><b>Already Subscribed</b></a> : <a className="signout-link" onClick={handleSubs}><b>Subscribe</b></a>}*/}
            {storedValue && <a className="signout-link" onClick={handleSignOut}><b>Sign out</b></a>}
        </div>
        </>
    )
}
export default MyHeader;