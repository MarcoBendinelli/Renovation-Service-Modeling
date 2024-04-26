let myQuotations = require("./worksService").myQuotations;

module.exports.funcquotationscustomerIdworkId = function funcquotationscustomerIdworkId(req, res) {
    res.send({
        message: 'This is the mockup controller for funcquotationscustomerIdworkId'
    });
}

module.exports.getQuotation = function getQuotation(req, res) {
    let result = myQuotations.find(o => (o.customerId == JSON.parse(req.params.customerId) && o.workId == JSON.parse(req.params.workId)));

    if (result != null) {
        res.status(200).send(result);
    }
    else {
        res.status(404).send(
            'Wrong id'
        );
    }
}

