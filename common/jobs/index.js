const dailyReport = require("./expireDocuments")

const runJob = () => {
    dailyReport()
}

module.exports = runJob