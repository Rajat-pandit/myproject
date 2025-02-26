import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './AdoptionRequest.css'

const AdoptionRequest= ()=>{
    const [requests, setRequests]= useState([]);
    const [error, setError]= useState('');

    useEffect(() =>{
        const fetchAdoptionRequests= async()=>{
            try{
                const {data}= await axios.get('http://localhost:3001/admin/adoption-requests', {withCredentials:true});
                console.log('Fetched requests:', data);
                setRequests(data);
            } catch(err){
                console.error('Error fetching adoption requests:', err);
                setError('Error fetching adoption requests');
            }
        };

        fetchAdoptionRequests();
    }, []);

    const handleRequestAction= async (requestId, action) => {
        if(!requestId){
            console.error('Invalid requestId:', requestId);
            return;
        }

        try{
            const response= await axios.patch(`http://localhost:3001/admin/adoption-requests/${requestId}`, {status:action}, {withCredentials:true});
            console.log('Response from backend:', response.data);

            const userEmail= response.data.userId.email;
            const petName= response.data.petId?.petName;
            const breed= response.data.petId?.breed;

            await axios.post('http://localhost:3001/admin/send-email', {
                userEmail:userEmail,
                status:action,
                petName: petName,
                breed: breed,
            });
           
            setRequests((prevRequests)=>
                prevRequests.map((request)=>
                request._id=== requestId? {...request, status:action}: request
            )
            );
          
        } catch(err){
            console.error('Error updating adoption request status:', err.response ? err.response.data : err.message);
            setError('Error updating adoption request status');
        }
    };

    return (
        <div className="adoption-requests">
            <h1>Adoption Requests</h1>
            {error && <div className='error'>{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Pet Name</th>
                        <th>Breed</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request)=>{
                        console.log('Request:', request);
                        return(
                            <tr key={request._id}>
                                <td>{request.petId?.petName || 'N/A'}</td>
                                <td>{request.petId?.breed || 'N/A'}</td>

                                <td>{request.userId?.name || 'N/A'}</td>
                                <td>{request.userId?.email || 'N/A'}</td>

                                <td>{request.status || 'N/A'}</td>

                                <td>
                                    <button className='approve-btn' onClick={()=> {
                                        console.log('Request Id:', request._id);
                                        handleRequestAction(request._id, 'approved');
                                    }} disabled={request.status === 'approved'}>
                                        Approve
                                    </button>
                                    <button className='reject-btn' onClick={()=>{
                                        console.log('Request Id:', request._id);
                                        handleRequestAction(request._id, 'rejected');
                                    }} disabled={request.status === 'rejected'}>
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AdoptionRequest;