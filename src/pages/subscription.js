import React, { useEffect, useState } from "react";
import supabaseClient from '../supabase';

function MySubscription() {
    const [date,SetDate] = useState();
    const storedValue = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const handleSub = async() => {
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
            SetDate(diffInDays)
            if (currentDate > targetDate) {
              console.log("Inactive")
              const { data, error } = await supabaseClient
              .from('subscriptions')
              .update({ status: 'Inactive'})
              .eq('user_email', storedValue.email)
            }
          }
        }

        handleSub();
      }, []);

    return(
        <div>
          {/*  {date > 0 ? <p>Your Subscription will end in {date} days</p> : <p>You are not a Subscriber</p>} */}
        </div>
    )
}
export default MySubscription;