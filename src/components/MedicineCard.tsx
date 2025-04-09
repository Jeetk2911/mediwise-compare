
import React from "react";
import { Pill, Shield, DollarSign, Info } from "lucide-react";

export interface Medicine {
  id: string;
  name: string;
  composition: string;
  price: number;
  manufacturer: string;
  dosage: string;
  image?: string;
}

interface MedicineCardProps {
  medicine: Medicine;
  isAlternative?: boolean;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, isAlternative = false }) => {
  return (
    <div 
      className={`
        bg-white rounded-xl overflow-hidden border shadow-sm card-hover-effect
        ${isAlternative ? "border-l-4 border-l-medcyan-500" : ""}
      `}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold tracking-tight">{medicine.name}</h3>
          <span className="pill bg-medblue-50 text-medblue-700">
            ${medicine.price.toFixed(2)}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-medcyan-500" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Composition:</span> {medicine.composition}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-medcyan-500" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Manufacturer:</span> {medicine.manufacturer}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-medcyan-500" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Dosage:</span> {medicine.dosage}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
        <button className="text-xs font-medium text-medblue-600 hover:text-medblue-800 flex items-center gap-1 transition-colors">
          <Info className="h-3.5 w-3.5" />
          More details
        </button>
        <button className="text-xs bg-medblue-500 hover:bg-medblue-600 text-white font-medium rounded-full px-3 py-1 transition-colors">
          Compare
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
