const multer = require("multer");
const path = require('path');
const fs = require('fs');
const logger = require("../../../libs/logger");

import config from '../../../config'

const maxSize = config.file.maxUploadFileSize * 1024 * 1024; // File size limited to 3Mbno

const storage = multer.diskStorage({ // need to set upload direct to folder of 1 dossier
    destination: function (req, file, cb) {
        const dir = req.uploadPath;
        fs.access(dir, (err) => {
            if (err) {
                return fs.mkdir(dir, {
                    recursive: true
                }, error => cb(error, dir))
            }
            return cb(null, dir)
        })
    },
    filename: function (req, file, cb) {
        cb(null, req.filenameToSave + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('doc');

function checkFileType(file, cb) {
    return cb(null, true);
    // Allowed ext
    // const filetypes = /jpeg|jpg|png|gif/;
    // // Check ext
    // const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // // Check mime
    // const mimetype = filetypes.test(file.mimetype);
    //
    // if (mimetype && extname) {
    //     return cb(null, true);
    // } else {
    //     cb('Error: Images Only!');
    // }
}

export const beforeUploadFile = function (req, res, next) {
    logger.info("Middleware : beforeUploadFile");

    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({status: false, message: 'File missing!'});
        } else {
            // console.log("req ==>> ", req.file)
            // if (req.file == undefined) {
            //     return res.status(400).send({
            //         status: false,
            //         message: 'Failed to upload file'
            //     });
            // } else {
            return next();
            // }
        }
    });

};
