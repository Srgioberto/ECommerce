// Runs in its own process (spawned by saveProductImage.js). Background
// removal (onnxruntime) crashes natively when loaded in the same process as
// sharp/libvips, so it's kept fully isolated here - if this script crashes
// or times out, the caller just falls back to the original photo.
const fs = require('fs');

const [, , inputPath, outputPath, mimeType] = process.argv;

(async () => {
  if (!inputPath || !outputPath) {
    throw new Error('Usage: node bgRemovalWorker.js <input> <output> <mimeType>');
  }
  const { removeBackground } = require('@imgly/background-removal-node');
  const inputBuffer = fs.readFileSync(inputPath);
  const blobInput = new Blob([inputBuffer], { type: mimeType || 'image/jpeg' });
  const resultBlob = await removeBackground(blobInput);
  const outputBuffer = Buffer.from(await resultBlob.arrayBuffer());
  fs.writeFileSync(outputPath, outputBuffer);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
