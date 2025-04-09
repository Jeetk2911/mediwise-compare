
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
    console.log("Fetching medicines from Supabase...");
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .limit(100); // Start with a smaller batch for initial load
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`Successfully fetched ${data.length} medicines from Supabase`);
      const mappedData = data.map(mapSupabaseMedicine);
      return {
        medicines: mappedData,
        useDefaultData: false
      };
    } else {
      console.log("No medicines found in Supabase, using sample data");
      toast.error("Failed to load medicines from database. Please check your connection.");
      return {
        medicines: sampleMedicines,
        useDefaultData: true
      };
    }
  } catch (error) {
    console.error("Error fetching medicines:", error);
    toast.error("Failed to load medicines from database. Please check your database connection.");
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
      
      // Apply text search if query exists - focusing on composition
      if (query && query.trim() !== "") {
        const searchTerm = formatCompositionForSearch(query);
        results = results.filter(med => 
          formatCompositionForSearch(med.composition).includes(searchTerm)
        );
        console.log(`Filtered to ${results.length} medicines by composition search term: ${searchTerm}`);
      }
      
      // Apply filters if they exist
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
    
    // Apply text search if query exists - FOCUSING ON COMPOSITION
    if (query && query.trim() !== "") {
      const searchTerm = query.toLowerCase().trim();
      console.log(`Searching for compositions with term: ${searchTerm}`);
      
      // Search using ILIKE on both composition fields for partial matches
      supabaseQuery = supabaseQuery.or(
        `short_composition1.ilike.%${searchTerm}%,short_composition2.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`
      );
    }
    
    // Apply filters if they exist
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
    
    // Execute the query with a higher limit to ensure we get enough data
    let { data, error } = await supabaseQuery.limit(500);
    
    if (error) {
      console.error("Supabase search error:", error);
      throw error;
    }
    
    console.log(`Supabase returned ${data?.length || 0} medicines`);
    
    if (!data || data.length === 0) {
      // Fall back to fetching some data without filters
      console.log("No results with filters, trying to get any medicines");
      const { data: anyData, error: anyError } = await supabase
        .from('medicines')
        .select('*')
        .limit(100);
        
      if (anyError) {
        console.error("Supabase fallback query error:", anyError);
        toast.warning("Could not retrieve medicines with your criteria.");
        return [];
      }
      
      if (!anyData || anyData.length === 0) {
        console.log("Still no data from Supabase, database might be empty");
        toast.error("Database appears to be empty. Please check your database configuration.");
        return [];
      }
      
      // We got some data, map it
      return anyData.map(mapSupabaseMedicine);
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
    toast.error("Error searching medicines: " + (error instanceof Error ? error.message : String(error)));
    
    // Return empty array instead of sample data on error
    return [];
  }
};
