import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './ReminderForm.css';

 const Reminder= ({petId}) => {
    const [reminder, setReminder]= useState({
        title:"",
        description:"",
        date:"",
        time:""
    });

    const [isFormVisible, setIsFormVisible]= useState(false); //to toggle form visibility
    const [reminders, setReminders]= useState([]); //to fetch the rmeinder

    useEffect(()=>{
        const fetchReminders= async()=>{
            try{
                const response= await axios.get(`http://localhost:3001/reminders/${petId}`, {
                    withCredentials:true,
                });
                setReminders(response.data);
            } catch (err){
                console.error('Error fetching reminders:'.err);
            }
        };

        if(petId){
            fetchReminders();
        }
    }, [petId]);

    const handleChange= (e)=>{
        const {name, value}= e.target;
        setReminder({...reminder, [name]: value});
    };

    const handleSubmit= async(e)=> {
        e.preventDefault();
        console.log("Reminder Submitted:", reminder);

        const userEmail = localStorage.getItem('userEmail');
        try{
            const response = await axios.post('http://localhost:3001/reminders', {
                petId,
                title:reminder.title,
                description: reminder.description,
                date: reminder.date,
                time: reminder.time,
                userEmail,
            }, {withCredentials:true});

            if (response.status === 200){
                console.log('Reminder saved:', response.data);
                setIsFormVisible(false);
                setReminders([...reminders, response.data]);
            } else{
                console.error('Failed to save reminder');
            }
        } catch (err){
            console.error('Error submitting reminder:', err);
        }
    };

    const handleCancel= () =>{
        setIsFormVisible(false);
    }

    const handleAddReminderClick= ()=>{
        setIsFormVisible(true);
    }

    const handleDeleteReminder= async (reminderId) => {
        try{
            const response= await axios.delete(`http://localhost:3001/reminder/${reminderId}`, {
                withCredentials:true,
            });

            if (response.status === 200){
                console.log("ReminderDeleted:", reminderId);
                setReminders(reminders.filter(reminder => reminder._id !== reminderId));
            } else{
                console.error('Failed to delete reminder');
            }
        } catch (err){
            console.error('Error deleting reminder', err);
        }
    };


  return (
    <div className="reminder-container">
        <h2 className="reminder-heading">Reminders</h2>

        <div className="reminder-list">
            <ul>
                {reminders.map((reminder)=>(
                    <li key={reminder._id}>
                        <strong>Title: {reminder.title}</strong>
                        <p>Description: {reminder.description}</p>
                        <p>Date and Time: {reminder.date} at {reminder.time}</p>
                        <button onClick={()=> handleDeleteReminder(reminder._id)} className='reminder-delete-button'>Delete Reminder</button>
                    </li>
                ))}
            </ul>
        </div>

        {!isFormVisible ? (
            <button onClick={handleAddReminderClick} className='reminder-add'>Add Reminder</button>
        ) :(
            <div className="reminder-form-container">
                <form className="reminder-form" onSubmit={handleSubmit}>
                    <h2>Create a Reminder</h2>
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input type='text' id='title' name='title' value={reminder.title} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea name="description" id="description" value={reminder.description} onChange={handleChange} rows="4" required></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input type="date" id="date" name='date' value={reminder.date} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="time">Time:</label>
                        <input type="time" id='time' name='time' value={reminder.time} onChange={handleChange} required />
                    </div>

                    <div className="button-group">
                        <button type='submit'>Save Reminder</button>
                        <button type='button' onClick={handleCancel} className='custom-cancel-button'>Cancel</button>
                    </div>
                </form>
            </div>
        )}
        
    </div>
  );
};

export default Reminder;
