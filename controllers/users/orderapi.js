const express = require('express');
const { UserProfile } = require('../../models/UserProfile');
const { Order } = require('../../models/OrderSchema');
const pricing = require('../../models/pricing');
const authenticateToken = require('../../middleware/auth');

const router = express.Router();

const PRICING = pricing.getPricing();

// Place Order API
router.post('/order', authenticateToken, async (req, res) => {
    const { washType, items, pickupSlot, orderDate, address, city, state, pincode } = req.body;
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

    // Validate pickupSlot
    const allowedSlots = ["6–8 AM", "5–7 PM", "emergency"];
    if (!allowedSlots.includes(pickupSlot)) {
        return res.status(400).json({ message: "Invalid pickup slot" });
    }

    // Validate address fields
    if (!address || !city || !state || !pincode) {
        return res.status(400).json({ message: 'Address, city, state, and pincode are required' });
    }

    // Format orderDate if not provided, or parse if provided
    let formattedDate = orderDate;
    if (orderDate) {
        // Try to parse date from frontend (e.g., "Thu Jun 26 2025")
        const parsed = new Date(orderDate);
        if (!isNaN(parsed)) {
            formattedDate = `${parsed.getDate().toString().padStart(2, '0')}-${(parsed.getMonth() + 1).toString().padStart(2, '0')}-${parsed.getFullYear()}`;
        } else {
            // If parsing fails, fallback to original string
            formattedDate = orderDate;
        }
    } else {
        const now = new Date();
        formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
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

    if (pickupSlot === "emergency") {
        total = Math.round(total * 1.3);
    }

    // Create order
    const order = await Order.create({
        userId,
        washType,
        items,
        total,
        orderDate: formattedDate,
        pickupSlot,
        address,
        city,
        state,
        pincode,
        payment: {
            status: 'pending',
            paymentId: null,
            method: 'razorpay'
        }
    });

    res.status(200).json({ message: 'Order placed', order, total });
});

// Get Orders by User ID (only show paid orders)
router.get('/orders', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    // Only fetch orders where payment.status is 'paid'
    const orders = await Order.find({ userId, 'payment.status': 'paid' });

    // Calculate grand total for all paid orders
    const total = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.status(200).json({ orders, total });
});

module.exports = router;