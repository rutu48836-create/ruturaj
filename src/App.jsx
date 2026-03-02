import { useState } from 'react'
import { Dashboard } from './Frontend/Pages/Dasboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LOGIN } from './Frontend/Pages/Login'
import { ChatPage } from './Frontend/Pages/ChatPage'
import { Terms } from './Frontend/Pages/Terms'
import { Contact } from './Frontend/Pages/Contact'
import { About } from './Frontend/Pages/About'

function App() {
 
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<LOGIN/>}/>
               <Route path="/chat/:shareToken" element={<ChatPage />} />
               <Route path="/Terms" element={<Terms/>}/>
               <Route path="/Contact" element={<Contact/>}/>
               <Route path="/About" element={<About/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
