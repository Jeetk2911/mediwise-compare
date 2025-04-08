
import React from "react";
import MedicineCard, { Medicine } from "./MedicineCard";
import { ArrowDownAZ, ArrowUpAZ, ArrowDownNarrowWide, ArrowUpWideNarrow } from "lucide-react";

interface MedicineGridProps {
  medicines: Medicine[];
  loading?: boolean;
  onSort: (type: string) => void;
  currentSort?: string;
}

const MedicineGrid: React.FC<MedicineGridProps> = ({ 
  medicines, 
  loading = false, 
  onSort,
  currentSort = ''
}) => {
  const sortOptions = [
    { id: 'name-asc', label: 'Name A-Z', icon: <ArrowDownAZ className="h-4 w-4" /> },
    { id: 'name-desc', label: 'Name Z-A', icon: <ArrowUpAZ className="h-4 w-4" /> },
    { id: 'price-asc', label: 'Price Low-High', icon: <ArrowDownNarrowWide className="h-4 w-4" /> },
    { id: 'price-desc', label: 'Price High-Low', icon: <ArrowUpWideNarrow className="h-4 w-4" /> },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {loading ? 'Searching...' : `Results (${medicines.length})`}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {medicines.map((medicine) => (
          <MedicineCard key={medicine.id} medicine={medicine} />
        ))}
      </div>
    </div>
  );
};

export default MedicineGrid;
