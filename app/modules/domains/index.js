const domainsController = require('./domains.controller');
const controller = new domainsController();
const express = require('express');

const router = express.Router();

router.post('/listen', controller.listenToDomain);
router.get('/:id', controller.getDomain);
router.put('/:id', controller.updateDomain);
router.post('/', controller.addDomain);
router.get('/', controller.getDomains);
router.delete('/:id', controller.deleteDomain);


module.exports = router;