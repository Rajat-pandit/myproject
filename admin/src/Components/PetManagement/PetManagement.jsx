import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './PetManagement.css';
import Form from './Form';

export const PetManagement = ()=>{
    const [pets, setPets]= useState([]);
    const [isModalOpen, setIsModalOpen]= useState(false);
    const [error, setError]= useState('');
    const [selectedPet, setSelectedPet]= useState(null);

    useEffect(()=>{
        const fetchPets= async() => {
            try{
                const response= await axios.get('http://localhost:3001/api/pets', {withCredentials:true});
                setPets(response.data);
             } catch (error){
                setError('Error fetching pets');
                console.error('Error fetching pets:', error);
             }
        };
        fetchPets();
    }, []);

    const openModal= (pet=null)=>{
        setSelectedPet(pet);
        setIsModalOpen(true);
    };

    const closeModal=()=>{
        setIsModalOpen(false);
        setSelectedPet(null);
    };

    const handlePetSubmit= (submittedPet)=>{
        if(selectedPet){
            setPets((prevPets) => prevPets.map((pet)=>(pet._id === submittedPet._id? submittedPet:pet)));
        } else{
            setPets((prevPets)=> [...prevPets, submittedPet]);
        }
    };

    const deletePet= async(petId)=> {
        try{
            await axios.delete(`http://localhost:3001/api/pets/${petId}`, {withCredentials:true});
            setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
        } catch(error){
            setError('Error deleteing pet:', error);
            console.error('Error deleteing pet:', error);
        }
    };

    return(
        <div className="pet-management">
            <h1>Pet Management</h1>
            <button className='add-new-pet-btn' onClick={()=> openModal()}>
                Add New Pet
            </button>
            {error && <p className='error-message'>{error}</p>}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className='close' onClick={closeModal}>&times;</span>

                        <Form pet={selectedPet} closeModal={closeModal} onPetSubmit={handlePetSubmit}></Form>
                    </div>
                </div>
            )}

            <h2>Animals Listed for Adoption</h2>
            <div className="animal-cards-container">
                {pets.map((pet) => (
                    <div className='animal-card' key={pet._id}>
                        <div className="animal-image">
                            <img src={`http://localhost:3001/${pet.image.replace(/\\/g, '/')}`} alt={`${pet.petName}`} />
                      </div>
                      <h3>{pet.petName}</h3>
                      <p>Breed: {pet.breed}</p>
                      <p>Age: {pet.age}</p>
                      <button className='edit-btn' onClick={()=> openModal(pet)}>Edit</button>
                      <button className='delete-btn' onClick={()=>deletePet(pet._id)}>Delete</button>
                      </div>

                ))}
            </div>
        </div>
    );
};

export default PetManagement;