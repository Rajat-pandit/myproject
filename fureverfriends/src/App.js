
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login  from './Components/LoginSignup/Login';

function App() {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
