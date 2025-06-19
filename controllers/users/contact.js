const express = require('express');
const ContactUs = require('../../models/ContactUs');
const router = express.Router();

router.post('/contact-us', async (req, res) => {
    const { firstname, lastname, email, message } = req.body;

    if (!firstname || !lastname || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await ContactUs.create({ firstname, lastname, email, message });
        res.status(200).json({ message: 'Thank you for contacting us. We will get back to you soon.' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

module.exports = router;