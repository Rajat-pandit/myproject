import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointment.css';

const Appointment = ({ petName }) => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/appointments/${petName}`);
        setAppointments(response.data.appointments);
      } catch (err) {
        setError('Failed to fetch appointments');
        console.error(err);
      }
    };

    if (petName) {
      fetchAppointments();
    }
  }, [petName]);

  const formatDateTime = (dateString, timeString) => {
    const combinedDateTime = new Date(`${dateString.split('T')[0]}T${timeString}:00`);
     // Format the date into a readable format like "May 4, 2025"
    const formattedDate = combinedDateTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    // Format the time into a readable 12-hour format like "2:30 PM"
    const formattedTime = combinedDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `Date and Time: ${formattedDate} at ${formattedTime}`;
  };

  const confirmDelete = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/appointments/${selectedAppointmentId}`);
      setAppointments(appointments.filter((appointment) => appointment._id !== selectedAppointmentId));
    } catch (err) {
      console.error('Error deleting appointment', err);
    } finally {
      setShowModal(false);
      setSelectedAppointmentId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointmentId(null);
  };

  return (
    <div className="appointment-container">
      <h2 className="appointment-heading">Appointments for {petName}</h2>
      {error && <div>{error}</div>}
      <div className="appointment-list">
        {appointments.length === 0 ? (
          <p>No appointments found for this pet.</p>
        ) : (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment._id} className="appointment-item">
                <p><strong>{formatDateTime(appointment.date, appointment.time)}</strong></p>
                <p><strong>Owner:</strong> {appointment.ownerName}</p>
                <p><strong>Age:</strong> {appointment.age}</p>
                <p><strong>Gender:</strong> {appointment.gender}</p>
                <p><strong>Contact Number:</strong> {appointment.contactNumber}</p>
                <p><strong>Location:</strong> {appointment.location}</p>
                <button onClick={() => confirmDelete(appointment._id)} className="delete-button">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this appointment?</p>
            <div className="modal-buttons">
              <button onClick={handleDelete} className="appointmentconfirm-button">Yes</button>
              <button onClick={closeModal} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
