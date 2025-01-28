import React, { useEffect, useState, useRef} from 'react'
import './Navbar.css'
import {useNavigate} from 'react-router-dom';

export const Navbar = ({user}) => {
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState (false);
  const serviceDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

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
        <img src="./logo.png" alt="logo" className='logo' />
        <ul className="navbar-menu">
            <li>Home</li>
            <li className='dropdown' onClick={toggleServicesDropdown} ref={serviceDropdownRef}>
              Services <span className={serviceDropdownOpen ? 'arrow-up' : 'arrow-down'}> ▼</span>
              {serviceDropdownOpen && (
                <ul className='dropdown-menu'>
                  <li onClick={(e) => handleDropdownItemClick(e, '/service1')}>Service 1</li>
                  <li onClick={(e) => handleDropdownItemClick(e, '/service2')}>Service 2</li>
                  <li onClick={(e) => handleDropdownItemClick(e, '/service3')}>Service 3</li>

                </ul>
              )}
              </li>
            <li>About</li>
            <li className='dropdown' onClick={toggleProfileDropdown} ref={profileDropdownRef}>
              {user ?`${user.name}`: "welcome Guest"}<span className={profileDropdownOpen ? 'arrow-up' : 'arrow-down'}>▼</span>
              {profileDropdownOpen && (
                <ul className="dropdown-menu">
                  <li onClick={(e) => handleDropdownItemClick(e, '/manageprofile')}>Profile</li>
                  <li onClick={(e) => handleDropdownItemClick(e, '/profile2')}>Profile 2</li>
                  <li onClick={(e) => handleDropdownItemClick(e, '/profile3')}>Profile 3</li>

                </ul>
              )}
              </li>
        </ul>
    </div>
  );
};

export default Navbar;
