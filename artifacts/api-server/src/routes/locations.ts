import { Router } from "express";

const router = Router();

const LOCATIONS = [
  {
    id: "mazgaon",
    name: "Kloud Diagnostics & Imaging",
    area: "Mazgaon",
    address: "Shop Number 2, Abdul Rauf Manzil Reay Road Station, Rambhau Bhogle Marg, opposite Haji Kasam Police Chowky, Mazgaon, Mumbai, Maharashtra 400010",
    phone: "9699977171",
    email: "klouddiagnostics@gmail.com",
    hours: "Mon–Sat: 7:00 AM – 9:00 PM | Sun: 8:00 AM – 2:00 PM",
    mapsUrl: "https://maps.google.com/?q=Shop+Number+2+Abdul+Rauf+Manzil+Reay+Road+Mazgaon+Mumbai+400010",
    lat: 18.9732,
    lng: 72.8461,
  },
];

const TESTIMONIALS = [
  { id: "t1", name: "Priya Sharma", rating: 5, text: "Booked a full body checkup, the phlebotomist arrived right on time. Reports were in my WhatsApp by afternoon. Absolutely seamless experience — I've recommended Kloud to my entire family.", service: "Star Well Being Profile", date: "March 2024", area: "Mazgaon" },
  { id: "t2", name: "Rajesh Mehta", rating: 5, text: "Been using Kloud for my quarterly diabetes panel. Their HbA1c results have always matched exactly when cross-checked at my endocrinologist's lab. The online report system is very convenient.", service: "Basic Health Profile 1", date: "February 2024", area: "Mazgaon" },
  { id: "t3", name: "Sunita Patil", rating: 5, text: "The staff are so warm and professional. My elderly mother was nervous about the blood draw and they made her feel completely at ease. Wonderful service at a very reasonable price.", service: "Star Health Check-up Profile", date: "January 2024", area: "Mazgaon" },
  { id: "t4", name: "Arjun Nair", rating: 5, text: "Fast, accurate, affordable. I uploaded my prescription at night and got a call first thing in the morning. The report was detailed and my doctor was very impressed with the thoroughness.", service: "Upload Prescription", date: "March 2024", area: "Mazgaon" },
  { id: "t5", name: "Meera Iyer", rating: 4, text: "Very professional. Minimal wait time and the collection was quick and hygienic. Reports came via WhatsApp which was super convenient. Definitely coming back.", service: "Thyroid Profile", date: "December 2023", area: "Mazgaon" },
  { id: "t6", name: "Vikram Desai", rating: 5, text: "My whole family got tested during the monsoon — the fever panel results came in under 4 hours. Dengue results were negative. Great service when you need quick answers.", service: "Dengue Test", date: "July 2023", area: "Mazgaon" },
];

const STATS = {
  testsCount: 500000,
  locationsCount: 1,
  yearsExperience: 20,
  patientsServed: 200000,
  turnaroundHours: 6,
};

router.get("/locations", (_req, res) => {
  res.json(LOCATIONS);
});

router.get("/testimonials", (_req, res) => {
  res.json(TESTIMONIALS);
});

router.get("/stats", (_req, res) => {
  res.json(STATS);
});

export default router;
