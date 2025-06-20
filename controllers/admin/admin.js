const express = require('express');
const { User } = require('../../models/Users');
const { UserProfile } = require('../../models/UserProfile');
const { Order } = require('../../models/OrderSchema');
const authenticateToken = require('../../middleware/auth');
const pricing = require('../../models/pricing');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const DeliveryBoyProfile = require('../../models/DeliveryBoyProfile');

// Middleware to check admin
function isAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
}

const router = express.Router();

// Admin Login
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isAdmin: true });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials or not an admin' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
        { userId: user._id, isAdmin: true },
        'your_jwt_secret',
        { expiresIn: '1h' }
    );
    res.status(200).json({ token });
});

// 1. View All Users
router.get('/admin/users', authenticateToken, isAdmin, async (req, res) => {
    // Exclude users where isAdmin or isDeliveryBoy is true
    const users = await User.find({ isAdmin: { $ne: true }, isDeliveryBoy: { $ne: true } }, '-password');
    res.json(users);
});

// 2. View All User Profiles
router.get('/admin/user-profiles', authenticateToken, isAdmin, async (req, res) => {
    const profiles = await UserProfile.find();
    res.json(profiles);
});

// 3. View All Orders (admin only, show only paid orders)
router.get('/admin/orders', authenticateToken, isAdmin, async (req, res) => {
    const { washType, city, state, date, userId } = req.query;
    let filter = { 'payment.status': 'paid' }; // Only show paid orders
    if (washType) filter.washType = washType;
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (date) filter.orderDate = date;
    if (userId) filter.userId = userId;
    const orders = await Order.find(filter);
    res.json(orders);
});

// 4. Get Pricing
router.get('/admin/pricing', authenticateToken, isAdmin, (req, res) => {
    res.json(pricing.getPricing());
});

// 5. Update Pricing
router.put('/admin/pricing', authenticateToken, isAdmin, (req, res) => {
    const { washType, prices } = req.body;
    if (!washType || !prices) {
        return res.status(400).json({ message: 'washType and prices are required' });
    }
    pricing.setPricing(washType, prices);
    res.json({ message: 'Pricing updated', pricing: { [washType]: prices } });
});

// 6. Add Wash Type
router.post('/admin/wash-types', authenticateToken, isAdmin, (req, res) => {
    const { washType, prices } = req.body;
    if (!washType || !prices) {
        return res.status(400).json({ message: 'washType and prices are required' });
    }
    pricing.addWashType(washType, prices);
    res.json({ message: 'Wash type added', washType });
});

// 7. Remove Wash Type
router.delete('/admin/wash-types/:washType', authenticateToken, isAdmin, (req, res) => {
    const { washType } = req.params;
    if (pricing.getPricing()[washType]) {
        pricing.removeWashType(washType);
        return res.json({ message: 'Wash type removed' });
    }
    res.status(404).json({ message: 'Wash type not found' });
});

// 8. Update Order Status
router.put('/admin/orders/:orderId/status', authenticateToken, isAdmin, async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Picked Up', 'In Progress', 'Delivered'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated', order });
});

// Assign order to a delivery boy
router.put('/admin/orders/:orderId/assign', authenticateToken, isAdmin, async (req, res) => {
    const { orderId } = req.params;
    const { deliveryBoyId } = req.body;

    // Check if delivery boy exists and is a delivery boy
    const deliveryBoy = await User.findOne({ _id: deliveryBoyId, isDeliveryBoy: true });
    if (!deliveryBoy) {
        return res.status(400).json({ message: 'Invalid delivery boy ID' });
    }

    // Assign the order
    const order = await Order.findByIdAndUpdate(
        orderId,
        { deliveryBoyId },
        { new: true }
    );
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order assigned to delivery boy', order });
});

// 9. View All Delivery Boys
router.get('/admin/delivery-boys', authenticateToken, isAdmin, async (req, res) => {
    const deliveryBoys = await User.find({ isDeliveryBoy: true }, '-password');
    res.json(deliveryBoys);
});

// View a user's full profile by userId (admin only)
router.get('/admin/user-profile/:userId', authenticateToken, isAdmin, async (req, res) => {
    const { userId } = req.params;
    if (!userId || userId === 'undefined') {
        return res.status(400).json({ message: 'Invalid or missing userId parameter' });
    }
    const user = await User.findOne({ _id: userId, isAdmin: { $ne: true }, isDeliveryBoy: { $ne: true } }, '-password');
    const profile = await UserProfile.findOne({ userId });
    if (!user || !profile) {
        return res.status(404).json({ message: 'User or profile not found' });
    }
    res.json({ user, profile });
});

// Create or update delivery boy profile (admin only, separate collection)
router.post('/admin/delivery-boy-profile', authenticateToken, isAdmin, async (req, res) => {
    const { userId, firstname, lastname, email, phone, address, pincode, city, state } = req.body;

    if (!userId || !firstname || !lastname || !email || !phone || !address || !pincode || !city || !state) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists and is a delivery boy
    const user = await User.findOne({ _id: userId, isDeliveryBoy: true });
    if (!user) {
        return res.status(404).json({ message: 'Delivery boy not found' });
    }

    // Save or update delivery boy profile in its own collection
    const profile = await DeliveryBoyProfile.findOneAndUpdate(
        { userId },
        { userId, firstname, lastname, email, phone, address, pincode, city, state },
        { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Delivery boy profile saved', profile });
});

// Get delivery boy profile by delivery boy userId (admin only)
router.get('/admin/delivery-boy-profile/:userId', authenticateToken, isAdmin, async (req, res) => {
    const { userId } = req.params;
    const profile = await DeliveryBoyProfile.findOne({ userId });
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ profile });
});

module.exports = router;