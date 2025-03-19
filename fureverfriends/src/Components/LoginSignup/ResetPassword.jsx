import React, {useState} from 'react';
import axios from 'axios';
import {TextField, Button, Typography, Paper} from "@mui/material";
import {useParams, useNavigate} from 'react-router-dom';

function ResetPassword(){
    const {token}= useParams();
    const navigate= useNavigate();
    const [newPassword, setNewPassword]= useState('');
    const [confirmPassword, setConfirmPassword]= useState('');
    const [message, setMessage]= useState('');
    const [loading, setLoading]= useState(false);

    const handleResetPassword = (e)=>{
        e.preventDefault();
        if(newPassword !== confirmPassword){
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        axios.post("http://localhost:3001/reset-password", {token, newPassword})
        .then((res)=> {
            setMessage("Password reset successfully!");
            setTimeout(()=> {
                navigate("/login");
            }, 2000);
        })
        .catch((err) =>{
            setMessage("Error resetting password. Please try again.");
        })
        .finally(()=>{
            setLoading(false);
        })
    };

    return(
        <Paper style={{padding:'2rem', margin:'100px auto', borderRadius:'1rem', maxWidth:'400px'}}>
            <Typography component="h1" variant='h5'>Reset Your Password</Typography>
            <form onSubmit={handleResetPassword}>
                <TextField label='New Password' fullWidth type='password' value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} required style={{marginTop:'1rem'}}/>
                <TextField label='Confirm Password' fullWidth type='password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required style={{marginTop:'1rem'}}/>
                <Button type='submit' variant='contained' color='primary' style={{marginTop:'1rem'}} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
            {message && <Typography style={{marginTop:'1rem'}}>{message}</Typography>}
        </Paper>
    );

};

export default ResetPassword;

