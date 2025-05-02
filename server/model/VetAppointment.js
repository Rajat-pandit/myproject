const mongoose = require('mongoose');

const vetAppointmentSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  petName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, 
});

const VetAppointment = mongoose.model('VetAppointment', vetAppointmentSchema);

module.exports = VetAppointment;
