"use server";

import { BACKEND_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";

export async function GetCategory(slug) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/categories/${slug}/specialization`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": `${LOCALE_LANGUAGE}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }

    const category = await response.json();
    return category.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function GetAllCategory() {
  try {
    const response = await fetch(`${BACKEND_URL}/categories/`, {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": `${LOCALE_LANGUAGE}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }

    const category = await response.json();
    return category.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function GetSpecialization() { 
  try {
    const response = await fetch(
      `${BACKEND_URL}/specializations_categories`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": `${LOCALE_LANGUAGE}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }

    const category = await response.json();
    return category.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function GetSpecificSpecialization(slug) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/courses/${slug}/specializations?per_page=10&page=1`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": `${LOCALE_LANGUAGE}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const category = await response.json();
    return category ?? [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function GetCities() {
  try {
    const response = await fetch(`${BACKEND_URL}/cities`, {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": `${LOCALE_LANGUAGE}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }

    const category = await response.json();
    return category.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function fetchData(url) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": `${LOCALE_LANGUAGE}`,
      },
    });
    console.log(`Fetching ${url}`);
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
    const data = await res.json();
    console.log(`Body consumed for ${url}`);
    return data;
  } catch (error) {
    // console.error(error?.message);
    return null;
  }
}
