import React, {useState, useEffect} from 'react';
import {Card, CardContent, TextField, Button, Typography} from '@mui/material';
import axios from 'axios';
import './ChangeDetails.css';

const ChangeDetails = ({onUpdate}) => {
    const [name, setName]= useState('');
    const [email, setEmail]= useState('');

    useEffect(()=> {
        const fetchUserDetails= async()=>{
            try{
                const response= await axios.get('http://localhost:3001/user', {withCredentials:true});
                setName(response.data.user.name);
                setEmail(response.data.user.email);
            } catch (error){
                console.error('Error fetching user details:',error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleSubmit= async (e) => {
        e.preventDefault();
        const updatedDetails= {name, email};
        console.log("Sending request with:", updatedDetails);

        try{
            const response= await axios.put('http://localhost:3001/user/update', updatedDetails, {withCredentials:true});
            if(response.data.user){
                onUpdate(response.data.user);
            } else{
                console.error('Failed to update user details');
            }
        } catch (error){
            console.log('Error updating user details:', error);
        }
    };

    return(
        <Card className="change-details-card">
            <CardContent>
                <Typography variant='h5'>
                    Change Details
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField label='Change Name' value={name} onChange={(e)=> setName(e.target.value)} fullWidth required margin='normal' className='change-details-field'></TextField>
                    <TextField label='Change Email' value={email} onChange={(e)=> setEmail(e.target.value)} fullWidth required margin='normal' className='change-details-field'></TextField>
                    <Button variant='contained' color='primary' type='submit' className='change-details-btn'>
                        Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
    
};

export default ChangeDetails;