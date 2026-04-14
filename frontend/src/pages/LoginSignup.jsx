import React, { useState } from 'react'
import './css/loginsignup.css'

const LoginSignup = () => {

const[state,setstate]=useState("Login");
const [formData,setformData]=useState({
  username:"",
  password:"",
  email:"",
})

const changeHandler=(e)=>{
setformData({...formData,[e.target.name]:e.target.value})
}


const login=async()=>{
console.log(" login function executed",formData);
let responseData;
await fetch('http://https://webuy-backend-0459.onrender.com/login',{
  method:'POST',
  headers:{
    Accept:'application/form-data',
    'Content-Type':'application/json',
  },
  body:JSON.stringify(formData),
}).then((response)=>response.json()).then((data)=>responseData=data)

if(responseData.success){
  localStorage.setItem('auth-token',responseData.token);
  window.location.replace("/");
}
else{
  alert(responseData.errors);
  
}

}

const signup=async()=>{
console.log(" signup function executed",formData);
let responseData;
await fetch('http://https://webuy-backend-0459.onrender.com/signup',{
  method:'POST',
  headers:{
    Accept:'application/form-data',
    'Content-Type':'application/json',
  },
  body:JSON.stringify(formData),
}).then((response)=>response.json()).then((data)=>responseData=data)

if(responseData.success){
  localStorage.setItem('auth-token',responseData.token);
  window.location.replace("/");
}
else{
  alert(responseData.errors);
  
}
}

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address'/>
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password'/>
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Login"
        ?<p className="loginsignup-login">Create an account?<span onClick={()=>{setstate("Sign up")}}>Click here</span></p>:
        <p className="loginsignup-login">Already have an account?<span onClick={()=>{setstate("Login")}}>Login here</span></p>}
        
        
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By Continuing , I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup;
