const mongoose = require('mongoose');
const { add } = require('winston');

// Order Schema
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
    washType: { type: String, enum: ['standard', 'premium', 'dry cleaning', 'delicate'], required: true },
    items: {
        shirt: { type: Number, default: 0 },
        pant: { type: Number, default: 0 },
        tshirt: { type: Number, default: 0 },
        dress: { type: Number, default: 0 },
        cottonDress: { type: Number, default: 0 }
    },
    total: { type: Number, default: 0 },
    address: { type: String, required: true }, 
    city: { type: String, required: true },
    state: { type: String, required: true }, 
    pincode: { type: String, required: true }, 
    orderDate: { type: String }, // e.g., "16-06-2025"
    pickupSlot: { type: String, enum: ['6–8 AM', '5–7 PM', 'emergency'], required: true },
    status: {
        type: String,
        enum: ['Pending', 'Picked Up', 'In Progress', 'Delivered'],
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now },
    deliveryBoyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    payment: {
        status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
        paymentId: { type: String, default: null }, // Stripe payment intent ID
        method: { type: String, default: 'stripe' }
    },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };