
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login  from './Components/LoginSignup/Login';
import Signup from './Components/LoginSignup/Signup';
import Home from './Components/Home/Home';

function App() {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
