const mongoose= require("mongoose");

const AdminSchema= new mongoose.Schema({
    name:String,
    email:{type: String, unique:true},
    password: String,
});

const AdminModel= mongoose.model("Admin", AdminSchema);

module.exports= AdminModel;