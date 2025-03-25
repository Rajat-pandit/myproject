import React, { useEffect, useState, useRef} from 'react'
import './Navbar.css'
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';



export const Navbar = () => {
  const [user, setUser]= useState(null);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState (false);
  const serviceDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();


  useEffect(()=>{
    const fetchUserData= async()=>{
      try{
        const response= await axios.get('http://localhost:3001/user', {
          withCredentials:true,
        });
        if(response.data.user){
          setUser(response.data.user)
           console.log("User Image:", response.data.user.image);
        } else {
          setUser(null);
        }
      } catch (error){
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  const toggleServicesDropdown =() => {
    setServiceDropdownOpen(!serviceDropdownOpen);
  };
  const toggleProfileDropdown = () =>{
    setProfileDropdownOpen(!profileDropdownOpen);
  }; 

  useEffect(() => {
    const handleClickOutside = (event) =>{
      if(
        (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) &&
        (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) )
      ){
        setServiceDropdownOpen(false);
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return() => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownItemClick = (e, route)=> {
    e.stopPropagation();
    navigate(route);
    setServiceDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <div className='navbar'>
        <img src="/logo.png" alt="logo" className='logo' />
        <ul className="navbar-menu">
            <li onClick={()=> navigate("/home")}>Home</li>
            <li className='dropdown' onClick={toggleServicesDropdown} ref={serviceDropdownRef}>
              Services <span className={serviceDropdownOpen ? 'arrow-up' : 'arrow-down'}> ▼</span>
              {serviceDropdownOpen && (
                <ul className='dropdown-menu'>
                  <li onClick={(e) => handleDropdownItemClick(e, '/service1')}>Service 1</li>
                  <li onClick={(e) => handleDropdownItemClick(e, '/adoption')}>Adoption</li>
                  <li onClick={(e) => handleDropdownItemClick(e, '/card')}>Emergency Card</li>

                </ul>
              )}
              </li>
            <li>About</li>
            <li className='dropdown' onClick={toggleProfileDropdown} ref={profileDropdownRef}>
              {user ? (
                <div className="profile">
                  {user.image ? (
                    <img src= {`http://localhost:3001/${user.image.replace(/\\/g, '/')}`} alt={user.name} className='profile-image'/>
                  ):(
                    <img src='/default-avatar.jpg' alt='Default Avatar' className='profile-image'/>
                  )}
                  <span>{user.name}</span>
                  <span className={profileDropdownOpen ? 'arrow-up' : 'arrow-down'}>▼</span>
                </div>
              ) : (
                <Link to= "/login">
                  <button>Login</button>
                </Link>
              )}
              {profileDropdownOpen && user && (
                <ul className='dropdown-menu'>
                  <li onClick={(e)=> handleDropdownItemClick(e, '/manageprofile')}>Profile</li>
                  <li onClick={(e)=> handleDropdownItemClick(e, '/settings')}>Settings</li>
                  <li onClick={(e)=> handleDropdownItemClick(e, '/profile3')}>Profile 3</li>

                </ul>
              )}
              </li>
        </ul>
    </div>
  );
};

export default Navbar;
