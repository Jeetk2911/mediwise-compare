
import React, { useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import MedicineGrid from "../components/MedicineGrid";
import MedicineCompare from "../components/MedicineCompare";
import NoResults from "../components/NoResults";
import { SkeletonGrid } from "../components/Skeletons";
import { useMedicineSearch } from "../hooks/useMedicineSearch";
import { Medicine } from "../types/medicine";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const {
    medicines,
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
  } = useMedicineSearch();

  // State for medicine comparison
  const [comparedMedicines, setComparedMedicines] = useState<Medicine[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Handle adding/removing medicines to comparison
  const handleCompare = (medicine: Medicine) => {
    const alreadyCompared = comparedMedicines.some(m => m.id === medicine.id);
    
    if (alreadyCompared) {
      // Remove from comparison
      setComparedMedicines(prev => prev.filter(m => m.id !== medicine.id));
    } else {
      // Add to comparison (limit to 4)
      if (comparedMedicines.length >= 4) {
        toast.warning("You can compare up to 4 medicines at once. Please remove one before adding another.");
        return;
      }
      
      setComparedMedicines(prev => [...prev, medicine]);
      
      // Show the comparison panel if this is the first item
      if (comparedMedicines.length === 0) {
        setShowComparison(true);
      }
      
      toast.success(`Added ${medicine.name} to comparison`);
    }
  };

  // Remove a medicine from comparison
  const removeMedicineFromComparison = (medicineId: string) => {
    setComparedMedicines(prev => prev.filter(m => m.id !== medicineId));
    
    // Hide the comparison panel if no items left
    if (comparedMedicines.length <= 1) {
      setShowComparison(false);
    }
  };

  // Toggle comparison panel visibility
  const toggleComparison = () => {
    if (comparedMedicines.length > 0) {
      setShowComparison(prev => !prev);
    } else {
      setShowComparison(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <section className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-medblue-600 to-medcyan-500 bg-clip-text text-transparent">
            Find Medicine Alternatives & Compare Prices
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Search for medications by composition and 
            easily compare alternatives to find the best option for your needs.
          </p>
          
          <SearchBar 
            onSearch={updateSearchQuery} 
            placeholder="Search by medicine composition..." 
          />
        </section>
        
        <section className="mb-8">
          <FilterBar 
            onFilterChange={updateFilters}
            activeFilters={searchOptions.filters || {}}
            manufacturers={manufacturers}
            compositions={compositions}
          />
        </section>
        
        {/* Comparison toggle button (when medicines are selected) */}
        {comparedMedicines.length > 0 && !showComparison && (
          <div className="fixed bottom-4 right-4 z-50">
            <button 
              onClick={toggleComparison}
              className="bg-medblue-600 text-white rounded-full px-4 py-3 shadow-lg flex items-center gap-2 hover:bg-medblue-700 transition-colors"
            >
              Compare Medicines ({comparedMedicines.length})
            </button>
          </div>
        )}
        
        {/* Data load failed message with retry button */}
        {dataLoadFailed && !loading && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-red-700 mb-2">Failed to load medicines data</h3>
            <p className="mb-4 text-red-600">
              We couldn't connect to the database to fetch medicines. Please check your connection and try again.
            </p>
            <button
              onClick={retryFetchData}
              className="bg-medblue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto hover:bg-medblue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Loading Data
            </button>
          </div>
        )}
        
        <section>
          {loading ? (
            <SkeletonGrid />
          ) : medicines.length > 0 ? (
            <MedicineGrid 
              medicines={medicines}
              alternatives={alternatives}
              focusedMedicine={focusedMedicine}
              onSort={updateSort} 
              currentSort={searchOptions.sort}
              onCompare={handleCompare}
              comparedMedicines={comparedMedicines}
            />
          ) : (
            <NoResults />
          )}
        </section>
      </main>
      
      {/* Medicine Comparison Panel */}
      {showComparison && (
        <MedicineCompare 
          medicines={comparedMedicines} 
          onRemove={removeMedicineFromComparison} 
          onClose={() => setShowComparison(false)}
        />
      )}
      
      <footer className="border-t mt-16 py-8 bg-muted/40">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="mb-2">© {new Date().getFullYear()} MediCompare. All rights reserved.</p>
          <p>MediCompare is for informational purposes only. Always consult with a healthcare professional.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
