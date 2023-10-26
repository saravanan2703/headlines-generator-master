import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import supabaseClient from '../supabase';
import Cookies from 'js-cookie';
import MySubscription from './subscription';
import MyHeader from "./Header";
import axios from "axios";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);



function Headline() {
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");

  //const [response, setResponse] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Editorial");
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [target, setTarget] = useState("");
  const [action, setAction] = useState("");
  const [benefit, setBenefit] = useState("");
  const [count, setCount] = useState(parseInt(Cookies.get('mycount')));
  const [user ,setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [supdata, setData] = useState({});
  const navigate = useNavigate();




//Use to Scroll the page to top default
  useEffect(() => {
    window.scrollTo(0, 0)

  }, [])

  let message = `Write some headlines, based on the following parameters:\nRules:It has to be in the style of the world’s best copywriters. It should be engaging and attention-grabbing Emphasize clarity and conciseness 50-70 characters\nLength: The length of the headline should be 50-70 characters (including spaces).\nKeywords: ${keyword}\n`;

  //Append to the let only when the value is available
  if (content) {
    message += `Headline Context: ${content}.\n`;
  }
  if (selectedOption) {
    message += `Headline Style: ${selectedOption}.\n`;
  }

  if (target) {
    message += `Target Audience: ${target}.\n`;
  }

  if (action) {
    message += `Call-to-Action: ${action}.\n`;
  }

  if (benefit) {
    message += `Benefit or Value Proposition: ${benefit}.\n`;
  }

  async function getuser() { 
    if(user) {
      await supabaseClient
      .from('usage_details')
      .select('*').eq('user_email', user.email)
      .then(response => setData(response.data[0]))
      .catch(error => console.log(error)); 
    }

  }
  useEffect(() => {
    getuser();
  }, [])


  async function handleSubmit(e) {
    setIsLoading(true);
    //setResponse("");
    e.preventDefault();   
    if(user) {
      if(!supdata) {
        console.log(1)
        const values = {
          user_email: user.email,
          count: 1,
        };
        await supabaseClient.from('usage_details').insert(values).select('*');
      }
      else {
        console.log(2)
        const { error } = await supabaseClient
        .from('usage_details')
        .update({ count: parseInt(supdata.count)+1 })
        .eq('user_email', user.email )

      }
    }
    

    await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        n:10,
        max_tokens: 1000,
        temperature:0.6       //Temperature is a parameter of OpenAI ChatGPT,that Provides the randomness of the responses
      }).then((res ) => { 
        setIsLoading(false)
        const data = res.data;
        console.log("result "+ data.choices[0].text)
        navigate('/results',{state:{data,keyword}});  
        //setResponse(res.data.choices[0].text);
        if(!user) {
          Cookies.set('mycount',count+1, { expires: 365 });
        }
      }); 
  };

  //Handling the first set of radio buttons
  function handleChange(e) {
    setSelectedOption(e.target.value);
  }
  //Handling the Second set of radio buttons
  function handleChange2(e) {
    setSelectedOption2(e.target.value);
  }


const toggleVisibility = () => {
  setIsToggled(!isToggled);
  setIsVisible(!isVisible);
}

