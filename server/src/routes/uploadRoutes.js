import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured = Boolean(
  (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET) ||
  process.env.CLOUDINARY_URL
);

if (isCloudinaryConfigured) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
  console.log('[UploadService] Persistent Cloudinary storage is ACTIVE.');
} else {
  console.log('[UploadService] Cloudinary credentials not detected, using local persistent disk storage.');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `tattoo-${cleanBase}-${uniqueSuffix}${ext || '.png'}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg\+xml/;
  const isMimeOk = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('image/');
  const isExtOk = /\.(jpe?g|png|webp|gif|svg)$/i.test(path.extname(file.originalname));

  if (isMimeOk || isExtOk) {
    cb(null, true);
  } else {
    cb(new Error('Only valid image files (JPEG, PNG, WebP, GIF, SVG) are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter
});

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    // If Cloudinary is configured, upload to Cloudinary
    if (isCloudinaryConfigured) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'twilight-thinks',
          resource_type: 'auto'
        });

        // Clean up temporary local file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(201).json({
          success: true,
          message: 'Image uploaded to persistent cloud storage',
          url: result.secure_url,
          relativeUrl: result.secure_url,
          filename: result.public_id,
          size: req.file.size
        });
      } catch (cloudErr) {
        console.error('[UploadService] Cloudinary upload error:', cloudErr);
        // Fall back to local file if Cloudinary fails
      }
    }

    // Local Disk storage fallback
    const host = req.get('host') || 'localhost:5000';
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const protocol = isHttps ? 'https' : (req.protocol || 'http');
    const relativeUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `${protocol}://${host}${relativeUrl}`;

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      url: fullUrl,
      relativeUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
