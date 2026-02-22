import { useState } from 'react'
import { Dashboard } from './Frontend/Pages/Dasboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LOGIN } from './Frontend/Pages/Login'
import { ChatPage } from './Frontend/Pages/ChatPage'

function App() {
 
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<LOGIN/>}/>
               <Route path="/chat/:shareToken" element={<ChatPage />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
