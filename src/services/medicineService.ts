
import { Medicine, FilterOptions } from "../types/medicine";
import { mapSupabaseMedicine } from "../utils/medicineMappers";
import { sampleMedicines } from "../data/sampleMedicines";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatCompositionForSearch } from "../utils/medicineHelpers";

export const fetchAllMedicines = async (): Promise<{
  medicines: Medicine[];
  useDefaultData: boolean;
}> => {
  try {
    console.log("Attempting to connect to Supabase database...");
    
    // First, test the connection with a small query
    const { data: testData, error: testError } = await supabase
      .from('medicines')
      .select('med_id')
      .limit(1);
    
    if (testError) {
      console.error("Connection test failed:", testError);
      throw new Error(`Database connection failed: ${testError.message}`);
    }
    
    console.log("Connection test successful, fetching medicines data");
    
    // Now fetch the actual data with pagination to handle large datasets
    // Increase limit to get more data
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .limit(500); // Increased limit to get more data
    
    if (error) {
      console.error("Data fetch error:", error);
      throw new Error(`Failed to retrieve medicines: ${error.message}`);
    }
    
    if (data && data.length > 0) {
      console.log(`Successfully fetched ${data.length} medicines from Supabase`);
      const mappedData = data.map(mapSupabaseMedicine);
      return {
        medicines: mappedData,
        useDefaultData: false
      };
    } else {
      console.log("No medicines found in database, using sample data");
      toast.info("No medicines found in database. Using sample data for demonstration.");
      return {
        medicines: sampleMedicines,
        useDefaultData: true
      };
    }
  } catch (error) {
    console.error("Error fetching medicines:", error);
    toast.error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      medicines: sampleMedicines,
      useDefaultData: true
    };
  }
};

export const searchMedicines = async (
  query: string | undefined,
  filters: FilterOptions | undefined,
  sort: string | undefined,
  allMedicines: Medicine[],
  useDefaultData: boolean
): Promise<Medicine[]> => {
  try {
    // If using default data, perform in-memory search and filtering
    if (useDefaultData) {
      console.log("Using default data for search");
      let results = [...sampleMedicines];
      
      // Apply text search if query exists
      if (query && query.trim() !== "") {
        const searchTerm = formatCompositionForSearch(query);
        results = results.filter(med => 
          formatCompositionForSearch(med.composition).includes(searchTerm) ||
          med.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log(`Filtered to ${results.length} medicines by search term: ${searchTerm}`);
      }
      
      // Apply filters
      if (filters) {
        // For composition filter
        if (filters.composition) {
          results = results.filter(med => med.composition === filters.composition);
          console.log(`Filtered to ${results.length} medicines by composition: ${filters.composition}`);
        }
        
        // For manufacturer filter
        if (filters.manufacturer) {
          results = results.filter(med => med.manufacturer === filters.manufacturer);
          console.log(`Filtered to ${results.length} medicines by manufacturer: ${filters.manufacturer}`);
        }
        
        // For price range filter
        if (filters.priceRange) {
          const { min, max } = filters.priceRange;
          if (min !== undefined) {
            results = results.filter(med => med.price >= min);
            console.log(`Filtered to ${results.length} medicines with price >= ${min}`);
          }
          if (max !== undefined) {
            results = results.filter(med => med.price <= max);
            console.log(`Filtered to ${results.length} medicines with price <= ${max}`);
          }
        }
      }
      
      return results;
    }
    
    console.log("Searching in Supabase database");
    // Start building the Supabase query for live data
    let supabaseQuery = supabase.from('medicines').select('*');
    
    // Apply text search if query exists - SEARCH IN BOTH COMPOSITION AND NAME
    if (query && query.trim() !== "") {
      const searchTerm = query.toLowerCase().trim();
      console.log(`Searching with term: ${searchTerm}`);
      
      // Use OR conditions to search across multiple columns
      supabaseQuery = supabaseQuery.or(
        `short_composition1.ilike.%${searchTerm}%,short_composition2.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`
      );
    }
    
    // Apply filters
    if (filters) {
      console.log("Applying filters:", filters);
      
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
    
    console.log("Executing Supabase query...");
    
    // Execute the query with a higher limit
    let { data, error } = await supabaseQuery.limit(500); // Increased limit substantially
    
    if (error) {
      console.error("Supabase search error:", error);
      throw error;
    }
    
    console.log(`Supabase returned ${data?.length || 0} medicines`);
    
    if (!data || data.length === 0) {
      console.log("No results from Supabase search");
      return [];
    }
    
    // Map the data to our Medicine type
    let results = data.map(mapSupabaseMedicine);
    
    // Apply composition filter in memory (since it's a derived field)
    if (filters?.composition) {
      results = results.filter(med => med.composition === filters.composition);
      console.log(`Filtered to ${results.length} medicines by exact composition: ${filters.composition}`);
    }
    
    return results;
  } catch (error) {
    console.error("Search error:", error);
    toast.error("Error searching medicines. Using sample data instead.");
    
    // On error, if we have a query or filters, search locally in sample data
    if (query || (filters && Object.keys(filters).length > 0)) {
      return searchMedicines(query, filters, sort, sampleMedicines, true);
    }
    
    // Fallback to empty array
    return [];
  }
};
