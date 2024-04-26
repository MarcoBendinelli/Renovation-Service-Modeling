let myContracts = require("./worksService").myContracts;
let myWorks = require("./worksService").myWorks;

module.exports.createContract = function createContract(req, res) {
    if (req.body.workId < myWorks.length && req.body.workId >= myContracts.length) {
        if (req.body.text != "") {
            if (req.body.text.length < 10) {
                res.status(200).send(
                    "Hope we can work next time"
                );
            } else {
                myContracts.push(req.body);
                res.status(200).send(
                    "Work will start in the selected days"
                );
            }
        } else {
            res.status(400).send({
                message: 'Request was rejected'
            });
        }
    } else {

        res.status(404).send({
            message: 'Page Not Found'
        });
    }
}

