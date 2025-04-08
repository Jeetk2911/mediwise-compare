
import { useState, useEffect } from "react";
import { Medicine, FilterOptions, SearchOptions } from "../types/medicine";
import { mapSupabaseMedicine } from "../utils/medicineMappers";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Sample data to use when no medicines are returned from the database
const sampleMedicines: Medicine[] = [
  {
    id: "sample1",
    name: "Paracetamol 500mg",
    composition: "Paracetamol",
    price: 50,
    manufacturer: "GSK Pharma",
    dosage: "As directed by physician"
  },
  {
    id: "sample2",
    name: "Ibuprofen 400mg",
    composition: "Ibuprofen",
    price: 65.5,
    manufacturer: "Sun Pharmaceuticals",
    dosage: "As directed by physician"
  },
  {
    id: "sample3",
    name: "Amoxicillin 250mg",
    composition: "Amoxicillin",
    price: 120.75,
    manufacturer: "Cipla Ltd",
    dosage: "As directed by physician"
  },
  {
    id: "sample4",
    name: "Azithromycin 500mg",
    composition: "Azithromycin",
    price: 180.25,
    manufacturer: "Mankind Pharma",
    dosage: "As directed by physician"
  },
  {
    id: "sample5",
    name: "Cetirizine 10mg",
    composition: "Cetirizine Hydrochloride",
    price: 35.5,
    manufacturer: "Dr Reddy's Laboratories",
    dosage: "As directed by physician"
  },
  {
    id: "sample6",
    name: "Montelukast 10mg",
    composition: "Montelukast Sodium",
    price: 145.8,
    manufacturer: "Lupin Limited",
    dosage: "As directed by physician"
  }
];

// Helper function to extract unique values from an array of medicines
const extractUniqueValues = (
  medicines: Medicine[], 
  key: keyof Medicine
): string[] => {
  return Array.from(
    new Set(
      medicines
        .filter(med => med[key])
        .map(med => med[key] as string)
    )
  );
};

export const useMedicineSearch = () => {
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [compositions, setCompositions] = useState<string[]>([]);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: "",
    filters: {},
    sort: "name-asc"
  });
  const [useDefaultData, setUseDefaultData] = useState(false);

  // Initial data fetch from Supabase
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .limit(100); // Limiting to 100 results for initial load performance
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mappedData = data.map(mapSupabaseMedicine);
          setAllMedicines(mappedData);
          setSearchResults(mappedData);
          
          // Extract unique manufacturers
          setManufacturers(extractUniqueValues(mappedData, 'manufacturer'));
          
          // Extract unique compositions
          setCompositions(extractUniqueValues(mappedData, 'composition'));
          
          setUseDefaultData(false);
        } else {
          // Use sample data if no data is returned from Supabase
          setAllMedicines(sampleMedicines);
          setSearchResults(sampleMedicines);
          setManufacturers(extractUniqueValues(sampleMedicines, 'manufacturer'));
          setCompositions(extractUniqueValues(sampleMedicines, 'composition'));
          setUseDefaultData(true);
          
          toast.info("Using sample data for demonstration. No medicines found in database.");
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
        
        // Use sample data if there's an error
        setAllMedicines(sampleMedicines);
        setSearchResults(sampleMedicines);
        setManufacturers(extractUniqueValues(sampleMedicines, 'manufacturer'));
        setCompositions(extractUniqueValues(sampleMedicines, 'composition'));
        setUseDefaultData(true);
        
        toast.error("Failed to load medicines from database. Using sample data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Search and filter function
  useEffect(() => {
    const searchMedicines = async () => {
      setLoading(true);
      try {
        const { query, filters, sort } = searchOptions;
        
        // If using default data, perform in-memory search and filtering
        if (useDefaultData) {
          let results = [...sampleMedicines];
          
          // Apply text search if query exists
          if (query && query.trim() !== "") {
            const searchTerm = query.toLowerCase();
            results = results.filter(med => 
              med.name.toLowerCase().includes(searchTerm) || 
              med.composition.toLowerCase().includes(searchTerm) || 
              med.manufacturer.toLowerCase().includes(searchTerm)
            );
          }
          
          // Apply filters if they exist
          if (filters) {
            // For composition filter
            if (filters.composition) {
              results = results.filter(med => med.composition === filters.composition);
            }
            
            // For manufacturer filter
            if (filters.manufacturer) {
              results = results.filter(med => med.manufacturer === filters.manufacturer);
            }
            
            // For price range filter
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
            results = applySorting(results, sort);
          }
          
          setSearchResults(results);
          return;
        }
        
        // Start building the Supabase query
        let supabaseQuery = supabase.from('medicines').select('*');
        
        // Apply text search if query exists
        if (query && query.trim() !== "") {
          const searchTerm = query.toLowerCase();
          supabaseQuery = supabaseQuery.or(
            `name.ilike.%${searchTerm}%,short_composition1.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%`
          );
        }
        
        // Apply filters if they exist
        if (filters) {
          // For manufacturer filter
          if (filters.manufacturer) {
            supabaseQuery = supabaseQuery.eq('manufacturer', filters.manufacturer);
          }
          
          // For price range filter
          if (filters.priceRange) {
            const { min, max } = filters.priceRange;
            if (min !== undefined) {
              supabaseQuery = supabaseQuery.gte('price(₹)', min);
            }
            if (max !== undefined) {
              supabaseQuery = supabaseQuery.lte('price(₹)', max);
            }
          }
        }
        
        // Execute the query
        let { data, error } = await supabaseQuery;
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          // Use sample data instead if no results from database
          setSearchResults(sampleMedicines);
          toast.info("Using sample data. No medicines found in database matching your criteria.");
          return;
        }
        
        // Map the data to our Medicine type
        let results = data.map(mapSupabaseMedicine);
        
        // Apply composition filter in memory (since it's a derived field)
        if (filters?.composition) {
          results = results.filter(med => med.composition === filters.composition);
        }
        
        // Apply sorting in memory
        if (sort) {
          results = applySorting(results, sort);
        }
        
        setSearchResults(results);
        if (results.length === 0 && (query || Object.keys(filters || {}).length > 0)) {
          toast.info("No medicines found matching your criteria");
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Error searching medicines");
        
        // Fallback to sample data
        setSearchResults(sampleMedicines);
      } finally {
        setLoading(false);
      }
    };

    // Only search if we've loaded the initial data
    if (allMedicines.length > 0 || searchOptions.query || 
        (searchOptions.filters && Object.keys(searchOptions.filters).length > 0)) {
      searchMedicines();
    }
  }, [searchOptions, allMedicines.length, useDefaultData]);

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

// Helper function for sorting medicines
const applySorting = (medicines: Medicine[], sort: string): Medicine[] => {
  const sortedMedicines = [...medicines]; // Create a copy to avoid mutating the original array
  
  switch (sort) {
    case 'name-asc':
      sortedMedicines.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sortedMedicines.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price-asc':
      sortedMedicines.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedMedicines.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }
  
  return sortedMedicines;
};
