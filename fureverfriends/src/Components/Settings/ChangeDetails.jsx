import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, Typography, Avatar } from '@mui/material';
import axios from 'axios';
import './ChangeDetails.css';

const ChangeDetails = ({ setUser }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user', { withCredentials: true });
        console.log('User Details Response:', response);
        setName(response.data.user.name);
  
        if (response.data.user.image) {
          const imagePath = response.data.user.image.replace(/\\/g, '/');
          console.log('Image path:', imagePath);
          setPreviewImage(`http://localhost:3001/${imagePath}`);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        console.log('Error Response:', error.response);
      }
    };
  
    fetchUserDetails();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put('http://localhost:3001/user/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.data.user) {
        setUser(response.data.user);
        setName(response.data.user.name);
        setPreviewImage(`http://localhost:3001/uploads/${response.data.user.image}`); 
      } else {
        console.error('Failed to update user details');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="change-details-card">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Change Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Change Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
            className="change-details-field"
          />

          <div style={{ marginTop: 16, marginBottom: 8 }}>
            <Typography variant="subtitle1">Current / New Profile Image:</Typography>
            {previewImage && (
              <Avatar
                src={previewImage}
                alt="Profile"
                sx={{ width: 80, height: 80, marginTop: 1 }}
              />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="upload-photo"
            style={{ display: 'none' }}
          />
          <label htmlFor="upload-photo">
            <Button
              variant="outlined"
              component="span"
              style={{ marginTop: 8 }}
            >
              Choose a Picture
            </Button>
          </label>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="change-details-btn"
            style={{ marginTop: 16 }}
          >
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangeDetails;


