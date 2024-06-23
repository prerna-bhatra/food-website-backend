const { Menu } = require('../models/menu.model');
const { uploadFileToS3 } = require("../utills/s3Uploader");
const { where } = require('sequelize');
const formidable = require("formidable")


exports.addDishBulk = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const menuItems = await Menu.find({ restaurantId: restaurantId });

        console.log({ menuItems });

        if (menuItems.length) {
            await Menu.deleteMany({ restaurantId: restaurantId });
        }

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            console.log({ files, fields });
            if (err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                });
            }

            try {
                const newMenuItems = [];

                for (const key in files) {
                    if (files.hasOwnProperty(key)) {
                        const file = files[key];
                        console.log({ file });
                        const fileLocation = await uploadFileToS3(file[0]);
                        console.log({ fileLocation });
                        const index = key.match(/\d+/)[0];
                        const dishName = fields[`dishes[${index}].name`];
                        const dishPrice = fields[`dishes[${index}].price`];

                        const existingDishIndex = newMenuItems.findIndex(item => item.dishname === dishName[0]);
                        if (existingDishIndex === -1) {
                            newMenuItems.push({
                                restaurantId,
                                dishname: dishName[0],
                                dishImage: fileLocation,
                                price: parseFloat(dishPrice[0]),
                            });
                        } else {
                            newMenuItems[existingDishIndex].dishImage = fileLocation;
                            newMenuItems[existingDishIndex].price = parseFloat(dishPrice[0]);
                        }
                    }
                }

                for (const key in fields) {
                    console.log({ key });
                    if (fields.hasOwnProperty(key)) {
                        const index = key.match(/\d+/)[0];
                        const dishName = fields[`dishes[${index}].name`];
                        const dishPrice = fields[`dishes[${index}].price`];
                        const dishImage = fields[`documents[${index}]`];

                        const existingDishIndex = newMenuItems.findIndex(item => item.dishname === dishName[0]);
                        if (existingDishIndex === -1) {
                            newMenuItems.push({
                                restaurantId,
                                dishname: dishName[0],
                                dishImage: dishImage[0],
                                price: parseFloat(dishPrice[0]),
                            });
                        } else {
                            newMenuItems[existingDishIndex].price = parseFloat(dishPrice[0]);
                        }
                    }
                }

                const savedMenuItems = await Menu.insertMany(newMenuItems);
                res.status(200).json({ message: 'Items created successfully', newMenuItems: savedMenuItems });
            } catch (error) {
                console.error('Error creating Menu Item:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.dishesByRestaurantID = async (req, res) => {
    try {
        console.log({ Menu });
        const { restaurantId } = req.params;
        console.log({ restaurantId });
        const dishes = await Menu.find({ restaurantId });
        res.status(200).json({ message: 'Dishes fetched successfully', dishes });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.dishById = async (req, res) => {
    try {
        const { dishId } = req.params;
        const dish = await Menu.find(dishId);
        res.status(200).json({ message: 'Dish fetched successfully', dish });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteByRestaurantId = async (restaurantId) => {
    try {
        await Menu.destroy({
            where: {
                restaurantId: restaurantId
            }
        });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
