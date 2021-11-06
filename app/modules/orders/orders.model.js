const mongoose = require('./../../_helpers/db');

let users = mongoose.Schema({

    orderId:String,
    orderDate:Date,
    productIds: Array,
    currency: String,
    price: Number,
    urlOfSale: String

}, {timestamps: {createdAt: true}});

module.exports = mongoose.model('Order', users);