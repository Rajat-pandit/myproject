import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import Login from './Components/LoginSignup/Login';
import SignUp from './Components/LoginSignup/Signup';
import Home from './Components/Home/Home';
import Create from "./Components/Profile/Create";
import Manage from "./Components/Profile/Manage";
import PetDetails from "./Components/Profile/PetDetails";
import Adoption from "./Components/Services/Adoption";
import Medical from "./Components/Profile/Medical";
import Settings from "./Components/Settings/Settings";
import EmergencyCardForm from "./Components/Services/EmergencyCard";
import ForgotPassword from "./Components/LoginSignup/ForgotPassword";
import ResetPassword from "./Components/LoginSignup/ResetPassword";
import Community from "./Components/Community/Community";
import  CommunityPost  from "./Components/Community/CommunityPost";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);  // Store user data here

  return (
    <Router>
      <Routes>
        {/* Login and Signup Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/medical" element={<Medical />} />
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} 
        />
        <Route 
          path="/signup" 
          element={isLoggedIn ? <Navigate to="/home" /> : <SignUp />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={isLoggedIn ? <Home user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/manageprofile" 
          element={isLoggedIn ? <Manage user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/create" 
          element={isLoggedIn ? <Create /> : <Navigate to="/login" />} 
        />
        <Route path="/pet/:petId" element={isLoggedIn ? <PetDetails user={user}/> : <Navigate to="/login" />} />
        <Route path="/adoption" element={isLoggedIn ? <Adoption user={user}/> : <Navigate to="/login" />} />
        <Route path="/settings" element={isLoggedIn ? <Settings user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/card" element={isLoggedIn ? <EmergencyCardForm user={user}/> : <Navigate to="/login" />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/community" element={<Community />} />
        <Route path="/communitypost" element={isLoggedIn? <CommunityPost user={user}/> :<Navigate to="/login"/>} />


      </Routes>
    </Router>
  );
}

export default App;
