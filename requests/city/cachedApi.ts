import { unstable_cache } from 'next/cache';
import {
  fetchCitiesWithPagination,
  fetchCities,
  fetchCityBySlug
} from './api';

// Set revalidation period (5 minutes)
const REVALIDATION_TIME = 300;

// Create cached versions of API functions
export const cachedFetchCitiesWithPagination = unstable_cache(
  async (params) => fetchCitiesWithPagination(params),
  ['cities-with-pagination'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCities = unstable_cache(
  async () => fetchCities(),
  ['cities'],
  { revalidate: REVALIDATION_TIME }
);

export const cachedFetchCityBySlug = unstable_cache(
  async (params) => fetchCityBySlug(params),
  ['city-by-slug'],
  { revalidate: REVALIDATION_TIME }
);