import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid2, List, ListItem, ListItemText } from '@mui/material';
import ChangePassword from './ChangePassword';
import ChangeDetails from './ChangeDetails';
import './Settings.css';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';

const UserSettings = ({ user, setUser }) => {  
  const [activeTab, setActiveTab] = useState('profileSettings');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showChangeDetailsForm, setShowChangeDetailsForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleChangePasswordClick = () => {
    setShowPasswordForm(!showPasswordForm);
    setShowChangeDetailsForm(false); 
  };

  const handleChangeDetailsClick = () => {
    setShowChangeDetailsForm(!showChangeDetailsForm);
    setShowPasswordForm(false); 
  };

  

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user', { withCredentials: true });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (!user) {
      fetchUserDetails();
    }
  }, [user]);

  return (
    <>
      <Navbar user={currentUser} />

      <Grid2 container spacing={2} className="user-settings-container">
        <Grid2 item xs={3} className="left-sidebar">
          <Card className="sidebar-card">
            <List>
              <ListItem
                button
                selected={activeTab === 'profileSettings'}
                onClick={() => handleTabChange('profileSettings')}
                className={activeTab === 'profileSettings' ? 'selected-item' : 'list-item'}
              >
                <ListItemText primary="Profile Settings" />
              </ListItem>
              <ListItem
                button
                selected={activeTab === 'profileManagement'}
                onClick={() => handleTabChange('profileManagement')}
                className={activeTab === 'profileManagement' ? 'selected-item' : 'list-item'}
              >
                <ListItemText primary="Profile Management" />
              </ListItem>
            </List>
          </Card>
        </Grid2>

        <Grid2 item xs={9} className="main-content">
          {activeTab === 'profileSettings' && (
            <Card className="content-card">
              <CardContent className="card-content">
                <Typography variant="h5" gutterBottom>
                  Profile Settings
                </Typography>
                <List>
                  <ListItem className="list-item" button onClick={handleChangePasswordClick}>
                    <ListItemText primary="Change Password" />
                  </ListItem>
                  <ListItem className="list-item" button onClick={handleChangeDetailsClick}>
                    <ListItemText primary="Change Details" />
                  </ListItem>
                </List>

                {showPasswordForm && <ChangePassword />}

                {showChangeDetailsForm && (
                  <ChangeDetails
                    user={currentUser}
                    setUser={setUser} 
                  />
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'profileManagement' && (
            <Card className="content-card">
              <CardContent className="card-content">
                <Typography variant="h5" gutterBottom>
                  Profile Management
                </Typography>
                <Typography>Manage account, delete account, etc.</Typography>
              </CardContent>
            </Card>
          )}
        </Grid2>
      </Grid2>
    </>
  );
};

export default UserSettings;


