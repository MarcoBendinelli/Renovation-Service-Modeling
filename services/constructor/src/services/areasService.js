const myAreasOfWork = [
    "Abruzzo",
    "Aosta",
    "Apulia",
    "Basilicata",
    "Calabria",
    "Campania",
    "Emilia Romagna",
    "Friuli Venezia Giulia",
    "Lazio",
    "Liguria",
    "Lombardy",
    "Molise",
    "Piedmont",
    "Sardinia",
    "Sicily",
    "The Marches",
    "Trentino Alto Adige",
    "Tuscany",
    "Umbria",
    "Veneto"
];

module.exports.myAreasOfWork = myAreasOfWork;

module.exports.funcareas = function funcareas(req, res) {
    res.status(200).send(
        myAreasOfWork,
    );
}

