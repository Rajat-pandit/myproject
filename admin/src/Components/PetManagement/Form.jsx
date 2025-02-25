import React, {useState} from 'react';
import axios from 'axios';
import './Form.css';

export const Form= ({pet, closeModal, onPetSubmit}) =>{
    const [petData, setPetData] = useState({
        petImage: pet?.image || null,
        petName: pet?.petName || '',
        breed: pet?.breed || '',
        age: pet?.age || ''
    });

    const [error, setError]= useState(null);
    const [isLoading, setIsLoading]= useState(false);

    const handleImageChange= (e)=> {
        const file= e.target.files[0];
        if(file){
            if(file.type.startsWith('image/')){
                setPetData((prevData) => ({
                    ...prevData,
                    petImage:file,
                }));
                setError(null);
            } else{
                setError('Please upload a valid image file.');
            }
        } else{
            setPetData((prevData) => ({
                ...prevData,
                petImage: pet?.image || prevData.petImage,
            }));
        }
    };

    const handleChange= (e) =>{
        const {name, value}= e.target;
        setPetData({
            ...petData,
            [name]: value
        });
    };
    
    const handleSubmit= async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('petName', petData.petName);
        formData.append('breed', petData.breed);
        formData.append('age', petData.age);

        if(petData.petImage){
            formData.append('petImage', petData.petImage);
        }

        try{
            setIsLoading(true);

            let response;
            if(pet){
                response= await axios.put(`http://localhost:3001/api/pets/${pet._id}`, formData, {headers:{
                    'Content-Type': 'multipart/form-data',
                }, withCredentials:true,
            });
            } else{
                response= await axios.post('http://localhost:3001/api/pets', formData, {headers: {
                    'Content-Type': 'multipart/form-data',
                }, withCredentials:true,
            });
            }

            onPetSubmit(response.data);
            closeModal();
        } catch (error) {
            console.error('Error submitting pet:', error);
        } finally{
            setIsLoading(false);
        }
    };

    return(
        <div className="add-pet-form">
        <h1>{pet ? 'Edit Pet' : 'Add New Pet'}</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="petImage">Pet Image</label>
                <input type="file" id='petImage' name='petImage' accept='image/*' onChange={handleImageChange} required={!pet} />
                {error && <p className='error'>{error}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="petName">Pet Name</label>
                <input type="text" id='petName' name='petName' value={petData.petName} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input type="text" id='breed' name='breed' value={petData.breed} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="age">Age</label>
                <input type="text" id='age' name='age' value={petData.age}  onChange={handleChange} required />
            </div>

            <button type='submit' className='submit-btn' disabled={isLoading}>
                {isLoading ? 'Submitting..': pet? 'Update Pet': 'Add Pet'}
            </button>
        </form>
        </div>
    );
};

export default Form;