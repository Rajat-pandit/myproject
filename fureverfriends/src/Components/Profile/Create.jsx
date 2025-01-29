import React, {useRef, useState} from 'react'
import './Create.css'
import {Grid2, Button, Paper, TextField, Typography, Alert} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Create = () => {
    const navigate= useNavigate();
    const fileInputRef= useRef(null);
    const [imagePreview, setImagePreview]= useState('./profile.png');
    const [photoUploaded, setPhotoUploaded]= useState(false);
    const [error, setError]= useState('');

    const [petsname, setPetsname]= useState('');
    const [breed, setBreed]= useState('');
    const [age, setAge]= useState('');
    const [contactnumber, setContactnumber]= useState('');

    const handleCreate= async (event) => {
        event.preventDefault();
        if (!photoUploaded){
            setError('Please upload your pet\'s picture.');
            return;
        }
        setError('');

        const formData = new FormData();
        formData.append('petsname', petsname);
        formData.append('breed', breed);
        formData.append('age', age);
        formData.append('contactnumber', contactnumber);
        formData.append('photo', fileInputRef.current.files[0]);

        try{
            await axios.post("http://localhost:3001/profiles", formData, {
                headres: {
                    'Content-Type' : 'multipart/form-data', 
                },
                withCredentials: true,
            });
            navigate('/manageprofile');
        } catch (err){
            console.error('Error uploading data:', err);
            setError('Failed to create pet profile.');
        }
    };
    
    const handleImageClick = () =>{
        fileInputRef.current.click();
    };

    const handleFileChange= (event)=> {
        const file= event.target.files[0];
        if (file){
            const validTypes= ['image/jpeg', 'image.png'];
            if (!validTypes.includes(file.type)){
                setError('Please upload a valid image (JPG, PNG');
                setPhotoUploaded(false);
                return;
            }

            const reader= new FileReader();
            reader.onloadend= () => {
                setImagePreview(reader.result);
                setPhotoUploaded(true);
                setError('');
            };
            reader.readAsDataURL(file);
        
        }
        
    };

  return (
       <div align="center" className="container">
        <div className="create">'
            <Grid2 justifyContent="center" alignItems="center" className="wrapper">
                <Paper className='paperStyle' sx={{
                    width: {
                        xs: '80vw',
                        sm: '50vw',
                        md: '40vw',
                        lg: '38vw',
                        xl: '25vw',
                    },
                    height: {
                        lg: '85vh',
                    }
                }}>
                    <Typography component="h1" variant="h5" className='heading'>Create Profile</Typography>
                    <form onSubmit={handleCreate}>
                        <TextField className='row' required sx={{marginBottom: "20px", label:{fontWeight: '600', fontSize: '1.3rem'}}} fullWidth type='text' label="Pet's Name" placeholder= "Enter Name" name="petname" value={petsname} onChange={(e) => setPetsname(e.target.value)}></TextField>
                        <TextField className='row' required sx={{marginBottom: "20px", label:{fontWeight: '600', fontSize: '1.3rem'}}} fullWidth type='text' label="Breed" variant='outlined' placeholder= "Enter Breed" name="breed" value={breed} onChange={(e) => setBreed(e.target.value)}></TextField>
                        <TextField className='row' required sx={{marginBottom: "20px", label:{fontWeight: '600', fontSize: '1.3rem'}}} fullWidth type='number' label="Age" variant='outlined' placeholder= "Enter Age" name="age" value={age} onChange={(e) => setAge(e.target.value)}></TextField>
                        <TextField className='row' required sx={{marginBottom: "20px", label:{fontWeight: '600', fontSize: '1.3rem'}}} fullWidth type='tel' label="Contact Number" variant='outlined' placeholder= "Enter Contact Number" name="number" value={contactnumber} onChange={(e) => setContactnumber(e.target.value)}></TextField>
                        <Button className='btnstyle' variant='contained' type='submit'>Create</Button>
                    </form>
                    {error && <Alert severity='error' style={{marginTop:'20px'}}>{error}</Alert>}
                </Paper>
            </Grid2>
        </div>

        <div className="image" onClick={handleImageClick}>
            <img src={imagePreview} alt="profile" />
            <p>*Upload Your Pet's Picture</p>
            <input type="file"
            ref={fileInputRef}
            style={{display:'none'}}
            onChange={handleFileChange} 
            />
        </div>
       </div>
  );
};

export default Create;