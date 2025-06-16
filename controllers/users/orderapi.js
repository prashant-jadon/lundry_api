const express = require('express');
const { UserProfile } = require('../../models/UserProfile');
const { Order } = require('../../models/OrderSchema');
const authenticateToken = require('../../middleware/auth');

const router = express.Router();

const PRICING = {
    standard:   { shirt: 30, pant: 40, tshirt: 25, dress: 50, cottonDress: 60 },
    premium:    { shirt: 50, pant: 60, tshirt: 40, dress: 80, cottonDress: 100 },
    'dry cleaning': { shirt: 80, pant: 90, tshirt: 70, dress: 120, cottonDress: 140 },
    delicate:   { shirt: 100, pant: 110, tshirt: 90, dress: 150, cottonDress: 170 }
};

// Place Order API
router.post('/order', authenticateToken, async (req, res) => {
    const { washType, items } = req.body;
    const userId = req.user.userId;

    // Validate washType
    const allowedTypes = ['standard', 'premium', 'dry cleaning', 'delicate'];
    if (!allowedTypes.includes(washType)) {
        return res.status(400).json({ message: 'Invalid wash type' });
    }

    // Validate items
    if (!items || typeof items !== 'object') {
        return res.status(400).json({ message: 'Items are required' });
    }

    // Check if user profile exists by userId
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
        return res.status(400).json({ message: 'User profile not found' });
    }

    // Calculate total price
    let total = 0;
    const prices = PRICING[washType];
    for (const item in items) {
        if (prices[item]) {
            total += (items[item] || 0) * prices[item];
        }
    }

    // Create order
    const order = await Order.create({
        userId,
        washType,
        items,
        total // Save total in DB if you want
    });

    res.status(200).json({ message: 'Order placed', order, total });
});

// Get Orders by User ID
router.get('/orders', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const orders = await Order.find({ userId });

    // Calculate grand total for all orders
    const total = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.status(200).json({ orders, total });
});

module.exports = router;