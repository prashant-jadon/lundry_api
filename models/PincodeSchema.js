const mongoose = require('mongoose');

const PincodeSchema = new mongoose.Schema({ pincode: String });
const Pincode = mongoose.model('Pincode', PincodeSchema);

module.exports = { Pincode};