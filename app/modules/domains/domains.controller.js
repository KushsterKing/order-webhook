const Joi = require('joi');
const domains = require('./domains.model');
const db = require('../../_helpers/db');
const mongoose = require('mongoose');
const socket = require('../../_helpers/socket');
let alert = require('alert');




class domainsController {

    constructor(){
        this.addDomain = async (req, res) => {

            try {

                const schema = Joi.object().keys({
                    name: Joi.string().required(),
                    // isActive: Joi.boolean().required()
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

                let domain = await domains.findOne(req.body);

                if(domain){
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Domain already exists'
                    })
                }

                const modelInstance = new domains(req.body);

                let result = await modelInstance.save();

                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Domain added successfully',
                    data: result
                })
            } catch (e) {
                console.log(e)

                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: e.message || 'something has gone wrong'
                })
            }

        };

        this.updateDomain = async (req, res) => {

            try {

                let schema = Joi.object({
                    name: Joi.string().optional(),
                    isActive: Joi.boolean().optional()
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

                let domain = await domains.findOne({_id: {$ne: mongoose.Types.ObjectId(req.params.id)}, isDeleted: false, ...req.body});

                if(domain){
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Domain already exists',
                    });
                }

                await domains.updateOne({_id: mongoose.Types.ObjectId(req.params.id), isDeleted: false}, {$set: {...req.body}});

                res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Domain updated successfully'
                })
            } catch (e) {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: e.message || 'something has gone wrong'
                })
            }

        };

        this.getDomains = async (req, res) => {

            try {

                // let schema = Joi.object({
                //     first_name: Joi.string().required(),
                //     last_name: Joi.string().required()
                // });
                //
                // try {
                //     Joi.validate(schema, req.body)
                // } catch (e) {
                //     res.status(400).json({
                //         status: 400,
                //         success: false,
                //         message: 'validation error'
                //     })
                // }

                let domains_result = await domains.find({ isDeleted: false});

                res.status(200).json({
                    status: 200,
                    success: true,
                    // message: 'Domain added successfully',
                    data: domains_result
                })
            } catch (e) {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: e.message || 'something has gone wrong'
                })
            }

        };

        this.deleteDomain = async (req, res) => {

            try {

                // let schema = Joi.object({
                //     first_name: Joi.string().required(),
                //     last_name: Joi.string().required()
                // });
                //
                // try {
                //     Joi.validate(schema, req.body)
                // } catch (e) {
                //     res.status(400).json({
                //         status: 400,
                //         success: false,
                //         message: 'validation error'
                //     })
                // }

                await domains.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {$set: {isDeleted: true}});

                res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Domain deleted successfully'
                })
            } catch (e) {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: e.message || 'something has gone wrong'
                })
            }

        };

        this.getDomain = async (req, res) => {

            try {

                // let schema = Joi.object({
                //     first_name: Joi.string().required(),
                //     last_name: Joi.string().required()
                // });
                //
                // try {
                //     Joi.validate(schema, req.body)
                // } catch (e) {
                //     res.status(400).json({
                //         status: 400,
                //         success: false,
                //         message: 'validation error'
                //     })
                // }

                let domain = await domains.findOne({_id: mongoose.Types.ObjectId(req.params.id), isDeleted: false});

                res.status(200).json({
                    status: 200,
                    success: true,
                    // message: 'Domain added successfully',
                    data: domain
                })
            } catch (e) {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: e.message || e.errors[0].message || 'something has gone wrong'
                })
            }

        };

        this.listenToDomain = async (req, res) => {

            try {

                if(!req.query.url){
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Please send url'
                    });
                }

                let domain = await domains.findOne({name: req.query.url, isDeleted: false, isActive: true});

                if(!domain){
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Domain doesn\'t exist'
                    });
                }

                socket.on('ORDER'+req.query.url, function incoming(message) {
                    alert(message);

                    console.log('received ', message);
                });

                return res.status(200).json({
                    status: true
                })

                // let string = 'dsaasaasdsdas';
                // const ws = new websocket('ws://localhost:8080/' + string);
                //
                // ws.on('ORDER', function incoming(message) {
                //     console.log('received ', message);
                // })
            }catch (e) {
                console.log(e);

                return res.status(500).json({
                    status: false
                })
            }
        };


    }

}

module.exports = domainsController;