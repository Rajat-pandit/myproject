import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import Login  from './Components/LoginSignup/Login';
import Signup from './Components/LoginSignup/Signup';
import Home from './Components/Home/Home';
import Manage from "./Components/Profile/Manage";
import Create from "./Components/Profile/Create";

function App() {
  const [isLoggedIn, setIsLoggedIn]= useState(false);
  const [user, setUser]= useState(null);
 
  return (
    
      <Router>
        <Routes>
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} 
        />
         <Route 
          path="/signup" 
          element={isLoggedIn ? <Navigate to="/home" /> : <Signup />} 
        />
        <Route 
          path="/home" 
          element={isLoggedIn ? <Home user={user} /> : <Navigate to="/login" />} 
        />
        <Route path="/manageprofile" element= {isLoggedIn ? <Manage user={user}/> : <Navigate to ="/login"/>}
        />
        <Route path="/create" element={isLoggedIn ? <Create/> : <Navigate to="/login"/>}/>
        </Routes>
      </Router>
    
  );
}

export default App;
