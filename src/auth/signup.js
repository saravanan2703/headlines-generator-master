import { useState } from 'react';
import supabaseClient from '../supabase';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message , setMessage] = useState('');

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }
      else {
        console.log(data); 
        setMessage("Please Verfiy Your Email For Further Process")
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };
const handleClick = (e) => {
    navigate('/login'); 
} 
  return (
    <div className='signup-form'>
        <div className="headline-logo"><img src={process.env.PUBLIC_URL + '/images/logo.png'} /> </div>
        <div class="signup-values">
          <form onSubmit={handleSignup}>
              <h2>Sign up</h2>
              {error && <div className="error">{error}</div>}
              <div className='email-field'>
                  <label htmlFor="email">Email</label>
                  <input
                  className='email'
                  type="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  />
              </div>
              <div className='password-field'>
                  <label htmlFor="password">Password</label>
                  <input
                  className='password'
                  type="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  />
              </div>
              <button type="submit">Sign up</button>
          </form>
          <p>{message}</p>
          <div className="login">
              <p>Already Have an account <a className="signin-link" onClick={handleClick}><b>Sign in</b></a></p>
          </div>
        </div>
    </div>
  );
}

export default Signup;
