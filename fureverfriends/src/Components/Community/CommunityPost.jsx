import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Box, TextField, IconButton, Snackbar, Alert } from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import './CommunityPost.css';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import PostList from './PostList';
import MyPostsList from './MyPostList'; 

function CommunityPost() {
    const [postContent, setPostContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); 
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

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    className="community-headings-container"
                    px={2}
                    mt={4}
                    gap={6}
                >
                    <Typography
                        variant="h5"
                        className="community-posts-headline"
                        onClick={() => setActiveTab('all')}
                        style={{
                            cursor: 'pointer',
                            fontWeight: activeTab === 'all' ? 'bold' : 'normal',
                            textDecoration: activeTab === 'all' ? 'underline' : 'none',
                            color: '#333'
                        }}
                    >
                        POSTS
                    </Typography>

                    <Typography
                        variant="h5"
                        className="community-my-posts-headline"
                        onClick={() => setActiveTab('my')}
                        style={{
                            cursor: 'pointer',
                            fontWeight: activeTab === 'my' ? 'bold' : 'normal',
                            textDecoration: activeTab === 'my' ? 'underline' : 'none',
                            color: '#333'
                        }}
                    >
                        MY POSTS
                    </Typography>
                </Box>

                {activeTab === 'all' ? <PostList /> : <MyPostsList />}

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
