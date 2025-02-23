import React, {useState, useEffect} from "react";
import {Box, TextField, Button, CircularProgress, Snackbar} from '@mui/material';
import axios from 'axios';
import './Medical.css'

const Medical = ({petId})=> {
    const [petName, setPetName]= useState('');
    const [isFormOpen, setIsFormOpen]= useState(false);
    const [medicalRecord, setMedicalRecord]= useState({
        date:'',
        vetName:'',
        description:'',
        diagnosis:'',
        treatment:'',
        mediactions:'',
        notes: '',
        nextVisit:'',
    });

    const [medicalRecords, setMedicalRecords]= useState([]);
    const [isLoading, setIsLoading]= useState(false);
    const [error,setError]= useState('');
    const [successMessage, setSucessMessage]= useState('');
    
    const handleInputChange= (e)=> {
        const {name, value}= e.target;
        setMedicalRecord({
            ...medicalRecord,
            [name]: value,
        });
    };

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:3001/api/medical-records/${petId}`, {withCredentials:true})
            .then(response => {
                setMedicalRecords(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                setError('Error fetching medical records');
            });

        axios.get(`http://localhost:3001/api/profiles/${petId}`, {withCredentials:true})
        .then(response => {
            setPetName(response.data.petsName);
        })
        .catch(error => {
            console.error('Error fetching pet data:', error);
        });
    }, [petId]);

    const handleSubmit= (e) => {
        e.preventDefault();

        if (medicalRecord.date && new Date(medicalRecord.date).toString()==='Invalid Date'){
            setError('Invalid Date');
            return;
        }

        setIsLoading(true);

        const formattedRecord= {
            ...medicalRecord,
            date: medicalRecord.date? new Date(medicalRecord.date).toISOString(): '',
            nextVisit: medicalRecord.nextVisit ? new Date(medicalRecord.nextVisit).toISOString(): null,
        };

        axios.post('http://localhost:3001/api/medical-records', {...formattedRecord, petId}, {withCredentials:true})
            .then(response => {
                setMedicalRecords([...medicalRecords, response.data]);
                setIsFormOpen(false);
                setMedicalRecord({
                    date: '',
                    vetName: '',
                    description: '',
                    diagnosis: '',
                    treatment: '',
                    mediactions: '',
                    notes: '',
                    nextVisit:'',
                });
                setIsLoading(false);
                setSucessMessage('New medical record added successfully');
            })
            .catch(error => {
                setIsLoading(false);
                setError('Error adding medical record');
            });            
    };

    const handleDelete= (recordId) => {
        setIsLoading(true);
        axios.delete(`http://localhost:3001/api/medical-records/${recordId}`)
            .then(response => {
                setMedicalRecords(medicalRecords.filter(record=> record._id !== recordId));
                setIsLoading(false);
                setSucessMessage('Medical record deleted successfully');
            })
            .catch(error => {
                setIsLoading(false);
                setError('Error deleteing medical record');
            });
    };

    return(
        <div className="medical-container">
            {petName? (
                <h2>Medical Records For {petName}</h2>
            ): (
                <h2>Loading pet information...</h2>
            )}

            <div className="medical-records-list">
                {isLoading ? (
                    <CircularProgress/>
                ) : (
                    medicalRecords.map((record, index) => (
                        <Box key={index} className="medical-record">
                            <p><strong>Vet Name:</strong> {record.vetName}</p>
                            <p><strong>Visited Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                            <p><strong>Treatment:</strong> {record.treatment}</p>
                            <p><strong>Next Visit:</strong> {record.nextVisit ? new Date(record.nextVisit).toLocaleDateString() : 'N/A'}</p>
                            <Button variant="outlined" color="secondary" onClick={() => handleDelete(record._id)} disabled={isLoading}>Delete</Button>

                        </Box>
                    ))
                )}
            </div>
            <Button variant="contained" color="primary" onClick={() => setIsFormOpen(true)} disabled={isLoading}> Add New Medical Record</Button>
            {successMessage && <Snackbar open={Boolean(successMessage)} autoHideDuration={3000} message={successMessage} onClose={()=> setSucessMessage('')}/> }
            {error && <Snackbar open= {Boolean(error)} autoHideDuration={3000} message={error} onClose={() => setError('')}/>}
            {isFormOpen && (
                <Box className="medical-form">
                    <h3>Add New Record</h3>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <TextField variant="outlined" fullWidth name="date" value={medicalRecord.date} onChange={handleInputChange} type="date" required></TextField>
                        </div>
                        <div>
                            <TextField label="Veterinarian Name" variant="outlined" fullWidth name="vetName" value={medicalRecord.vetName} onChange={handleInputChange}  required></TextField>
                        </div>
                        <div>
                            <TextField label="Diagnosis" variant="outlined" fullWidth name="diagnosis" value={medicalRecord.diagnosis} onChange={handleInputChange} required></TextField>
                        </div>
                        <div>
                            <TextField label="Treatment" variant="outlined" fullWidth name="treatment" value={medicalRecord.treatment} onChange={handleInputChange} required></TextField>
                        </div>
                        <div>
                            <TextField variant="outlined" fullWidth name="nextVisit" value={medicalRecord.nextVisit} onChange={handleInputChange} type="date" required></TextField>
                        </div>
                        <Button variant="contained" color="primary" type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Record'}</Button>
                        <Button variant="outlined" color="secondary" onClick={() => setIsFormOpen(false)} disabled={isLoading}> Cancel </Button>
                    </form>
                </Box>
            )}
        </div>
    );
};

export default Medical;