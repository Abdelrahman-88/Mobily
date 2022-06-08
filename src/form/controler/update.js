const Form = require("../model/form.model");
const { StatusCodes } = require("http-status-codes");

const updateForm = async(req, res) => {
    try {
        if (req.fileValidationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: req.fileValidationError });
        } else {
            const { updatedBy, formId } = req.params
            const find = await Form.findOne({ _id: formId })
            if (req.user._id == updatedBy) {
                if (find) {
                    if (req.file) {
                        let form = {
                            name: req.file.filename,
                            url: process.env.URL + 'displayForms/' + req.file.filename
                        }
                        const update = await Form.findOneAndUpdate({ _id: formId }, { updatedBy, form })
                        res.status(StatusCodes.CREATED).json({ message: "Form updated successfully" });
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Form is required" });
                    }
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid form" });
                }
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to update form" });
    }
}



module.exports = { updateForm }