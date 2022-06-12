const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require("crypto");
const path = require("path");


const storage = new GridFsStorage({
    url: process.env.CONNECTIONSTRING,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});

function fileFilter(req, file, cb) {

    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        req.fileValidationError = "Forbidden extension only png/jpg/jpeg available";
        return cb(null, false, req.fileValidationError);
    }
}

const uploadPic = multer({
    fileFilter,
    storage,
    limits: { fileSize: 1000 * 1000 }
})


module.exports = uploadPic