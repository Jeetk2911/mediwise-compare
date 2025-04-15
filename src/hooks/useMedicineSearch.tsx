
import { useState, useEffect } from "react";
import { Medicine, FilterOptions, SearchOptions } from "../types/medicine";
import { findAlternativeMedicines } from "../utils/medicineMappers";
import { extractUniqueValues, applySorting } from "../utils/medicineHelpers";
import { fetchAllMedicines, searchMedicines } from "../services/medicineService";
import { toast } from "sonner";

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
  const [focusedMedicine, setFocusedMedicine] = useState<Medicine | null>(null);
  const [alternatives, setAlternatives] = useState<Medicine[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        console.log("Loading initial medicines data...");
        const { medicines, useDefaultData } = await fetchAllMedicines();
        
        console.log(`Loaded ${medicines.length} medicines (useDefaultData: ${useDefaultData})`);
        setAllMedicines(medicines);
        setSearchResults(medicines);
        
        // Extract unique manufacturers and compositions
        setManufacturers(extractUniqueValues(medicines, 'manufacturer'));
        setCompositions(extractUniqueValues(medicines, 'composition'));
        
        setUseDefaultData(useDefaultData);
        
        if (medicines.length === 0) {
          setErrorMessage("No medicines found in the database. Please check your connection.");
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setErrorMessage("Failed to load medicine data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Search and filter function
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        const { query, filters, sort } = searchOptions;
        
        console.log(`Performing search with query: "${query || ''}", filters:`, filters, `sort: ${sort || 'none'}`);
        
        // Get search results
        const results = await searchMedicines(
          query, 
          filters, 
          sort, 
          allMedicines, 
          useDefaultData
        );
        
        // Apply sorting to results
        const sortedResults = sort ? applySorting(results, sort) : results;
        console.log(`Found ${sortedResults.length} medicines after sorting`);
        
        // Set focused medicine and alternatives if there's a query
        if (query && query.trim() !== "" && sortedResults.length > 0) {
          setFocusedMedicine(sortedResults[0]);
          // Find alternatives for the focused medicine
          const medicineAlternatives = findAlternativeMedicines(sortedResults[0], allMedicines);
          console.log(`Found ${medicineAlternatives.length} alternatives for ${sortedResults[0].name}`);
          setAlternatives(medicineAlternatives);
        } else {
          setFocusedMedicine(null);
          setAlternatives([]);
        }
        
        setSearchResults(sortedResults);
        if (sortedResults.length === 0 && (query || Object.keys(filters || {}).length > 0)) {
          toast.info("No medicines found matching your criteria");
        }
      } catch (error) {
        console.error("Error performing search:", error);
        toast.error("An error occurred while searching");
      } finally {
        setLoading(false);
      }
    };

    // Only search if we've loaded the initial data
    if (allMedicines.length > 0 || searchOptions.query || 
        (searchOptions.filters && Object.keys(searchOptions.filters).length > 0)) {
      performSearch();
    }
  }, [searchOptions, allMedicines.length, useDefaultData]);

  const retryConnection = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      toast.info("Attempting to reconnect to database...");
      const { medicines, useDefaultData } = await fetchAllMedicines();
      
      setAllMedicines(medicines);
      setSearchResults(medicines);
      
      // Extract unique manufacturers and compositions
      setManufacturers(extractUniqueValues(medicines, 'manufacturer'));
      setCompositions(extractUniqueValues(medicines, 'composition'));
      
      setUseDefaultData(useDefaultData);
      
      if (!useDefaultData) {
        toast.success("Successfully connected to the database!");
      } else {
        setErrorMessage("Still using sample data. Check your database connection.");
      }
    } catch (error) {
      console.error("Error retrying connection:", error);
      setErrorMessage("Failed to connect to the database. Please try again later.");
      toast.error("Connection failed. Using sample data.");
    } finally {
      setLoading(false);
    }
  };

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
    focusedMedicine,
    alternatives,
    errorMessage,
    useDefaultData,
    updateSearchQuery,
    updateFilters,
    updateSort,
    retryConnection
  };
};

export default useMedicineSearch;
