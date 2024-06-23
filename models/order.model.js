const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    foodItems: [{
        dishname: String,
        quantity: Number,
        price: Number,
        dishImage:String
    }],
    checkoutAddress: {
        googleAddress: String,
        area: String,
        latitude: Number,
        longitude: Number
    },
    paymentMethod: String,
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'out for delivery', 'cancelled', 'rejected', 'delivered'],
        default: 'pending'
    },
    totalPrice: Number,
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

 const Order = mongoose.model('Order', orderSchema);

 module.exports ={Order}