// Rebuild raster assets from the font-independent SVG master: node scripts/generate-brand.mjs
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
const output = new URL('../public/', import.meta.url);
for (const [name, size] of [['favicon.png',96],['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]]) {
  await sharp(svg).resize(size,size).png().toFile(new URL(name,output).pathname);
}
const sizes = [16,32,48,96];
const frames = await Promise.all(sizes.map(size => sharp(svg).resize(size,size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1,2); header.writeUInt16LE(sizes.length,4);
let offset = header.length;
frames.forEach((frame,i) => {
  const entry = 6+i*16;
  header[entry] = sizes[i]; header[entry+1] = sizes[i];
  header.writeUInt16LE(1,entry+4); header.writeUInt16LE(32,entry+6);
  header.writeUInt32LE(frame.length,entry+8); header.writeUInt32LE(offset,entry+12);
  offset += frame.length;
});
await writeFile(new URL('favicon.ico',output),Buffer.concat([header,...frames]));
const mark = svg.toString().replace('<svg ', '<svg x="88" y="120" ' ).replace('width="96" height="96"','width="120" height="120"');
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f5faff"/>
<rect x="0" y="0" width="12" height="630" fill="#075985"/>
${mark}
<text x="88" y="358" font-family="DejaVu Sans,sans-serif" font-size="78" font-weight="700" letter-spacing="-3" fill="#172b4d">Steven Log<tspan fill="#0369a1">.</tspan></text>
<text x="92" y="420" font-family="DejaVu Sans,sans-serif" font-size="26" fill="#586b80">Thoughts on AI. Notes on building software.</text>
<path d="M92 486H1108" stroke="#dce9f3" stroke-width="2"/>
<text x="92" y="535" font-family="DejaVu Sans,sans-serif" font-size="20" fill="#586b80">steven-log.home201.com</text></svg>`;
await sharp(Buffer.from(card)).png().toFile(new URL('social-default.png',output).pathname);
