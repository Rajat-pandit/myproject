import React, {useState, useEffect} from 'react'
import axios from 'axios';
import './Adoption.css';
import Navbar from '../Navbar/Navbar';
import Map from './Map';
import Modal from '../Navbar/Modal';

const Adoption= ({user}) => {
    const [petsForAdoption, setPetsForAdoption]= useState([]);
    const [error, setError]= useState('');
    const [isLoading, setIsLoading]= useState(true);
    const [modalOpen, setModalOpen]= useState(false);
    const [modalMessage, setModalMessae]= useState('');
    const [modalType, setModalType]= useState('success');

    useEffect(() => {
        const fetchPetsForAdoption= async()=>{
            try{
                const response = await axios.get('http://localhost:3001/api/pets', {withCredentials:true});
                setPetsForAdoption(response.data);
                setIsLoading(false);
            } catch(error){
                setError('Error fetching pets for adoption');
                console.error('Error fetching pets', error);
                setIsLoading(false);
            }
        };
        fetchPetsForAdoption();
    }, []);

    const handleAdoptionClick= async (pet) =>{
        if(!user || !user.name){
            setError('User not found or user is not logged in');
            return;
        }

        try{
            const userEmail= user.email;
            await axios.post('http://localhost:3001/adopt',{
                petId: pet._id,
                userName: user.name,
                breed: pet.breed,
                email: userEmail,
            }, {withCredentials:true}
        );
        setModalMessae(`Your Request for ${pet.petName} has been sent!`);
        setModalType('success');
        setModalOpen(true);
        } catch (error){
            setModalMessae(`Error: ${error.response?.data?.message || 'An error occurred during adoption request'}`);
            setModalType('error');
            setModalOpen(true);
        }
    };

    const closeModal=()=>{
        setModalOpen(false);
    }

    return(
        <div className="adoption-page">
            <Navbar user={user}/>
            <div className="banner-section">
                <div className="banner-text">
                <h1>Find Your New Best Friend</h1>
                <p>Browse our available dogs for adoption and give a pet a loving home.</p>
                </div>
                
            </div>

            <div className="pets-for-adoption">
                <h2>Available Pets For Adoption</h2>
                {error && <p className='error-message'>{error}</p>}
                {isLoading ? (
                    <p>Loading pets...</p>
                ) : (
                    <div className="pet-cards-container">
                        {petsForAdoption.map((pet) =>(
                            <div className="pet-card" key={pet._id}>
                                <div className="pet-image">
                                    <img src={`http://localhost:3001/${pet.image.replace(/\\/g, '/')}`} alt={`${pet.petName}`} />
                                </div>
                                <h3>{pet.petName}</h3>
                                <p>Breed: {pet.breed}</p>
                                <p>Age: {pet.age}</p>
                                <button onClick={()=> handleAdoptionClick(pet)} className='adopt-btn'>Adopt Me</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={closeModal}/>

            <div className="map-heading">
                <h2>Find Nearby Adoption Center</h2>
            </div>
            <Map/>
        </div>
    );
};

export default Adoption;