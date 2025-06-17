const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pincode } = require('../../models/PincodeSchema');
const { User } = require('../../models/Users');
const { UserProfile } = require('../../models/UserProfile');
const { NotAvailable } = require('../../models/NotAvailableSchema');
const authenticateToken = require('../../middleware/auth'); 


const router = express.Router();

// Utility to sanitize pincode input (allow only digits, length 6)
function sanitizePincode(pincode) {
    if (typeof pincode !== 'string') return null;
    const sanitized = pincode.trim();
    if (/^\d{6}$/.test(sanitized)) {
        return sanitized;
    }
    return null;
}

// Pincode check API
router.post('/check-pincode', async (req, res) => {
    const sanitizedPincode = sanitizePincode(req.body.pincode);
    if (!sanitizedPincode) {
        return res.status(400).json({ message: 'Invalid pincode format' });
    }
    const found = await Pincode.findOne({ pincode: sanitizedPincode });
    if (found) {
        return res.status(200).json({ message: 'Service available' });
    } else {
        await NotAvailable.create({ pincode: sanitizedPincode });
        return res.status(200).json({ message: 'Service not available'});
    }
});

// Signup API
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ email, password: hashedPassword });
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
});

// Profile Update API (after signup)
router.post('/profile', authenticateToken, async (req, res) => {
    const { firstname, lastname, email, phone, address, pincode, city, state } = req.body;
    const userId = req.user.userId;

    if (!firstname || !lastname || !email || !phone || !address || !pincode || !city || !state) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Save or update profile by userId
    let profile = await UserProfile.findOneAndUpdate(
        { userId },
        { userId, firstname, lastname, email, phone, address, pincode, city, state },
        { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Profile saved', profile });
});



// Login API
router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
});

// Get Profile API
router.get('/profile', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ profile });
});

module.exports = router;