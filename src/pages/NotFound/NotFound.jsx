import React from 'react'
import { Link } from 'react-router-dom'
import { TbError404Off } from "react-icons/tb";
import Navbar from '../../components/Navbar/Navbar';
function NotFound() {
  return (
    <div>
            <Navbar/>
    <div className='bg-[#212121] text-white items-center justify-center flex flex-col gap-4 h-screen'>
        <TbError404Off className='text-7xl' color='yellow'/>
       <h2 className='text-7xl font-semibold'>404 Page Not Found</h2>
       <p className='text-orange-400'>Please check the url the page your are looking for is not available</p>  
    </div>

    </div>

  )
}

export default NotFound