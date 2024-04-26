const service = require('../services/commissionsService.js');

module.exports.postCommission = function postCommission(req, res) {
    service.postCommission(req, res);
}

