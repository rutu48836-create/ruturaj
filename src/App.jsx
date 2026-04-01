import { useState } from 'react'
import { Dashboard } from './Frontend/Pages/Dasboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LOGIN } from './Frontend/Pages/Login'
import { ChatPage } from './Frontend/Pages/ChatPage'
import { Terms } from './Frontend/Pages/Terms'
import { Contact } from './Frontend/Pages/Contact'
import { About } from './Frontend/Pages/About'
import { Homepage } from './Frontend/Pages/Homepage'
import { Guide } from './Frontend/Pages/Guide'
import {Privacy} from './Frontend/Pages/Privacy'

function App() {
 
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Login" element={<LOGIN/>}/>
               <Route path="/chat/:shareToken" element={<ChatPage />} />
               <Route path="/Terms" element={<Terms/>}/>
               <Route path="/Contact" element={<Contact/>}/>
               <Route path="/About" element={<About/>}/>
               <Route path="/" element={<Homepage/>}/>
               <Route path="/Guide" element={<Guide/>}/>
               <Route path="/Privacy" element={<Privacy/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
