const Joi = require('joi');
const orders = require('./orders.model');
const domains = require('./../domains/domains.model');
const socket = require('../../_helpers/socket');
// const mongoose = require('mongoose');


class domainsController {

    constructor(){

        this.addOrder = async (req, res) => {

            try {

                const schema = Joi.object().keys({
                    orderId: Joi.string().required(),
                    orderDate: Joi.date().required(),
                    productIds: Joi.array().required(),
                    currency: Joi.string().required(),
                    price: Joi.number().required(),
                    urlOfSale: Joi.string().required()
                });

                let request = req.body;
                let resultValidation = Joi.validate(request, schema);
                if (resultValidation.error !== null) {

                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Field ' + resultValidation.error.details[0].message,
                    });
                }

                req.body.isDeleted = false;
                req.body.isActive = true;

                let domain = await domains.findOne({name: req.body.urlOfSale, isDeleted: false});

                if(!domain){
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Domain doesn\'t exist'
                    });
                }

                if(!domain.isActive) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Domain isn\'t active'
                    });
                }

                const modelInstance = new orders(req.body);

                let result = await modelInstance.save();

                socket.emit('ORDER'+req.body.urlOfSale, result);

                // socket.emit(result);


                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Order added successfully',
                    data: result
                })
            } catch (e) {
                console.log(e);

                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: e.message || 'something has gone wrong'
                })
            }

        };

    }

}

module.exports = domainsController;