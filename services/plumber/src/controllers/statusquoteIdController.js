const service = require('../services/statusquoteIdService.js');

module.exports.showStatusWorkById = function showStatusWorkById(req, res) {
    service.showStatusWorkById(req, res);
}

