const express = require('express');
const router = express.Router();
const { createUserAddress  ,getUserAddressById, updateUserName} = require('../controllers/userController');
const { checkTokenMiddleware } = require('../middlewares/authMiddleware.middleware');

router.post('/address',checkTokenMiddleware, createUserAddress);

router.get('/address',checkTokenMiddleware,getUserAddressById);
router.post('/profile',checkTokenMiddleware,updateUserName);


module.exports = router;