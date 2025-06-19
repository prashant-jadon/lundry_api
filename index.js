const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./controllers/users/api');
const orderRoutes = require('./controllers/users/orderapi');
const adminRoutes = require('./controllers/admin/admin');
const deliveryRoutes = require('./controllers/delivery/delivery');
const paymentRoutes = require('./controllers/users/payment');
const contactRoutes = require('./controllers/users/contact');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://prashant:prashant@cluster0.zktg0fy.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Use API routes
app.use('/api', apiRoutes);

// Use Order routes
app.use('/api', orderRoutes);

// Use Admin routes
app.use('/api', adminRoutes);

// Use Delivery routes
app.use('/api', deliveryRoutes);

// Use Payment routes
app.use('/api', paymentRoutes);

// Use Contact routes
app.use('/api', contactRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Application is running on ${port}`);
});