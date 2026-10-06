/* global Buffer */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const LOGO_SVG = path.join(ROOT, 'assets/onboarding/logo.svg');
const BG_COLOR = { r: 0, g: 103, b: 92, alpha: 1 }; // #00675C

// Android mipmap sizes
const ANDROID_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

// iOS icon sizes (pixels)
const IOS_SIZES = [
  { name: 'icon-20@2x.png', size: 40 },
  { name: 'icon-20@3x.png', size: 60 },
  { name: 'icon-29@2x.png', size: 58 },
  { name: 'icon-29@3x.png', size: 87 },
  { name: 'icon-40@2x.png', size: 80 },
  { name: 'icon-40@3x.png', size: 120 },
  { name: 'icon-60@2x.png', size: 120 },
  { name: 'icon-60@3x.png', size: 180 },
  { name: 'icon-1024.png', size: 1024 },
];

async function getWhiteLogoBuffer(targetWidth) {
  // Read SVG and force all fills to white
  let svgContent = fs.readFileSync(LOGO_SVG, 'utf-8');

  // Add fill="white" to the root svg element to make everything white
  svgContent = svgContent.replace(
    'fill="none"',
    'fill="white"'
  );

  const density = Math.max(300, Math.round((targetWidth / 94) * 72 * 2));

  const logoBuffer = await sharp(Buffer.from(svgContent), { density })
    .resize(targetWidth, null, { fit: 'inside' })
    .png()
    .toBuffer();

  return logoBuffer;
}

async function generateIcon(size, outputPath, round = false) {
  const logoSize = Math.round(size * 0.55);
  const logoBuffer = await getWhiteLogoBuffer(logoSize);
  const logoMeta = await sharp(logoBuffer).metadata();

  // Create green background
  let icon = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG_COLOR,
    },
  });

  // Composite white logo centered
  const left = Math.round((size - logoMeta.width) / 2);
  const top = Math.round((size - logoMeta.height) / 2);

  icon = icon.composite([{ input: logoBuffer, left, top }]);

  if (round) {
    // Create circular mask
    const circle = Buffer.from(
      `<svg width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
      </svg>`
    );
    icon = icon.composite([{ input: circle, blend: 'dest-in' }]);
  }

  await icon.png().toFile(outputPath);
  console.log(`  Created: ${path.relative(ROOT, outputPath)} (${size}x${size})`);
}

async function main() {
  console.log('Generating app icons with white logo on #00675C background...\n');

  // Android icons
  console.log('Android:');
  for (const [folder, size] of Object.entries(ANDROID_SIZES)) {
    const dir = path.join(ROOT, 'android/app/src/main/res', folder);
    fs.mkdirSync(dir, { recursive: true });
    await generateIcon(size, path.join(dir, 'ic_launcher.png'));
    await generateIcon(size, path.join(dir, 'ic_launcher_round.png'), true);
  }

  // iOS icons
  console.log('\niOS:');
  const iosDir = path.join(ROOT, 'ios/VisitBulgaria/Images.xcassets/AppIcon.appiconset');
  fs.mkdirSync(iosDir, { recursive: true });

  for (const { name, size } of IOS_SIZES) {
    await generateIcon(size, path.join(iosDir, name));
  }

  // Write iOS Contents.json
  const iosContents = {
    images: [
      { idiom: 'iphone', scale: '2x', size: '20x20', filename: 'icon-20@2x.png' },
      { idiom: 'iphone', scale: '3x', size: '20x20', filename: 'icon-20@3x.png' },
      { idiom: 'iphone', scale: '2x', size: '29x29', filename: 'icon-29@2x.png' },
      { idiom: 'iphone', scale: '3x', size: '29x29', filename: 'icon-29@3x.png' },
      { idiom: 'iphone', scale: '2x', size: '40x40', filename: 'icon-40@2x.png' },
      { idiom: 'iphone', scale: '3x', size: '40x40', filename: 'icon-40@3x.png' },
      { idiom: 'iphone', scale: '2x', size: '60x60', filename: 'icon-60@2x.png' },
      { idiom: 'iphone', scale: '3x', size: '60x60', filename: 'icon-60@3x.png' },
      { idiom: 'ios-marketing', scale: '1x', size: '1024x1024', filename: 'icon-1024.png' },
    ],
    info: { version: 1, author: 'xcode' },
  };

  fs.writeFileSync(
    path.join(iosDir, 'Contents.json'),
    JSON.stringify(iosContents, null, 2)
  );
  console.log(`  Created: Contents.json`);

  console.log('\nDone!');
}

main().catch(console.error);
