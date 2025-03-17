import React, {useState} from 'react';
import {TextField, Button, Card, CardContent, Typography, IconButton, InputAdornment, Snackbar} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import axios from 'axios';
import './ChangePassword.css';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword]= useState('');
    const [newPassword, setNewPassword]= useState('');
    const [confirmPassword, setConfirmPassword]= useState('');
    const [error, setError]= useState('');
    const [successMessage, setSuccessMessage]= useState('');
    const [loading, setLoading]= useState(false);
    const [showCurrentPassword, setShowCurrentPassword]= useState(false);
    const [showNewPassword, setShowNewPassword]= useState(false);
    const [showConfirmPassword, setShowConfirmPassword]= useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();

        if (newPassword !==confirmPassword){
            setError('New password and confirm password do not match!');
            return;
        }

        if (currentPassword === newPassword){
            setError('New password cannot be the same as the current password');
            return;
        }

        setLoading(true);
        setError('');

        try{
            const response = await axios.put('http://localhost:3001/change-password', {
                currentPassword, newPassword
            }, {withCredentials:true});

            setSuccessMessage(response.data.message);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err){
            setError(err.response?.data?.message || 'An error occurred while changing the password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="change-password-card">
            <CardContent>
                <Typography variant='h5' gutterBottom>
                    Change Password
                </Typography>
                <form onSubmit={handleSubmit} className='change-password-form'>
                    <TextField label="Current Password" type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}
                        fullwidth required margin='normal' InputProps={{endAdornment:(<InputAdornment position='end'>
                            <IconButton onClick={()=> setShowCurrentPassword(!showCurrentPassword)} edge='end'>
                                {showCurrentPassword ? <VisibilityOff/>:<Visibility/>}
                            </IconButton>
                        </InputAdornment>),
                    }}>
                    </TextField>

                    <TextField label="New Password" type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}
                        fullwidth required margin='normal' InputProps={{endAdornment:(<InputAdornment position='end'>
                            <IconButton onClick={()=> setShowNewPassword(!showNewPassword)} edge='end'>
                                {showNewPassword ? <VisibilityOff/>:<Visibility/>}
                            </IconButton>
                        </InputAdornment>),
                    }}>
                    </TextField>

                    <TextField label="Confirm New Password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
                        fullwidth required margin='normal' InputProps={{endAdornment:(<InputAdornment position='end'>
                            <IconButton onClick={()=> setShowConfirmPassword(!showConfirmPassword)} edge='end'>
                                {showConfirmPassword ? <VisibilityOff/>:<Visibility/>}
                            </IconButton>
                        </InputAdornment>),
                    }}>
                    </TextField>

                    <Button variant='contained' color='primary' type='submit' className='submit-button' disabled={loading}>
                        {loading ? 'Chnaging...' : 'Change Password'}
                    </Button>
                </form>

                <Snackbar open={Boolean(error)} message={error} onClose={()=>setError('')} autoHideDuration={5000}/>
                    <Snackbar open={Boolean(successMessage)} message={successMessage} onClose={()=> setSuccessMessage('')} autoHideDuration={5000}></Snackbar>
            </CardContent>
        </Card>
    );
};

export default ChangePassword;
