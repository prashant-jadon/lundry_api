require('dotenv').config();
const express = require('express');
const { Order } = require('../../models/OrderSchema');
const authenticateToken = require('../../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-razorpay-order', authenticateToken, async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.payment.status === 'paid') return res.status(400).json({ message: 'Order already paid' });

    const options = {
        amount: Math.round(order.total * 100), // amount in paise
        currency: "INR",
        receipt: order._id.toString(),
        notes: { userId: req.user.userId }
    };

    try {
        const razorpayOrder = await razorpay.orders.create(options);
        // Optionally, store razorpayOrder.id in order.payment.paymentId
        order.payment.paymentId = razorpayOrder.id;
        order.payment.method = 'razorpay';
        order.payment.status = 'pending';
        await order.save();
        res.json({ orderId: order._id, razorpayOrderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create Razorpay order', error: err.message });
    }
});

router.post('/verify-razorpay-payment', authenticateToken, async (req, res) => {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Generate expected signature
    const generated_signature = crypto.createHmac('sha256', razorpay.key_secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        await Order.findByIdAndUpdate(orderId, {
            'payment.status': 'paid',
            'payment.paymentId': razorpay_payment_id,
            'payment.method': 'razorpay'
        });
        return res.json({ message: 'Payment verified and order marked as paid' });
    } else {
        return res.status(400).json({ message: 'Invalid payment signature' });
    }
});

module.exports = router;