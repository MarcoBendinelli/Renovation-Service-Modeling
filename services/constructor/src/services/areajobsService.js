const myAreasOfWork = require("./areasService").myAreasOfWork;
const myQuoteIds = []

module.exports.myQuoteIds = myQuoteIds;

module.exports.funcareajobs = function funcareajobs(req, res) {
    const requestedArea = myAreasOfWork.find(area => area == req.params.area);   

    if (requestedArea != null) {

        const newQuoteId = myQuoteIds.length;
        myQuoteIds.push(newQuoteId);

        const quotation = {
            "quoteId": newQuoteId,
            "price": newQuoteId == 0 ? 50 : newQuoteId * 100,
            "workDays": newQuoteId + 30,
        }
        res.status(201).send(quotation);
    } else {
        res.send({
            code: 404,
            message: 'Inserted an unavailable area of work'
        });
    }
}

