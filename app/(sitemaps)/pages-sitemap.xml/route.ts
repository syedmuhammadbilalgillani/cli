import { DOMAIN_URL } from "@/constant/apiUrl";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const paths = [
    "/",
    "/about",
    "/blog",
    "/contact",
    "/consulting-services",
    "/sign-in",
    "/sign-up",
    "/privacy-policy",
    "/customer-service",
    "/academy-service",
    "/sitemap",
  ];

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${paths
    .map(
      (path) => `
  <sitemap>
    <loc>${DOMAIN_URL}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
    )
    .join("")}
</sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    headers: { "Content-Type": "text/xml" },
  });
}

export const dynamic = 'force-dynamic';
