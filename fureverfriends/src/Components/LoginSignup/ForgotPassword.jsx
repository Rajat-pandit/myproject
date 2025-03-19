import React, {useState} from 'react';
import axios from 'axios';
import {TextField, Button, Typography, Paper} from '@mui/material';
import './ForgotPassword.css';

function ForgotPassword(){
    const [email, setEmail]= useState('');
    const [message, setMessage]= useState('');

    const handleForgotPassword = (e)=>{
        e.preventDefault();
        axios.post("http://localhost:3001/forgot-password", {email}, {withCredentials:true})
        .then((res) => {
            setMessage(res.data.message);

        })
        .catch((err)=>{
            setMessage("Something went wrong. Please try again.");
        });

        };

        return(
            <Paper className='forgot-password-container'>
                <Typography component='h1' variant='h5' className='forgot-password-heading'>
                    Forgot Password
                </Typography>
                <form onSubmit={handleForgotPassword} className='forgot-password-form'>
                    <TextField label="Enter Your Registered Email" fullWidth type='email' value={email} onChange={(e)=>setEmail(e.target.value)} required></TextField>
                    <Button type='submit' variant='contained' color='primary' className='forgot-password-button'>
                        Send Reset Link
                    </Button>
                </form>
                {message && <Typography className='forgot-password-message'>{message}</Typography>}
            </Paper>
        );
    }

export default ForgotPassword;