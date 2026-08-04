
const fs = require('fs');
const sharp = require('sharp');

const svgBuffer = fs.readFileSync('app/favicon.svg');
sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile('app/apple-icon.png')
  .then(() => {
    fs.copyFileSync('app/apple-icon.png', 'public/apple-touch-icon.png');
    fs.copyFileSync('app/apple-icon.png', 'app/icon.png');
    console.log('Success');
  })
  .catch(err => console.error(err));

