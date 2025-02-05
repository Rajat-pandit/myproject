import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import {CircularProgress, Box} from '@mui/material';
import './Profile.css';

const PetDetails = ({user}) => {
    const {petId} = useParams();
    const [petData, setPetData]= useState(null);

    useEffect(() =>{
        axios.get(`http://localhost:3001/api/profiles/${petId}`, {withCredentials: true})
            .then(response => {
                setPetData(response.data);
            })
            .catch(error => {
                console.error('Error fetching pet data:', error);
            });
    }, [petId]);

    if (!petData){
        return(
            <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

  return (
    <>
    <Navbar user={user}/>
    <div className="pet-details">
        <div className="left-section">
            <img src={`http://localhost:3001/${petData.image.replace(/\\/g, '/')}`} alt={petData.petsName}/>
            <h1>{petData.petsName}</h1>

            <div className="options">
                <ul>
                    <li>Medical Records</li>
                    <li>Reminders</li>
                    <li>Edit Profile</li>
                </ul>
            </div>
        </div>

        <div className="right-section">
            <p>Owner's Name: {petData.ownerName}</p>
            <p>Email: {petData.ownerEmail}</p>
            <p>Age: {petData.age}</p>
            <p>Breed: {petData.breed}</p>
            <p>Contact Number: {petData.contactNumber}</p>
        </div>
    </div>

    </>
  );
};

export default PetDetails;