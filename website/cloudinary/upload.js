var cloudinary = require('cloudinary').v2;

function upload(file, type,  cb) {
    var options = {
        resource_type: type,
    }
    cloudinary.uploader.upload(file, options, (err, result) => {
        if (err) {
            console.log(err)
            cb(err, null);
        }
        else {
            cb(null, result);
        }
    })
}

module.exports = {
    upload
}