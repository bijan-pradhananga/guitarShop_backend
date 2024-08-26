const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

class UploadCloudMiddleware {
  
  upload(destination) {
    // Set up Cloudinary storage
    this.storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: destination, // The folder in Cloudinary where images will be stored
        format: async (req, file) => {
          const formats = file.mimetype.split('/');
          return formats[1]; // Keep the original file format (e.g., jpg, png)
        },
        public_id: (req, file) => {
          let fileName = file.originalname.trim().replace(/\.[^/.]+$/, ""); // Remove file extension
          return Date.now() + '-' + Math.round(Math.random() * 1E9) + "-" + fileName;
        }
      },
    });

    // Return multer middleware using the Cloudinary storage
    return multer({ storage: this.storage });
  }
}

module.exports = UploadCloudMiddleware;
