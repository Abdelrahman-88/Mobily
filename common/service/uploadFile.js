const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require("crypto");
const path = require("path");


// const storage = multer.diskStorage({

//     destination: function(req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function(req, file, cb) {
//         cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
//     }
// })

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

// const storage = new GridFsStorage({
//     url: `mongodb://localhost:27017/mobily`,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: function(req, file, cb) {
//         const filename = `${Date.now()}${file.originalname}`;
//         return filename;
//     }
// });

function fileFilter(req, file, cb) {

    if (file.mimetype === "application/pdf") {
        cb(null, true)
    } else {
        cb('invalid file', false)
    }
}

const upload = multer({
    fileFilter,
    storage,
    limits: { fileSize: 1000 * 1000 }
})


module.exports = upload