const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'assets', 'logo.svg');
const OUT = path.join(__dirname, '..', 'assets');

async function main() {
  // Standard "any" purpose icons - full bleed, matches favicon look.
  await sharp(SRC).resize(192, 192).png().toFile(path.join(OUT, 'icon-192.png'));
  await sharp(SRC).resize(512, 512).png().toFile(path.join(OUT, 'icon-512.png'));

  // Maskable icon: Android applies its own shape mask (circle/squircle/etc),
  // so artwork must sit within a safe zone (~80% of canvas, centered) or it
  // gets clipped. Render the logo smaller onto a solid crimson square.
  const maskableSize = 512;
  const logoSize = Math.round(maskableSize * 0.7);
  const logoBuffer = await sharp(SRC).resize(logoSize, logoSize).png().toBuffer();

  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: { r: 0x5C, g: 0x00, b: 0x00, alpha: 1 }
    }
  })
    .composite([{ input: logoBuffer, gravity: 'center' }])
    .png()
    .toFile(path.join(OUT, 'icon-512-maskable.png'));

  console.log('Icons generated in assets/: icon-192.png, icon-512.png, icon-512-maskable.png');
}

main().catch(err => { console.error(err); process.exit(1); });
