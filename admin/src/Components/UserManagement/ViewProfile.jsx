import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './ViewProfile.css'

const ViewProfile = () => {
    const [petProfiles, setPetProfiles]= useState([]);
    const [ownerDetails, setOwnerDetails]= useState({ownerName:'', contactNumber:''});
    const [error, setError]= useState('');
    const {userEmail}= useParams();

    useEffect(()=>{
        const fetchUserData = async ()=>{
            try{
                const response = await axios.get(`http://localhost:3001/api/admin/user/${userEmail}/pets`, {withCredentials:true});
                if(response.data){
                    setPetProfiles(response.data.petProfiles);
                    setOwnerDetails(response.data.ownerDetails);
                } else{
                    setError('No data availabel for this user');
                }
            } catch (err){
                setError('Error fetching data');
                console.error('Error:', err);
            }
        };

        fetchUserData();
    }, [userEmail]);

    return(
        <div className="view-profile-container">
        <h2 className="view-profile-title">{`User's Pet Profiles`}</h2>

        <div className="pet-profiles-container">
            {petProfiles.length>0 ? (
                petProfiles.map((pet) => (
                    <div key={pet._id} className='pet-card'>
                        <img src= {`http://localhost:3001/${pet.image.replace(/\\/g, '/')}`} alt={pet.petsName} className='pet-card-img'/>
                        <p className='pet-name'>{pet.petsName}</p>
                        </div>
                ))
            ) : (
                <p className='no-pet-profile'>No pet profiles available for this user.</p>
            )}
        </div>

        <div className="owner-details-container">
            <h3 className="owner-title">Owner Information:</h3>
            <p className="owner-detail"><strong>Name:</strong> {ownerDetails.ownerName}</p>
            <p className="owner-detail"><strong>Contact Number:</strong> {ownerDetails.contactNumber}</p>
        </div>

        {error && <p className='error-message'>{error}</p>}
        </div>
    );
};

export default ViewProfile;