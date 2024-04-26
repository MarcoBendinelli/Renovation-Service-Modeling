let myQuotations = require("./worksService").myQuotations;

module.exports.funcquotationscustomerId = function funcquotationscustomerId(req, res) {
    res.send({
        message: 'This is the mockup controller for funcquotationscustomerId'
    });
}

module.exports.getQuotations = function getQuotations(req, res) {
    let result = myQuotations.filter(o => o.customerId == JSON.parse(req.params.customerId));

    if (result.length != 0) {
        res.status(200).send(result);
    } else {
        res.status(404).send(
            'Wrong id'
        );
    }
}

