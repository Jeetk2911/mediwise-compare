
import { Medicine } from "../types/medicine";

// Sample data to use when no medicines are returned from the database
export const sampleMedicines: Medicine[] = [
  {
    id: "sample1",
    name: "Paracetamol 500mg",
    composition: "Paracetamol",
    price: 50,
    manufacturer: "GSK Pharma",
    dosage: "As directed by physician",
    description: "Paracetamol 500mg is commonly used to treat pain and fever in adults and children.",
    sideEffects: "Side effects are rare but may include nausea, rash, or liver problems with prolonged use.",
    popularity: 95
  },
  {
    id: "sample2",
    name: "Ibuprofen 400mg",
    composition: "Ibuprofen",
    price: 65.5,
    manufacturer: "Sun Pharmaceuticals",
    dosage: "As directed by physician",
    description: "Ibuprofen 400mg is a nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce inflammation, and lower fever.",
    sideEffects: "May cause stomach pain, heartburn, nausea, headache, or dizziness.",
    popularity: 88
  },
  {
    id: "sample3",
    name: "Amoxicillin 250mg",
    composition: "Amoxicillin",
    price: 120.75,
    manufacturer: "Cipla Ltd",
    dosage: "As directed by physician",
    description: "Amoxicillin 250mg is an antibiotic used to treat various bacterial infections.",
    sideEffects: "May cause diarrhea, stomach upset, or allergic reactions.",
    popularity: 85
  },
  {
    id: "sample4",
    name: "Azithromycin 500mg",
    composition: "Azithromycin",
    price: 180.25,
    manufacturer: "Mankind Pharma",
    dosage: "As directed by physician",
    description: "Azithromycin 500mg is an antibiotic used to treat various bacterial infections including respiratory infections.",
    sideEffects: "May cause diarrhea, nausea, abdominal pain, or vomiting.",
    popularity: 82
  },
  {
    id: "sample5",
    name: "Cetirizine 10mg",
    composition: "Cetirizine Hydrochloride",
    price: 35.5,
    manufacturer: "Dr Reddy's Laboratories",
    dosage: "As directed by physician",
    description: "Cetirizine 10mg is an antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching, and sneezing.",
    sideEffects: "May cause drowsiness, dry mouth, or headache.",
    popularity: 79
  },
  {
    id: "sample6",
    name: "Montelukast 10mg",
    composition: "Montelukast Sodium",
    price: 145.8,
    manufacturer: "Lupin Limited",
    dosage: "As directed by physician",
    description: "Montelukast 10mg is used to prevent and treat symptoms of asthma and allergies.",
    sideEffects: "May cause headache, stomach pain, or in rare cases, mood changes.",
    popularity: 76
  }
];
