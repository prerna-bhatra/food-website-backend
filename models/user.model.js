const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        default: 'customer',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
