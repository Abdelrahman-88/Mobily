const {
    ADMIN,
    USER,
    OPERATOR,
    CALLC
} = require("../../enum/roles")
const adminPolicy = require("./adminPolicy")
const operatorPolicy = require("./operatorPolicy")
const userPolicy = require("./userPolicy")
const callC = require("./callCenterPolicy")



const option = {
    [USER]: { can: userPolicy },
    [ADMIN]: { can: adminPolicy },
    [OPERATOR]: { can: operatorPolicy },
    [CALLC]: { can: callC }
}

module.exports = option