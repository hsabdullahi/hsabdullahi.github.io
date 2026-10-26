import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
const root = path.resolve("out"),
  base = process.env.NEXT_PUBLIC_BASE_PATH || "",
  port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".zip": "application/zip",
};
http
  .createServer((request, response) => {
    let url;
    try {
      url = new URL(request.url, "http://127.0.0.1");
      url.pathname = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400);
      response.end("Invalid request");
      return;
    }
    function missing() {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(
        fs.existsSync(path.join(root, "404.html"))
          ? fs.readFileSync(path.join(root, "404.html"))
          : "Not found",
      );
    }
    if (base && url.pathname !== base && !url.pathname.startsWith(base + "/"))
      return missing();
    const local = url.pathname.slice(base.length) || "/";
    let file = path.resolve(root, "." + local);
    if (!file.startsWith(root + path.sep) && file !== root) return missing();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(308, { Location: url.pathname + "/" + url.search });
        response.end();
        return;
      }
      file = path.join(file, "index.html");
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return missing();
    const type = types[path.extname(file)] || "application/octet-stream";
    const compress =
      /text\/|javascript|json|xml|svg/.test(type) &&
      /\bgzip\b/.test(request.headers["accept-encoding"] || "");
    const bytes = fs.readFileSync(file);
    const body = compress ? gzipSync(bytes) : bytes;
    response.writeHead(200, {
      "Content-Type": type,
      "Content-Length": body.length,
      ...(compress ? { "Content-Encoding": "gzip" } : {}),
      Vary: "Accept-Encoding",
      "Cache-Control": file.includes("/_next/static/")
        ? "public, max-age=31536000, immutable"
        : "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    response.end(body);
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Static preview: http://127.0.0.1:${port}${base}/`),
  );
