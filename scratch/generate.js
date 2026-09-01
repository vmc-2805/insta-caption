import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const pubDir = path.resolve('public');
const logoPath = path.join(pubDir, 'Logo.png');
const faviconPath = path.join(pubDir, 'icon.png');

async function run() {
  if (fs.existsSync(faviconPath)) {
    // Generate different favicon sizes
    await sharp(faviconPath).resize(16, 16).toFile(path.join(pubDir, 'favicon-16x16.png'));
    await sharp(faviconPath).resize(32, 32).toFile(path.join(pubDir, 'favicon-32x32.png'));
    await sharp(faviconPath).resize(180, 180).toFile(path.join(pubDir, 'apple-touch-icon.png'));
    await sharp(faviconPath).resize(192, 192).toFile(path.join(pubDir, 'android-chrome-192x192.png'));
    await sharp(faviconPath).resize(512, 512).toFile(path.join(pubDir, 'android-chrome-512x512.png'));
    console.log('Favicons generated');
  } else {
    console.log('favicon.png not found');
  }

  if (fs.existsSync(logoPath)) {
    // Generate OG image from Logo
    // Let's composite the logo onto a 1200x630 canvas
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([{ input: await sharp(logoPath).resize({ width: 800, height: 500, fit: 'inside' }).toBuffer() }])
    .png()
    .toFile(path.join(pubDir, 'og-image.png'));
    console.log('OG image generated');
  } else {
    console.log('Logo.png not found');
  }
}

run().catch(console.error);
