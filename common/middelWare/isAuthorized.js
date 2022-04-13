var jwt = require('jsonwebtoken');
const { StatusCodes } = require("http-status-codes");
const rbac = require('../rbac/rbac');
const User = require('../../src/users/model/user.model');

module.exports = (endPoint) => {
    console.log('err');
    return async(req, res, next) => {
        try {
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(" ")[1]
                if (token) {
                    const decoded = jwt.verify(token, process.env.SECRET_KEY)
                    console.log(decoded);
                    const user = await User.findOne({ _id: decoded._id })
                    if (user) {
                        const isAllowed = await rbac.can(user.role, endPoint)
                        if (isAllowed) {
                            req.user = user
                            next()
                        } else {
                            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED1" })
                        }
                    } else {
                        res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED2" })
                    }
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED3" })
                }

            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED4" })
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "UNAUTHORIZED5" })
        }
    }
}