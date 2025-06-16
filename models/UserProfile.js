const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    phone: String,
    address: String,
    pincode: String,
    city: String,
    state: String,
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = { UserProfile };