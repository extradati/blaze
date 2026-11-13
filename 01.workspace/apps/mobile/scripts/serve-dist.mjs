// Serves the production web build (dist/) like the real server: static files, index.html for unknown paths.
// Usage: node scripts/serve-dist.mjs [port]
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = join(import.meta.dirname, "..", "dist");
const port = Number(process.argv[2] ?? 8082);
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".ico": "image/x-icon", ".ttf": "font/ttf", ".css": "text/css" };

createServer((req, res) => {
  let file = join(root, normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!file.startsWith(root) || !isFile(file)) file = join(root, "index.html");
  res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`http://localhost:${port}`));

function isFile(p) {
  try { return statSync(p).isFile(); } catch { return false; }
}
