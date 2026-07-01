import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/login`, priority: 0.5 },
    { url: `${base}/signup`, priority: 0.5 },
    { url: `${base}/terms`, priority: 0.3 },
    { url: `${base}/privacy`, priority: 0.3 },
  ];
}
