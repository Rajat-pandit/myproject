const mongoose= require('mongoose');

const PetSchema= new mongoose.Schema({
    petName: {type:String, required:true},
    breed: {type: String, required:true},
    age: {type: String, required: true},
    image: {type: String},
});

const PetModel= mongoose.model("Pet", PetSchema);
module.exports= PetModel;