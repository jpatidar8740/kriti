const cloudinary = require('cloudinary').v2;
cloudinary.config({
cloud_name: 'lohit8740',
api_key: '229462115697223',
api_secret: 'hrwgUaleqEIXGah7_bpevKSO7E0'
});

module.exports = cloudinary;