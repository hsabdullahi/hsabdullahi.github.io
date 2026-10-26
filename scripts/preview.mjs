import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
if (
  spawnSync(process.execPath, ["scripts/sync-routes.mjs"], { stdio: "inherit" })
    .status
)
  process.exit(1);
const routes = [
  ["", "index-preview"],
  ["speaking", "speaking-preview"],
  ["styles", "style-preview"],
  ["work", "work-preview"],
  ["work/example", "project-preview"],
  ["resources", "resources-preview"],
  ["contact", "contact-preview"],
];
for (const [route, source] of routes) {
  const file = `app/review-preview/${route ? route + "/" : ""}page.tsx`;
  fs.mkdirSync(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  fs.writeFileSync(
    file,
    `export { default } from '@/dev/${source}';\nexport const metadata={title:'Development preview',robots:{index:false,follow:false}};\n`,
  );
}
const file = "app/review-preview/files/[file]/route.ts";
fs.mkdirSync(file.slice(0, file.lastIndexOf("/")), { recursive: true });
fs.writeFileSync(
  file,
  `import { demoPdf } from '@/dev/sample-pdf';\nexport const dynamic='force-static';\nexport const dynamicParams=false;\nexport function generateStaticParams(){return ['sample-notes.pdf','sample-slides.pdf'].map(file=>({file}));}\nexport async function GET(_request:Request,{params}:{params:Promise<{file:string}>}){const {file}=await params;if(!['sample-notes.pdf','sample-slides.pdf'].includes(file))return new Response('Not found',{status:404});return new Response(demoPdf,{headers:{'Content-Type':'application/pdf','Content-Length':String(Buffer.byteLength(demoPdf)),'Cache-Control':'no-store'}});}\n`,
);
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--webpack",
    "--hostname",
    "127.0.0.1",
  ],
  { stdio: "inherit" },
);
function clean() {
  fs.rmSync("app/review-preview", { recursive: true, force: true });
  fs.rmSync(".next/dev/types", { recursive: true, force: true });
}
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    child.kill(signal);
    clean();
  });
child.on("exit", (code) => {
  clean();
  process.exit(code || 0);
});
