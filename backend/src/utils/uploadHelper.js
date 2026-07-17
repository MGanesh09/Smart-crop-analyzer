const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Multer in-memory storage config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Configure Cloudinary if keys are provided
const hasCloudinary = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Upload processor
const uploadToCloudinary = async (file) => {
  if (!file) return '';

  if (hasCloudinary) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'smart_crop' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Cloudinary upload failed, falling back to base64:', error);
    }
  }

  // Fallback: Convert to Base64 data URL
  const base64Image = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64Image}`;
};

module.exports = { upload, uploadToCloudinary };
