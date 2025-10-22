import { unstable_cache } from 'next/cache';
import {
  fetchCategoriesWithPagination,
  fetchCategories,
  fetchCategoryBySlug,
  fetchCategoryBySpecialization
} from './api';

// Set revalidation period (5 minutes)
const REVALIDATION_TIME = 300;

// Create cached versions of API functions
export const cachedFetchCategoriesWithPagination = unstable_cache(
  async (params) => fetchCategoriesWithPagination(params),
  ['categories-with-pagination'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCategories = unstable_cache(
  async () => fetchCategories(),
  ['categories'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCategoryBySlug = unstable_cache(
  async (params) => fetchCategoryBySlug(params),
  ['category-by-slug'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCategoryBySpecialization = unstable_cache(
  async (params) => fetchCategoryBySpecialization(params),
  ['category-by-specialization'],
  { revalidate: REVALIDATION_TIME }
);