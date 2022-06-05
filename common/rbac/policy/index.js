const {
    ADMIN,
    USER,
    OPERATOR,
    CALLC,
    SUPERADMIN
} = require("../../enum/roles")
const adminPolicy = require("./adminPolicy")
const operatorPolicy = require("./operatorPolicy")
const userPolicy = require("./userPolicy")
const callC = require("./callCenterPolicy")
const superAdminPolicy = require("./superAdminPolicy")



const option = {
    [USER]: { can: userPolicy },
    [ADMIN]: { can: adminPolicy },
    [OPERATOR]: { can: operatorPolicy },
    [CALLC]: { can: callC },
    [SUPERADMIN]: { can: superAdminPolicy }
}

module.exports = option