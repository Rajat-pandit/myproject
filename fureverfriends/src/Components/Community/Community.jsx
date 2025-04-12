import React, { useEffect, useState } from 'react';
import {Container, Typography, Button, Box} from "@mui/material";
import './Community.css'
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

function Community(){
    const navigate = useNavigate();
    const [hasJoined, setHasJoined]= useState(false);

    useEffect(()=> {
        const joined= localStorage.getItem('hasJoinedCommunity');
        if (joined === 'true'){
            setHasJoined(true);
            navigate('/communitypost');
        }
    }, [navigate]);

    const handleJoinClick = ()=>{
        localStorage.setItem('hasJoinedCommunity', 'true'); //Mark the user as joined by saving to localstorage
        setHasJoined(true); //update the state
        navigate('/communitypost'); //Navigate to the posts portion
    };

    return (
        <>
        <Navbar/>
        <Container maxWidth={false} disableGutters>
            <Box className="banner">
                <Typography variant='h2' className='banner-caption'>
                    Welcome to the Furever Friends Community
                </Typography>
                <Typography variant='h5' className='banner-subcaption'>
                    Connect with fellow pet lovers, share stories, and join the community!
                </Typography>
            </Box>

            <Box className='join-section'>
                <Button variant='contained' color='primary' className='join-button' size='large' onClick={handleJoinClick} disabled={hasJoined}>
                   {hasJoined ? 'You are already a member' : 'Join our Community'}
                </Button>
            </Box>
        </Container>
        </>
    );
}

export default Community;