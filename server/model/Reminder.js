const mongoose = require('mongoose');

const ReminderSchema= new mongoose.Schema({
    petId: {type:String, required:true},
    petName: {type:String, required:true},
    title:{type:String, required:true},
    description:{type:String},
    date:{type:String, required:true},
    time:{type:String, required:true},
    userEmail:{type:String, required:true},
});

module.exports= mongoose.model('Reminder', ReminderSchema);
