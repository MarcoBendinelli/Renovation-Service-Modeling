const myQuoteIds = require("./areajobsService").myQuoteIds;

module.exports.funcconfirmations = function funcconfirmations(req, res) {
    const requestedQuoteId = req.body.quoteId;
    const matchedQuoteId = myQuoteIds.find(quoteId => quoteId == requestedQuoteId);   

    if (matchedQuoteId != null) {

        const message = req.body.message;

        if (message === "Confirmed") {
            res.status(201).send("Works will start in the requested dates")

        } else if (message === "Rejected") {
            res.status(201).send("Copy, the work will not be carried out");

        } else {
            res.send({
                code: 400,
                message: "Wrong message structure"
            })
        }

    } else {
        res.send({
            code: 404,
            message: 'No quotes found'
        });
    }
}

