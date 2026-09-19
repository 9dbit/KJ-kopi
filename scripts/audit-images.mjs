import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('public');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const HERO_MIN = 100 * 1024;
const GENERAL_WARN = 60 * 1024;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const images = walk(ROOT).filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()));
let failures = 0;
let warnings = 0;

console.log('\nKang Jago image quality audit');
console.log('Hero policy: minimum 100 KB; preferred 300–400 KB.\n');

if (!images.length) {
  console.log('No static images found in public/.');
}

for (const file of images) {
  const bytes = fs.statSync(file).size;
  const kb = bytes / 1024;
  const relative = path.relative(process.cwd(), file);
  const isHero = relative.includes(`${path.sep}hero${path.sep}`);
  let status = 'OK';

  if (isHero && bytes < HERO_MIN) {
    status = 'FAIL';
    failures += 1;
  } else if (!isHero && bytes < GENERAL_WARN) {
    status = 'WARN';
    warnings += 1;
  }

  console.log(`${status.padEnd(4)} ${kb.toFixed(1).padStart(7)} KB  ${relative}`);
}

console.log(`\nResult: ${failures} failure(s), ${warnings} warning(s).`);
if (failures) {
  console.error('Hero assets below 100 KB must be replaced before production approval.');
  process.exitCode = 1;
}
