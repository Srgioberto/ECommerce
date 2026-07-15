const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads/products');

// Resizes/compresses the uploaded image and writes it to disk, returning the
// public path the frontend can fetch it from (served via express.static).
const saveProductImage = async (fileBuffer, originalName) => {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const slug =
    path
      .parse(originalName || 'product')
      .name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || 'product';
  const filename = `${Date.now()}-${slug}.webp`;

  await sharp(fileBuffer)
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(UPLOAD_DIR, filename));

  return `/uploads/products/${filename}`;
};

module.exports = { saveProductImage };
