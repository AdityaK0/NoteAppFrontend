import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { useState } from 'react'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { FaS } from 'react-icons/fa6'
import {FadeLoader} from 'react-spinners'

function Login() {
  const [email, setEmail] = useState("")  
  const [password, setPassword] = useState("")  
  const [error, setError] = useState(null) ;
  const [btnLoader,setBtnLoader] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e)=>{
    e.preventDefault()
    
    if(email.trim() === "" || email.trim().length<1){
      setError("Please Username or Email ...")
      return
    }
    else{
      if(email.includes("@")){
        if(!validateEmail(email)){
          setError("Please Enter a valid email address");
          return;
        }

      }
    }

    if(!password){
         setError("Please enter the password")
         return;
    }
    setBtnLoader(true)
    setError("")

    
    try {
        localStorage.clear()
        const response = await axiosInstance.post("api/auth/login/",{
          username:email,
          password:password
        });
        
        if(response.data.message){
           localStorage.setItem("access",response.data.token.access)
           localStorage.setItem("refresh",response.data.token.refresh)
           console.log(response.data.token);
           
           navigate("/")
        } 

    } 
    catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error);
        setError(error.response.data.error); 
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
    finally{
      setBtnLoader(false)
    }

  }

  return (
    <>
    <Navbar/>
    <div className='flex items-center justify-center mt-28'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
        <form onSubmit={handleLogin}>
           <h4 className='text-2xl mb-7 text-center' >Login</h4>

           <input 
              type="text" 
              placeholder='Email or Username '
              className='input-box' 
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

           <PasswordInput value={password} 
              onChange={(e)=>setPassword(e.target.value)}
            />
            <div className='h-3 mb-2 text-center'>
               {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            </div>
           <button type='submit' className='btn-primary min-h-2 max-h-10'> 
            {btnLoader?
               "Loading ...."
            :"Login"}
              
           </button>
           <p className='text-sm text-center mt-4'>
            Not Registered Yet ?  {" "}
            <Link to={"/register"} className='font-medium text-blue-500 underline'>Create an Account</Link>
           </p>
        </form>
      </div>
    </div>

    </>
  )
}

export default Login