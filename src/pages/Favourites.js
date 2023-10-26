import React, { useEffect, useEffectuseState, useState } from 'react';
import supabaseClient from '../supabase';
import { Link, useNavigate } from 'react-router-dom';


function FavouritePage() {

const [data, setData] = useState({});
const navigate = useNavigate();


useEffect(() => {
    fetchMyData();
}, []);

async function fetchMyData() {
    const auth = localStorage.getItem('user');
    const dataobj = JSON.parse(auth);
  await supabaseClient
    .from('favourites')
    .select('*').eq('user_id', dataobj.id)
    .then(response => setData(response.data))
    .catch(error => console.log(error));
  }

const anchorCLick = async (event) => {
    const parentText = event.target.parentNode;
    const childImgElement = parentText?.children[1];

    const id = parentText.querySelector('.favourites-list').id
    console.log(id)
    const auth = localStorage.getItem('user');
    const dataobj = JSON.parse(auth);
    const datas = {
        user_id: dataobj.id,
        user_email: dataobj.email,
        id: id
      };
    await supabaseClient.from('favourites').delete(datas).eq('user_id', dataobj.id).eq('id', id).then((res) => {});
    fetchMyData();
 }

 const handleSignOut = () => {
    supabaseClient.auth.signOut().then(() => {
        localStorage.removeItem('user');
        navigate('/login'); 
      }).catch((error) => {
        console.error(error);
      });
  }

 const homePage = (e) => {
    navigate('/'); 
  }

  const handleFav = (e) => {
    navigate('/headline'); 
  }
  const storedValue = localStorage.getItem('user');

return (
  <div className='main'>
    <div className="headline-logo"><img alt="logo" src={process.env.PUBLIC_URL + '/images/logo.png'} onClick={homePage} /> </div>
    <div className='signout favourites-items'>
        {storedValue && <a className="favourites-link" onClick={handleFav}><b>Create a Headline</b></a>}
        {storedValue && <a className="signout-link" onClick={handleSignOut}><b>Sign out</b></a>}
    </div>
    {data.length >= 0  ? (
      <div className="search-box favourite-heading">
        <h2>Favourites List</h2>
        {data?.map(item => (
            <div key={item.id} className='favourites'>
                <div className='favourites-list' id={item.id}>Text: {item.favourite_text}(Keyword: {item.keyword})</div> 
                <span className='active-class' onClick={anchorCLick}/>
            </div>
        ))}
            {data.length == 0 ? (
                <p>Favourite Data Not Available</p>
                ) : (
                    ""
            )}
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);
 }
export default FavouritePage;