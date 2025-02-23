const mongoose= require('mongoose');

const medicalRecordSchema= new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        set:(v) => new Date(v).toISOString(),
    },
    vetName:{type: String, required:true},
    description: {type: String},
    diagnosis: {type:String},
    treatment: {type:String},
    medications: {type:String},
    notes: {type: String},
    nextVisit:{
        type: Date, set: (v)=> v? new Date(v).toISOString(): null,
    },
    petId: {type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true},
});

const MedicalRecord= mongoose.model('medicalrecords', medicalRecordSchema);
module.exports = MedicalRecord;