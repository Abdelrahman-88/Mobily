const { StatusCodes } = require("http-status-codes");
const User = require("../model/user.model");

const userExpireDocment = async(req, res) => {
    try {
        let { from, to } = req.body
        from = new Date(from).toISOString()
        to = new Date(to).toISOString()
        const data = await User.updateMany({ documentExpiryDate: { $gte: from, $lte: to }, documentValidity: true }, { documentValidity: false })
        if (data.matchedCount) {
            res.status(StatusCodes.OK).json({ message: "Changed to invalid successfully" });
        } else {
            res.status(StatusCodes.OK).json({ message: "No expire document found" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get user expire document" });
    }
}


module.exports = { userExpireDocment }