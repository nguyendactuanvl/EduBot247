import fs from 'fs';

const blueDotBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgG2Sn28pQAAAABJRU5ErkJggg==";

function writeIcon(filename) {
    const buffer = Buffer.from(blueDotBase64, 'base64');
    fs.writeFileSync(filename, buffer);
    console.log(`Created ${filename}`);
}

if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

writeIcon('public/pwa-192x192.png');
writeIcon('public/pwa-512x512.png');
writeIcon('public/pwa-maskable-512x512.png');
writeIcon('public/apple-touch-icon.png');
