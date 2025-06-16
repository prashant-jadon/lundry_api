const mongoose = require('mongoose');

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
    orderDate: { type: String }, // e.g., "16-06-2025"
    pickupSlot: { type: String, enum: ['6–8 AM', '5–7 PM', 'emergency'], required: true },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };