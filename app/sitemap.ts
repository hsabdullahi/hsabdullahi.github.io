export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { publicRoutes } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({ url: absoluteUrl(route) }));
}
