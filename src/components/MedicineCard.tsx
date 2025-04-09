
import React, { useState } from "react";
import { 
  Pill, Shield, BadgeIndianRupee, Info, ExternalLink, 
  ChevronDown, ChevronUp, FileText 
} from "lucide-react";
import { Medicine } from "../types/medicine";
import { getMedicineAvailability } from "../utils/medicineMappers";

interface MedicineCardProps {
  medicine: Medicine;
  isAlternative?: boolean;
  onCompare?: (medicine: Medicine) => void;
  isCompared?: boolean;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ 
  medicine, 
  isAlternative = false,
  onCompare,
  isCompared = false
}) => {
  const [showAvailability, setShowAvailability] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showSideEffects, setShowSideEffects] = useState(false);
  const availability = getMedicineAvailability(medicine);
  
  const toggleAvailability = () => {
    setShowAvailability(prev => !prev);
  };

  const toggleDescription = () => {
    setShowDescription(prev => !prev);
  };

  const toggleSideEffects = () => {
    setShowSideEffects(prev => !prev);
  };
  
  return (
    <div 
      className={`
        bg-white rounded-xl overflow-hidden border shadow-sm card-hover-effect transition-all
        ${isAlternative ? "border-l-4 border-l-medcyan-500" : ""}
        ${isCompared ? "border-2 border-medblue-500 shadow-md" : ""}
      `}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold tracking-tight">{medicine.name}</h3>
          <span className="pill bg-medblue-50 text-medblue-700 flex items-center gap-1">
            <BadgeIndianRupee className="h-3 w-3" />
            {medicine.price.toFixed(2)}
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
            <BadgeIndianRupee className="h-4 w-4 text-medcyan-500" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Dosage:</span> {medicine.dosage}
            </p>
          </div>
        </div>
      </div>
      
      {/* Description toggle */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <button 
          onClick={toggleDescription} 
          className="flex justify-between items-center w-full text-sm text-medblue-600 font-medium"
        >
          <span className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            {showDescription ? 'Hide description' : 'Show description'}
          </span>
          {showDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showDescription && (
          <div className="mt-3 animate-fade-in">
            <p className="text-sm text-gray-600">{medicine.description}</p>
          </div>
        )}
      </div>
      
      {/* Side Effects toggle */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <button 
          onClick={toggleSideEffects} 
          className="flex justify-between items-center w-full text-sm text-medblue-600 font-medium"
        >
          <span className="flex items-center gap-2">
            <Info className="h-3.5 w-3.5" />
            {showSideEffects ? 'Hide side effects' : 'Show side effects'}
          </span>
          {showSideEffects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showSideEffects && (
          <div className="mt-3 animate-fade-in">
            <p className="text-sm text-gray-600">{medicine.sideEffects}</p>
          </div>
        )}
      </div>
      
      {/* Availability toggle */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <button 
          onClick={toggleAvailability} 
          className="flex justify-between items-center w-full text-sm text-medblue-600 font-medium"
        >
          <span className="flex items-center gap-2">
            <Info className="h-3.5 w-3.5" />
            {showAvailability ? 'Hide availability' : 'Show availability'}
          </span>
          {showAvailability ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showAvailability && (
          <div className="mt-3 space-y-2 animate-fade-in">
            <h4 className="text-xs font-semibold uppercase text-gray-500">Available at</h4>
            {availability.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm font-medium">{item.brand}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium flex items-center">
                    <BadgeIndianRupee className="h-3 w-3 mr-0.5" />
                    {item.price.toFixed(2)}
                  </span>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-gray-100 px-5 py-3 flex justify-end items-center">
        <button 
          onClick={() => onCompare && onCompare(medicine)}
          className={`
            text-xs font-medium rounded-full px-3 py-1 transition-colors
            ${isCompared 
              ? "bg-medcyan-100 text-medcyan-800 hover:bg-medcyan-200"
              : "bg-medblue-500 hover:bg-medblue-600 text-white"
            }
          `}
        >
          {isCompared ? "Remove from comparison" : "Compare"}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
