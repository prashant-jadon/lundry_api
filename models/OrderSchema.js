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
        // Add more items as needed
    },
    total: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };