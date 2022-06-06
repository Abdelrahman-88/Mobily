const { StatusCodes } = require("http-status-codes");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search");
const Document = require("../model/document.model");


const getSeenDocuments = async(req, res) => {
    try {
        const { createdBy } = req.params
        if (req.user._id == createdBy) {
            let { page, size } = req.query
            const { skip, limit, currentPage } = pageService(page, size)
            const documents = await searchServies("", { createdBy, seen: false }, limit, skip, Document, [], "", "", "")
            if (documents.data.length) {
                res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: documents.totalPages, total: documents.total, data: documents.data });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "No seen documents found" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get seen documents" });
    }
}

const updateSeenDocuments = async(req, res) => {
    try {
        const { createdBy } = req.params
        if (req.user._id == createdBy) {
            const seen = await Document.updateMany({ createdBy, seen: false }, { seen: true })
            if (seen.matchedCount) {
                res.status(StatusCodes.OK).json({ message: "Updated to seen successfully" });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "No unseen documents found" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get unseen documents" });
    }
}




module.exports = {
    getSeenDocuments,
    updateSeenDocuments
}