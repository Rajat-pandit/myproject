import React, { useState, useEffect } from 'react';
import './VetService.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder';
import Navbar from '../Navbar/Navbar';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import axios from 'axios';

// Location Picker component for selecting location from map
const LocationPicker = ({ setLocation, setMarkerCoords }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      // Reverse geocoding using Nominatim
      L.Control.Geocoder.nominatim().reverse(
        { lat, lng },
        13,
        (results) => {
          const r = results[0];
          if (r) {
            setLocation(r.name);
            setMarkerCoords([lat, lng]);
          }
        }
      );
    },
  });

  return null;
};

const VetService = () => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [petName, setPetName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const userName = localStorage.getItem('userName'); 
    if (!userName) return;
  
    try {
      const response = await axios.get(`http://localhost:3001/appointments/${userName}`, {
        withCredentials: true
      });
  
      if (response.status === 200) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  

  useEffect(() => {
    if (ownerName) {
      fetchAppointments();
    }
  }, [ownerName]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setLocation(query);

    if (query.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Nepal')}`
        );
        const data = await response.json();

        const locations = data.map((item) => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }));

        setSuggestions(locations);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (loc) => {
    setLocation(loc.name);
    setMarkerCoords([loc.lat, loc.lng]);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      ownerName,
      petName,
      age,
      gender,
      contactNumber,
      location,
      date,
      time,
    };

    try {
      const response = await axios.post(
        'http://localhost:3001/appointments',
        appointmentData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        alert('Appointment booked successfully');
        fetchAppointments();  
      }
    } catch (error) {
      alert('Failed to create appointment');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="banner-section">
        <div className="banner-content">
          <h1>Caring for Your Pets, One Paw at a Time</h1>
          <p>Book appointments, track visits, and keep your furry friend healthy!</p>
        </div>
      </div>

      <h2 className="appointment-heading">Book an Appointment</h2>

      <div className="form-banner">
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Owner Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Pet's Name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-row">
            <input
              type="tel"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Type location or click on map to select"
                value={location}
                onChange={handleSearch}
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((loc, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(loc)}>
                      {loc.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-row">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Book Appointment
          </button>
        </form>
      </div>

      <div className="map-section">
        <MapContainer
          center={[28.3949, 84.1240]}
          zoom={7}
          style={{ width: '100%', height: '400px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker setLocation={setLocation} setMarkerCoords={setMarkerCoords} />
          {markerCoords && <Marker position={markerCoords} />}
        </MapContainer>
      </div>

      <div className="appointments-list">
        <h3>Upcoming Appointments</h3>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <p>Owner: {appointment.ownerName}</p>
              <p>Pet: {appointment.petName}</p>
              <p>Age: {appointment.age}</p>
              <p>Gender: {appointment.gender}</p>
              <p>Contact Number: {appointment.contactNumber}</p>
              <p>Location: {appointment.location}</p>
              <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
              <p>Time: {appointment.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VetService;
