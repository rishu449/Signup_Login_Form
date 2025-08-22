import { useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './assets/components/Signup'
import Login from './assets/components/Login'
import UserDashboard from './assets/components/UserDashboard'
import { ToastContainer } from 'react-toastify'

function App() {


  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/'element={<Signup/>}/>
      <Route path='/login'element={<Login/>}/>
      <Route path='/userdashboard'element={<UserDashboard/>}/>
     </Routes>
     <ToastContainer />
     </BrowserRouter>
    </>
  )
}

export default App
