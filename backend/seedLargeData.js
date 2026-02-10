require("dotenv").config();
const mongoose = require("mongoose");
const Medicine = require("./models/Medicine"); // Ensure path is correct

// --- 1. Master Data Lists (Real Real-world Data) ---
const manufacturers = [
  "Sun Pharma", "Cipla", "Dr. Reddy's", "GSK", "Pfizer", "Abbott", "Alkem", 
  "Lupin", "Torrent Pharma", "Zydus Cadila", "Mankind", "Glenmark", 
  "Intas", "Biocon", "Sanofi India", "Novartis", "Alembic", "Wockhardt"
];

const drugData = {
  Tablet: [
    "Paracetamol 500mg", "Pantoprazole 40mg", "Metformin 500mg", "Amoxicillin 625mg", 
    "Azithromycin 500mg", "Ciprofloxacin 500mg", "Ibuprofen 400mg", "Diclofenac 50mg", 
    "Losartan 50mg", "Atorvastatin 10mg", "Amlodipine 5mg", "Telmisartan 40mg", 
    "Enalapril 5mg", "Furosemide 40mg", "Ranitidine 150mg", "Cetirizine 10mg", 
    "Levocetirizine 5mg", "Montelukast 10mg", "Prednisolone 5mg", "Dexamethasone 0.5mg",
    "Aspirin 75mg", "Clopidogrel 75mg", "Rosuvastatin 10mg", "Glimepiride 1mg", 
    "Voglibose 0.2mg", "Teneligliptin 20mg", "Aceclofenac 100mg", "Tramadol 50mg",
    "Ofloxacin 200mg", "Levofloxacin 500mg", "Albendazole 400mg", "Fluconazole 150mg"
  ],
  Capsule: [
    "Omeprazole 20mg", "Lansoprazole 30mg", "Esomeprazole 40mg", "Rabeprazole 20mg", 
    "Itraconazole 100mg", "Fluconazole 150mg", "Doxycycline 100mg", "Tetracycline 500mg", 
    "Clindamycin 300mg", "Gabapentin 300mg", "Pregabalin 75mg", "Tramadol 50mg", 
    "Vitamin E 400mg", "B-Complex", "Lycopene with Multivitamins", "Carbonyl Iron",
    "Amoxicillin 250mg", "Cefixime 200mg", "Silodosin 8mg", "Tamsulosin 0.4mg",
    "Dutasteride 0.5mg", "Tacrolimus 1mg", "Cyclosporine 100mg", "Isotretinoin 20mg"
  ],
  Syrup: [
    "Dextromethorphan Hydrobromide", "Diphenhydramine HCL", "Ambroxol + Salbutamol", 
    "Guaifenesin Expectorant", "Paracetamol Suspension", "Ibuprofen Suspension", 
    "Mefenamic Acid Suspension", "Cetirizine Syrup", "Levocetirizine Syrup", 
    "Lactulose Solution", "Liquid Paraffin", "Disodium Hydrogen Citrate", 
    "Multivitamin Syrup", "Calcium + Vitamin D3", "Iron Tonic", "Zinc Sulphate", 
    "Digestive Enzyme", "Antacid Gel", "Sucralfate Suspension", "Ondansetron Syrup"
  ],
  Injection: [
    "Tetanus Toxoid", "Insulin Glargine", "Insulin Regular", "Diclofenac Sodium", 
    "Pantoprazole IV", "Ondansetron 2ml", "Ranitidine 2ml", "Metoclopramide", 
    "Tramadol", "Paracetamol IV", "Ceftriaxone 1gm", "Piperacillin Tazobactam", 
    "Amikacin 500mg", "Gentamicin 80mg", "Meropenem 1gm", "Vancomycin 500mg", 
    "Hydrocortisone 100mg", "Dexamethasone 4mg", "Avil (Pheniramine)", "Adrenaline"
  ],
  Ointment: [
    "Povidone Iodine", "Silver Sulfadiazine", "Diclofenac Gel", "Luliconazole Cream", 
    "Ketoconazole Cream", "Clotrimazole Cream", "Miconazole Cream", "Betamethasone Valerate", 
    "Clobetasol Propionate", "Mometasone Furoate", "Fusidic Acid", "Mupirocin", 
    "Neomycin + Bacitracin", "Permethrin Cream", "Acyclovir Cream", "Tretinoin Gel", 
    "Adapalene Gel", "Benzoyl Peroxide", "Hydroquinone Cream", "Lignocaine Gel"
  ],
  Drops: [
    "Ciprofloxacin Eye Drops", "Moxifloxacin Eye Drops", "Tobramycin Eye Drops", 
    "Carboxymethylcellulose", "Polyvinyl Alcohol", "Timolol Maleate", "Brimonidine Tartrate", 
    "Latanoprost", "Cyclopentolate", "Tropicamide", "Xylometazoline Nasal", 
    "Oxymetazoline Nasal", "Saline Nasal Drops", "Clotrimazole Ear Drops", 
    "Ofloxacin Ear Drops", "Wax Solvent Ear Drops", "Vitamin D3 Drops (Kids)", 
    "Multivitamin Drops (Kids)", "Colic Aid Drops", "Ondansetron Drops"
  ],
  Inhaler: [
    "Salbutamol Inhaler", "Levosalbutamol Inhaler", "Ipratropium Bromide", 
    "Tiotropium Rotacaps", "Budesonide Inhaler", "Fluticasone Inhaler", 
    "Beclomethasone Inhaler", "Formoterol + Budesonide", "Salmeterol + Fluticasone", 
    "Cipla Rotahaler", "Lupinhaler Device", "Zerostat Spacer", "Fluticasone Nasal Spray", 
    "Mometasone Nasal Spray", "Azelastine Nasal Spray", "Oxymetazoline Spray"
  ],
  Surgical: [
    "Sterile Cotton Roll 500g", "Sterile Cotton Roll 100g", "Absorbent Gauze", 
    "Roller Bandage 4 inch", "Roller Bandage 6 inch", "Crepe Bandage", 
    "Surgical Tape 1 inch", "Surgical Tape 2 inch", "Disposable Syringe 2ml", 
    "Disposable Syringe 5ml", "Disposable Syringe 10ml", "Insulin Syringe", 
    "IV Cannula 18G", "IV Cannula 20G", "IV Cannula 22G", "IV Set (Infusion Set)", 
    "Blood Transfusion Set", "Foley Catheter", "Urine Collection Bag", "Surgical Gloves Pair"
  ],
  Device: [
    "Digital Thermometer", "Mercury Thermometer", "Digital BP Monitor", "Aneroid BP Monitor", 
    "Stethoscope", "Pulse Oximeter", "Glucometer Device", "Glucometer Strips (50s)", 
    "Glucometer Lancets", "Nebulizer Machine", "Nebulizer Mask (Adult)", "Nebulizer Mask (Child)", 
    "Hot Water Bag", "Ice Bag", "Vaporizer / Steamer", "Weighing Scale", 
    "Electric Heating Pad", "Orthopedic Knee Cap", "Lumbar Belt", "Cervical Collar"
  ],
  "Personal Care": [
    "Hand Sanitizer 100ml", "Hand Sanitizer 500ml", "Surgical Face Mask 3 Ply", 
    "N95 Face Mask", "Antiseptic Liquid 100ml", "Antiseptic Liquid 500ml", 
    "Sanitary Pads (Regular)", "Sanitary Pads (XL)", "Adult Diapers (M)", "Adult Diapers (L)", 
    "Baby Diapers (S)", "Baby Diapers (M)", "Baby Diapers (L)", "Baby Wipes", 
    "Medicated Soap", "Anti-Fungal Powder", "Prickly Heat Powder", "Mosquito Repellent Cream", 
    "Sunscreen SPF 30", "Sunscreen SPF 50"
  ],
  General: [
    "ORS Sachet (Orange)", "ORS Sachet (Lemon)", "Glucose Powder 100g", "Glucose Powder 500g", 
    "Protein Powder 200g", "Protein Powder 500g", "Vicks Vaporub 10g", "Vicks Vaporub 50g", 
    "Iodex Balm", "Zandu Balm", "Tiger Balm", "Amrutanjan", "Isabgol Husk", 
    "Eno Sachet", "Gas-O-Fast", "Hajmola", "Strepsils Lozenges", "Vicks Cough Drops", 
    "Electral Powder", "Enerzal"
  ]
};

