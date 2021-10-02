const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
 //body here
})

exports.Order = mongoose.model('Order', orderSchema);
