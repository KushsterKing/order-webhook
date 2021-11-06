const mongoose = require('./../../_helpers/db');

let users = mongoose.Schema({

    name:String,
    isActive:Boolean,
    isDeleted: Boolean

}, {timestamps: {createdAt: true}});

module.exports = mongoose.model('Domain', users);