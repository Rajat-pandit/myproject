import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import EditProfile from './EditProfile';
import Medical from './Medical';
import {CircularProgress, Box} from '@mui/material';
import './Profile.css';

const PetDetails = ({user}) => {
    const {petId} = useParams();
    const [petData, setPetData]= useState(null);
    const [isEditMode, setIsEditMode]= useState(false);
    const [isMedicalMode, setIsMedicalMode]= useState(false);

    useEffect(() =>{
        axios.get(`http://localhost:3001/api/profiles/${petId}`, {withCredentials: true})
            .then(response => {
                setPetData(response.data);
            })
            .catch(error => {
                console.error('Error fetching pet data:', error);
            });
    }, [petId]);

    const handleEditClick= ()=>{
        setIsEditMode(true);
    }

    const handleMedicalClick= () =>{
        setIsMedicalMode(true);
    }

    const handleSaveChanges =(updatedPetData)=>{
        setPetData(updatedPetData);
        setIsEditMode(false);
    }

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
                    <li onClick={handleMedicalClick}>Medical Records</li>
                    <li>Reminders</li>
                    <li onClick={handleEditClick}>Edit Profile</li>
                </ul>
            </div>
        </div>

        <div className="right-section">
             {isMedicalMode ? (
                <Medical petId={petId}/>):
                isEditMode ? (
                <EditProfile petData={petData} onSaveChanges={handleSaveChanges}></EditProfile>
            ) : (
                <>
                            <p>Owner's Name: {petData.ownerName}</p>
                            <p>Email: {petData.ownerEmail}</p>
                            <p>Age: {petData.age}</p>
                            <p>Breed: {petData.breed}</p>
                            <p>Contact Number: {petData.contactNumber}</p>
                        </>
            )}
        </div>
    </div>

    </>
  );
};

export default PetDetails;