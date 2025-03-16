import React, {useState} from 'react';
import {TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import axios from 'axios';
import './EmergencyCard.css'
import Navbar from '../Navbar/Navbar';

const EmergencyCard= ({user}) => {
    const [petName, setPetName]= useState('');
    const [ownerName, setOwnerName]= useState('');
    const [contactNumber, setContactNumber]= useState('');
    const [emergencyText, setEmergencyText]= useState('');
    const [successMessage, setSuccessMessage]= useState('');
    const [recipientEmail, setRecipientEmail]= useState('');
    const [openDialog, setOpenDialog]= useState(false);

    const handleOpenDialog = (e)=>{
        e.preventDefault();
        setOpenDialog(true);
    };

    const handleCloseDialog= () => {
        setOpenDialog(false);
    };

    const handleConfirmSubmit = async () => {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            console.log('User email not found in local storage.');
            setSuccessMessage('USer email not found. please log in again');
            return;
        }

        const emergencyCardData = {
            petName,
            ownerName,
            contactNumber,
            emergencyText,
            recipientEmail,
            senderEmail: userEmail,
        };

        try{
            const response = await axios.post('http://localhost:3001/emergency-card', emergencyCardData);
            if (response.status ===200){
                const emergencyCardId= response.data._id;
                const emailData = {
                    emergencyCardId,
                };

                await axios.post('http://localhost:3001/send-email', emailData);
                setSuccessMessage('Emergency card saved and email sent successfully.');
                setPetName('');
                setOwnerName('');
                setContactNumber('');
                setEmergencyText('');
                setRecipientEmail('');
                setOpenDialog(false);
            }
        } catch (error) {
            console.error('Error sending emergency card!', error);
            setSuccessMessage('Failed to send email!');
        }
    };

    return (
        <Box sx={{maxWidth: 500, margin:'0 auto', marginTop:'20px', padding:'20px', boxShadow:'0 4px 8px rgba(0,0,0,0.1)', borderRadius:'8px', backgroundColor:'#f9f9f9',}}>
            <div className="navbars-container">
                <Navbar user={user}/>
            </div>

            <h4>Emergency Card</h4>
            <form onSubmit={handleOpenDialog} className='emergency-card-form'>
                <TextField label="Pet's Name" variant='outlined' fullWidth value={petName} onChange={(e) => setPetName(e.target.value)} required margin='normal'/>
                <TextField label="Owner's Name" variant='outlined' fullWidth value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required margin='normal'/>
                <TextField label="Contact Number" variant='outlined' fullWidth value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required margin='normal'/>
                <TextField label="Recipient Email" variant='outlined' fullWidth value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} required margin='normal'/>
                <TextField label="Emergency Text" variant='outlined'multiline rows={4} fullWidth value={emergencyText} onChange={(e) => setEmergencyText(e.target.value)} required margin='normal'/>

                <Button type='submit' variant='contained' color='primary' fullWidth>Submit Emergency Card</Button>
            </form>

            {successMessage && <div className='success'>{successMessage}</div>}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Email</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Is the recipient email correct? <strong>{recipientEmail}</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color='secondary'>Cancel</Button>
                    <Button onClick={handleConfirmSubmit} color='primary'>Confirm & Submit</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EmergencyCard;