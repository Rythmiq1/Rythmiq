const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/'); // Specify the destination folder
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname); // Use timestamp for unique file name
    }
});

// Allow all file types
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Set a file size limit (10MB for example)
}).any(); // Use .any() to accept any file type

module.exports = upload;
