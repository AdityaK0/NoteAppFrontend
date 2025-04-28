import React ,{useState,useEffect}from 'react'
import { getInitials } from '../../utils/helper'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ProfilePageCard from './ProfilePageCard';
import axiosInstance from '../../utils/axiosInstance';

function ProfileInfo() {
  const [userInfo,setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || null)
  const navigate = useNavigate()
  const ProfileViewer = () =>{
    navigate(`/profile/${userInfo.username}`,{state:{userInfo}});
    
  }
  const getUserInfo = async ()=>{
    try {
      const response =  await axiosInstance.get("api/auth/get-user/") 
      if(response.data){
        console.log(response.data);
        setUserInfo(response.data)
        localStorage.setItem("userInfo",JSON.stringify(response.data))
        return
      }
    }
     catch (error) {
      if(error.response.status == 401){
        localStorage.clear()
        navigate("/login")
      }
      console.log(error);
      
    }
  }

    useEffect(()=>{
      if (!userInfo) {
        let userData = JSON.parse(localStorage.getItem("userInfo"))
         
        if (userData) {
          setUserInfo(userData)
        }
        else{
          getUserInfo();
        }
        
      }
      // getAllNotes();
      return ()=>{}
    },[])

  return (
    <div>
      {!userInfo?
      <div className='flex items-center gap-3'>
        <Link to={"/login"}>Login</Link>
        <Link to={"/register"}>Register</Link>
      </div>:
        <div className='flex items-center gap-3'>
        <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200 cursor-pointer'  onClick={ProfileViewer}>
            {getInitials(userInfo.fullname)}

        </div>

      </div>

      }

    </div>

  )
}

export default ProfileInfo