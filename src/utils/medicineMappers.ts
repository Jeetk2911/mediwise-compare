import { Medicine, BrandAvailability } from "../types/medicine";
import type { Database } from "../integrations/supabase/types";

type SupabaseMedicine = Database['public']['Tables']['medicines']['Row'];

export const mapSupabaseMedicine = (item: SupabaseMedicine): Medicine => {
  // Extract compositions, handle null values
  const composition1 = item.short_composition1 || '';
  const composition2 = item.short_composition2 || '';
  
  // Create formatted composition string
  const composition = composition1 + (composition2 ? `, ${composition2}` : '');
  
  return {
    id: item.med_id.toString(),
    name: item.name || 'Unknown Medicine',
    composition: composition,
    price: item['price(₹)'] || 0,
    manufacturer: item.manufacturer || 'Unknown Manufacturer',
    dosage: "As directed by physician", // Default dosage as it's not in the Supabase schema
    description: `${item.name} contains ${composition1}${composition2 ? ` and ${composition2}` : ''} and is commonly prescribed for various conditions.`,
    sideEffects: "Common side effects may include nausea, headache, dizziness, or stomach upset. Please consult your doctor for complete information.",
    popularity: Math.floor(Math.random() * 100), // Mock popularity score for alternatives
  };
};

export const getMedicineAvailability = (medicine: Medicine): BrandAvailability[] => {
  // This is mock data - in a real app, this would come from APIs
  const basePrice = medicine.price;
  
  // Make sure we have a valid price to calculate from
  const validBasePrice = basePrice > 0 ? basePrice : 100;
  
  return [
    {
      brand: "1mg",
      price: Math.round((validBasePrice + (Math.random() * 5 - 2)) * 100) / 100, // Small variation in price
      available: Math.random() > 0.2, // 80% chance of being available
      url: `https://www.1mg.com/search/all?name=${encodeURIComponent(medicine.name)}`
    },
    {
      brand: "PharmEasy",
      price: Math.round((validBasePrice + (Math.random() * 6 - 3)) * 100) / 100,
      available: Math.random() > 0.3,
      url: `https://pharmeasy.in/search/all?name=${encodeURIComponent(medicine.name)}`
    },
    {
      brand: "Netmeds",
      price: Math.round((validBasePrice + (Math.random() * 4 - 2)) * 100) / 100,
      available: Math.random() > 0.25,
      url: `https://www.netmeds.com/catalogsearch/result?q=${encodeURIComponent(medicine.name)}`
    },
    {
      brand: "Apollo Pharmacy",
      price: Math.round((validBasePrice + (Math.random() * 7 - 3)) * 100) / 100,
      available: Math.random() > 0.15,
      url: `https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(medicine.name)}`
    },
    {
      brand: "MedPlus Mart",
      price: Math.round((validBasePrice + (Math.random() * 5 - 2.5)) * 100) / 100,
      available: Math.random() > 0.35,
      url: `https://www.medplusmart.com/searchProduct?productName=${encodeURIComponent(medicine.name)}`
    }
  ];
};

// Updated function to find alternative medicines based on the Python algorithm
export const findAlternativeMedicines = (
  medicine: Medicine,
  allMedicines: Medicine[]
): Medicine[] => {
  if (!medicine || !allMedicines.length) return [];
  
  console.log(`Finding alternatives for: ${medicine.name} with composition: ${medicine.composition}`);
  
  // Get the composition parts (might be multiple ingredients)
  const compositionParts = medicine.composition.split(', ').map(part => part.trim().toLowerCase());
  
  // Filter medicines with any matching composition part but different from the current medicine
  const sameComposition = allMedicines.filter(m => {
    // Skip the original medicine
    if (m.id === medicine.id) return false;
    
    // Check if any part of the composition matches
    const mCompositionParts = m.composition.split(', ').map(part => part.trim().toLowerCase());
    return compositionParts.some(comp => 
      mCompositionParts.some(mComp => mComp === comp)
    );
  });
  
  console.log(`Found ${sameComposition.length} medicines with matching composition`);
  
  // Sort by price in descending order (as specified in the Python code)
  const sortedAlternatives = sameComposition.sort((a, b) => b.price - a.price);
  
  // Return top 5 alternatives
  return sortedAlternatives.slice(0, 5);
};
