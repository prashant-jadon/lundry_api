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
const cookieParser = require('cookie-parser');

// app.use(cors());
app.use(cors({
  origin: (origin, callback) => {
    // Allow all vercel.app subdomains and localhost for dev
    if (
      !origin ||
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:3000' ||
      origin === 'http://localhost:4000'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true               // ⬅️ Needed to allow cookies
}));

app.use(express.json());
app.use(cookieParser())

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