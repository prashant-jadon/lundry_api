const express = require('express');
const { User } = require('../../models/Users');
const { Order } = require('../../models/OrderSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Delivery Boy Login
router.post('/delivery/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeliveryBoy: true });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials or not a delivery boy' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
        { userId: user._id, isDeliveryBoy: true },
        'your_jwt_secret',
        { expiresIn: '1h' }
    );
    // Exclude password from user object in response
    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ token, user: userData });
});

// Middleware to check delivery boy
function isDeliveryBoy(req, res, next) {
    if (!req.user || !req.user.isDeliveryBoy) {
        return res.status(403).json({ message: 'Forbidden: Delivery boys only' });
    }
    next();
}

// Middleware to authenticate token
const authenticateToken = require('../../middleware/auth');

// Get all assigned orders (optionally filter by status)
router.get('/delivery/orders', authenticateToken, isDeliveryBoy, async (req, res) => {
    // You can assign orders to delivery boys by adding a deliveryBoyId field in OrderSchema
    const { status } = req.query;
    const filter = { deliveryBoyId: req.user.userId };
    if (status) filter.status = status;
    const orders = await Order.find(filter);
    res.json({ orders });
});

// Update order status (only for assigned orders)
router.put('/delivery/orders/:orderId/status', authenticateToken, isDeliveryBoy, async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['Picked Up', 'In Progress', 'Delivered'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    // Only allow update if order is assigned to this delivery boy
    const order = await Order.findOneAndUpdate(
        { _id: orderId, deliveryBoyId: req.user.userId },
        { status },
        { new: true }
    );
    if (!order) {
        return res.status(404).json({ message: 'Order not found or not assigned to you' });
    }
    res.json({ message: 'Order status updated', order });
});

module.exports = router;