import { Router } from "express";

const router = Router();

// Static catalog of diagnostic tests
const TESTS = [
  { id: "cbc", name: "Complete Blood Count (CBC)", category: "blood", price: 199, mrp: 299, turnaround: "4-6 hours", description: "Measures red blood cells, white blood cells, haemoglobin, and platelets.", fastingRequired: false, popular: true },
  { id: "thyroid-tsh", name: "TSH (Thyroid Stimulating Hormone)", category: "blood", price: 249, mrp: 399, turnaround: "4-6 hours", description: "Screens for thyroid disorders.", fastingRequired: false, popular: true },
  { id: "thyroid-t3t4tsh", name: "Thyroid Profile Total (T3, T4, TSH)", category: "blood", price: 499, mrp: 750, turnaround: "6-8 hours", description: "Comprehensive thyroid function assessment.", fastingRequired: false, popular: true },
  { id: "vitd", name: "Vitamin D (25-OH)", category: "blood", price: 699, mrp: 1100, turnaround: "24 hours", description: "Checks Vitamin D levels — essential for bones and immunity.", fastingRequired: false, popular: true },
  { id: "vitb12", name: "Vitamin B12", category: "blood", price: 599, mrp: 950, turnaround: "24 hours", description: "Measures Vitamin B12, important for nerve function.", fastingRequired: false, popular: false },
  { id: "bsugar-fasting", name: "Blood Sugar Fasting", category: "blood", price: 79, mrp: 129, turnaround: "2-4 hours", description: "Measures glucose levels after 8-hour fast.", fastingRequired: true, popular: false },
  { id: "hba1c", name: "HbA1c (Glycated Haemoglobin)", category: "blood", price: 349, mrp: 549, turnaround: "6-8 hours", description: "3-month average blood sugar — key for diabetes monitoring.", fastingRequired: false, popular: true },
  { id: "lipid", name: "Lipid Profile", category: "blood", price: 299, mrp: 499, turnaround: "4-6 hours", description: "Cholesterol and triglycerides panel.", fastingRequired: true, popular: false },
  { id: "liver", name: "Liver Function Test (LFT)", category: "blood", price: 399, mrp: 649, turnaround: "6-8 hours", description: "Assesses liver enzymes, bilirubin, and protein levels.", fastingRequired: false, popular: false },
  { id: "kidney", name: "Kidney Function Test (KFT/RFT)", category: "blood", price: 349, mrp: 549, turnaround: "6-8 hours", description: "Creatinine, urea, and electrolytes panel.", fastingRequired: false, popular: false },
  { id: "urine-routine", name: "Urine Routine & Microscopy", category: "blood", price: 99, mrp: 149, turnaround: "2-4 hours", description: "Complete urine analysis.", fastingRequired: false, popular: false },
  { id: "iron", name: "Iron Studies (Iron, TIBC, Ferritin)", category: "blood", price: 499, mrp: 799, turnaround: "24 hours", description: "Evaluates iron stores and transport.", fastingRequired: false, popular: false },
  { id: "crp", name: "C-Reactive Protein (CRP)", category: "blood", price: 249, mrp: 399, turnaround: "4-6 hours", description: "Marker for inflammation and infection.", fastingRequired: false, popular: false },
  { id: "dengue", name: "Dengue NS1 Antigen + IgM/IgG", category: "blood", price: 699, mrp: 999, turnaround: "4-6 hours", description: "Detects dengue fever markers.", fastingRequired: false, popular: false },
  { id: "malaria", name: "Malaria Antigen Test", category: "blood", price: 249, mrp: 399, turnaround: "2-4 hours", description: "Rapid detection of malaria parasites.", fastingRequired: false, popular: false },
  { id: "typhoid", name: "Typhoid (Widal / Rapid)", category: "blood", price: 199, mrp: 299, turnaround: "4-6 hours", description: "Detects Salmonella typhi antibodies.", fastingRequired: false, popular: false },
  { id: "xray-chest", name: "X-Ray Chest (PA View)", category: "imaging", price: 299, mrp: 499, turnaround: "30 minutes", description: "Digital chest X-ray — heart, lungs, and bones.", fastingRequired: false, popular: false },
  { id: "usg-abdomen", name: "Ultrasound Abdomen & Pelvis", category: "imaging", price: 799, mrp: 1299, turnaround: "Same day", description: "Sonography of liver, gallbladder, kidneys, and pelvic organs.", fastingRequired: true, popular: true },
  { id: "ecg", name: "ECG / EKG (12 Lead)", category: "imaging", price: 199, mrp: 349, turnaround: "30 minutes", description: "Electrocardiogram — heart rhythm and electrical activity.", fastingRequired: false, popular: false },
  { id: "echo", name: "2D Echocardiography", category: "imaging", price: 1499, mrp: 2499, turnaround: "Same day", description: "Detailed ultrasound of the heart's structure and function.", fastingRequired: false, popular: false },
];

