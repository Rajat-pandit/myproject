import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Button, Modal, Box, Typography} from '@mui/material';
// import {Visibility} from '@mui/icons-material';
import './UserList.css'

const UserList= ()=>{
    const [users, setUsers]= useState([]);
    const [openModal, setOpenModal]= useState(false);
    const [selectedUserId, setSelectedUserId]= useState(null);
    

    useEffect(()=>{
        axios.get('http://localhost:3001/api/admin/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error =>{
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleOpenModal= (userId)=>{
        setSelectedUserId(userId);
        setOpenModal(true);
    };

    const handleCloseModal= ()=>{
        setOpenModal(false);
        setSelectedUserId(null);
    };

    const handleDeleteUser= ()=>{
        axios.delete(`http://localhost:3001/api/admin/users/${selectedUserId}`)
            .then(response =>{
                if(response.status===200){
                    setUsers(users.filter(user => user._id!==selectedUserId));
                    console.log(`User with ID: ${selectedUserId} has been deleted`);
                } else{
                    console.error('Error deleting user');
                }
            })
            .catch(error =>{
                console.error('Error:',error);
            });
            handleCloseModal();
    };


    return(
        <div className="userlist-container">
            <h2>User Management</h2>
            <table className="userlist-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Registration Date</th>
                        <th>Actions</th>
                    </tr>

                </thead>
                <tbody>
                    {users.map(user=>(
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                            <td>
                                <Button className='userlist-button' variant='contained' color='error' onClick={()=>handleOpenModal(user._id)}>
                                    Delete User
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="confirm-delete-modal" aria-describedby="confirm-delete-description">
                <Box className="userlist-modal">
                    <Typography variant='h6' component="h2" gutterBottom>
                        Are you sure, you want to delete this user?
                    </Typography>
                    <Button variant='contained' color='error' onClick={handleDeleteUser} sx={{marginLeft:'60px'}}>
                        Delete
                    </Button>
                    <Button variant='outlined' onClick={handleCloseModal} sx={{marginLeft:"20px"}}>
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default UserList;