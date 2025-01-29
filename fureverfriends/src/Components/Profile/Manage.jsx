import React, {useState, useEffect} from 'react'
import './Manage.css';
import {FaPlusCircle} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import Navbar from '../Navbar/Navbar'

export const Manage = ({user}) => {
    const navigate =useNavigate();
    const handleProfile =() => {
        navigate("/create");
    };

  return (
    <div className="manage-container">
        <Navbar user={user}/>
        
        <div className="profile-display">
            <div className="profile-item">
                <img src="" alt="" />
                <div className="profile-name">

                </div>
            </div>
        </div>
       <div className="add-profile-btn">
        <FaPlusCircle size={100} onClick={handleProfile}/>
        <h3>Add Profile</h3>
       </div>
    </div>
  )
}

export default Manage;