import { Router } from "express";

const router = Router();

const LOCATIONS = [
  {
    id: "lalbaug",
    name: "Kloud Diagnostics – Lalbaug",
    area: "Lalbaug",
    address: "Shop 12, Sardar Patel Road, Lalbaug, Mumbai – 400012",
    phone: "+91 98200 12345",
    email: "lalbaug@klouddiagnostics.in",
    hours: "Mon–Sat: 7:00 AM – 8:00 PM | Sun: 8:00 AM – 2:00 PM",
    mapsUrl: "https://maps.google.com/?q=Lalbaug+Mumbai",
    lat: 18.9996,
    lng: 72.8378,
  },
  {
    id: "byculla",
    name: "Kloud Diagnostics – Byculla",
    area: "Byculla",
    address: "B-7, Dr. Babasaheb Ambedkar Road, Byculla, Mumbai – 400027",
    phone: "+91 98200 23456",
    email: "byculla@klouddiagnostics.in",
    hours: "Mon–Sat: 7:00 AM – 8:00 PM | Sun: 8:00 AM – 2:00 PM",
    mapsUrl: "https://maps.google.com/?q=Byculla+Mumbai",
    lat: 18.9792,
    lng: 72.8369,
  },
  {
    id: "dadar",
    name: "Kloud Diagnostics – Dadar",
    area: "Dadar West",
    address: "303, Shivaji Park Road, Near Shivaji Park Circle, Dadar West, Mumbai – 400028",
    phone: "+91 98200 34567",
    email: "dadar@klouddiagnostics.in",
    hours: "Mon–Sat: 7:00 AM – 9:00 PM | Sun: 8:00 AM – 3:00 PM",
    mapsUrl: "https://maps.google.com/?q=Dadar+West+Mumbai",
    lat: 19.0178,
    lng: 72.8478,
  },
  {
    id: "andheri",
    name: "Kloud Diagnostics – Andheri West",
    area: "Andheri West",
    address: "G-15, Versova Road, Near Andheri Station, Andheri West, Mumbai – 400058",
    phone: "+91 98200 45678",
    email: "andheri@klouddiagnostics.in",
    hours: "Mon–Sat: 7:00 AM – 9:00 PM | Sun: 8:00 AM – 3:00 PM",
    mapsUrl: "https://maps.google.com/?q=Andheri+West+Mumbai",
    lat: 19.1136,
    lng: 72.8697,
  },
  {
    id: "borivali",
    name: "Kloud Diagnostics – Borivali West",
    area: "Borivali West",
    address: "11, IC Colony Road, Near Borivali Station, Borivali West, Mumbai – 400092",
    phone: "+91 98200 56789",
    email: "borivali@klouddiagnostics.in",
    hours: "Mon–Sat: 7:00 AM – 8:00 PM | Sun: 8:00 AM – 2:00 PM",
    mapsUrl: "https://maps.google.com/?q=Borivali+West+Mumbai",
    lat: 19.2183,
    lng: 72.8564,
  },
];

const TESTIMONIALS = [
  { id: "t1", name: "Priya Sharma", rating: 5, text: "Booked a full body checkup at 7 AM, the phlebotomist arrived right on time. Reports were in my email by 2 PM. Absolutely seamless experience — I've recommended Kloud to my entire family.", service: "Home Sample Collection", date: "March 2024", area: "Andheri West" },
  { id: "t2", name: "Rajesh Mehta", rating: 5, text: "Been using Kloud for my quarterly diabetes panel. Their HbA1c results have always matched exactly when cross-checked at my endocrinologist's lab. The online report system is very convenient.", service: "Diabetes Care Package", date: "February 2024", area: "Dadar" },
  { id: "t3", name: "Sunita Patil", rating: 5, text: "The staff at the Borivali branch are so warm and professional. My elderly mother was nervous about the blood draw and they made her feel completely at ease. Wonderful service.", service: "Senior Citizen Care Package", date: "January 2024", area: "Borivali" },
  { id: "t4", name: "Arjun Nair", rating: 5, text: "Fast, accurate, affordable. I uploaded my prescription at night and got a call first thing in the morning. The cardiac package report was detailed and my cardiologist was impressed with the thoroughness.", service: "Cardiac Risk Package", date: "March 2024", area: "Lalbaug" },
  { id: "t5", name: "Meera Iyer", rating: 4, text: "Very professional. The Andheri branch had minimal wait time and the collection was quick and hygienic. Reports came via WhatsApp which was super convenient. Definitely coming back.", service: "Women's Wellness Package", date: "December 2023", area: "Andheri" },
  { id: "t6", name: "Vikram Desai", rating: 5, text: "My whole family got tested during the monsoon — the fever panel results came in under 4 hours. Dengue and malaria reports were negative. Great service when you need quick answers.", service: "Fever & Infection Panel", date: "July 2023", area: "Byculla" },
];

const STATS = {
  testsCount: 500000,
  locationsCount: 15,
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
