let quotes = require("./commissionsService").quotes;
module.exports.postAgreement = function postAgreement(req, res) {
    let result = quotes.find(o => o.quoteId == req.body.quoteId);
    if (result != null) {
        if (result.status === "Not confirmed") {
            let message = req.body.message;
            if (message === "Selected") {
                result.status = message;
                res.status(201).send("Works will start for the selected dates")
            } else if (message === "Rejected") {
                result.status = message;
                res.status(201).send("Received");
            } else {
                res.send({
                    code: 400,
                    message: "Wrong message"
                })
            }
        } else {
            res.send({
                code: 400,
                message: "Already received an update message for this quote"
            })
        }
    } else {
        res.send({
            code: 404,
            message: 'Any quote found'
        });
    }
}

