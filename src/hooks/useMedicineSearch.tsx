
import { useState, useEffect } from "react";
import { Medicine } from "../components/MedicineCard";
import { FilterOptions } from "../components/FilterBar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Mapping function to convert Supabase data to Medicine type
const mapSupabaseMedicine = (item: any): Medicine => ({
  id: item.med_id.toString(),
  name: item.name || 'Unknown Medicine',
  composition: item.short_composition1 + (item.short_composition2 ? `, ${item.short_composition2}` : ''),
  price: item['price(₹)'] || 0,
  manufacturer: item.manufacturer || 'Unknown Manufacturer',
  dosage: "As directed by physician", // Default dosage as it's not in the Supabase schema
});

interface SearchOptions {
  query?: string;
  filters?: FilterOptions;
  sort?: string;
}

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
        
        if (data) {
          const mappedData = data.map(mapSupabaseMedicine);
          setAllMedicines(mappedData);
          setSearchResults(mappedData);
          
          // Extract unique manufacturers
          const uniqueManufacturers = Array.from(
            new Set(mappedData.filter(med => med.manufacturer).map(med => med.manufacturer))
          );
          setManufacturers(uniqueManufacturers as string[]);
          
          // Extract unique compositions
          const uniqueCompositions = Array.from(
            new Set(mappedData.filter(med => med.composition).map(med => med.composition))
          );
          setCompositions(uniqueCompositions);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
        toast.error("Failed to load medicines");
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
          // Since composition in our app is mapped from short_composition1 + short_composition2
          // We need to handle this filter differently in the frontend
          
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
        
        if (!data) {
          data = [];
        }
        
        // Map the data to our Medicine type
        let results = data.map(mapSupabaseMedicine);
        
        // Apply composition filter in memory (since it's a derived field)
        if (filters?.composition) {
          results = results.filter(med => med.composition === filters.composition);
        }
        
        // Apply sorting in memory
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

    // Only search if we've loaded the initial data
    if (allMedicines.length > 0 || searchOptions.query || 
        (searchOptions.filters && Object.keys(searchOptions.filters).length > 0)) {
      searchMedicines();
    }
  }, [searchOptions, allMedicines.length]);

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
