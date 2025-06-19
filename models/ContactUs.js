const mongoose = require('mongoose');
const ContactUsSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ContactUs', ContactUsSchema);