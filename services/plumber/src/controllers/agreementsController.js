const service = require('../services/agreementsService.js');

module.exports.postAgreement = function postAgreement(req, res) {
    service.postAgreement(req, res);
}

