const express = require('express');
const router = express.Router();
const { addDishBulk , dishById  , dishesByRestaurantID} = require('../controllers/menuController');

router.post('/items/:restaurantId', addDishBulk);
router.get('/item/:dishId', dishById);
router.get('/items/:restaurantId', dishesByRestaurantID);

module.exports = router;