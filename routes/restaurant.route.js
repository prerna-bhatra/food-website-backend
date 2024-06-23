const express = require('express');
const router = express.Router();
const { registerRestaurant, 
    virificationDetailUpdateOrSave,
     restaurantsByUserId, 
     myRestaurantById ,
      updateRestaurantRegistration ,
      restaurantDocumentOrImagesUpload,
      restaurantOrMenuSearch,
      restaurantById,
      searchByDishName,
      restaurantImagesUpload
    } = require('../controllers/restaurantController');
const { checkTokenMiddleware } = require('../middlewares/authMiddleware.middleware');

router.post('/register', checkTokenMiddleware, registerRestaurant);
router.post('/update-registration-details/:restaurantId', checkTokenMiddleware, updateRestaurantRegistration);
router.post('/verification-details/:restaurantId', checkTokenMiddleware, virificationDetailUpdateOrSave);
router.get('/my-restaurant/:restaurantId', checkTokenMiddleware, myRestaurantById);
router.get('/search-by-dishname', searchByDishName);
router.get('/search/:restaurantId', restaurantById);
router.get('/my-restaurants', checkTokenMiddleware, restaurantsByUserId);
router.post('/upload', checkTokenMiddleware , restaurantDocumentOrImagesUpload);
router.post('/images', checkTokenMiddleware , restaurantImagesUpload);
router.get('/search-item' , restaurantOrMenuSearch);

module.exports = router;