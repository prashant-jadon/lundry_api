const express = require('express');
const { User } = require('../../models/Users');
const { UserProfile } = require('../../models/UserProfile');
const { Order } = require('../../models/OrderSchema');
const authenticateToken = require('../../middleware/auth');
const pricing = require('../../models/pricing');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    // Exclude users where isAdmin is true
    const users = await User.find({ isAdmin: { $ne: true } }, '-password');
    res.json(users);
});

// 2. View All User Profiles
router.get('/admin/user-profiles', authenticateToken, isAdmin, async (req, res) => {
    const profiles = await UserProfile.find();
    res.json(profiles);
});

// 3. View All Orders
router.get('/admin/orders', authenticateToken, isAdmin, async (req, res) => {
    const { washType, city, state, date, userId } = req.query;
    let filter = {};
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

module.exports = router;