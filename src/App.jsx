import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './frontend/compoents/authcontext';
import { Home } from './frontend/pages/home';
import { Courses } from './frontend/pages/courses';
import { Lesson } from './frontend/pages/lesson';
import { User } from './frontend/pages/user';
import { Auth_page } from './frontend/pages/auth_';
import { Landing } from './frontend/pages/Landing';
import {Privacy} from './frontend/pages/privacy'
import {Terms} from './frontend/pages/terms'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/Dashboard" element={<Home/>}/>
          <Route path="/lesson/:id" element={<Lesson/>}/>
          <Route path="/courses" element={<Courses/>}/>
          <Route path="/auth" element={<Auth_page/>}/>
          <Route path="/User" element={<User/>}/>
          <Route path="/privacy" element={<Privacy/>}/>
          <Route path="/terms" element={<Terms/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;