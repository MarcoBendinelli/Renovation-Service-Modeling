let quotes = require("./commissionsService").quotes;
module.exports.showStatusWorkById = function showStatusWorkById(req, res) {
    let result = quotes.find(o => o.quoteId == JSON.parse(req.params.quoteId));
    if (result != null){
        if (result.status==="Working"){
            result.status= "Completed";
            res.send("Working");
        } else {
            res.send(result.status);
        }
    } else {
        res.send({
            code: 404,
            message: 'Wrong id'
        });
    }
}


