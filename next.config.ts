import type { NextConfig } from "next";
import { site } from "./lib/site.ts";
const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
  trailingSlash: true,
  basePath: site.basePath,
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
};
export default nextConfig;
