import { useState } from 'react'
import './App.css'
import Home from './pages/Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import NotFound from './pages/NotFound/NotFound'
import ProfilePageCard from './components/Cards/ProfilePageCard'
import Navbar from './components/Navbar/Navbar'


function App() {


 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/dashboard" element={<Home />} />
        <Route path="/profile/:username" element={<ProfilePageCard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='*' element={<NotFound/>}/>
      
      </Routes>
    </Router>
  )
}

export default App
