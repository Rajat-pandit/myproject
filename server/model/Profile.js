const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    petsName: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    }
});

const ProfileModel = mongoose.model("profiles", ProfileSchema);
module.exports = ProfileModel;