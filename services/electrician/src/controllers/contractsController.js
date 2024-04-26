const service = require('../services/contractsService.js');

module.exports.createContract = function createContract(req, res) {
    service.createContract(req, res);
}

