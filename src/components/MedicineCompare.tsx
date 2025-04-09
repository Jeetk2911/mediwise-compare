
import React from "react";
import { Medicine, BrandAvailability } from "../types/medicine";
import { getMedicineAvailability } from "../utils/medicineMappers";
import { Check, X, XCircle } from "lucide-react";

interface MedicineCompareProps {
  medicines: Medicine[];
  onRemove: (medicineId: string) => void;
  onClose: () => void;
}

const MedicineCompare: React.FC<MedicineCompareProps> = ({ medicines, onRemove, onClose }) => {
  if (medicines.length === 0) return null;

  // Get all unique brands from the availability data
  const allBrands = new Set<string>();
  medicines.forEach(medicine => {
    const availability = getMedicineAvailability(medicine);
    availability.forEach(item => allBrands.add(item.brand));
  });
  
  const brands = Array.from(allBrands);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 animate-slide-up">
      <div className="container max-w-screen-xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Compare Medicines ({medicines.length})</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left min-w-[150px]">Medicine</th>
                <th className="border p-2 text-left">Composition</th>
                <th className="border p-2 text-left">Manufacturer</th>
                <th className="border p-2 text-left">Price</th>
                {brands.map(brand => (
                  <th key={brand} className="border p-2 text-left">{brand}</th>
                ))}
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map(medicine => {
                const availability = getMedicineAvailability(medicine);
                return (
                  <tr key={medicine.id} className="hover:bg-gray-50">
                    <td className="border p-2 font-medium">{medicine.name}</td>
                    <td className="border p-2">{medicine.composition}</td>
                    <td className="border p-2">{medicine.manufacturer}</td>
                    <td className="border p-2 font-medium">₹{medicine.price.toFixed(2)}</td>
                    
                    {brands.map(brand => {
                      const brandData = availability.find(item => item.brand === brand);
                      return (
                        <td key={brand} className="border p-2">
                          {brandData ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                {brandData.available ? (
                                  <Check size={16} className="text-green-500" />
                                ) : (
                                  <X size={16} className="text-red-500" />
                                )}
                                <span className={brandData.available ? 'text-green-700' : 'text-red-600'}>
                                  {brandData.available ? 'Available' : 'Not available'}
                                </span>
                              </div>
                              {brandData.available && (
                                <div className="mt-1">
                                  <span className="font-medium">₹{brandData.price.toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </td>
                      );
                    })}
                    
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => onRemove(medicine.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicineCompare;
