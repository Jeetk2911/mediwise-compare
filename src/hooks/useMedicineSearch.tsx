
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
  const [dataLoadFailed, setDataLoadFailed] = useState(false);

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log("Loading initial medicines data...");
        const { medicines, useDefault } = await fetchAllMedicines();
        
        console.log(`Loaded ${medicines.length} medicines (useDefaultData: ${useDefault})`);
        setAllMedicines(medicines);
        setSearchResults(medicines);
        setUseDefaultData(useDefault);
        setDataLoadFailed(medicines.length === 0);
        
        if (medicines.length === 0) {
          toast.error("Failed to load any medicines from the database. Please check your connection.");
          return;
        }
        
        // Extract unique manufacturers and compositions
        setManufacturers(extractUniqueValues(medicines, 'manufacturer'));
        setCompositions(extractUniqueValues(medicines, 'composition'));
        
      } catch (error) {
        console.error("Error in initial data load:", error);
        setDataLoadFailed(true);
        toast.error("Failed to load medicines data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Search and filter function
  useEffect(() => {
    const performSearch = async () => {
      if (dataLoadFailed) {
        console.log("Skipping search because initial data load failed");
        return;
      }
      
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
  }, [searchOptions, allMedicines.length, useDefaultData, dataLoadFailed]);

  const updateSearchQuery = (query: string) => {
    setSearchOptions(prev => ({ ...prev, query }));
  };

  const updateFilters = (filters: FilterOptions) => {
    setSearchOptions(prev => ({ ...prev, filters }));
  };

  const updateSort = (sort: string) => {
    setSearchOptions(prev => ({ ...prev, sort }));
  };

  const retryFetchData = async () => {
    setLoading(true);
    setDataLoadFailed(false);
    try {
      const { medicines, useDefault } = await fetchAllMedicines();
      setAllMedicines(medicines);
      setSearchResults(medicines);
      setUseDefaultData(useDefault);
      
      if (medicines.length === 0) {
        setDataLoadFailed(true);
        toast.error("Still unable to load medicines. Please check database connection.");
      } else {
        // Extract unique manufacturers and compositions
        setManufacturers(extractUniqueValues(medicines, 'manufacturer'));
        setCompositions(extractUniqueValues(medicines, 'composition'));
        toast.success(`Successfully loaded ${medicines.length} medicines`);
      }
    } catch (error) {
      console.error("Error retrying data fetch:", error);
      setDataLoadFailed(true);
      toast.error("Failed to load medicines data on retry.");
    } finally {
      setLoading(false);
    }
  };

  return {
    medicines: searchResults,
    loading,
    manufacturers,
    compositions,
    searchOptions,
    focusedMedicine,
    alternatives,
    dataLoadFailed,
    updateSearchQuery,
    updateFilters,
    updateSort,
    retryFetchData
  };
};

export default useMedicineSearch;
