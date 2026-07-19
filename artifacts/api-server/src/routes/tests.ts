import { Router } from "express";

const router = Router();

// Comprehensive pathology test catalog — MaxLab pricing
const TESTS = [
  // ─── BLOOD / HAEMATOLOGY ───
  { id: "cbc", name: "Complete Blood Count (CBC)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures red blood cells, white blood cells, haemoglobin, and platelets.", fastingRequired: false, popular: true, keywords: ["haemogram", "haemoglobin", "wbc", "rbc", "platelets", "blood count"] },
  { id: "cbc-diff", name: "CBC with Differential Count", category: "blood", price: 250, mrp: 400, turnaround: "4-6 hours", description: "Complete blood count with detailed white cell differential.", fastingRequired: false, popular: false, keywords: ["differential", "neutrophil", "lymphocyte", "monocyte", "eosinophil"] },
  { id: "esr", name: "ESR (Erythrocyte Sedimentation Rate)", category: "blood", price: 100, mrp: 180, turnaround: "2-4 hours", description: "Inflammation marker — elevated in infections, arthritis, and autoimmune diseases.", fastingRequired: false, popular: false, keywords: ["sedimentation", "inflammation"] },
  { id: "peripheral-smear", name: "Peripheral Blood Smear", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Microscopic examination of blood cells for abnormalities.", fastingRequired: false, popular: false, keywords: ["smear", "morphology", "malaria", "blood film"] },
  { id: "retic-count", name: "Reticulocyte Count", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures immature red blood cells — assesses bone marrow activity.", fastingRequired: false, popular: false, keywords: ["reticulocyte", "anaemia", "bone marrow"] },

  // ─── BLOOD SUGAR / DIABETES ───
  { id: "bsugar-fasting", name: "Blood Sugar (Fasting)", category: "blood", price: 100, mrp: 180, turnaround: "2-4 hours", description: "Measures glucose after 8-hour fast. Screens for diabetes.", fastingRequired: true, popular: true, keywords: ["glucose", "fasting", "FBS", "diabetes"] },
  { id: "bsugar-pp", name: "Blood Sugar (Post Prandial / PP)", category: "blood", price: 100, mrp: 180, turnaround: "2-4 hours", description: "Blood sugar measured 2 hours after a meal.", fastingRequired: false, popular: false, keywords: ["PP", "post prandial", "post meal", "glucose"] },
  { id: "bsugar-random", name: "Blood Sugar (Random)", category: "blood", price: 80, mrp: 150, turnaround: "1-2 hours", description: "Random blood glucose — can be done at any time.", fastingRequired: false, popular: false, keywords: ["random", "glucose", "sugar"] },
  { id: "hba1c", name: "HbA1c (Glycated Haemoglobin)", category: "blood", price: 400, mrp: 600, turnaround: "6-8 hours", description: "3-month average blood sugar — key for diabetes monitoring.", fastingRequired: false, popular: true, keywords: ["HbA1c", "glycated", "haemoglobin", "diabetes", "A1c"] },
  { id: "insulin-fasting", name: "Insulin (Fasting)", category: "blood", price: 700, mrp: 1000, turnaround: "24 hours", description: "Measures fasting insulin — evaluates insulin resistance.", fastingRequired: true, popular: false, keywords: ["insulin", "HOMA-IR", "resistance"] },
  { id: "c-peptide", name: "C-Peptide", category: "blood", price: 900, mrp: 1400, turnaround: "24 hours", description: "Assesses beta-cell function and distinguishes Type 1 from Type 2 diabetes.", fastingRequired: true, popular: false, keywords: ["c-peptide", "diabetes type 1", "insulin"] },

  // ─── THYROID ───
  { id: "tsh", name: "TSH (Thyroid Stimulating Hormone)", category: "blood", price: 300, mrp: 500, turnaround: "4-6 hours", description: "Primary screening test for thyroid disorders.", fastingRequired: false, popular: true, keywords: ["TSH", "thyroid", "hypothyroid", "hyperthyroid"] },
  { id: "t3", name: "T3 (Triiodothyronine)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures T3 thyroid hormone.", fastingRequired: false, popular: false, keywords: ["T3", "triiodothyronine", "thyroid"] },
  { id: "t4", name: "T4 (Thyroxine)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures T4 thyroid hormone.", fastingRequired: false, popular: false, keywords: ["T4", "thyroxine", "thyroid"] },
  { id: "thyroid-profile", name: "Thyroid Profile (T3, T4, TSH)", category: "blood", price: 600, mrp: 950, turnaround: "6-8 hours", description: "Comprehensive thyroid function — T3, T4 and TSH in one panel.", fastingRequired: false, popular: true, keywords: ["thyroid profile", "T3", "T4", "TSH"] },
  { id: "thyroid-advance", name: "Thyroid Profile Advance (T3, T4, TSH, Anti-TPO)", category: "blood", price: 1999, mrp: 2999, turnaround: "24 hours", description: "Extended thyroid panel including anti-thyroid peroxidase antibody.", fastingRequired: false, popular: false, keywords: ["anti-TPO", "thyroid antibody", "autoimmune thyroid"] },
  { id: "anti-tpo", name: "Anti-TPO Antibody", category: "blood", price: 800, mrp: 1200, turnaround: "24 hours", description: "Detects autoimmune thyroid disease (Hashimoto's).", fastingRequired: false, popular: false, keywords: ["anti-TPO", "Hashimoto", "autoimmune"] },
  { id: "anti-tg", name: "Anti-Thyroglobulin Antibody", category: "blood", price: 800, mrp: 1200, turnaround: "24 hours", description: "Detects thyroglobulin antibodies — used in thyroid cancer monitoring.", fastingRequired: false, popular: false, keywords: ["anti-TG", "thyroglobulin", "cancer"] },

  // ─── VITAMINS & MINERALS ───
  { id: "vitd", name: "Vitamin D (25-OH)", category: "blood", price: 900, mrp: 1400, turnaround: "24 hours", description: "Checks Vitamin D levels — essential for bones, immunity and mood.", fastingRequired: false, popular: true, keywords: ["vitamin D", "25-OH", "cholecalciferol"] },
  { id: "vitb12", name: "Vitamin B12 (Cyanocobalamin)", category: "blood", price: 600, mrp: 950, turnaround: "24 hours", description: "Measures Vitamin B12 — vital for nerve function and RBC production.", fastingRequired: false, popular: true, keywords: ["vitamin B12", "cobalamin", "B12"] },
  { id: "folate", name: "Folate / Vitamin B9 (Serum)", category: "blood", price: 700, mrp: 1100, turnaround: "24 hours", description: "Measures folic acid — important for pregnancy and cell growth.", fastingRequired: false, popular: false, keywords: ["folate", "folic acid", "vitamin B9"] },
  { id: "calcium", name: "Calcium (Serum)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures serum calcium — for bone health and parathyroid evaluation.", fastingRequired: false, popular: false, keywords: ["calcium", "bone", "hypercalcemia"] },
  { id: "phosphorus", name: "Phosphorus (Serum)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures phosphorus — evaluated alongside calcium.", fastingRequired: false, popular: false, keywords: ["phosphorus", "phosphate", "bone"] },
  { id: "magnesium", name: "Magnesium (Serum)", category: "blood", price: 300, mrp: 500, turnaround: "4-6 hours", description: "Measures magnesium — important for muscle and nerve function.", fastingRequired: false, popular: false, keywords: ["magnesium", "mg"] },

  // ─── IRON STUDIES ───
  { id: "iron-serum", name: "Iron (Serum)", category: "blood", price: 300, mrp: 500, turnaround: "4-6 hours", description: "Measures circulating iron in blood.", fastingRequired: false, popular: false, keywords: ["iron", "anaemia", "Fe"] },
  { id: "tibc", name: "TIBC (Total Iron Binding Capacity)", category: "blood", price: 300, mrp: 500, turnaround: "4-6 hours", description: "Assesses the capacity of blood to bind iron.", fastingRequired: false, popular: false, keywords: ["TIBC", "iron binding", "transferrin"] },
  { id: "ferritin", name: "Ferritin (Serum)", category: "blood", price: 600, mrp: 950, turnaround: "24 hours", description: "Measures iron stored in the body — best marker for iron-deficiency anaemia.", fastingRequired: false, popular: false, keywords: ["ferritin", "iron store", "anaemia"] },
  { id: "iron-studies", name: "Iron Studies (Iron, TIBC, Ferritin)", category: "blood", price: 900, mrp: 1500, turnaround: "24 hours", description: "Complete iron panel — serum iron, TIBC, and ferritin.", fastingRequired: false, popular: false, keywords: ["iron studies", "TIBC", "ferritin", "anaemia"] },

  // ─── LIPIDS ───
  { id: "lipid", name: "Lipid Profile", category: "blood", price: 500, mrp: 800, turnaround: "4-6 hours", description: "Cholesterol and triglycerides panel — includes HDL, LDL, VLDL.", fastingRequired: true, popular: true, keywords: ["lipid", "cholesterol", "triglycerides", "HDL", "LDL"] },
  { id: "cholesterol", name: "Total Cholesterol", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures total cholesterol.", fastingRequired: true, popular: false, keywords: ["cholesterol", "total cholesterol"] },
  { id: "hdl", name: "HDL Cholesterol", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Good cholesterol — high levels are protective.", fastingRequired: true, popular: false, keywords: ["HDL", "good cholesterol"] },
  { id: "ldl", name: "LDL Cholesterol", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Bad cholesterol — elevated levels increase heart disease risk.", fastingRequired: true, popular: false, keywords: ["LDL", "bad cholesterol"] },
  { id: "triglycerides", name: "Triglycerides", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures fat (triglycerides) in the blood.", fastingRequired: true, popular: false, keywords: ["triglycerides", "TG", "fat"] },

  // ─── LIVER FUNCTION ───
  { id: "lft", name: "Liver Function Test (LFT)", category: "blood", price: 600, mrp: 950, turnaround: "6-8 hours", description: "Full liver panel — ALT, AST, ALP, bilirubin, proteins.", fastingRequired: false, popular: true, keywords: ["LFT", "liver", "SGPT", "SGOT", "bilirubin"] },
  { id: "sgpt", name: "SGPT / ALT (Alanine Aminotransferase)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Liver enzyme — elevated in liver damage and hepatitis.", fastingRequired: false, popular: false, keywords: ["SGPT", "ALT", "liver enzyme"] },
  { id: "sgot", name: "SGOT / AST (Aspartate Aminotransferase)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Liver and heart enzyme marker.", fastingRequired: false, popular: false, keywords: ["SGOT", "AST", "liver"] },
  { id: "alp", name: "Alkaline Phosphatase (ALP)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Elevated in liver disease and bone disorders.", fastingRequired: false, popular: false, keywords: ["ALP", "alkaline phosphatase", "liver", "bone"] },
  { id: "bilirubin", name: "Bilirubin (Total, Direct, Indirect)", category: "blood", price: 250, mrp: 400, turnaround: "4-6 hours", description: "Measures bilirubin — elevated in jaundice and liver disease.", fastingRequired: false, popular: false, keywords: ["bilirubin", "jaundice", "liver"] },
  { id: "ggt", name: "GGT (Gamma Glutamyl Transferase)", category: "blood", price: 250, mrp: 400, turnaround: "4-6 hours", description: "Liver enzyme — sensitive marker for alcohol abuse and liver disease.", fastingRequired: false, popular: false, keywords: ["GGT", "gamma GT", "liver"] },

  // ─── KIDNEY FUNCTION ───
  { id: "kft", name: "Kidney Function Test (KFT / RFT)", category: "blood", price: 500, mrp: 800, turnaround: "6-8 hours", description: "Creatinine, urea, uric acid, BUN, and electrolytes panel.", fastingRequired: false, popular: true, keywords: ["KFT", "RFT", "kidney", "creatinine", "urea", "BUN"] },
  { id: "creatinine", name: "Creatinine (Serum)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Key marker for kidney function — elevated in kidney disease.", fastingRequired: false, popular: false, keywords: ["creatinine", "kidney"] },
  { id: "bun", name: "BUN (Blood Urea Nitrogen)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures urea nitrogen — indicator of kidney function.", fastingRequired: false, popular: false, keywords: ["BUN", "urea", "nitrogen", "kidney"] },
  { id: "uric-acid", name: "Uric Acid (Serum)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Measures uric acid — elevated in gout and kidney disease.", fastingRequired: false, popular: false, keywords: ["uric acid", "gout", "kidney"] },
  { id: "egfr", name: "eGFR (Estimated Glomerular Filtration Rate)", category: "blood", price: 300, mrp: 500, turnaround: "4-6 hours", description: "Estimates kidney filtration rate — key for CKD staging.", fastingRequired: false, popular: false, keywords: ["eGFR", "GFR", "kidney", "CKD"] },
  { id: "electrolytes", name: "Electrolytes (Sodium, Potassium, Chloride)", category: "blood", price: 500, mrp: 800, turnaround: "4-6 hours", description: "Measures electrolyte balance — critical for heart and kidney function.", fastingRequired: false, popular: false, keywords: ["electrolytes", "sodium", "potassium", "chloride", "Na", "K", "Cl"] },
  { id: "microalbumin-urine", name: "Microalbumin (Urine)", category: "blood", price: 400, mrp: 650, turnaround: "24 hours", description: "Early marker of kidney damage in diabetes.", fastingRequired: false, popular: false, keywords: ["microalbumin", "kidney", "diabetes", "albumin"] },

  // ─── URINE ───
  { id: "urine-routine", name: "Urine Routine & Microscopy", category: "blood", price: 120, mrp: 200, turnaround: "2-4 hours", description: "Complete urine analysis — colour, pH, glucose, protein, cells.", fastingRequired: false, popular: true, keywords: ["urine routine", "urine", "microscopy", "urinalysis"] },
  { id: "urine-culture", name: "Urine Culture & Sensitivity", category: "blood", price: 600, mrp: 950, turnaround: "48-72 hours", description: "Identifies bacteria causing UTI and appropriate antibiotics.", fastingRequired: false, popular: false, keywords: ["urine culture", "UTI", "sensitivity", "bacteria"] },
  { id: "urine-24hr-protein", name: "Urine 24-Hour Protein", category: "blood", price: 400, mrp: 650, turnaround: "24 hours", description: "Measures total protein excreted in 24 hours — kidney disease marker.", fastingRequired: false, popular: false, keywords: ["24 hour urine", "protein", "kidney"] },

  // ─── STOOL ───
  { id: "stool-routine", name: "Stool Routine & Microscopy", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Stool analysis for blood, parasites, bacteria, and mucus.", fastingRequired: false, popular: false, keywords: ["stool", "faeces", "microscopy", "parasites"] },
  { id: "stool-culture", name: "Stool Culture & Sensitivity", category: "blood", price: 500, mrp: 800, turnaround: "48-72 hours", description: "Identifies bacterial pathogens in stool.", fastingRequired: false, popular: false, keywords: ["stool culture", "bacteria", "sensitivity"] },
  { id: "h-pylori-stool", name: "H. pylori Antigen (Stool)", category: "blood", price: 600, mrp: 950, turnaround: "24 hours", description: "Non-invasive test to detect H. pylori infection causing peptic ulcers.", fastingRequired: false, popular: false, keywords: ["H pylori", "helicobacter", "ulcer", "stool antigen"] },

  // ─── INFLAMMATION / INFECTION MARKERS ───
  { id: "crp", name: "C-Reactive Protein (CRP)", category: "blood", price: 300, mrp: 500, turnaround: "4-6 hours", description: "Marker for acute inflammation and infection.", fastingRequired: false, popular: false, keywords: ["CRP", "C reactive protein", "inflammation"] },
  { id: "hs-crp", name: "hs-CRP (High-Sensitivity CRP)", category: "blood", price: 500, mrp: 800, turnaround: "24 hours", description: "High-sensitivity CRP — risk marker for cardiovascular disease.", fastingRequired: false, popular: false, keywords: ["hs-CRP", "high sensitivity", "cardiac risk", "inflammation"] },
  { id: "procalcitonin", name: "Procalcitonin (PCT)", category: "blood", price: 1500, mrp: 2200, turnaround: "24 hours", description: "Biomarker for bacterial infection severity — helps guide antibiotic therapy.", fastingRequired: false, popular: false, keywords: ["procalcitonin", "PCT", "sepsis", "infection"] },

  // ─── FEVER / TROPICAL INFECTIONS ───
  { id: "dengue-ns1", name: "Dengue NS1 Antigen", category: "blood", price: 600, mrp: 950, turnaround: "4-6 hours", description: "Detects dengue virus antigen in early phase of infection.", fastingRequired: false, popular: true, keywords: ["dengue", "NS1", "fever"] },
  { id: "dengue-antibody", name: "Dengue IgM / IgG Antibody", category: "blood", price: 600, mrp: 950, turnaround: "4-6 hours", description: "Detects dengue antibodies — used after day 4 of fever.", fastingRequired: false, popular: false, keywords: ["dengue", "IgM", "IgG", "antibody"] },
  { id: "dengue-panel", name: "Dengue Fever Panel (NS1 + IgM/IgG)", category: "blood", price: 1200, mrp: 1800, turnaround: "4-6 hours", description: "Complete dengue workup — NS1 antigen plus antibodies.", fastingRequired: false, popular: false, keywords: ["dengue panel", "NS1", "IgM", "IgG"] },
  { id: "malaria-antigen", name: "Malaria Antigen (RDT)", category: "blood", price: 300, mrp: 500, turnaround: "2-4 hours", description: "Rapid detection of Plasmodium falciparum and vivax.", fastingRequired: false, popular: false, keywords: ["malaria", "RDT", "plasmodium", "falciparum", "vivax"] },
  { id: "typhoid-widal", name: "Widal Test (Typhoid)", category: "blood", price: 200, mrp: 350, turnaround: "4-6 hours", description: "Detects Salmonella typhi antibodies — traditional typhoid test.", fastingRequired: false, popular: false, keywords: ["typhoid", "widal", "salmonella", "fever"] },
  { id: "typhoid-rapid", name: "Typhoid IgM (Rapid)", category: "blood", price: 400, mrp: 650, turnaround: "2-4 hours", description: "Rapid typhoid detection — more sensitive than Widal in early phase.", fastingRequired: false, popular: false, keywords: ["typhoid", "IgM", "rapid", "salmonella"] },
  { id: "covid-antigen", name: "COVID-19 Antigen Test (Rapid)", category: "blood", price: 300, mrp: 500, turnaround: "30 minutes", description: "Rapid antigen test for active COVID-19 infection.", fastingRequired: false, popular: false, keywords: ["COVID", "coronavirus", "antigen", "rapid test"] },
  { id: "covid-antibody", name: "COVID-19 IgG Antibody", category: "blood", price: 500, mrp: 800, turnaround: "24 hours", description: "Measures COVID-19 IgG antibody — useful for immunity assessment.", fastingRequired: false, popular: false, keywords: ["COVID", "IgG", "antibody", "immunity"] },

  // ─── CARDIAC MARKERS ───
  { id: "troponin-i", name: "Troponin I (Cardiac)", category: "blood", price: 700, mrp: 1100, turnaround: "4-6 hours", description: "Gold-standard marker for heart attack.", fastingRequired: false, popular: false, keywords: ["troponin", "cardiac", "heart attack", "MI"] },
  { id: "troponin-t", name: "Troponin T (hsTnT)", category: "blood", price: 800, mrp: 1200, turnaround: "4-6 hours", description: "High-sensitivity troponin T — very early marker for cardiac injury.", fastingRequired: false, popular: false, keywords: ["troponin T", "high sensitivity", "cardiac"] },
  { id: "ck-mb", name: "CK-MB (Creatine Kinase-MB)", category: "blood", price: 400, mrp: 650, turnaround: "4-6 hours", description: "Cardiac enzyme — elevated after heart muscle injury.", fastingRequired: false, popular: false, keywords: ["CK-MB", "creatine kinase", "cardiac"] },
  { id: "bnp", name: "BNP / NT-proBNP", category: "blood", price: 1500, mrp: 2200, turnaround: "24 hours", description: "Heart failure biomarker — measures cardiac stress.", fastingRequired: false, popular: false, keywords: ["BNP", "NT-proBNP", "heart failure", "cardiac"] },
  { id: "homocysteine", name: "Homocysteine (Serum)", category: "blood", price: 1200, mrp: 1800, turnaround: "24 hours", description: "Elevated levels increase risk of cardiovascular disease and stroke.", fastingRequired: false, popular: false, keywords: ["homocysteine", "cardiac risk", "cardiovascular"] },
  { id: "d-dimer", name: "D-Dimer", category: "blood", price: 800, mrp: 1200, turnaround: "4-6 hours", description: "Clotting marker — elevated in DVT, PE, and COVID-19 complications.", fastingRequired: false, popular: false, keywords: ["D-dimer", "clot", "DVT", "PE", "thrombosis"] },

  // ─── COAGULATION ───
  { id: "pt-inr", name: "PT / INR (Prothrombin Time)", category: "blood", price: 400, mrp: 650, turnaround: "4-6 hours", description: "Measures blood clotting time — important for anticoagulant therapy.", fastingRequired: false, popular: false, keywords: ["PT", "INR", "prothrombin", "coagulation", "warfarin"] },
  { id: "aptt", name: "APTT (Activated Partial Thromboplastin Time)", category: "blood", price: 400, mrp: 650, turnaround: "4-6 hours", description: "Assesses the intrinsic clotting pathway.", fastingRequired: false, popular: false, keywords: ["APTT", "coagulation", "clotting"] },

  // ─── HORMONES ───
  { id: "testosterone", name: "Testosterone (Total)", category: "blood", price: 800, mrp: 1200, turnaround: "24 hours", description: "Measures testosterone — important for male health evaluation.", fastingRequired: false, popular: false, keywords: ["testosterone", "male hormones", "androgen"] },
  { id: "fsh", name: "FSH (Follicle Stimulating Hormone)", category: "blood", price: 500, mrp: 800, turnaround: "24 hours", description: "Evaluates fertility and reproductive function.", fastingRequired: false, popular: false, keywords: ["FSH", "fertility", "reproductive", "menopause"] },
  { id: "lh", name: "LH (Luteinizing Hormone)", category: "blood", price: 500, mrp: 800, turnaround: "24 hours", description: "Evaluates ovulation and reproductive function.", fastingRequired: false, popular: false, keywords: ["LH", "luteinizing", "ovulation", "fertility"] },
  { id: "prolactin", name: "Prolactin (Serum)", category: "blood", price: 500, mrp: 800, turnaround: "24 hours", description: "Measures prolactin — elevated in pituitary tumors and menstrual disorders.", fastingRequired: false, popular: false, keywords: ["prolactin", "pituitary", "infertility"] },
  { id: "cortisol", name: "Cortisol (Serum)", category: "blood", price: 700, mrp: 1100, turnaround: "24 hours", description: "Stress hormone — measured for adrenal gland function.", fastingRequired: false, popular: false, keywords: ["cortisol", "adrenal", "stress", "Cushing"] },
  { id: "dhea-s", name: "DHEA-S (Dehydroepiandrosterone Sulphate)", category: "blood", price: 700, mrp: 1100, turnaround: "24 hours", description: "Adrenal hormone — elevated in PCOS and adrenal tumors.", fastingRequired: false, popular: false, keywords: ["DHEA", "PCOS", "adrenal", "hormone"] },
  { id: "estradiol", name: "Estradiol (E2)", category: "blood", price: 600, mrp: 950, turnaround: "24 hours", description: "Primary female sex hormone — assessed in fertility and menopause workup.", fastingRequired: false, popular: false, keywords: ["estradiol", "estrogen", "E2", "menopause", "fertility"] },
  { id: "progesterone", name: "Progesterone", category: "blood", price: 600, mrp: 950, turnaround: "24 hours", description: "Evaluates ovulation and corpus luteum function.", fastingRequired: false, popular: false, keywords: ["progesterone", "ovulation", "fertility"] },

  // ─── AUTOIMMUNE / ARTHRITIS ───
  { id: "ra-factor", name: "Rheumatoid Factor (RA Factor)", category: "blood", price: 300, mrp: 500, turnaround: "4-6 hours", description: "Screens for rheumatoid arthritis.", fastingRequired: false, popular: false, keywords: ["RA factor", "rheumatoid", "arthritis"] },
  { id: "anti-ccp", name: "Anti-CCP Antibody", category: "blood", price: 1200, mrp: 1800, turnaround: "24 hours", description: "Highly specific for rheumatoid arthritis — positive before symptoms appear.", fastingRequired: false, popular: false, keywords: ["anti-CCP", "rheumatoid", "arthritis"] },
  { id: "ana", name: "ANA (Antinuclear Antibody)", category: "blood", price: 800, mrp: 1200, turnaround: "24 hours", description: "Screens for autoimmune diseases — SLE, lupus, Sjogren's syndrome.", fastingRequired: false, popular: false, keywords: ["ANA", "lupus", "SLE", "autoimmune"] },

  // ─── CANCER MARKERS ───
  { id: "psa", name: "PSA (Prostate Specific Antigen)", category: "blood", price: 700, mrp: 1100, turnaround: "24 hours", description: "Prostate cancer screening marker — recommended for men over 50.", fastingRequired: false, popular: false, keywords: ["PSA", "prostate", "cancer"] },
  { id: "ca-125", name: "CA-125 (Ovarian Cancer Marker)", category: "blood", price: 900, mrp: 1400, turnaround: "24 hours", description: "Elevated in ovarian cancer and endometriosis.", fastingRequired: false, popular: false, keywords: ["CA-125", "ovarian", "cancer", "marker"] },
  { id: "cea", name: "CEA (Carcinoembryonic Antigen)", category: "blood", price: 800, mrp: 1200, turnaround: "24 hours", description: "Cancer marker — used to monitor colorectal, lung, and breast cancers.", fastingRequired: false, popular: false, keywords: ["CEA", "cancer marker", "colorectal"] },
  { id: "afp", name: "AFP (Alpha-Fetoprotein)", category: "blood", price: 700, mrp: 1100, turnaround: "24 hours", description: "Liver cancer and pregnancy marker.", fastingRequired: false, popular: false, keywords: ["AFP", "alpha fetoprotein", "liver cancer"] },

  // ─── SEROLOGY / INFECTIOUS ───
  { id: "hbsag", name: "HBsAg (Hepatitis B Surface Antigen)", category: "blood", price: 300, mrp: 500, turnaround: "4-6 hours", description: "Screens for active Hepatitis B infection.", fastingRequired: false, popular: false, keywords: ["HBsAg", "hepatitis B", "liver"] },
  { id: "hcv", name: "HCV Antibody (Hepatitis C)", category: "blood", price: 500, mrp: 800, turnaround: "4-6 hours", description: "Screens for Hepatitis C infection.", fastingRequired: false, popular: false, keywords: ["HCV", "hepatitis C", "liver"] },
  { id: "hiv", name: "HIV 1 & 2 Antibody (ELISA)", category: "blood", price: 400, mrp: 650, turnaround: "4-6 hours", description: "Confidential HIV screening by ELISA method.", fastingRequired: false, popular: false, keywords: ["HIV", "AIDS", "ELISA"] },
  { id: "vdrl", name: "VDRL (Syphilis Screening)", category: "blood", price: 300, mrp: 500, turnaround: "4-6 hours", description: "Screens for syphilis infection.", fastingRequired: false, popular: false, keywords: ["VDRL", "syphilis", "STI"] },
  { id: "blood-group", name: "Blood Group & Rh Factor (ABO Typing)", category: "blood", price: 100, mrp: 180, turnaround: "2-4 hours", description: "Determines blood group (A/B/AB/O) and Rh factor.", fastingRequired: false, popular: false, keywords: ["blood group", "blood type", "ABO", "Rh factor"] },

  // ─── IMAGING ───
  { id: "xray-chest", name: "X-Ray Chest (PA View)", category: "imaging", price: 400, mrp: 650, turnaround: "30 minutes", description: "Digital chest X-ray — heart, lungs, and bony thorax.", fastingRequired: false, popular: false, keywords: ["X-ray", "chest", "PA view", "lungs"] },
  { id: "usg-abdomen", name: "Ultrasound Abdomen (USG)", category: "imaging", price: 900, mrp: 1400, turnaround: "Same day", description: "Sonography of liver, gallbladder, kidneys, spleen, and pancreas.", fastingRequired: true, popular: true, keywords: ["ultrasound", "USG", "abdomen", "sonography", "liver", "gallbladder"] },
  { id: "usg-pelvis", name: "Ultrasound Pelvis (USG)", category: "imaging", price: 700, mrp: 1100, turnaround: "Same day", description: "Pelvic sonography — uterus, ovaries, urinary bladder.", fastingRequired: true, popular: false, keywords: ["ultrasound", "USG", "pelvis", "uterus", "ovaries"] },
  { id: "usg-abdomen-pelvis", name: "Ultrasound Abdomen & Pelvis", category: "imaging", price: 1200, mrp: 1800, turnaround: "Same day", description: "Combined abdominal and pelvic sonography.", fastingRequired: true, popular: false, keywords: ["ultrasound", "USG", "abdomen pelvis", "combined"] },
  { id: "usg-thyroid", name: "Ultrasound Thyroid (USG)", category: "imaging", price: 700, mrp: 1100, turnaround: "Same day", description: "Thyroid gland sonography — detects nodules, goitre, and cysts.", fastingRequired: false, popular: false, keywords: ["ultrasound", "thyroid", "nodule", "goitre"] },
  { id: "ecg", name: "ECG / EKG (12-Lead)", category: "imaging", price: 300, mrp: 500, turnaround: "30 minutes", description: "Electrocardiogram — assesses heart rhythm and electrical activity.", fastingRequired: false, popular: false, keywords: ["ECG", "EKG", "heart", "electrocardiogram"] },
  { id: "echo-2d", name: "2D Echocardiography", category: "imaging", price: 2000, mrp: 3000, turnaround: "Same day", description: "Detailed ultrasound of the heart — structure and function assessment.", fastingRequired: false, popular: false, keywords: ["echo", "echocardiography", "2D echo", "heart"] },
  { id: "xray-kub", name: "X-Ray KUB (Kidney, Ureter, Bladder)", category: "imaging", price: 400, mrp: 650, turnaround: "30 minutes", description: "X-ray of abdomen to detect kidney stones.", fastingRequired: false, popular: false, keywords: ["X-ray", "KUB", "kidney stones", "bladder"] },
  { id: "xray-spine", name: "X-Ray Spine (Lumbar / Cervical)", category: "imaging", price: 500, mrp: 800, turnaround: "30 minutes", description: "Spinal X-ray — evaluates alignment, disc space, and fractures.", fastingRequired: false, popular: false, keywords: ["X-ray", "spine", "lumbar", "cervical", "back pain"] },
  { id: "xray-knee", name: "X-Ray Knee (Both Views)", category: "imaging", price: 450, mrp: 700, turnaround: "30 minutes", description: "Knee X-ray — evaluates arthritis, fractures, and joint space.", fastingRequired: false, popular: false, keywords: ["X-ray", "knee", "arthritis", "joint"] },
];

// Health packages — as specified
const PACKAGES = [
  {
    id: "star-well-being",
    name: "Star Well Being Profile",
    shortDescription: "10 tests for complete wellness screening",
    description: "A comprehensive wellness profile covering blood count, diabetes, hormones, liver, kidney, vitamins, and lipids — everything for your annual health check.",
    price: 1650,
    mrp: 2500,
    parameterCount: 10,
    category: "wellness",
    fastingRequired: true,
    includes: [
      "CBC (Haemogram)",
      "HbA1C",
      "Iron Studies",
      "Lipid Profile",
      "LFT (Liver Function Test)",
      "KFT (Kidney Function Test)",
      "T3, T4, TSH (Thyroid)",
      "Vitamin B12",
      "Vitamin D Total",
      "Testosterone Total",
    ],
    badge: "Best Seller",
    popular: true,
  },
  {
    id: "basic-health-profile-1",
    name: "Basic Health Profile 1",
    shortDescription: "9 essential tests for everyday health monitoring",
    description: "An affordable and complete health screening covering blood count, blood sugar, liver, kidney, thyroid, cholesterol, and urine — ideal for a preventive check-up.",
    price: 1400,
    mrp: 2200,
    parameterCount: 9,
    category: "wellness",
    fastingRequired: true,
    includes: [
      "CBC (Complete Blood Count)",
      "Glucose Fasting",
      "HbA1C",
      "LFT (Liver Function Test)",
      "Electrolytes",
      "Basic RFT (Renal Function)",
      "T3, T4, TSH (Thyroid)",
      "Lipid Profile",
      "Urine Routine",
    ],
    badge: null,
    popular: true,
  },
  {
    id: "star-health-checkup",
    name: "Star Health Check-up Profile",
    shortDescription: "12 tests — the most thorough health audit",
    description: "Our most comprehensive health package covering all major systems — blood, diabetes, kidneys, liver, thyroid, vitamins, cholesterol, iron, and inflammatory markers.",
    price: 1999,
    mrp: 3500,
    parameterCount: 12,
    category: "wellness",
    fastingRequired: true,
    includes: [
      "CBC (Complete Blood Count)",
      "eGFR",
      "ESR",
      "Fasting Blood Sugar",
      "HbA1C",
      "Iron Studies",
      "Lipid Profile",
      "LFT (Liver Function Test)",
      "KFT (Kidney Function Test)",
      "T3, T4, TSH (Thyroid)",
      "Vitamin B12",
      "Vitamin D",
    ],
    badge: "Most Popular",
    popular: true,
  },
];

function searchItems(query: string, category: string) {
  const q = query.toLowerCase().trim();

  let tests = TESTS.filter(t => {
    const matchesCategory = category === "all" || category === t.category;
    const matchesQuery = !q ||
      t.name.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      (t.keywords || []).some(k => k.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  let packages = PACKAGES.filter(p => {
    const matchesCategory = category === "all" || category === "packages";
    const matchesQuery = !q ||
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.includes.some(i => i.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  if (!q) {
    tests = tests.filter(t => t.popular).slice(0, 6);
    packages = packages.filter(p => p.popular).slice(0, 3);
  } else {
    tests = tests.slice(0, 12);
    packages = packages.slice(0, 3);
  }

  return { tests, packages };
}

// GET /api/tests/search
router.get("/tests/search", (req, res) => {
  const q = String(req.query.q || "");
  const category = String(req.query.category || "all");
  const result = searchItems(q, category);
  res.json(result);
});

// GET /api/packages
router.get("/packages", (_req, res) => {
  res.json(PACKAGES);
});

// GET /api/packages/:id
router.get("/packages/:id", (req, res): void => {
  const pkg = PACKAGES.find(p => p.id === req.params.id);
  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }
  res.json(pkg);
});

export default router;