const storedValue = localStorage.getItem('user');


  return (
    <div className="main">
      <MySubscription />
      <MyHeader />
      <div className="search-box">
      <h1>Create Your Headline</h1>
      <form onSubmit={handleSubmit}>
        <h3>Enter Your Topic or Keyword</h3>
        <input className="search-input" type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)} required/>
        <p className="hint-text">Enter the main topic or subject of your headline. This could be a product, service, event, or idea. Use specific and descriptive words to ensure your headline is relevant and engaging.</p>
        
        <h3>Enter your content (Optional)</h3>
        <textarea className="search-input"
            value={content} style={{height: "140px",maxWidth: "100%"}} 
            onChange={(e) => setContent(e.target.value)} maxLength={400}/>
        <p className="hint-text">Enter your text here for the headline generator to analyze and generate a compelling headline. 300-400 words max.</p>

        <h3>Headline Style</h3>
        <div className="headline-checkbox">
          <label className={`form-control custom-checkbox ${selectedOption === "Editorial" ? "active" : ""}`}>
            <input type="radio" value="Editorial" name="radio" className={selectedOption === "Editorial" ? "active" : ""} onChange={handleChange} checked={selectedOption === "Editorial"}/>
            Editorial
          </label>
          <label className={`form-control custom-checkbox ${selectedOption === "Email Subject Line" ? "active" : ""}`}>
            <input type="radio" name="radio" value="Email Subject Line" className={selectedOption === "Email Subject Line" ? "active" : ""} onChange={handleChange} checked={selectedOption === "Email Subject Line"} />
            Email Subject Line
          </label>
          <label className={`form-control custom-checkbox ${selectedOption === "App Launch" ? "active" : ""}`}>
            <input type="radio" name="radio" value="App Launch" className={selectedOption === "App Launch" ? "active" : ""} onChange={handleChange} checked={selectedOption === "App Launch"} />
            App Launch
          </label>
          <label className={`form-control custom-checkbox ${selectedOption === "Product Launch" ? "active" : ""}`}>
            <input type="radio" name="radio" value="Product Launch" className={selectedOption === "Product Launch" ? "active" : ""} onChange={handleChange} checked={selectedOption === "Product Launch"} />
            Product Launch
          </label>
          <label className={`form-control custom-checkbox ${selectedOption === "Social Media Caption" ? "active" : ""}`}>
            <input type="radio" name="radio" value="Social Media Caption" className={selectedOption === "Social Media Caption" ? "active" : ""} onChange={handleChange} checked={selectedOption === "Social Media Caption"} />
            Social Media Caption
          </label>
          <span>More Coming!</span>
        </div>
        <p className="hint-text">Choose the style of headline you want to generate. This will determine the tone and format of the headline.</p>

        <div>
          <h3>Target Audience</h3>
          <input className="search-input" type="text" value={target} onChange={(e) => setTarget(e.target.value)} maxLength={30}/>        
          <p className="hint-text">Who is your target audience for this headline? Consider factors such as age range, location, interests, occupation, and other demographic information. This will help you tailor the headline to their specific needs and interests. </p>
        </div> 


        {/*Toggle Class for Additional Parameters*/}
        
        <h3 className="toggle-text" onClick={toggleVisibility}>{isToggled ? "-" : "+"} Additional Parameters (Recommended)</h3>
        {isVisible && 
            <div className="additional-params">
              <h3>Call to Action (optional)</h3><input className="search-input" type="text" value={action} onChange={(e) => setAction(e.target.value)} maxLength={30} />   
              <p className="hint-text">Describe any next steps you want the reader to take.</p>
              <div>
              <h3>Benefit or Value Proposition (optional)</h3><input className="search-input" type="text" value={benefit} onChange={(e) => setBenefit(e.target.value)} maxLength={40}/>  
              <p className="hint-text">Describe the primary customer value or your unique sales proposition.</p>   
              </div>

              <h3>Brand Voice</h3>
              <div className="headline-checkbox brand-voice">
                <label className={`form-control custom-checkbox ${selectedOption2 === "Formal" ? "active" : ""}`}>
                  <input type="radio" name="radio" value="Formal" className={selectedOption2 === "Formal" ? "active" : ""} onChange={handleChange2} checked={selectedOption === "Formal"} />
                  Formal
                </label>
                <label className={`form-control custom-checkbox ${selectedOption2 === "Casual" ? "active" : ""}`}>
                  <input type="radio" name="radio" value="Casual" className={selectedOption2 === "Casual" ? "active" : ""} onChange={handleChange2} checked={selectedOption === "Casual"}/>
                  Casual
                </label>
                <label className={`form-control custom-checkbox ${selectedOption2 === "Playful" ? "active" : ""}`}>
                  <input type="radio" name="radio" value="Playful" className={selectedOption2 === "Playful" ? "active" : ""} onChange={handleChange2} checked={selectedOption === "Playful"} />
                  Playful
                </label>
              </div>
            </div>     
          }
      {/*End of Toggle Class for Additional Parameters*/}
        <div className="Submit-Button">
          <button type="submit" className="btn" disabled={isLoading} style={{ backgroundColor: isLoading ? '#cccccc' : '#FF0000', border:isLoading ? 'none' : '' }} >        
          {isLoading ? <span><ClipLoader color={'#fff'} size={15} /> Please Wait Loading...</span> : "Copywrite my headline"}    
          </button>
        </div>
        </form>
      </div>
      <footer className="footer-container">
            <p>© 2023. <Link href="https://GreatHeadlines.ai">GreatHeadlines.ai.</Link></p>
            <p>Made with  &lt;  3 by <Link href="https://withpulp.com">With Pulp</Link>.</p>
      </footer>
    </div>
  );
}

export default Headline;
