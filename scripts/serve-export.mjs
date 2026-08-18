import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT ?? 4173);
const root = join(process.cwd(), 'dist');
const basePath = '/musubijima-uranai';
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === basePath) pathname = `${basePath}/`;
  if (!pathname.startsWith(`${basePath}/`)) {
    res.writeHead(404).end('Not found');
    return;
  }

  const relative = pathname.slice(basePath.length).replace(/^\//, '');
  const safeRelative = normalize(relative).replace(/^(\.\.(\/|\\|$))+/, '');
  const candidates = [
    join(root, safeRelative),
    join(root, `${safeRelative}.html`),
    join(root, safeRelative, 'index.html'),
  ];
  const file = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  if (!file) {
    res.writeHead(404).end('Not found');
    return;
  }

  res.setHeader('Content-Type', contentTypes[extname(file)] ?? 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => {
  console.log(`Static export: http://127.0.0.1:${port}${basePath}/`);
});
