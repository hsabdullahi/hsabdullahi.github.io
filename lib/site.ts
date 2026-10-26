const origin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://hsabdullahi.github.io";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
if (new URL(origin).origin !== origin || !/^https?:\/\//.test(origin))
  throw Error(
    "SITE_ORIGIN must be an HTTP(S) origin without a path or trailing slash",
  );
if (basePath && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath))
  throw Error(
    "BASE_PATH must be empty or a path such as /repository, without a trailing slash",
  );
export const site = { origin, basePath };
export const assetPath = (path: string) => `${site.basePath}${path}`;
export const absoluteUrl = (path: string) =>
  `${site.origin}${site.basePath}${path}`;
