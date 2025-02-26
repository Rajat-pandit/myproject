const mongoose= require("mongoose");

const AdoptionRequestSchema= new mongoose.Schema({
    petId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    breed:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required:true,
    },
    status:{
        type:String,
        enum: ["pending", "approved", "rejected"],
        default:"pending"
    }
}, {timestamps:false});

const RequestModel= mongoose.model("adoptionRequests", AdoptionRequestSchema);
module.exports= RequestModel;