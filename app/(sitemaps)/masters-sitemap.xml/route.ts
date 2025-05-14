import { NextResponse } from "next/server";
import { fetchCoursesByProgram } from "@/requests/courses/api";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";

const SLUG = LOCALE_LANGUAGE === "en" ? "masters" : "الماجستير";
export async function GET() {
  try {
    // Fetch city data from API
    const response = await fetchCoursesByProgram({ slug: SLUG });

    // Map city data to sitemap URLs
    // Note: fetchCities returns the data directly, not a response object that needs .json()
    const dynamicUrls = response?.data?.map((course: any) => ({
      loc: `${DOMAIN_URL}/${course.specialization_slug}/${course.category_slug}/${course.slug}`,
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
