const { Order } = require('../models/order.model');
const { where, Op } = require('sequelize');
const { User } = require('../models/user.model');

exports.createOrder = async (req, res) => {
    console.log({ Order });
    try {
        const { userId } = req
        const { restaurantId, foodItems, totalPrice, checkoutAddress, paymentMethod } = req.body;

        console.log({checkoutAddress});

        // console.log({
        //     foodItems,
        //     restaurantId,
        //     totalPrice,
        //     checkoutAddress
        // });

        const newOrder = await Order.create({
            restaurantId,
            userId,
            foodItems,
            totalPrice,
            checkoutAddress,
            paymentMethod
        })
        res.status(200).json({ message: 'Order created successfully', newOrder });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// only restuarant owner can do this
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body;
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.orderStatus = status;
        await order.save();

        res.status(200).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.orderByID = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order fetched successfully', order });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.orderByUserId = async (req, res) => {
    try {
        const { userId } = req;
        const orders = await Order.find({ userId: userId });
        if (!orders) {
            throw new Error('No orders found for the given user');
        }

        res.status(200).json({ message: 'Order fetched successfully', orders });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.orderByRestaurantId = async (req, res) => {
    try {
        const { restaurantId } = req.params
        console.log({restaurantId});
        const orders = await Order.find({
            restaurantId: restaurantId
        }).populate('userId', '_id username email phone');

        console.log({orders});

        if (!orders) {
            throw new Error('No orders found for the given user');
        }

        res.status(200).json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
        console.error('Error creating user address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    console.log("cancelOrder", orderId);

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderCreationTime = new Date(order.createdAt);
        const currentTime = new Date();
        const timeDifference = (currentTime - orderCreationTime) / 1000; // Difference in seconds

        if (order.orderStatus === 'cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        if (timeDifference > 60) {
            return res.status(400).json({ message: 'Order can only be cancelled within 60 seconds of placing' });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        return res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.changeAddress = async (req, res) => {
    const { orderId } = req.params;
    const { newAddress } = req.body;
    console.log({ newAddress });
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.orderStatus === 'cancelled') {
            return res.status(200).json({ message: 'Order is already cancelled , can not be changed address' });
        }

        order.checkoutAddress = newAddress;
        await order.save();

        return res.status(200).json({ message: 'Order address updates successfully', order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};