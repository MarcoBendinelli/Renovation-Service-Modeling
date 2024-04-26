// Initializing a first set of quotes
let quotes = [
    {
        quoteId: 0,
        status: "Not confirmed",
    }, 
    {
        quoteId: 1,
        status: "Rejected",
    },
    {
        quoteId: 2, 
        status: "Working",
    },
    {
        quoteId: 3,
        status: "Completed"
    }
];

module.exports.quotes = quotes;

module.exports.postCommission = function postCommission(req, res) {
    let quoteId = quotes.length;
    let newQuote = {
        "quoteId": quoteId,
        "status": "Not confirmed",
    }
    quotes.push(newQuote);
    quotes.forEach(element => console.log(element));
    let quotationResponse = {
        "quoteId" : quoteId,
        "price" : quoteId * 10,
        "workdays" : quoteId,
        "startDate" : req.body.startDate,
        "endDate" : req.body.endDate,
    }
    res.status(201).send(quotationResponse);
}

