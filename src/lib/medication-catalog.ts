// Curated quick-pick list of medications, all using the same verified RxNorm codes
// already present in the seeded pulmonology patient data. Doctors can also type a
// free-text medication name for anything not in this list (creates a text-only
// medicationCodeableConcept — still a valid FHIR MedicationRequest, just uncoded).

export interface CatalogMedication {
  rxcui: string;
  display: string;
  defaultDosage: string;
}

export const MEDICATION_CATALOG: CatalogMedication[] = [
  { rxcui: "2123111", display: "Albuterol HFA 90mcg inhaler (rescue)", defaultDosage: "Inhale 2 puffs every 4-6 hours as needed" },
  { rxcui: "966529", display: "Budesonide (Pulmicort) inhaled", defaultDosage: "Inhale as directed twice daily" },
  { rxcui: "896184", display: "Fluticasone/Salmeterol (Advair) 250/50 Diskus", defaultDosage: "Inhale 1 puff by mouth twice daily" },
  { rxcui: "1246306", display: "Budesonide/Formoterol (Symbicort) 160/4.5", defaultDosage: "Inhale 2 puffs by mouth twice daily" },
  { rxcui: "1246315", display: "Budesonide/Formoterol (Symbicort) 80/4.5", defaultDosage: "Inhale 2 puffs by mouth twice daily" },
  { rxcui: "749762", display: "Montelukast 10mg tablet", defaultDosage: "Take 1 tablet by mouth nightly" },
  { rxcui: "198145", display: "Prednisone 10mg tablet (burst)", defaultDosage: "Take 5 tablets (50mg) by mouth once daily for 5 days" },
  { rxcui: "580261", display: "Tiotropium (Spiriva) HandiHaler", defaultDosage: "Inhale 1 capsule once daily" },
  { rxcui: "1651266", display: "Olodaterol/Tiotropium (Stiolto) Respimat", defaultDosage: "Inhale 2 puffs once daily" },
  { rxcui: "308460", display: "Azithromycin 250mg tablet", defaultDosage: "Take as directed for acute exacerbation" },
  { rxcui: "1657212", display: "Omalizumab (Xolair) injection", defaultDosage: "225 mg subcutaneously every 2 weeks" },
];
