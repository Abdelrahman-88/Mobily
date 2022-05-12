const mongoose = require('mongoose');

const dbConnection = () => mongoose.connect(process.env.CONNECTIONSTRING)
    .then((result) => {
        console.log("db connected");
    })
    .catch((error) => { console.log(error); });

let conn
try {
    conn = mongoose.createConnection(process.env.CONNECTIONSTRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log("db connected");
} catch (error) {
    console.log(error);
}



module.exports = { dbConnection, conn }