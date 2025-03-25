import React, {useState, useEffect} from 'react'
import './Manage.css';
import {FaPlusCircle} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import axios from 'axios';

export const Manage = ({user}) => {
    const [profiles, setProfiles]= useState([]);
    const navigate =useNavigate();

    useEffect(()=>{
      axios.get('http://localhost:3001/api/profiles', {withCredentials: true})
          .then(response => {
            setProfiles(response.data);
          })
          .catch(error => {
            console.error('Error fetching profile data:', error);
          });
    }, []);

    const handlePetClick =(petId)=>{
      navigate(`/pet/${petId}`);
    };

    const handleProfile =() => {
        navigate("/create");
    };

  return (
    <div className="manage-container">
        <Navbar user={user}/>
        
        <div className="profile-display">
          {profiles.map((profile)=> (
                <div className="profile-item" key={profile._id} onClick={() => handlePetClick(profile._id)}>
                  <div className="petprofile-image">
                    <img src={`http://localhost:3001/${profile.image.replace(/\\/g, '/')}`} alt={profile.petsName}
                    style= {{width:120, height:120, border:'5px gray',borderRadius: '50%', objectFit:'cover',}} />
                    <div className="profile-name">
                      <h3>{profile.petsName}</h3>
                    </div>
                  </div>
                </div>

          ))}

<div className="add-profile-btn">
                    <FaPlusCircle size={100}  onClick={handleProfile} />
                    <h3>Add Profile</h3> 
                </div>
            </div>
        </div>
    );
};

            

export default Manage;