// --- 2. Helper Functions ---
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomStock = () => Math.floor(Math.random() * 100) + 10; // Stock between 10 and 110

const generateMedicines = () => {
  const allMedicines = [];
  const categories = Object.keys(drugData);

  categories.forEach((category) => {
    const baseNames = drugData[category];
    
    // Generate exactly 50 items per category
    for (let i = 0; i < 50; i++) {
      // Pick a base name. If we run out of unique names, append a variant number.
      let baseName = baseNames[i % baseNames.length];
      let name = i < baseNames.length ? baseName : `${baseName} (Pack ${Math.floor(i / baseNames.length) + 1})`;
      
      let manufacturer = getRandomItem(manufacturers);
      let price = getRandomPrice(20, 500); // Random price between 20 and 500
      
      // Determine Unit based on category
      let unit = "Pack";
      if (category === "Tablet" || category === "Capsule") unit = "Strip";
      if (category === "Syrup" || category === "Drops" || category === "Personal Care") unit = "Bottle";
      if (category === "Injection") unit = "Vial";
      if (category === "Ointment") unit = "Tube";
      if (category === "Device") unit = "Unit";

      allMedicines.push({
        name: name,
        manufacturer: manufacturer,
        category: category,
        price: price,
        countInStock: getRandomStock(),
        description: `${category} used for medical treatment. Manufactured by ${manufacturer}.`,
        image: `/uploads/medicines/${category.toLowerCase()}_generic.jpg`, // Ensure you have placeholder images or generic ones
        baseUnit: unit,
        prescriptionRequired: ["Injection", "Tablet", "Capsule"].includes(category) && Math.random() > 0.5, // Randomly require Rx for some
      });
    }
  });

  return allMedicines;
};

// --- 3. Database Seed Logic ---
const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔥 Connected to MongoDB...");

    // Optional: Clear existing data to avoid duplicates
    // await Medicine.deleteMany();
    // console.log("🗑️  Existing medicines removed.");

    const medicines = generateMedicines();
    await Medicine.insertMany(medicines);
    
    console.log(`✅ Successfully Imported ${medicines.length} Medicines!`);
    console.log(`   (50 items for ${Object.keys(drugData).length} categories)`);

    process.exit();
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

importData();