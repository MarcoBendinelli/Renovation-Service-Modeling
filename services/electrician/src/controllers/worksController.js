const service = require('../services/worksService.js');

module.exports.workRequest = function workRequest(req, res) {
    service.workRequest(req, res);
}

