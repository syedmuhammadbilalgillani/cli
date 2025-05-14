type OpenGraphImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

type Metadata = {
  title: string;
  description: string;
  keywords: string;
  openGraph: {
    type: string;
    locale: string;
    site_name: string;
    title: string;
    description: string;
    url: string;
    images: OpenGraphImage[];
  };
  twitter: {
    card: string;
    creator: string;
    title: string;
    description: string;
    images: OpenGraphImage[];
  };
  alternates: {
    canonical: string;
  };
}; // Assume LOCALE_LANGUAGE is coming from somewhere (global state, context, or prop)
declare const LOCALE_LANGUAGE: string;

// Define types for the API responses
export interface DataItem {
  name: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  image?: string;
}

export interface ApiResponse {
  status: string;
  data: any;
}

export interface CommonData {
  cityData: ApiResponse;
  specializationData: ApiResponse;
  specializationCategory: ApiResponse;
  categoryData: ApiResponse;
}

export interface PageParams {
  params: {
    specializationdynamicpage: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
