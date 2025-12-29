import { DOMAIN_URL, INSITUTE_NAME, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { fetchBlogsWithPagination } from "@/requests/blogs/api";
import { fetchCategoriesWithPagination } from "@/requests/categories/api";
import { fetchCoursesByProgram } from "@/requests/courses/api";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
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
export async function GET() {
  try {
    const isAr = LOCALE_LANGUAGE === "ar";

    // Static pages
    const staticLines = STATIC_PATHS.map((p) => `${DOMAIN_URL}${p}`);

    // Categories
    const categoriesResp = await fetchCategoriesWithPagination({
      page: 1,
      per_page: 20000,
    });
    const categories = categoriesResp?.data ?? categoriesResp ?? [];
    const categoryLines = (categories || [])
      .filter((c: any) => c?.slug)
      .map((c: any) => `[${c.name}](${DOMAIN_URL}/${c.specialization_slug}/${c.slug})`);
    const SLUG =
      LOCALE_LANGUAGE === "en" ? "training-courses" : "الدورات-التدريبية";
    // Courses mapped as "- [Title](URL)"
    const coursesResp = await fetchCoursesByProgram({ slug: SLUG });
    const courses = coursesResp?.data ?? coursesResp ?? [];
    const courseLines = (courses || [])
      //   .filter((course: any) => course?.slug && course?.category_slug)
      .map((course: any) => {
        const rawTitle =
          course.meta_title || course.title || course.name || course.slug;
        const title = String(rawTitle || "")
          .replace(/\r?\n|\r/g, " ")
          .trim();
        const url = `${DOMAIN_URL}/${course.specialization_slug}/${course.category_slug}/${course.slug}`;
        return `- [${title}](${url})`;
      });

    // Latest blog posts (optional)
    const blogsResp = await fetchBlogsWithPagination({
      page: 1,
      per_page: 20,
    });
    const blogs = blogsResp?.data ?? blogsResp ?? [];
    const postLines = (blogs || [])
      .filter((b: any) => b?.slug)
      .map((b: any) => {
        const title = (b.meta_title || b.title || "")
          .replace(/\r?\n|\r/g, " ")
          .trim();
        const url = `${DOMAIN_URL}/blog/${b?.categories[0]?.slug}/${b?.slug}`;
        return `- [${title}](${url})`;
      });

    const header = isAr
      ? `## llms.txt لـ ${INSITUTE_NAME}

${INSITUTE_NAME} (${DOMAIN_URL}) يوفر دورات تدريبية في الذكاء الاصطناعي، وخدمات استشارية، ومقالات حول التعليم والتطوير المهني.

## الصفحات الرئيسية
${STATIC_PATHS.map((p) => `- ${DOMAIN_URL}${p}`).join("\n")}

## خرائط الموقع
- خريطة الموقع الرئيسية: ${DOMAIN_URL}/sitemap.xml
- خريطة صفحات: ${DOMAIN_URL}/pages-sitemap.xml
- خريطة الدورات: ${DOMAIN_URL}/training-courses-sitemap.xml
- خريطة المدن: ${DOMAIN_URL}/cities-sitemap.xml
- خريطة الاستشارات: ${DOMAIN_URL}/consultation-sitemap.xml
`
      : `## llms.txt for ${INSITUTE_NAME}

${INSITUTE_NAME} (${DOMAIN_URL}) provides training courses, consulting services, and articles on education and professional development.

## Main Pages
${STATIC_PATHS.map((p) => `- ${DOMAIN_URL}${p}`).join("\n")}

## Sitemaps
- Main Sitemap: ${DOMAIN_URL}/sitemap.xml
- Pages Sitemap: ${DOMAIN_URL}/pages-sitemap.xml
- Courses Sitemap: ${DOMAIN_URL}/training-courses-sitemap.xml
- Cities Sitemap: ${DOMAIN_URL}/cities-sitemap.xml
- Consultation Sitemap: ${DOMAIN_URL}/consultation-sitemap.xml
`;

    const categoriesSection =
      categoryLines.length > 0
        ? categoryLines.map((u: any) => `- ${u}`).join("\n")
        : isAr
        ? "## لا توجد فئات متاحة"
        : "## No categories available";

    const coursesSection =
      courseLines.length > 0
        ? courseLines.join("\n")
        : isAr
        ? "## لا توجد دورات متاحة"
        : "## No courses available";

    const postsSection =
      postLines.length > 0
        ? postLines.join("\n")
        : isAr
        ? "## لا توجد مقالات حديثة"
        : "## No recent posts available";

    const postsHeading = isAr ? "## المقالات" : "## Posts";
    const categoriesHeading = isAr ? "## الفئات" : "## Categories";
    const coursesHeading = isAr ? "## الدورات" : "## Courses";

    const body = [
      header,
      postsHeading,
      postsSection,
      "",
      categoriesHeading,
      categoriesSection,
      "",
      coursesHeading,
      coursesSection,
    ].join("\n");

    return new NextResponse(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
