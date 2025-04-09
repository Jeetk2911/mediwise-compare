
import React from "react";
import MedicineCard from "./MedicineCard";
import { Medicine } from "../types/medicine";
import { ArrowDownAZ, ArrowUpAZ, ArrowDownNarrowWide, ArrowUpWideNarrow } from "lucide-react";

interface MedicineGridProps {
  medicines: Medicine[];
  alternatives?: Medicine[];
  focusedMedicine?: Medicine | null;
  loading?: boolean;
  onSort: (type: string) => void;
  currentSort?: string;
  onCompare: (medicine: Medicine) => void;
  comparedMedicines: Medicine[];
}

const MedicineGrid: React.FC<MedicineGridProps> = ({ 
  medicines, 
  alternatives = [],
  focusedMedicine = null,
  loading = false, 
  onSort,
  currentSort = '',
  onCompare,
  comparedMedicines = []
}) => {
  const sortOptions = [
    { id: 'name-asc', label: 'Name A-Z', icon: <ArrowDownAZ className="h-4 w-4" /> },
    { id: 'name-desc', label: 'Name Z-A', icon: <ArrowUpAZ className="h-4 w-4" /> },
    { id: 'price-asc', label: 'Price Low-High', icon: <ArrowDownNarrowWide className="h-4 w-4" /> },
    { id: 'price-desc', label: 'Price High-Low', icon: <ArrowUpWideNarrow className="h-4 w-4" /> },
  ];

  // Check if a medicine is already in the comparison list
  const isCompared = (medicine: Medicine) => {
    return comparedMedicines.some(m => m.id === medicine.id);
  };

  const resultsText = medicines.length === 0 
    ? "No matches found" 
    : `Results (${medicines.length})`;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {loading ? 'Searching...' : resultsText}
        </h2>
        <div className="flex gap-2">
          <label className="text-sm font-medium mr-2 hidden sm:inline-block">Sort by:</label>
          <div className="flex flex-wrap gap-1">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onSort(option.id)}
                className={`
                  inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors
                  ${currentSort === option.id 
                    ? 'bg-medblue-500 text-white' 
                    : 'bg-muted hover:bg-muted/80 text-foreground'}
                `}
                aria-pressed={currentSort === option.id}
              >
                {option.icon}
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Show focused medicine and alternatives if they exist */}
      {focusedMedicine && alternatives.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Your Medicine</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            <MedicineCard 
              key={focusedMedicine.id} 
              medicine={focusedMedicine} 
              onCompare={onCompare}
              isCompared={isCompared(focusedMedicine)}
            />
          </div>
          
          <h2 className="text-xl font-bold mb-4 border-t pt-8">Top Alternatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {alternatives.map((medicine) => (
              <MedicineCard 
                key={medicine.id} 
                medicine={medicine}
                isAlternative={true}
                onCompare={onCompare}
                isCompared={isCompared(medicine)}
              />
            ))}
          </div>
          
          <div className="border-t pt-8 mb-4">
            <h2 className="text-xl font-bold">All Medicines</h2>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {medicines.map((medicine) => (
          <MedicineCard 
            key={medicine.id} 
            medicine={medicine} 
            onCompare={onCompare}
            isCompared={isCompared(medicine)}
          />
        ))}
      </div>
    </div>
  );
};

export default MedicineGrid;
