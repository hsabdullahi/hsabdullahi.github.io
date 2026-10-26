import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
const origin = process.env.PREVIEW_ORIGIN || "http://127.0.0.1:3000";
const directory = path.resolve("review-evidence/performance");
fs.mkdirSync(directory, { recursive: true });
const pages = [
  { name: "home", route: "/" },
  { name: "course", route: "/teaching/mec3203/2024-2025/" },
  { name: "publications", route: "/research/publications/" },
];
const results = [];
for (const page of pages) {
  const runs = [];
  for (let run = 1; run <= 3; run++) {
    const output = path.join(directory, `${page.name}-${run}.json`);
    console.log(`Lighthouse mobile: ${page.name}, run ${run}/3`);
    const args = [
      "node_modules/lighthouse/cli/index.js",
      origin + page.route,
      "--quiet",
      "--output=json",
      `--output-path=${output}`,
      "--chrome-flags=--headless=new --disable-extensions --no-first-run",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--throttling-method=simulate",
      "--form-factor=mobile",
      "--screenEmulation.mobile=true",
      "--screenEmulation.width=390",
      "--screenEmulation.height=844",
      "--screenEmulation.deviceScaleFactor=1",
      "--no-enable-error-reporting",
    ];
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, args, { stdio: "inherit" });
      child.on("error", reject);
      child.on("exit", (code) =>
        code === 0 ? resolve() : reject(Error(`Lighthouse exited ${code}`)),
      );
    });
    const report = JSON.parse(fs.readFileSync(output, "utf8"));
    if (report.runtimeError) throw Error(report.runtimeError.message);
    const resourceSummary = report.audits["resource-summary"].details.items;
    runs.push({
      version: report.lighthouseVersion,
      environment: report.environment,
      settings: report.configSettings,
      lcp: report.audits["largest-contentful-paint"].numericValue,
      cls: report.audits["cumulative-layout-shift"].numericValue,
      performance: report.categories.performance.score,
      accessibility: report.categories.accessibility.score,
      seo: report.categories.seo.score,
      images:
        resourceSummary.find((item) => item.resourceType === "image")
          ?.transferSize || 0,
      total:
        resourceSummary.find((item) => item.resourceType === "total")
          ?.transferSize || 0,
    });
  }
  const median = (key) => runs.map((run) => run[key]).sort((a, b) => a - b)[1];
  results.push({
    page: page.route,
    runs,
    median: Object.fromEntries(
      [
        "lcp",
        "cls",
        "performance",
        "accessibility",
        "seo",
        "images",
        "total",
      ].map((key) => [key, median(key)]),
    ),
  });
  console.log(
    `${page.name}: median LCP ${(median("lcp") / 1000).toFixed(2)}s, CLS ${median("cls")}, performance ${Math.round(median("performance") * 100)}`,
  );
}
fs.writeFileSync(
  path.join(directory, "summary.json"),
  JSON.stringify(results, null, 2) + "\n",
);
console.log("Performance reports saved under review-evidence/performance/.");
