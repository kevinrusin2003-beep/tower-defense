/* Erzeugt die App-Icons aus der Turm-Grafik des Spiels selbst,
   damit Icon und Spielfeld immer denselben Stil haben.

   Aufruf:  node tools/make-icons.mjs
   Nötig:   npm i -D playwright   (oder global installiertes playwright)
*/
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'icons');

// size: Kantenlänge, pad: Anteil des Turms an der Kantenlänge (maskable braucht mehr Rand)
const TARGETS = [
  { file: 'icon-192.png', size: 192, pad: 0.62, round: true },
  { file: 'icon-512.png', size: 512, pad: 0.62, round: true },
  { file: 'icon-maskable-512.png', size: 512, pad: 0.44, round: false },
  { file: 'apple-touch-icon.png', size: 180, pad: 0.62, round: false },
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + join(root, 'index.html'));

await mkdir(outDir, { recursive: true });

for (const t of TARGETS){
  const dataUrl = await page.evaluate(({ size, pad, round }) => {
    const cv = document.createElement('canvas');
    cv.width = size; cv.height = size;
    const c = cv.getContext('2d');
    const TAU = Math.PI * 2;

    // Hintergrund im Farbton der Spieloberfläche
    if (round){
      c.beginPath();
      c.roundRect(0, 0, size, size, size * 0.22);
      c.clip();
    }
    const bg = c.createLinearGradient(0, 0, size, size);
    bg.addColorStop(0, '#1d2d52');
    bg.addColorStop(1, '#0b1220');
    c.fillStyle = bg;
    c.fillRect(0, 0, size, size);

    // Wiese als Scheibe – erinnert an das Spielfeld
    const grass = c.createRadialGradient(size * 0.5, size * 0.46, 0, size * 0.5, size * 0.5, size * 0.42);
    grass.addColorStop(0, '#6cb350');
    grass.addColorStop(1, '#4c8a3c');
    c.fillStyle = grass;
    c.beginPath();
    c.arc(size / 2, size / 2, size * (round ? 0.40 : 0.33), 0, TAU);
    c.fill();

    // Sandweg quer darunter
    c.save();
    c.beginPath();
    c.arc(size / 2, size / 2, size * (round ? 0.40 : 0.33), 0, TAU);
    c.clip();
    c.strokeStyle = '#d9a45b';
    c.lineWidth = size * 0.11;
    c.beginPath();
    c.moveTo(0, size * 0.74);
    c.lineTo(size, size * 0.74);
    c.stroke();
    c.restore();

    // Turm aus dem Spiel (Sockel + Kanone), Blickrichtung nach oben
    c.translate(size / 2, size / 2 - size * 0.03);
    const s = (size * pad) / 46;
    c.scale(s, s);
    paintTowerBody(c, 'cannon', { angle: -Math.PI / 2, flash: 0, time: 0.8, spin: 0.8, sx: 0, sy: 0 });

    return cv.toDataURL('image/png');
  }, t);

  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  await writeFile(join(outDir, t.file), png);
  console.log('geschrieben:', t.file, `(${t.size}×${t.size})`);
}

await browser.close();
