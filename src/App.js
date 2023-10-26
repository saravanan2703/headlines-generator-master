import './App.css';
import {BrowserRouter as Router,  Route, Routes } from 'react-router-dom';
import PrivateRoute from './Route/protected';
import HomePage from './pages/HomePage';
import Results from './pages/Results';
import Headline from './pages/Headline';
import FavouritePage from './pages/Favourites';
import Login from './auth/login';
import Signup from './auth/signup';
import ThankYouPage from './pages/thankyou';
import Cookies from 'js-cookie';
import SubsRoute from './Route/subs';
import { useEffect, useState } from 'react';
import supabaseClient from './supabase';
import NotFound from './pages/Notfound';

function App() {
  const cookieValue = Cookies.get('mycount');
  const[data,setData] = useState({});
  const [count,setCount]= useState();
  const auth = JSON.parse(localStorage.getItem('user'));
  if(!(cookieValue)) {
    Cookies.set('mycount',0, { expires: 800 })
  }

  async function getuser() { 
    if(auth) {
      await supabaseClient
      .from('usage_details')
      .select('*')
      .eq('user_email', auth.email)
      .then(response => {
        if (response.data[0] ) {
          console.log(response.data[0]);
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
    getuser();
    console.log(count)
  }, [count])

  return (
    <Router basename="/">
    <Routes>
      <Route path="/login" element={(<Login />)}/>
      <Route path="/signup" element={(<Signup />)}/>
      {cookieValue <= 2 && !(auth) && (
        <Route exact path='/' element={''} > 
          <Route exact path='/results' element={<Results />}/>
          <Route path="/headline" element={(<Headline />)}/>
          <Route path="/" element={(<HomePage />)}/>
        </Route> 
      )}
      {cookieValue >= 3 && !(auth) &&( 
        <Route exact path='/' element={<PrivateRoute />} > 
          <Route exact path='/results' element={<Results />}/>
          <Route path="/headline" element={(<Headline />)}/>
          <Route path="/" element={(<HomePage />)}/>
          <Route path="/favourites" element={(<FavouritePage />)}/>
          <Route path="/payment-success" element={(<ThankYouPage />)}/>
        </Route>
      )}
      {count < 3 && auth && ( 
        <Route exact path='/' element={<SubsRoute />} > 
          <Route exact path='/results' element={<Results />}/>
          <Route path="/headline" element={(<Headline />)}/>
          <Route path="/" element={(<HomePage />)}/>
          <Route path="/favourites" element={(<FavouritePage />)}/>
          <Route path="/payment-success" element={(<ThankYouPage />)}/>
        </Route> 
      )}
      {count >= 3 && auth && ( 
        <Route exact path='/' element={<SubsRoute />} > 
          <Route path="/" element={(<HomePage />)}/>
          <Route path="/results" element={(<NotFound />)}/>
          <Route path="/headline" element={(<NotFound />)}/>
          <Route path="/favourites" element={(<FavouritePage />)}/>
          <Route path="/payment-success" element={(<NotFound />)}/>
        </Route> 
      )}
    </Routes>
  </Router>
  );
}

export default App;
