import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPng(size, bgColor, fgColor) {
  // Create raw RGBA image data
  const width = size;
  const height = size;
  const rowBytes = width * 4;
  const rawData = Buffer.alloc((rowBytes + 1) * height);

  const [bgR, bgG, bgB, bgA] = bgColor;
  const [fgR, fgG, fgB, fgA] = fgColor;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      // Draw rounded card background with border radius
      const rx = width * 0.18;
      const insideBox = (x >= rx && x <= width - rx) || (y >= rx && y <= height - rx) ||
        (Math.hypot(x - rx, y - rx) <= rx) ||
        (Math.hypot(x - (width - rx), y - rx) <= rx) ||
        (Math.hypot(x - rx, y - (height - rx)) <= rx) ||
        (Math.hypot(x - (width - rx), y - (height - rx)) <= rx);

      // Draw stylized "A" / diamond in the center
      const cx = width / 2;
      const cy = height / 2;
      const scale = size / 100;
      
      // Target/compass emblem in the center
      const distFromCenter = Math.hypot(x - cx, y - cy);
      const isInnerGlow = distFromCenter < 24 * scale;
      const isRing = distFromCenter >= 28 * scale && distFromCenter <= 34 * scale;
      const isCompassNeedle = Math.abs(x - cx) + Math.abs(y - cy) < 18 * scale;

      let r = bgR, g = bgG, b = bgB, a = bgA;

      if (insideBox) {
        // Gradient effect
        const gradRatio = (y / height);
        r = Math.round(15 + gradRatio * 20);
        g = Math.round(61 + gradRatio * 40);
        b = Math.round(102 + gradRatio * 80);
        a = 255;

        if (isRing || isCompassNeedle || isInnerGlow) {
          r = fgR;
          g = fgG;
          b = fgB;
          a = fgA;
        }
      } else {
        a = 0; // transparent outside rounded card
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // Compression method
  ihdr.writeUInt8(0, 11); // Filter method
  ihdr.writeUInt8(0, 12); // Interlace method

  function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(len + 12);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, len + 8));
    buf.writeUInt32BE(crc, len + 8);
    return buf;
  }

  // CRC32 table
  function crc32(buf) {
    let c = 0xffffffff;
    for (let n = 0; n < buf.length; n++) {
      c = crcTable[(c ^ buf[n]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate Icons
const bg = [15, 61, 102, 255]; // #0F3D66 TONOZ Dark Blue
const fg = [74, 144, 226, 255]; // #4A90E2 TONOZ Electric Blue

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, bg, fg));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, bg, fg));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, [15, 61, 102, 255], [255, 255, 255, 255]));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, bg, fg));

console.log('PNG Icons successfully generated in public/');
