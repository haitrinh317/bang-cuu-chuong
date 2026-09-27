import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');

// Create maskable icon: purple background with SVG centered at 80%
const size = 512;
const iconSize = Math.round(size * 0.7);
const padding = Math.round((size - iconSize) / 2);

const svgIcon = await sharp(path.join(publicDir, 'favicon.svg'))
  .resize(iconSize, iconSize)
  .toBuffer();

await sharp({
  create: {
    width: size,
    height: size,
    channels: 4,
    background: { r: 147, g: 51, b: 234, alpha: 1 } // #9333EA
  }
})
  .composite([{ input: svgIcon, left: padding, top: padding }])
  .png()
  .toFile(path.join(publicDir, 'icon-maskable-512x512.png'));

console.log('✅ Maskable icon generated!');
