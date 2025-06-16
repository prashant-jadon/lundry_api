const mongoose = require('mongoose');


const NotAvailableSchema = new mongoose.Schema({ pincode: String });
const NotAvailable = mongoose.model('NotAvailable', NotAvailableSchema);


module.exports = {  NotAvailable };