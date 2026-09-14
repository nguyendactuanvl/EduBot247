import fs from 'fs';
const blueDotBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgG2Sn28pQAAAABJRU5ErkJggg==";
const buffer = Buffer.from(blueDotBase64, 'base64');
fs.writeFileSync('public/favicon.ico', buffer);
