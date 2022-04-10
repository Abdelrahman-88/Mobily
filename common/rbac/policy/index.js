const { ADMIN, USER } = require("../../enum/roles")
const userPolicy = require("./userPolicy")



const option = {
    [USER]: { can: userPolicy }
}

module.exports = option