import { unstable_cache } from 'next/cache';
import {
  fetchCourses,
  fetchCoursesWithFilteration,
  fetchCoursesWithPagination,
  fetchCoursesBySpecializationAndCategory,
  fetchCoursesByCategory,
  fetchCoursesBySpecialization,
  fetchCourseDetails,
  fetchFeaturedCoursesWithPagination,
  fetchCoursesByCityWithPagination,
  fetchCoursesByProgramWithPagination,
  fetchCoursesByCategoryWithPagination,
  fetchCoursesByCity,
  fetchCoursesByProgram
} from './api';

// Set revalidation period (5 minutes)
const REVALIDATION_TIME = 300;

// Create cached versions of API functions
export const cachedFetchCourses = unstable_cache(
  async () => fetchCourses(),
  ['courses'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesWithFilteration = unstable_cache(
  async (params) => fetchCoursesWithFilteration(params),
  ['courses-with-filters'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesWithPagination = unstable_cache(
  async (params) => fetchCoursesWithPagination(params),
  ['courses-with-pagination'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesBySpecializationAndCategory = unstable_cache(
  async (params) => fetchCoursesBySpecializationAndCategory(params),
  ['courses-by-specialization-category'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesByCategory = unstable_cache(
  async (params) => fetchCoursesByCategory(params),
  ['courses-by-category'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesBySpecialization = unstable_cache(
  async (params) => fetchCoursesBySpecialization(params),
  ['courses-by-specialization'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCourseDetails = unstable_cache(
  async (params) => fetchCourseDetails(params),
  ['course-details'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchFeaturedCoursesWithPagination = unstable_cache(
  async (params) => fetchFeaturedCoursesWithPagination(params),
  ['featured-courses'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesByCityWithPagination = unstable_cache(
  async (params) => fetchCoursesByCityWithPagination(params),
  ['courses-by-city-pagination'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesByProgramWithPagination = unstable_cache(
  async (params) => fetchCoursesByProgramWithPagination(params),
  ['courses-by-program-pagination'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesByCategoryWithPagination = unstable_cache(
  async (params) => fetchCoursesByCategoryWithPagination(params),
  ['courses-by-category-pagination'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesByCity = unstable_cache(
  async (params) => fetchCoursesByCity(params),
  ['courses-by-city'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCoursesByProgram = unstable_cache(
  async (params) => fetchCoursesByProgram(params),
  ['courses-by-program'],
  { revalidate: REVALIDATION_TIME }
);