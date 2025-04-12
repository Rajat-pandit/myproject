import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Box, TextField, IconButton, Snackbar, Alert } from '@mui/material'; 
import { PhotoCamera, Close } from '@mui/icons-material';  
import './CommunityPost.css';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';  
import PostList from './PostList'; 

function CommunityPost() {
    const [postContent, setPostContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false); 
    const fileInputRef = useRef(null); 

    const handlePost = async () => {
        if (postContent || selectedImage) {
            const formData = new FormData();
            
            const userName = localStorage.getItem('userName');
            const userImage = localStorage.getItem('userImage');
            
            if (!userName || !userImage) {
                alert('User information not found! Please login again.');
                return;
            }

            formData.append('postContent', postContent);
            formData.append('userName', userName);
            formData.append('userImage', userImage);

            if (selectedImage) {
                const imageFile = fileInputRef.current.files[0];
                formData.append('image', imageFile);
            }

            try {
                const response = await axios.post('http://localhost:3001/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
                console.log('Post created:', response.data);
                setPostContent('');
                setSelectedImage(null);
                fileInputRef.current.value = null;
                setSnackbarOpen(true);
            } catch (error) {
                console.log('Full error:', error);
                console.log('Error response:', error.response);
                console.error('Error creating post:', error.response?.data?.error || error.message);
            }
        } else {
            alert('Please write something before posting!');
        }
    };

   
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); 
        }
    };

  
    const handleRemoveImage = () => {
        setSelectedImage(null); 
        fileInputRef.current.value = null; 
    };

   
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false); 
    };

    return (
        <>
            <Navbar />
            <Container maxWidth={false} disableGutters>
                <Box className="community-post-section">
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Something on your mind?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="community-post-input"
                    />
                    <Box className="community-button-container">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePost}
                            className="community-post-button"
                        >
                            Post
                        </Button>
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                            className="community-media-button"
                        >
                            <input
                                ref={fileInputRef} 
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageUpload}  
                            />
                            <PhotoCamera />  
                        </IconButton>
                    </Box>
                    {selectedImage && (
                        <Box className="image-preview" position="relative">
                            <img src={selectedImage} alt="Selected" className="preview-image" />
                            <IconButton
                                className="remove-image-button"
                                onClick={handleRemoveImage}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    )}
                </Box>
                <Typography variant="h4" className="community-posts-headline">
                    POSTS
                </Typography>
                <PostList />
                <Snackbar
                    open={snackbarOpen} 
                    autoHideDuration={3000} 
                    onClose={handleCloseSnackbar} 
                >
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Your post has been successfully posted!
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
}

export default CommunityPost;
