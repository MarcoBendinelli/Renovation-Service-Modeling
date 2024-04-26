var myWorks = [
    {
        workId: 0,
        companyName: "HouseRenovationCompany",
        workDescription: "I need this this and that",
        budget: 200,
    },
    {
        workId: 1,
        companyName: "HouseRenovationCompany",
        workDescription: "I want everything golden",
        budget: 319,
    },
    {
        workId: 2,
        companyName: "RivalRenovation",
        workDescription: "Solar energy is the way",
        budget: 1000,
    }
]

var myQuotations = [
    {
        workId: 0,
        customerId: 0,
        workDays: 3,
        price: 150,
        startDate: "12/11/22",
        endDate: "15/11/22",
    },
    {
        workId: 1,
        customerId: 1,
        workDays: 5,
        price: 113,
        startDate: "8/9/22",
        endDate: "13/10/22",
    },
    {
        workId: 2,
        customerId: 0,
        workDays: 17,
        price: 250,
        startDate: "30/4/22",
        endDate: "1/5/22",
    }
]

var myContracts = [
    {
        workId: 0,
        text: "this is a contract"
        
    },
    {
        workId: 1,
        text: "give me your soul"
        
    },
    {
        workId: 2,
        text: "yoooooooo"
        
    }
]

module.exports.myWorks = myWorks;

module.exports.myQuotations = myQuotations;

module.exports.myContracts = myContracts;

module.exports.workRequest = function workRequest(req, res) {
       
    var currentId = myWorks.length;

    var work = {
        "workId" : currentId,
        "companyName" : req.body.companyName,
        "budget" : req.body.budget,
        "workDescription" : req.body.workDescription,
    };

    if(work.companyName == "" || work.budget == 0 || work.workDescription == ""){

        res.status(400).send({
            message: 'Request was rejected'
        });

    }else{

        myWorks.push(work);

        var quote = {
            "workId" : currentId,
            "customerId" : 0,
            "workDays" : currentId * 2,
            "price" : (currentId + 1)*10,
            "startDate" : req.body.startDate,
            "endDate" : req.body.endDate,
        };

        myQuotations.push(quote);
        res.status(201).send(quote);
    }
}