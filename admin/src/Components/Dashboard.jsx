import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard= () =>{
    const [totalPets, setTotalPets]= useState(0);
    const [totalUsers, setTotalUsers]= useState(0);
    const [totalPendingRequests, setTotalPendingRequests]= useState(0);

    useEffect(()=> {
        const fetchData= ()=>{
            axios.get('http://localhost:3001/api/pets', {withCredentials:true})
               .then(response=> setTotalPets(response.data.length))
               .catch(error => console.error('Error fetching Pets.', error));
               
               axios.get('http://localhost:3001/api/users/total', {withCredentials:true})
                .then(response=> setTotalUsers(response.data.totalUsers))
                .catch(error => console.error('Error fetching user count', error));

                axios.get('http://localhost:3001/admin/adoption-requests', {withCredentials:true})
                    .then(response =>{
                        const pendingRequests= response.data.filter(requestAnimationFrame.status ==='pending');
                        setTotalPendingRequests(pendingRequests.length);
                    })
                    .catch(error => console.error('Error fetching adoption requets.', error));
        };

        fetchData();
        const interval= setInterval(fetchData, 1000);
        return()=>clearInterval(interval);
    }, []);

    return(
        <div className="dashboard">
        <div className="left-side">
            <div className="sections">
                <h2>Sections</h2>
                <ul>
                    <li><a href="/admin/pets">Pet Management</a></li>
                    <li><a href="/admin/users">User Management</a></li>
                    <li><a href="/admin/adoptions">Adoption Requests</a></li>
                    <li><a href="/admin/settings">Settings</a></li>
                </ul>
                </div>
                </div>
                <div className="right-side">
                    <h1>Admin Dashboard</h1>
                    <div className='card overview'>
                        <h2>Overview</h2>
                        <div className="stats">
                            <p><strong>Total Pets:</strong>{totalPets}</p>
                            <p><strong>Total Users:</strong>{totalUsers}</p>
                            <p><strong>Succesful Adoptions:</strong>10</p>
                            <p><strong>Pending Requests::</strong>{totalPendingRequests}</p>
                        </div>
                    </div>

                </div>
                </div>
    );

};

export default Dashboard;