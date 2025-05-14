import { DOMAIN_URL } from "@/constant/apiUrl";
import { fetchConsultationWithCategoriesForSitemap } from "@/requests/consultations/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch city data from API
    const response = await fetchConsultationWithCategoriesForSitemap();

    // Map city data to sitemap URLs
    // Note: fetchCities returns the data directly, not a response object that needs .json()
    const dynamicUrls = response?.data?.map((city: any) => ({
      loc: `${DOMAIN_URL}/consulting-services/${city.category_slug}/${city.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.8",
    }));

    // Generate the XML for the sitemap
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${dynamicUrls
    .map(
      (url: any) => `<url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

    return new NextResponse(sitemapXml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Error fetching city data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
