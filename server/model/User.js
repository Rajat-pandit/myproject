const mongoose = require("mongoose");

const UserSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    registrationDate: {type: Date, default: Date.now}
});

const UserModel= mongoose.model("User", UserSchema);
module.exports= UserModel;