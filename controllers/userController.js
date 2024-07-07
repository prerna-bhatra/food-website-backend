const { UserAddress } = require('../models/userAddress.model');
const { User } = require('../models/user.model');
const { where } = require('sequelize');

exports.createUserAddress = async (req, res) => {
    try {
        const { addressType, houseName, latitude, longitude, area, landMark, receiverContact, googleAddress } = req.body;

        const userId = req.userId
        const newUserAddress = await UserAddress.create({
            userId,
            addressType,
            houseName,
            latitude,
            longitude,
            area,
            landMark,
            receiverContact,
            googleAddress
        });
        

        res.status(201).json({ message: 'User address created successfully', userAddress: newUserAddress });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getUserAddressById = async (req, res) => {
    try {
        const userId = req.userId;

        const userAddresses = await UserAddress.find({
            
                userId: userId
        
        });

        console.log({ userAddresses });

        if (!userAddresses) {
            return res.status(404).json({ error: 'User address not found' });
        }

        res.status(200).json(userAddresses);
    } catch (error) {
        console.error('Error fetching user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUserAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { addressType, houseName, latitude, longitude, area, landMark, receiverContact } = req.body;

        const userAddress = await UserAddress.findById(addressId);

        if (!userAddress) {
            return res.status(404).json({ error: 'User address not found' });
        }

        await userAddress.update({
            addressType,
            houseName,
            latitude,
            longitude,
            area,
            landMark,
            receiverContact
        });

        res.status(200).json({ message: 'User address updated successfully', userAddress });
    } catch (error) {
        console.error('Error updating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteUserAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const userAddress = await UserAddress.findByPk(addressId);

        if (!userAddress) {
            return res.status(404).json({ error: 'User address not found' });
        }

        await userAddress.destroy();

        res.status(200).json({ message: 'User address deleted successfully' });
    } catch (error) {
        console.error('Error deleting user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUserName = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.userId
        const updatesUser = await User.update(
            { userName: name }, // Updated fields
            { where: { userId } } // Where condition
        );
        res.status(200).json({ message: 'User updated successfully', updatesUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
