const mongoose = require('mongoose');

const dbConnection = () => mongoose.connect(process.env.CONNECTIONSTRING)
    .then((result) => { console.log("db connected"); })
    .catch((error) => { console.log(error); });

module.exports = dbConnection