// Static catalog of health packages
const PACKAGES = [
  {
    id: "pkg-basic",
    name: "Kloud Basic Health Checkup",
    shortDescription: "Essential health screening for everyday wellness",
    description: "A foundational health screen covering blood count, sugar, cholesterol, and kidney health. Ideal for annual check-ups.",
    price: 799,
    mrp: 1299,
    parameterCount: 28,
    category: "wellness",
    fastingRequired: true,
    includes: ["CBC", "Blood Sugar Fasting", "Lipid Profile", "Urine Routine", "Blood Pressure Check"],
    badge: null,
    popular: false,
  },
  {
    id: "pkg-full-body",
    name: "Kloud Full Body Checkup",
    shortDescription: "70+ parameters — the most comprehensive health audit",
    description: "Our most thorough health package covering all major organ systems. Includes CBC, thyroid, liver, kidney, vitamins, sugar, and urine analysis.",
    price: 1999,
    mrp: 3499,
    parameterCount: 72,
    category: "wellness",
    fastingRequired: true,
    includes: ["CBC", "Liver Function (LFT)", "Kidney Function (KFT)", "Lipid Profile", "Thyroid Profile (T3, T4, TSH)", "Blood Sugar Fasting & PP", "Vitamin D & B12", "Urine Routine", "Iron Studies"],
    badge: "Most Popular",
    popular: true,
  },
  {
    id: "pkg-diabetes",
    name: "Diabetes Care Package",
    shortDescription: "Complete diabetes monitoring and risk assessment",
    description: "Designed for diabetes management and early detection. Tracks blood sugar trends, kidney health, and cardiovascular risk.",
    price: 899,
    mrp: 1499,
    parameterCount: 18,
    category: "chronic",
    fastingRequired: true,
    includes: ["Fasting & PP Blood Sugar", "HbA1c (3-month average)", "Lipid Profile", "Kidney Function (KFT)", "Urine Microalbumin"],
    badge: null,
    popular: false,
  },
  {
    id: "pkg-cardiac",
    name: "Cardiac Risk Package",
    shortDescription: "Heart health screening with ECG and advanced markers",
    description: "Assess your cardiovascular risk with lipid profiling, ECG, and high-sensitivity CRP. Ideal for those above 35 or with a family history of heart disease.",
    price: 1299,
    mrp: 2199,
    parameterCount: 22,
    category: "cardiac",
    fastingRequired: true,
    includes: ["Lipid Profile (full)", "ECG 12-Lead", "Blood Sugar Fasting", "hs-CRP (Cardiac marker)", "Homocysteine"],
    badge: null,
    popular: false,
  },
  {
    id: "pkg-thyroid",
    name: "Thyroid Profile (Total)",
    shortDescription: "T3, T4, TSH — complete thyroid function test",
    description: "A targeted thyroid panel to diagnose hypo- and hyperthyroidism. Includes all three key thyroid hormones.",
    price: 499,
    mrp: 749,
    parameterCount: 3,
    category: "hormones",
    fastingRequired: false,
    includes: ["T3 (Triiodothyronine)", "T4 (Thyroxine)", "TSH (Thyroid Stimulating Hormone)"],
    badge: "Best Value",
    popular: true,
  },
  {
    id: "pkg-womens",
    name: "Women's Wellness Package",
    shortDescription: "Comprehensive health screening for women",
    description: "Tailored for women's health needs — covers hormonal, nutritional, and haematological markers with optional Pap smear add-on.",
    price: 1799,
    mrp: 2999,
    parameterCount: 38,
    category: "women",
    fastingRequired: true,
    includes: ["CBC", "Thyroid Profile", "Vitamin D & B12", "Iron Studies (Ferritin)", "Fasting Blood Sugar", "Urine Routine", "CA-125 (Ovarian marker)"],
    badge: null,
    popular: false,
  },
  {
    id: "pkg-senior",
    name: "Senior Citizen Care Package",
    shortDescription: "Full-spectrum checkup designed for 55+ years",
    description: "A thorough health assessment for older adults covering heart, bone, kidney, thyroid, and cancer markers for early detection.",
    price: 2499,
    mrp: 4199,
    parameterCount: 88,
    category: "wellness",
    fastingRequired: true,
    includes: ["Full Body Checkup (72 params)", "Bone Density markers (Calcium, Vitamin D)", "PSA (for men) / CA-125 (for women)", "Cardiac Risk Profile", "Uric Acid"],
    badge: null,
    popular: false,
  },
  {
    id: "pkg-fever",
    name: "Fever & Infection Panel",
    shortDescription: "Rapid diagnosis for fever — covers dengue, malaria, typhoid",
    description: "Fast-tracked panel for patients with fever. Covers the most common tropical infections in Mumbai alongside an inflammatory marker.",
    price: 1099,
    mrp: 1799,
    parameterCount: 14,
    category: "infection",
    fastingRequired: false,
    includes: ["CBC with Differential", "CRP (Inflammation)", "Malaria Antigen", "Dengue NS1 + IgM/IgG", "Typhoid (Widal)"],
    badge: null,
    popular: false,
  },
];

function searchItems(query: string, category: string) {
  const q = query.toLowerCase().trim();
  
  let tests = TESTS.filter(t => {
    const matchesCategory = category === "all" || category === t.category;
    const matchesQuery = !q || 
      t.name.toLowerCase().includes(q) || 
      (t.description || "").toLowerCase().includes(q);
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
    packages = packages.filter(p => p.popular).slice(0, 4);
  } else {
    tests = tests.slice(0, 10);
    packages = packages.slice(0, 5);
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
