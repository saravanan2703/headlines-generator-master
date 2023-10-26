// src/pages/AboutPage.js

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import supabaseClient from '../supabase';
import Cookies from 'js-cookie';
import axios from 'axios';
import { SupabaseClient } from '@supabase/supabase-js';
import MySubscription from './subscription';
import MyHeader from './Header';

function ResultsPage() {
  const [response, setResponse] = useState('');
  const [cla,setClass] = useState("");
  const[data,setData] = useState({});
  const [count,setCount]= useState();
  const[userdetail, setuserdetail] = useState();
  const [keyword,setKeyword] = useState('Null');
  const navigate = useNavigate();
  const location = useLocation();
  const storedValue = JSON.parse(localStorage.getItem('user'));

  async function getuser() { 
    if(storedValue) {
      await supabaseClient
      .from('usage_details')
      .select('*').eq('user_email', storedValue.email)
      .then(response => {
        if (response.data[0]) {
          setData(response.data[0]);
          setCount(response.data[0].count);
        } else {
          setData(0);
          setCount(0);
        }
      })
      .catch(error => console.log(error)); 
    }

  }

  useEffect(() => { 
    setuserdetail(localStorage.getItem('user'));
    //GEt the response from headline page as state
    getuser();

    if(location.state === null) {
      setResponse("Data Not Found Please Try Again With New Headline");
      setClass("not-available");
    }
    else {
      const resp = location.state.data.choices[0].text;
      setKeyword(location.state.keyword)
      //console.log(location.state.keyword)
      const formattedResponse = resp.replace(/<br\s*\/?>/gm, '');
     // console.log(formattedResponse);
      setResponse(location.state.data.choices[0].text);
    }
  //
  },[location.state]);
const handleClick = () => {
  const cookieValue = Cookies.get('mycount');
  console.log('cookie'+ cookieValue)

  if (cookieValue > 2 && !(storedValue))  {
    window.location.reload();
  }
  if (cookieValue <= 2 && !(storedValue))  {
    //console.log(2)
    navigate('/headline');
  }

  if (count >= 3 && storedValue)  {
    window.location.href = '/';
  }
  if(count == 2 && storedValue) {
    window.location.href = '/headline';
    //window.location.reload();
  }
  navigate('/headline')

 // window.location.reload();
}

const anchorCLick = async (event) => {
  event.preventDefault(); 
  const auth = localStorage.getItem('user');
  const dataobj = JSON.parse(auth);
  //setFilled(!filled);
  const parentClass = event.target.parentNode;
  const childImgElement = parentClass?.children[1];
  if(childImgElement.getAttribute('class') == 'inactive-class') {
    childImgElement.classList.add('active-class');
    childImgElement.classList.remove('inactive-class');

    const parentText = event.target.parentNode.textContent;
    const stringWithoutNumbers = parentText.replace(/[0-9.]/g, '');

    const datas = {
      keyword: keyword,
      user_id: dataobj.id,
      user_email: dataobj.email,
      favourite_text: stringWithoutNumbers
    };
    //insert a record to supabase database and a table
    const { data } = await supabaseClient.from('favourites').insert(datas).select('*');
    parentClass.setAttribute('id', data[0].id);
    //console.log(data[0].id)
  }
  else {
    childImgElement.classList.remove('active-class');
    childImgElement.classList.add('inactive-class');
    const parentText = event.target.parentNode.textContent;
    const stringWithoutNumbers = parentText.replace(/[0-9.]/g, '');
    const parentTexts = event.target.parentNode;
    const id = parentTexts.id
    console.log(id)

    const data = {
      id: id,
      user_id: dataobj.id,
      user_email: dataobj.email,
      //favourite_text: stringWithoutNumbers
    };
    supabaseClient.from('favourites').delete(data).eq('user_id', dataobj.id).eq('id', id).then((res) => {});
  }
 // supabaseClient.from('favourites').insert(data).then((res) => {});
};




const arr = response.split('\n');
const elements = arr.map((item) => (
  <div key={item} className="results-items" >{item}  <a></a> {userdetail ? <span className='inactive-class' onClick={anchorCLick}/> : null}
  </div>
));

//Use to Scroll the page to top default
useEffect(() => {
  window.scrollTo(0, 0)
}, [])


//Payment and Subscribe///

// Insert the data into the table
  return (
    <div className='main'>
      <MySubscription />
      <MyHeader />
      <div className="search-box results">
        <h1>Results</h1>
        <h2 >Your Searched Keyword is : {keyword}</h2>
        <h3 className={cla}>{elements}</h3>
        <div className="Submit-Button">
          <button onClick={handleClick}>Create another Headline</button>
        </div>
      </div>
      <footer className="footer-container">
            <p>© 2023. <Link href="https://GreatHeadlines.ai">GreatHeadlines.ai.</Link></p>
            <p>Made with  &lt;  3 by <Link href="https://withpulp.com">With Pulp</Link>.</p>
      </footer>
    </div>
  );
}

export default ResultsPage;