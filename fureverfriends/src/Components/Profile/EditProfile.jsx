import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {TextField, Button, Typography, Box} from '@mui/material';
import Modal from '../Modal/Modal';
import './EditProfile.css'

const EditProfile = ({petData, onSaveChanges}) => {
    const {petId} = useParams();
    const [formData, setFormData]= useState({
        petsName: petData.petsName,
        ownerName: petData.ownerName,
        ownerEmail: petData.ownerEmail,
        age: petData.age,
        breed: petData.breed,
        contactNumber: petData.contactNumber,
        image: petData.image,
    });
    const [loading]= useState(false);
    const [error, setError]= useState(null);
    const [isFormValid, setIsFormValid]= useState(true);
    const [validationErrors, setValidationErrors]= useState({});
    const [showModal, setShowModal]= useState(false);

    const handleChange= (e)=> {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]:'',
        }));
    };

    const handleImageChange= (e)=> {
        const file= e.target.files[0];
        if(file){
            if(file.type.startsWith('image/')){
                setFormData((prevData) => ({
                    ...prevData,
                    image: file,
                }));
                setError(null);
            } else{
                setError('Please upload a valid image file.')
            }
        }
    };

    const validateForm= ()=>{
        const errors={};
        if(!formData.petsName) errors.petsName='pet\'s name is required';
        if(!formData.ownerName) errors.ownerName= 'Owner\'s name is required';
        if(!formData.ownerEmail) errors.ownerEmail= 'Owner\'s email is required.';
        if(!formData.age) errors.age= 'Age is required';
        if(!formData.breed) errors.breed= 'Breed is required';
        if(!formData.contactNumber) errors.contactNumber= 'Contact Number is required';

        setValidationErrors(errors);
        return Object.keys(errors).length===0;
    };

    const handleSubmit= (e) => {
        e.preventDefault();
        if (!validateForm()){
            setIsFormValid(false);
            return;
        }
        setError(null);

        const formDataToSubmit= new FormData();
        for(const key in formData){
            if(key === 'image' && formData[key] instanceof File){
                formDataToSubmit.append(key, formData[key], formData[key].name);
          } else{
            formDataToSubmit.append(key, formData[key]);
          }
        }

        axios.put(`http://localhost:3001/api/profiles/${petId}`, formDataToSubmit, {
            withCredentials: true,
            headers:{
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response=>{
            setShowModal(true);
            setTimeout(()=>{
                onSaveChanges(response.data);
            }, 2000);
        })
        .catch(error => {
            setError('Error updating pet profile. Please try again');
        });
    };

    if(loading){
        return <div>Loading...</div>
    }

    return(
        <>
        {showModal && <Modal message= "Profile updated successfully!" onClose={()=>setShowModal(false)}/>}
        <Box className= "edit-profile-container">
            <Typography variant="h4" component="h1" gutterBottom>Edit Profile for {formData.petsName}</Typography>
            {error && <div className='error-message'>{error}</div>}
            {!isFormValid && (
                <div className="error-message">Please fill in all fields.</div>
            )}
            <form onSubmit={handleSubmit}>
                <TextField label="Pet's Name" id="petsName" name="petsName" value={formData.petsName} onChange={handleChange} error={!!validationErrors.petsName} helperText={validationErrors.petsName} fullWidth margin='normal'></TextField>
                <TextField label="owner's Email" id="ownerEmail" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} error={!!validationErrors.ownerEmail} helperText={validationErrors.ownerEmail} fullWidth margin='normal'></TextField>
                <TextField label="Age" id="age" name="age" type="number" value={formData.age} onChange={handleChange} error={!!validationErrors.age} helperText={validationErrors.age} fullWidth margin='normal'></TextField>
                <TextField label="Breed" id="breed" name="breed" value={formData.breed} onChange={handleChange} error={!!validationErrors.breed} helperText={validationErrors.breed} fullWidth margin='normal'></TextField>
                <TextField label="Contact Number" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} error={!!validationErrors.contactNumber} helperText={validationErrors.contactNumber} fullWidth margin='normal'></TextField>

                <div className="form-group">
                    <label htmlFor='image'>Uplaod Pet's Picture</label>
                    <input type='file' id='image' name='image' accept='image/*' onChange={handleImageChange}></input>
                    {formData.image && formData.image instanceof File && (
                        <img src={URL.createObjectURL(formData.image)} alt='Preview' style={{width:'100px', height:'100px', objectFit:'cover', marginTop:'10px'}}></img>
                     )}
                </div>
                <Button type='submit' variant='contained' color='primary' fullWidth sx={{marginTop:'20px'}}> Save Changes</Button>

            </form>
        </Box>
        </>
    );
};

export default EditProfile;