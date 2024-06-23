const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    dishname: {
        type: String,
        required: true
    },
    dishImage: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = { Menu };
