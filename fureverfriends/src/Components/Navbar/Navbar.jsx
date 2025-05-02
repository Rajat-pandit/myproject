import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const servicesDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user', {
          withCredentials: true,
        });
        setUser(response.data.user || null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  // Fetch notifications whenever route changes
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:3001/notifications', {
          withCredentials: true,
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, [location.pathname]);

  // Toggle dropdowns
  const toggleServicesDropdown = () => setServicesDropdownOpen(!servicesDropdownOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);
  const toggleNotificationsDropdown = () => setNotificationsOpen(!notificationsOpen);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (!servicesDropdownRef.current || !servicesDropdownRef.current.contains(event.target)) &&
        (!profileDropdownRef.current || !profileDropdownRef.current.contains(event.target)) &&
        (!notificationsDropdownRef.current || !notificationsDropdownRef.current.contains(event.target))
      ) {
        setServicesDropdownOpen(false);
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownItemClick = (e, route) => {
    e.stopPropagation();
    navigate(route);
    setServicesDropdownOpen(false);
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  };

  const handleLogout = async (e) => {
    e.stopPropagation();
    try {
      await axios.get('http://localhost:3001/logout', { withCredentials: true });
      localStorage.clear();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  //  Mark all notifications as read and re-fetch updated notifications
  const markAllAsRead = async () => {
    try {
      await axios.post('http://localhost:3001/notifications/markAllAsRead', {}, { withCredentials: true });

      // Re-fetch updated notifications
      const res = await axios.get('http://localhost:3001/notifications', {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-store',
        },
      });

      setNotifications(res.data);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete('http://localhost:3001/notifications/clear', { withCredentials: true });
      setNotifications([]);
      console.log('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className='navbar'>
      <img src='/logo.png' alt="logo" className='logo' />
      <ul className='navbar-menu'>
        <li onClick={() => navigate("/home")}>Home</li>

        <li className='dropdown' onClick={toggleServicesDropdown} ref={servicesDropdownRef}>
          Services <span className={servicesDropdownOpen ? 'arrow-up' : 'arrow-down'}>▼</span>
          {servicesDropdownOpen && (
            <ul className='dropdown-menu'>
              <li onClick={(e) => handleDropdownItemClick(e, '/vet')}>Veterinary Service</li>
              <li onClick={(e) => handleDropdownItemClick(e, '/adoption')}>Adoption</li>
              <li onClick={(e) => handleDropdownItemClick(e, '/card')}>Emergency Card</li>
            </ul>
          )}
        </li>

        <li onClick={() => navigate('/community')}>Community</li>

        <li className='notification-bell' onClick={toggleNotificationsDropdown} ref={notificationsDropdownRef}>
          <span className="bell-icon">🔔</span>
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount}</span>
          )}
          {notificationsOpen && (
            <div className="notification-dropdown">
              {notifications.length > 0 && (
                <div className="notification-actions">
                  <button className="clear-btn" onClick={clearAllNotifications}>Clear All</button>
                  <button className="mark-btn" onClick={markAllAsRead}>Mark all as read</button>
                </div>
              )}

              {notifications.length === 0 ? (
                <div className="notification-item">No new notifications</div>
              ) : (
                notifications.map((note, index) => (
                  <div
                    key={index}
                    className="notification-item"
                    style={{
                      backgroundColor: note.isRead ? 'white' : '#e6f7ff',
                      fontWeight: note.isRead ? 'normal' : 'bold',
                    }}
                  >
                    <img
                      src={`http://localhost:3001/${note.fromUserImage}`}
                      alt={note.fromUserName}
                      className="notification-avatar"
                    />
                    <span>
                      <strong>{note.fromUserName}</strong> {note.message}
                    </span>
                    {!note.isRead && <span className="blue-dot" />}
                  </div>
                ))
              )}
            </div>
          )}
        </li>

        <li className='dropdown' onClick={toggleProfileDropdown} ref={profileDropdownRef}>
          {user ? (
            <div className='profile'>
              <img
                src={`http://localhost:3001/${user.image?.replace(/\\/g, '/') || 'default-avatar.jpg'}`}
                alt={user.name}
                className='profile-image'
              />
              <span>{user.name}</span>
              <span className={profileDropdownOpen ? 'arrow-up' : 'arrow-down'}>▼</span>
            </div>
          ) : (
            <button onClick={() => navigate('/login')}>Login</button>
          )}
          {profileDropdownOpen && user && (
            <ul className='dropdown-menu'>
              <li onClick={(e) => handleDropdownItemClick(e, '/manageprofile')}>Profile</li>
              <li onClick={(e) => handleDropdownItemClick(e, '/settings')}>Settings</li>
              <li onClick={handleLogout}>Log Out</li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;

