
import React from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import MedicineGrid from "../components/MedicineGrid";
import NoResults from "../components/NoResults";
import { SkeletonGrid } from "../components/Skeletons";
import { useMedicineSearch } from "../hooks/useMedicineSearch";

const Index = () => {
  const {
    medicines,
    loading,
    manufacturers,
    compositions,
    searchOptions,
    updateSearchQuery,
    updateFilters,
    updateSort
  } = useMedicineSearch();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <section className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-medblue-600 to-medcyan-500 bg-clip-text text-transparent">
            Find Medicine Alternatives & Compare Prices
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Search for medications by name, composition, or manufacturer and 
            easily compare alternatives to find the best option for your needs.
          </p>
          
          <SearchBar 
            onSearch={updateSearchQuery} 
            placeholder="Search by medicine name, composition, or manufacturer..." 
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
        
        <section>
          {loading ? (
            <SkeletonGrid />
          ) : medicines.length > 0 ? (
            <MedicineGrid 
              medicines={medicines} 
              onSort={updateSort} 
              currentSort={searchOptions.sort}
            />
          ) : (
            <NoResults />
          )}
        </section>
      </main>
      
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
