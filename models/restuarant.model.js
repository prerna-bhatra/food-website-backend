const mongoose = require('mongoose');
const { User } = require('./user.model.js'); // Import the User model

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    completeAddress: {
        type: String,
        required: true
    },
    googleAddress: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
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
    ownerName: {
        type: String,
        required: true
    },
    ownerContact: {
        type: String,
        required: true
    },
    restaurantImages: {
        type: [String],
        required: false
    },
    startTime: {
        type: String, // Consider using Date type with proper handling if time needs to be precise
        required: true
    },
    endTime: {
        type: String, // Consider using Date type with proper handling if time needs to be precise
        required: true
    },
    establishmentType: {
        type: String,
        required: true
    },
    outletDescription: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true,
        unique: true
    },
    cuisines: {
        type: [String],
        required: true
    },
    openDays: {
        type: [String],
        required: true
    },
    menuImages: {
        type: [String],
        required: false
    },
    panNumber: {
        type: String,
        required: false
    },
    panCardName: {
        type: String,
        required: false
    },
    panCardAddress: {
        type: String,
        required: false
    },
    panCardImage: {
        type: String,
        required: false
    },
    bankAccountNumber: {
        type: String,
        required: false
    },
    bankAccountType: {
        type: String,
        required: false
    },
    ifscCode: {
        type: String,
        required: false
    },
    fssaiNumber: {
        type: String,
        required: false
    },
    fssaiExpiryDate: {
        type: String,
        required: false
    },
    fssaiImage: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = { Restaurant };
