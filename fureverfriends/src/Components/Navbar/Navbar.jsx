import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user', {
          withCredentials: true, 
        });

        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    fetchUserData();
  }, []);


  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
  };
 
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) &&
        (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target))
      ) {
        setServicesDropdownOpen(false);
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownItemClick = (e, route) => {
    e.stopPropagation();
    navigate(route);
    setServicesDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = async (e) => {
    e.stopPropagation();
    try {
      // Send logout request to backend to destroy session
      await axios.get('http://localhost:3001/logout', { withCredentials: true });

      // Remove login-related data from local storage
      localStorage.removeItem('userName');
      localStorage.removeItem('userImage');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');

      // Clear user state
      setUser(null);
      navigate('/'); 
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className='navbar'>
      <img src='/logo.png' alt="logo" className='logo' />
      <ul className='navbar-menu'>
        <li onClick={() => navigate("/home")}>Home</li>
        <li className='dropdown' onClick={toggleServicesDropdown} ref={servicesDropdownRef}>
          Services <span className={servicesDropdownOpen ? 'arrow-up' : 'arrow-down'}>▼</span>
          {servicesDropdownOpen && (
            <ul className='dropdown-menu'>
              <li onClick={(e) => handleDropdownItemClick(e, '/vet')}>Veterinary Service</li>
              <li onClick={(e) => handleDropdownItemClick(e, '/adoption')}>Adoption</li>
              <li onClick={(e) => handleDropdownItemClick(e, '/card')}>Emergency Card</li>
            </ul>
          )}
        </li>
        <li>About</li>
        <li onClick={() => navigate('/community')}>Community</li>
        <li className='dropdown' onClick={toggleProfileDropdown} ref={profileDropdownRef}>
          {user ? (
            <div className='profile'>
              {user.image ? (
                <img
                  src={`http://localhost:3001/${user.image.replace(/\\/g, '/')}`}
                  alt={user.name}
                  className='profile-image'
                />
              ) : (
                <img
                  src='/default-avatar.jpg'
                  alt="Default Avatar"
                  className='profile-image'
                />
              )}
              <span>{user.name}</span>
              <span className={profileDropdownOpen ? 'arrow-up' : 'arrow-down'}>▼</span>
            </div>
          ) : (
            <button onClick={() => navigate('/login')}>Login</button>  
          )}
          {profileDropdownOpen && user && (
            <ul className='dropdown-menu'>
              <li onClick={(e) => handleDropdownItemClick(e, '/manageprofile')}>Profile</li>
              <li onClick={(e) => handleDropdownItemClick(e, '/settings')}>Settings</li>
              <li onClick={handleLogout}>Log Out</li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;

