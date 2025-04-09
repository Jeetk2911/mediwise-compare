
import { Medicine } from "../types/medicine";

// Helper function to extract unique values from an array of medicines
export const extractUniqueValues = (
  medicines: Medicine[], 
  key: keyof Medicine
): string[] => {
  return Array.from(
    new Set(
      medicines
        .filter(med => med[key])
        .map(med => med[key] as string)
    )
  );
};

// Helper function for sorting medicines
export const applySorting = (medicines: Medicine[], sort: string): Medicine[] => {
  const sortedMedicines = [...medicines]; // Create a copy to avoid mutating the original array
  
  switch (sort) {
    case 'name-asc':
      sortedMedicines.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sortedMedicines.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price-asc':
      sortedMedicines.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedMedicines.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }
  
  return sortedMedicines;
};
