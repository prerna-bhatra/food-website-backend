const mongoose = require('mongoose');
const { User } = require('./user.model.js'); // Import the User model

const userAddressSchema = new mongoose.Schema({
    addressType: {
        type: String,
        default: 'Home',
        required: true
    },
    houseName: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    googleAddress: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    landMark: {
        type: String
    },
    receiverContact: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const UserAddress = mongoose.model('UserAddress', userAddressSchema);

module.exports = { UserAddress };
