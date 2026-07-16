const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads/products');

const slugify = (originalName) =>
  path
    .parse(originalName || 'product')
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'product';

// Resizes/compresses the uploaded image and writes it to disk, returning the
// public path the frontend can fetch it from (served via express.static).
// Photos are expected to already be edited/cropped the way the admin wants -
// this only optimizes them for the web, it doesn't alter their content.
const saveProductImage = async (fileBuffer, originalName) => {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const filename = `${Date.now()}-${slugify(originalName)}.webp`;

  await sharp(fileBuffer)
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(UPLOAD_DIR, filename));

  return `/uploads/products/${filename}`;
};

// Removes a previously uploaded photo that's no longer referenced by any
// product (e.g. replaced or removed during an edit). Silently ignores paths
// that aren't ours to delete (legacy filenames bundled with the frontend).
const deleteProductImage = (imagePath) => {
  if (!imagePath || !imagePath.startsWith('/uploads/products/')) return;
  const filePath = path.join(__dirname, '../../public', imagePath);
  fs.rm(filePath, { force: true }, () => {});
};

module.exports = { saveProductImage, deleteProductImage };
