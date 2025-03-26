import React from 'react';
import {Container, Typography, Button, Box} from "@mui/material";
import './Community.css'
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

function Community(){
    const navigate = useNavigate();
    const handleJoinClick = ()=>{
        navigate('/comunitypost');
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
                <Button variant='contained' color='primary' className='join-button' size='large' onClick={handleJoinClick}>
                    Join Our community
                </Button>
            </Box>
        </Container>
        </>
    );
}

export default Community;