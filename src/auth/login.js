import { useState } from 'react';
import supabaseClient from '../supabase';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import Cookies from 'js-cookie';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage , setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
      event.preventDefault();
      try {
        setIsLoading(true);
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
          throw error;
        }
        else {
          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.href = '/';
          //insert a record to supabase database and a table
          setIsLoading(false);
        }
      } catch (error) {
        setErrorMessage(error.message)
        setIsLoading(false);
        console.log(error.message);
      }
    };
const handleClick = (e) => {
  navigate('/signup'); 
} 

const storedValue = localStorage.getItem('user');
if (storedValue) {
console.log('testing')
}

    return (
      <div className='login-form'>
        <div className="headline-logo"><img src={process.env.PUBLIC_URL + '/images/logo.png'} /> </div>
        <div className="login-values">
          <form onSubmit={handleLogin}>
            <h2>Sign In</h2>
            <div className='email-field'>
              <label htmlFor="email">Email</label>
              <input
                className="email"
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className='password-field'>
              <label htmlFor="password">Password</label>
              <input
                className="password"
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {errormessage ? <p className='error-message'>{errormessage}</p>:'' }
            <button type="submit" className="btn" disabled={isLoading} style={{ backgroundColor: isLoading ? '#cccccc' : '#FF0000', border:isLoading ? 'none' : '' }} >        
            {isLoading ? <span><ClipLoader color={'#fff'} size={15} /> Please Wait Validating...</span> : "Login"}    
            </button>
          </form>
          <div className="signup">
            <p>Don't Have an Account <a className="signup-link" onClick={handleClick}><b>Sign Up Here</b></a></p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;
