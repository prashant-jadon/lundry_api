const mongoose = require('mongoose');
const DeliveryBoyProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    address: String,
    pincode: String,
    city: String,
    state: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('DeliveryBoyProfile', DeliveryBoyProfileSchema);