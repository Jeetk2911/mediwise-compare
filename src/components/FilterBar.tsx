
import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";

export interface FilterOptions {
  composition?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  manufacturer?: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
  manufacturers: string[];
  compositions: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  activeFilters,
  manufacturers,
  compositions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters);
  
  const toggleFilters = () => setIsOpen(!isOpen);
  
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };
  
  const applyFilters = () => {
    onFilterChange(localFilters);
  };
  
  const resetFilters = () => {
    const emptyFilters: FilterOptions = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== undefined);
  
  return (
    <div className="w-full mb-6 bg-white rounded-lg shadow-sm border animate-fade-in">
      <button
        onClick={toggleFilters}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-medblue-500" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="pill bg-medblue-100 text-medblue-800">Active</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {/* Composition Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Composition</label>
            <select
              value={localFilters.composition || ""}
              onChange={(e) => updateFilter("composition", e.target.value || undefined)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="">Any Composition</option>
              {compositions.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>
          
          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.priceRange?.min || ""}
                onChange={(e) => 
                  updateFilter("priceRange", {
                    ...localFilters.priceRange,
                    min: e.target.value ? Number(e.target.value) : undefined
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.priceRange?.max || ""}
                onChange={(e) =>
                  updateFilter("priceRange", {
                    ...localFilters.priceRange,
                    max: e.target.value ? Number(e.target.value) : undefined
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </div>
          
          {/* Manufacturer Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Manufacturer</label>
            <select
              value={localFilters.manufacturer || ""}
              onChange={(e) => updateFilter("manufacturer", e.target.value || undefined)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="">Any Manufacturer</option>
              {manufacturers.map((mfr) => (
                <option key={mfr} value={mfr}>
                  {mfr}
                </option>
              ))}
            </select>
          </div>
          
          {/* Action Buttons */}
          <div className="md:col-span-3 flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <X className="mr-1 h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="inline-flex items-center rounded-md bg-medblue-500 text-white px-3 py-2 text-sm hover:bg-medblue-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
