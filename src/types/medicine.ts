
export interface Medicine {
  id: string;
  name: string;
  composition: string;
  price: number;
  manufacturer: string;
  dosage: string;
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
