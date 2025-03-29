import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link,useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import axios from 'axios'


function Register() {
    const [name,setName] = useState("")
    const [email, setEmail] = useState("")  
    const [username,setUserName] = useState("")
    const [password, setPassword] = useState("")  
    const [error, setError] = useState(null) ;
    const [btnLoader,setBtnLoader] = useState(false)

    const navigate = useNavigate()

  const handleRegister = async (e)=>{
    e.preventDefault()
    if(!username){
      setError("Please enter username")
      return
    }
    if(!name){
      setError("Please enter your fullname")
      return
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address")
      return
    }
    if(!password){
      setError("Please enter the password")
      return
    }
    setError("")
    setBtnLoader(true)
    //signup api call
    try {
      localStorage.clear()
      const response = await axiosInstance.post("/api/auth/register/",{
        username:username,
        fullname:name,
        email:email,
        password:password
      })
      if(response.data && response.data.error){
        setError(response.data.error)
        return;
      }
      if (response.data && response.data.token.access) {
        //  localStorage.setItem("access",response.data.token.access)
         navigate("/login")
      }
   
    } catch (error) {
      if(error.response || error.response.error){
        setError(error.response.data.error)
      }
      else{
        setError("Unexpected Error Occurred ......")
      }
    }

  }
  return (
    <>
    <Navbar/>
    <div className='flex items-center justify-center mt-20 h-96'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
        <form onSubmit={handleRegister}>
           <h4 className='text-2xl mb-7 text-center' >Register</h4>

           <input 
              type="text" 
              placeholder='Username'
              className='input-box' 
              value={username}
              onChange={(e)=>setUserName(e.target.value)}
            />  
            <input 
              type="text" 
              placeholder='Full Name'
              className='input-box' 
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />          
             <input 
              type="text" 
              placeholder='Email'
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
            :"Create Account"}
              
           </button>

           <p className='text-sm text-center mt-4'>
            Already have account ? {" "}
            <Link to={"/login"} className='font-medium  text-blue-500  underline'>Login</Link>
           </p>


            

        </form>
      </div>
    </div>
    </>
  )
}

export default Register