const {
    ADMIN,
    USER,
    OPERATOR
} = require("../../enum/roles")
const adminPolicy = require("./adminPolicy")
const operatorPolicy = require("./operatorPolicy")
const userPolicy = require("./userPolicy")



const option = {
    [USER]: { can: userPolicy },
    [ADMIN]: { can: adminPolicy },
    [OPERATOR]: { can: operatorPolicy }
}

module.exports = option