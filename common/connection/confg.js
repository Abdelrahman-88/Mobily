const mongoose = require('mongoose');

const dbConnection = () => mongoose.connect(process.env.CONNECTIONSTRING)
    .then((result) => {
        console.log("db connected");
    })
    .catch((error) => { console.log(error); });

const conn = mongoose.createConnection(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})



module.exports = { dbConnection, conn }