const ordersController = require('./orders.controller');
const controller = new ordersController();
const express = require('express');

const router = express.Router();

router.post('/', controller.addOrder);


module.exports = router;