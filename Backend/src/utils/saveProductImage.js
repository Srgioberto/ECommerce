const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const { execFile } = require('child_process');
const sharp = require('sharp');

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads/products');
const BG_REMOVAL_TIMEOUT_MS = 30000;

const slugify = (originalName) =>
  path
    .parse(originalName || 'product')
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'product';

// Removes the background in an isolated child process (see bgRemovalWorker.js
// for why) and returns the RGBA cutout as a buffer, or null if it failed for
// any reason - callers should fall back to the original photo, never fail
// the whole upload over this.
const removeBackgroundSafely = (buffer, mimeType) =>
  new Promise((resolve) => {
    const tmpId = crypto.randomUUID();
    const inputPath = path.join(os.tmpdir(), `stride-bg-in-${tmpId}`);
    const outputPath = path.join(os.tmpdir(), `stride-bg-out-${tmpId}.png`);
    const cleanup = () => {
      fs.rm(inputPath, { force: true }, () => {});
      fs.rm(outputPath, { force: true }, () => {});
    };

    fs.writeFile(inputPath, buffer, (writeErr) => {
      if (writeErr) {
        cleanup();
        return resolve(null);
      }

      execFile(
        process.execPath,
        [path.join(__dirname, 'bgRemovalWorker.js'), inputPath, outputPath, mimeType || 'image/jpeg'],
        { timeout: BG_REMOVAL_TIMEOUT_MS },
        (err) => {
          if (err) {
            console.error('Background removal failed, using original photo:', err.message);
            cleanup();
            return resolve(null);
          }
          fs.readFile(outputPath, (readErr, data) => {
            cleanup();
            resolve(readErr ? null : data);
          });
        }
      );
    });
  });

// Resizes/compresses the uploaded image (attempting to lift it onto a clean
// white background first) and writes it to disk, returning the public path
// the frontend can fetch it from (served via express.static).
const saveProductImage = async (fileBuffer, originalName, mimeType) => {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const cutout = await removeBackgroundSafely(fileBuffer, mimeType);
  let source = fileBuffer;
  if (cutout) {
    const { width, height } = await sharp(cutout).metadata();
    source = await sharp({
      create: { width, height, channels: 4, background: '#ffffff' },
    })
      .composite([{ input: cutout }])
      .png()
      .toBuffer();
  }

  const filename = `${Date.now()}-${slugify(originalName)}.webp`;

  await sharp(source)
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
