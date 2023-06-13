const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// get credentials from cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "app",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 512, height: 512, crop: "limit" }],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
