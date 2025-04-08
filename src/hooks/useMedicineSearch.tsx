
import { useState, useEffect } from "react";
import { Medicine } from "../components/MedicineCard";
import { FilterOptions } from "../components/FilterBar";
import { toast } from "sonner";

// Sample data for demo purposes
const DEMO_MEDICINES: Medicine[] = [
  {
    id: "1",
    name: "PainRelief Plus",
    composition: "Paracetamol 500mg",
    price: 5.99,
    manufacturer: "MediPharm",
    dosage: "1 tablet 3-4 times daily"
  },
  {
    id: "2",
    name: "ParaEase",
    composition: "Paracetamol 500mg",
    price: 4.50,
    manufacturer: "HealthCare Labs",
    dosage: "1-2 tablets every 6 hours"
  },
  {
    id: "3",
    name: "AlloCure",
    composition: "Allopurinol 100mg",
    price: 12.75,
    manufacturer: "PharmaGlobal",
    dosage: "1 tablet daily"
  },
  {
    id: "4",
    name: "ZantiAcid",
    composition: "Ranitidine 150mg",
    price: 8.25,
    manufacturer: "MediPharm",
    dosage: "1 tablet twice daily"
  },
  {
    id: "5",
    name: "HeartGuard",
    composition: "Atenolol 25mg",
    price: 15.99,
    manufacturer: "CardioMed",
    dosage: "1 tablet daily"
  },
  {
    id: "6",
    name: "DigestAid",
    composition: "Omeprazole 20mg",
    price: 11.50,
    manufacturer: "HealthCare Labs",
    dosage: "1 capsule daily before breakfast"
  },
  {
    id: "7",
    name: "GenericPain",
    composition: "Paracetamol 500mg",
    price: 3.99,
    manufacturer: "ValueMeds",
    dosage: "1-2 tablets every 4-6 hours"
  },
  {
    id: "8",
    name: "BioCardia",
    composition: "Atenolol 25mg",
    price: 14.25,
    manufacturer: "BioHealth",
    dosage: "1 tablet daily in the morning"
  }
];

interface SearchOptions {
  query?: string;
  filters?: FilterOptions;
  sort?: string;
}

export const useMedicineSearch = () => {
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>(DEMO_MEDICINES);
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [compositions, setCompositions] = useState<string[]>([]);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: "",
    filters: {},
    sort: "name-asc"
  });

  // Extract unique manufacturers and compositions
  useEffect(() => {
    const uniqueManufacturers = Array.from(
      new Set(DEMO_MEDICINES.map(med => med.manufacturer))
    );
    const uniqueCompositions = Array.from(
      new Set(DEMO_MEDICINES.map(med => med.composition))
    );
    
    setManufacturers(uniqueManufacturers);
    setCompositions(uniqueCompositions);
  }, []);

  // Search and filter function
  useEffect(() => {
    const searchMedicines = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let results = [...DEMO_MEDICINES];
        const { query, filters, sort } = searchOptions;
        
        // Filter by search query
        if (query && query.trim() !== "") {
          const searchTerm = query.toLowerCase();
          results = results.filter(
            (med) =>
              med.name.toLowerCase().includes(searchTerm) ||
              med.composition.toLowerCase().includes(searchTerm) ||
              med.manufacturer.toLowerCase().includes(searchTerm)
          );
        }
        
        // Apply filters
        if (filters) {
          if (filters.composition) {
            results = results.filter(med => med.composition === filters.composition);
          }
          
          if (filters.manufacturer) {
            results = results.filter(med => med.manufacturer === filters.manufacturer);
          }
          
          if (filters.priceRange) {
            const { min, max } = filters.priceRange;
            if (min !== undefined) {
              results = results.filter(med => med.price >= min);
            }
            if (max !== undefined) {
              results = results.filter(med => med.price <= max);
            }
          }
        }
        
        // Apply sorting
        if (sort) {
          switch (sort) {
            case 'name-asc':
              results.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'name-desc':
              results.sort((a, b) => b.name.localeCompare(a.name));
              break;
            case 'price-asc':
              results.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              results.sort((a, b) => b.price - a.price);
              break;
            default:
              break;
          }
        }
        
        setSearchResults(results);
        if (results.length === 0 && (query || Object.keys(filters || {}).length > 0)) {
          toast.info("No medicines found matching your criteria");
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Error searching medicines");
      } finally {
        setLoading(false);
      }
    };

    searchMedicines();
  }, [searchOptions]);

  const updateSearchQuery = (query: string) => {
    setSearchOptions(prev => ({ ...prev, query }));
  };

  const updateFilters = (filters: FilterOptions) => {
    setSearchOptions(prev => ({ ...prev, filters }));
  };

  const updateSort = (sort: string) => {
    setSearchOptions(prev => ({ ...prev, sort }));
  };

  return {
    medicines: searchResults,
    loading,
    manufacturers,
    compositions,
    searchOptions,
    updateSearchQuery,
    updateFilters,
    updateSort
  };
};
