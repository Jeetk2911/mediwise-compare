
import { Medicine } from "../types/medicine";
import type { Database } from "../integrations/supabase/types";

type SupabaseMedicine = Database['public']['Tables']['medicines']['Row'];

export const mapSupabaseMedicine = (item: SupabaseMedicine): Medicine => ({
  id: item.med_id.toString(),
  name: item.name || 'Unknown Medicine',
  composition: item.short_composition1 + (item.short_composition2 ? `, ${item.short_composition2}` : ''),
  price: item['price(₹)'] || 0,
  manufacturer: item.manufacturer || 'Unknown Manufacturer',
  dosage: "As directed by physician", // Default dosage as it's not in the Supabase schema
});
