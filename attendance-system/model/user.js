const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id : {
        type: Number,
        required: true
    },
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    firstname : {
        type: String,
        required: true
    },
    lastname : {
        type: String,
        required: true
    },
    dob : {
        type: Date,
        required: true
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;