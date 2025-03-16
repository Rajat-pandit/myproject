const mongoose = require('mongoose');

const emergencyCardSchema= new mongoose.Schema({
    petName:{type: String, required: true},
    ownerName:{ type:String, required:true},
    contactNumber:{type: String, required:true},
    emergencyText:{type:String, required:true},
    senderEmail:{type:String, required:true},
    recipientEmail:{type:String, required:true},
    createdAt:{type:Date, default:Date.now,},
});

const EmergencyCard= mongoose.model('EmergencyCard', emergencyCardSchema);
module.exports= EmergencyCard;