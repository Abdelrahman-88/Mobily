const { ADMIN, USER } = require("../../enum/roles")
const adminPolicy = require("./adminPolicy")
const userPolicy = require("./userPolicy")



const option = {
    [USER]: { can: userPolicy },
    [ADMIN]: { can: adminPolicy }
}

module.exports = option