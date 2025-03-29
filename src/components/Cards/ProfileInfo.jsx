import React from 'react'
import { getInitials } from '../../utils/helper'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ProfilePageCard from './ProfilePageCard';

function ProfileInfo({userInfo,onLogout}) {
  const navigate = useNavigate()
  const ProfileViewer = () =>{
    navigate(`/profile/${userInfo.username}`,{state:{userInfo}});
    
  }

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
      
        <div>
          <p className='text-sm font-medium'>{userInfo.fullname}</p>
          <button className='text-sm text-slate-700 underline' onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      }

    </div>

  )
}

export default ProfileInfo