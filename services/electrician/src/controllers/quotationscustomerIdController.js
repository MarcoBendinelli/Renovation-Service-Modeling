const service = require('../services/quotationscustomerIdService.js');

module.exports.funcquotationscustomerId = function funcquotationscustomerId(req, res) {
    service.funcquotationscustomerId(req, res);
}

module.exports.getQuotations = function getQuotations(req, res) {
    service.getQuotations(req, res);
}

