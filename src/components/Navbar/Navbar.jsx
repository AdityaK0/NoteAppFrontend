import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate , Link} from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import axiosInstance from '../../utils/axiosInstance'
import axios from 'axios'

function Navbar({userInfo,onSearchNote,onSearchClear}) {
  
  const [searchQuery,setSearchQuery] = useState("")
  const navigate = useNavigate();
  
  const onLogout = ()=>{
    localStorage.clear()
    navigate("/login")
  }
  const handleSearch = async ()=>{
      searchQuery?onSearchNote(searchQuery):""
  }
  const onClearSearch = ()=>{
    setSearchQuery("")
    onSearchClear()
  }

  return (
    <div  className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className='text-xl font-medium text-black py-2' > <Link to="/">Notes</Link> </h2>
      <SearchBar value={searchQuery} onChange={({target})=>{
                                                        setSearchQuery(target.value);
                                                          }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
    </div>
  )
}

export default Navbar