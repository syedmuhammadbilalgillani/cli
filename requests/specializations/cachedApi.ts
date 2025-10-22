import { unstable_cache } from 'next/cache';
import {
  fetchSpecializationsWithPagination,
  fetchSpecializations,
  fetchSpecializationBySlug,
  fetchSpecializationsWithCourses,
  fetchSpecializationsWithCategories,
  fetchSpecializationsWithCategoriesAndCourses
} from './api';

// Set revalidation period (5 minutes)
const REVALIDATION_TIME = 300;

// Create cached versions of API functions
export const cachedFetchSpecializationsWithPagination = unstable_cache(
  async (params) => fetchSpecializationsWithPagination(params),
  ['specializations-with-pagination'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchSpecializations = unstable_cache(
  async () => fetchSpecializations(),
  ['specializations'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchSpecializationBySlug = unstable_cache(
  async (params) => fetchSpecializationBySlug(params),
  ['specialization-by-slug'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchSpecializationsWithCourses = unstable_cache(
  async (params) => fetchSpecializationsWithCourses(params),
  ['specializations-with-courses'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchSpecializationsWithCategories = unstable_cache(
  async () => fetchSpecializationsWithCategories(),
  ['specializations-with-categories'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchSpecializationsWithCategoriesAndCourses = unstable_cache(
  async () => fetchSpecializationsWithCategoriesAndCourses(),
  ['specializations-with-categories-courses'],
  { revalidate: REVALIDATION_TIME }
);