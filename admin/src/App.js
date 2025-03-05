import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; 
import Dashboard from "./Components/Dashboard";
import AdoptionRequests from "./Components/Adoption/AdoptionRequest";
import PetManagement from "./Components/PetManagement/PetManagement";
import UserList from "./Components/UserManagement/UserList";
import SignUp from "./Components/LoginSignUp/SignUp";
import Login from "./Components/LoginSignUp/Login";
import ViewProfile from "./Components/UserManagement/ViewProfile";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/adoptions" element={<AdoptionRequests />} />
      <Route path="/admin/pets" element={<PetManagement/>}></Route>
      <Route path="/admin/users" element={<UserList/>}></Route>
      <Route path="/admin/signup" element={<SignUp/>}></Route>
      <Route path="/admin/login" element={<Login/>}></Route>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/user/:userEmail/view" element={<ViewProfile />} />


      </Routes>
    </Router>
  );
}

export default App;
