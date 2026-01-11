// Veritabanı türleri

export interface Listing {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  listing_date: string; // ISO date string
  created_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  order: number;
  created_at: string;
}

// İlan ve görselleri birlikte içeren tip
export interface ListingWithImages extends Listing {
  images: ListingImage[];
}

// Filtreleme için tipler
export interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
}
