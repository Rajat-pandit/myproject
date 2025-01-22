import React from 'react'
import './Navbar.css'
export const Navbar = ({user}) => {
  return (
    <div className='navbar'>
        <img src="./logo.png" alt="logo" className='logo' />
        <ul className="navbar-menu">
            <li>Home</li>
            <li>Services</li>
            <li>About</li>
            <li>{user ?`${user.name}`: "welcome Guest"}</li>
        </ul>
    </div>
  )
}
