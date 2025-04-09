
import { Medicine, BrandAvailability } from "../types/medicine";
import type { Database } from "../integrations/supabase/types";

type SupabaseMedicine = Database['public']['Tables']['medicines']['Row'];

export const mapSupabaseMedicine = (item: SupabaseMedicine): Medicine => ({
  id: item.med_id.toString(),
  name: item.name || 'Unknown Medicine',
  composition: item.short_composition1 + (item.short_composition2 ? `, ${item.short_composition2}` : ''),
  price: item['price(₹)'] || 0,
  manufacturer: item.manufacturer || 'Unknown Manufacturer',
  dosage: "As directed by physician", // Default dosage as it's not in the Supabase schema
  // Added mock data for new fields
  image: `/images/medicine-${Math.floor(Math.random() * 5) + 1}.jpg`, // Mock images
  description: `${item.name} contains ${item.short_composition1}${item.short_composition2 ? ` and ${item.short_composition2}` : ''} and is commonly prescribed for various conditions.`,
  sideEffects: "Common side effects may include nausea, headache, dizziness, or stomach upset. Please consult your doctor for complete information.",
  popularity: Math.floor(Math.random() * 100), // Mock popularity score for alternatives
});

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

// New function to find alternative medicines based on composition
export const findAlternativeMedicines = (
  medicine: Medicine,
  allMedicines: Medicine[]
): Medicine[] => {
  if (!medicine || !allMedicines.length) return [];
  
  // Filter medicines with the same composition but different from the current medicine
  const sameComposition = allMedicines.filter(
    m => m.composition === medicine.composition && m.id !== medicine.id
  );
  
  // Sort by popularity (descending)
  const sortedAlternatives = sameComposition.sort((a, b) => 
    (b.popularity || 0) - (a.popularity || 0)
  );
  
  // Return top 5 alternatives
  return sortedAlternatives.slice(0, 5);
};
