import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import EditProfile from './EditProfile';
import Medical from './Medical';
import Reminder from './ReminderForm';
import Appointment from './Appointment'; // <-- Import Appointment component
import { CircularProgress, Box } from '@mui/material';
import './Profile.css';

const PetDetails = ({ user }) => {
    const { petId } = useParams(); 
    const [petData, setPetData] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isMedicalMode, setIsMedicalMode] = useState(false);
    const [isReminderMode, setIsReminderMode] = useState(false);
    const [isAppointmentMode, setIsAppointmentMode] = useState(false); 

    useEffect(() => {
        axios.get(`http://localhost:3001/api/profiles/${petId}`, { withCredentials: true })
            .then(response => {
                setPetData(response.data);
            })
            .catch(error => {
                console.error('Error fetching pet data:', error);
            });
    }, [petId]);

    const handleEditClick = () => {
        setIsEditMode(true);
        setIsMedicalMode(false);
        setIsReminderMode(false);
        setIsAppointmentMode(false);
    };

    const handleMedicalClick = () => {
        setIsMedicalMode(true);
        setIsEditMode(false);
        setIsReminderMode(false);
        setIsAppointmentMode(false);
    };

    const handleReminderClick = () => {
        setIsReminderMode(true);
        setIsMedicalMode(false);
        setIsEditMode(false);
        setIsAppointmentMode(false);
    };

    const handleAppointmentClick = () => {
        setIsAppointmentMode(true); 
        setIsMedicalMode(false);
        setIsEditMode(false);
        setIsReminderMode(false);
    };

    const handleSaveChanges = (updatedPetData) => {
        setPetData(updatedPetData);
        setIsEditMode(false);
    };

    if (!petData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Navbar user={user} />
            <div className="pet-details">
                <div className="left-section">
                    <img
                        src={`http://localhost:3001/${petData.image.replace(/\\/g, '/')}`}
                        alt={petData.petsName}
                    />
                    <h1>{petData.petsName}</h1>

                    <div className="options">
                        <ul>
                            <li onClick={handleMedicalClick}>Medical Records</li>
                            <li onClick={handleReminderClick}>Reminders</li>
                            <li onClick={handleEditClick}>Edit Profile</li>
                            <li onClick={handleAppointmentClick}>Appointments</li>
                        </ul>
                    </div>
                </div>

                <div className="right-section">
                    {isAppointmentMode ? (
                        <Appointment petName={petData.petsName} /> 
                    ) : isReminderMode ? (
                        <Reminder petId={petId} />
                    ) : isMedicalMode ? (
                        <Medical petId={petId} />
                    ) : isEditMode ? (
                        <EditProfile petData={petData} onSaveChanges={handleSaveChanges} />
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
