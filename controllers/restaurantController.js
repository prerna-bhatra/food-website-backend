const { Restaurant } = require('../models/restuarant.model');
const { Menu } = require('../models/menu.model');
const { uploadFileToS3 } = require("../utills/s3Uploader");
const { where, Op } = require('sequelize');
const formidable = require("formidable");
const { default: mongoose } = require('mongoose');

exports.registerRestaurant = async (req, res) => {
    try {
        const userId = req.userId
        const {
            name,
            completeAddress,
            googleAddress,
            contactName,
            contactNumber,
            country,
            pincode,
            receiverContact,
            state,
            city,
            latitude,
            longitude,
            ownerName,
            ownerContact,
            restaurantImages,
            startTime,
            endTime,
            establishmentType,
            outletDescription,
            ownerEmail,
            cuisines,
            openDays,
            panCardAddress
        } = req.body;

        const newRestaurant = await Restaurant.create({
            name,
            completeAddress,
            googleAddress,
            contactName,
            contactNumber,
            country,
            pincode,
            receiverContact,
            state,
            city,
            latitude,
            longitude,
            ownerName,
            ownerContact,
            restaurantImages,
            startTime,
            endTime,
            establishmentType,
            outletDescription,
            ownerEmail,
            cuisines,
            openDays,
            userId,
            panCardAddress
        });

        res.status(201).json({ message: 'Restaurant registered successfully', newRestaurant });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.updateRestaurantRegistration = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const {
            name,
            completeAddress,
            googleAddress,
            contactName,
            contactNumber,
            country,
            pincode,
            receiverContact,
            state,
            city,
            latitude,
            longitude,
            ownerName,
            ownerContact,
            restaurantImages,
            startTime,
            endTime,
            establishmentType,
            outletDescription,
            // ownerEmail,
            panCardAddress,
            cuisines,
            openDays } = req.body;

        const updateRestaurantRegistrationInfo = await Restaurant.update(
            {
                name,
                completeAddress,
                googleAddress,
                contactName,
                contactNumber,
                country,
                pincode,
                receiverContact,
                state,
                city,
                latitude,
                longitude,
                ownerName,
                ownerContact,
                restaurantImages,
                startTime,
                endTime,
                establishmentType,
                outletDescription,
                // ownerEmail,
                panCardAddress,
                cuisines,
                openDays
            },
            {
                where: {
                    id: restaurantId
                }
            }

        );

        res.status(201).json({ message: 'regustration  data  updated successfully', updateRestaurantRegistrationInfo });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.virificationDetailUpdateOrSave = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const {
            panCardName,
            panCardAddress,
            panNumber,
            ifscCode,
            fssaiNumber,
            fssaiExpiryDate,
            bankAccountType,
            bankAccountNumber } = req.body;

        const verificationInfo = await Restaurant.update(
            {
                panCardName,
                panNumber,
                ifscCode,
                fssaiNumber,
                fssaiExpiryDate,
                bankAccountType,
                bankAccountNumber,
                panCardAddress
            },
            {
                where: {
                    id: restaurantId
                }
            }

        );

        res.status(201).json({ message: 'verification data  updated successfully' });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.restaurantDocument = async (req, res) => {
    try {
        // res.status(201).json({ message: 'User address created successfully', userAddress: newUserAddress });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.restaurantsByUserId = async (req, res) => {
    try {
        const { userId } = req;
        console.log({ userId });
        const restaurants = await Restaurant.find({ userId });
        res.status(200).json({ message: 'Restaurant created successfully', restaurants });
    } catch (error) {
        console.error('Error finding  restaurant address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//  only restaurant user  can access it  ( document detauls etc)
exports.myRestaurantById = async (req, res) => {
    try {
        const { restaurantId } = req.params
        const restaurant = await Restaurant.find(restaurantId);
        res.status(200).json({ message: 'successfully', restaurant });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.restaurantById = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Find the restaurant by ID
        const restaurant = await Restaurant.findById(restaurantId)
            .select('id name completeAddress restaurantImages city cuisines');

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Find menus for the specific restaurantId
        const menus = await Menu.find({ restaurantId });

        res.status(200).json({ message: 'Restaurant and menus fetched successfully', restaurant, menus });
    } catch (error) {
        console.error('Error fetching restaurant and menus:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.searchByDishName = async (req, res) => {
    try {
        const { dishName } = req.query;
        console.log({ dishName });

        if (!dishName || !dishName.trim().length) {
            return res.status(400).json({ error: 'Invalid Request' });
        }

        // Find menus matching dishName
        const menus = await Menu.find({ dishname: dishName })
        // Extract restaurantIds from matching menus
        const restaurantIds = menus.map(menu => menu.restaurantId);

        // Query restaurants using the extracted restaurantIds
        const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } })
            .select('id name completeAddress restaurantImages');

        res.status(200).json({ message: 'Restaurants fetched successfully', restaurants, menus });
    } catch (error) {
        console.error('Error searching by dishname:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.restaurantOrMenuSearch = async (req, res) => {
    console.log("restaurantOrMenuSearch");
    try {
        console.log({ query: req.query });
        const { searchString } = req.query;
        console.log({ searchString });

        if (!searchString || !searchString.trim().length) {
            return res.status(400).json({ error: 'Invalid Request' });
        }

        // Search for menus
        const menus = await Menu.find({
            dishname: { $regex: searchString, $options: 'i' } // Case insensitive search
        }).select('id dishname price dishImage');

        // Search for restaurants
        const restaurants = await Restaurant.find({
            name: { $regex: searchString, $options: 'i' } // Case insensitive search
        }).select('id name completeAddress');

        res.status(200).json({ message: 'Search results retrieved successfully', restaurants, menus });
    } catch (error) {
        console.error('Error searching restaurants or menus:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.restaurantDocumentOrImagesUpload = async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                })
            }
            const documentType = fields.documentType
            const restaurantId = fields.restaurantId[0];
            console.log({ d: files.document });
            if (files.document) {
                const fileLocation = await uploadFileToS3(files.document[0]);
                console.log("30=======>", { fileLocation });
                if (fileLocation) {
                    console.log("inside it ");
                    switch (documentType[0]) {
                        case 'panCardImage':
                            saveImage(restaurantId, { panCardImage: fileLocation });
                            return res.status(200).json({ error: ' document added  successfully' });
                            break;
                        case 'fssaiImage':
                            saveImage({ fssaiImage: fileLocation })
                            return res.status(200).json({ error: ' document added  successfully' });
                            break;
                        default:
                            return res.status(400).json({ error: 'Invalid document type' });
                            break;

                    }
                }
            }
        })

    } catch (error) {
        console.error('Error creating Image uploading:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.restaurantImagesUpload = async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                });
            }
            const restaurantId = fields.restaurantId[0];

            console.log({ restaurantId });

            if (files.document) {
                const fileLocation = await uploadFileToS3(files.document[0]);
                // const fileLocation="TESTING";
                console.log({ fileLocation });
                if (fileLocation) {
                    const restaurant = await Restaurant.findOne({ _id: restaurantId });
                    console.log({ restaurant });
                    if (!restaurant) {
                        return res.status(404).json({ error: 'Restaurant not found' });
                    }

                    console.log({ images: restaurant.restaurantImages });

                    const updatedImages = restaurant.restaurantImages && Array.isArray(restaurant.restaurantImages)
                        ? [...restaurant.restaurantImages, fileLocation]
                        : [fileLocation];


                    console.log({ updatedImages });

                    restaurant.restaurantImages = updatedImages;

                    await restaurant.save();
                    res.status(200).json({
                        message: 'Image uploaded and added successfully',
                        fileLocation
                    });
                }
            } else {
                res.status(400).json({
                    error: 'No document uploaded'
                });
            }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.deleteRestaurantImage = async (req, res) => {
    const { restaurantId, imageUrl } = req.body;

    try {
        const restaurant = await Restaurant.find(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const updatedImages = restaurant.restaurantImages.filter(image => image !== imageUrl);
        restaurant.restaurantImages = updatedImages;

        await restaurant.save();

        // await deleteFile(imageUrl);

        res.status(200).json({
            message: 'Image removed successfully',
            updatedImages
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const saveImage = async (restaurantId, updateFields) => {
    try {
        console.log("save image");
        // Ensure restaurantId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            throw new Error('Invalid restaurantId');
        }

        // Perform the update
        const updateImage = await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $set: updateFields },
            { new: true } // Return the updated document
        );

        return updateImage;
    } catch (err) {
        console.error('Error updating image:', err);
        throw err;
    }
}




