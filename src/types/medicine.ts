
export interface Medicine {
  id: string;
  name: string;
  composition: string;
  price: number;
  manufacturer: string;
  dosage: string;
  description?: string;
  sideEffects?: string;
  popularity?: number; // For determining popular alternatives
}

export interface FilterOptions {
  composition?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  manufacturer?: string;
}

export interface SearchOptions {
  query?: string;
  filters?: FilterOptions;
  sort?: string;
}

export interface BrandAvailability {
  brand: string;
  price: number;
  available: boolean;
  url?: string;
}

export interface MedicineComparison {
  id: string;
  name: string;
  composition: string;
  price: number;
  manufacturer: string;
  dosage: string;
  brandAvailability: BrandAvailability[];
}
