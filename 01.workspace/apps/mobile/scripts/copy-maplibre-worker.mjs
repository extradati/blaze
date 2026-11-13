// Metro can't bundle MapLibre's web worker, so serve it from public/.
// Saved as .js (nginx serves .mjs with a non-JS MIME type) and without the sourceMappingURL
// comment (the .map isn't shipped; browsers' dev tools would log a 404 for it).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", "utf8");
mkdirSync("public", { recursive: true });
writeFileSync("public/maplibre-gl-worker.js", src.replace(/\n?\/\/# sourceMappingURL=\S+\s*$/, "\n"));
