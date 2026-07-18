import React from 'react';
import { useGetSiteStats, useListPackages, useListTestimonials, useListLocations } from '@workspace/api-client-react';
import { SearchBar } from '@/components/search-bar';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, MapPin, Activity, Star, ArrowRight, Home, Microscope, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/lib/cart-context';

export default function HomePage() {
  const { data: stats } = useGetSiteStats();
  const { data: packages, isLoading: pkgsLoading } = useListPackages();
  const { data: testimonials } = useListTestimonials();
  const { data: locations } = useListLocations();
  const [, setLocation] = useLocation();
  const { addItem } = useCart();

  const heroStats = [
    { label: 'Tests Available', value: stats?.testsCount || '2,000+', icon: Microscope },
    { label: 'Years Experience', value: stats?.yearsExperience || '15+', icon: Clock },
    { label: 'Happy Patients', value: stats?.patientsServed ? `${(stats.patientsServed / 1000000).toFixed(1)}M+` : '2M+', icon: HeartPulse },
    { label: 'Locations', value: stats?.locationsCount || '12', icon: MapPin },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white">
        {/* Animated Background SVG */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-primary"/>
          </svg>
          {/* Faint animated heartbeat */}
          <svg className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 text-primary" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M0,60 L200,60 L230,10 L270,110 L300,60 L1200,60" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              initial={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <ShieldCheck className="w-4 h-4" />
              NABL & ISO Accredited Labs
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-foreground tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
              Accurate Diagnostics. <br/><span className="text-primary">Trusted Across Mumbai.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Precision testing, fast digital reports, and compassionate care. Book a home collection or visit our premium centers.
            </p>

            <div className="max-w-3xl mx-auto flex flex-col items-center">
              <SearchBar className="mb-8 shadow-xl" />
              
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground mr-2 py-1">Popular:</span>
                {['Thyroid Profile', 'Diabetes Panel', 'Full Body Checkup', 'Vitamin D', 'CBC'].map((chip) => (
                  <button 
                    key={chip}
                    onClick={() => {}}
                    className="px-3 py-1 bg-white border border-border rounded-full text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors shadow-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-primary text-white py-12 relative z-20 shadow-xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {heroStats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center px-4"
              >
                <stat.icon className="w-8 h-8 text-accent mb-3 opacity-90" />
                <div className="text-3xl md:text-4xl font-bold font-sans mb-1">{stat.value}</div>
                <div className="text-sm text-white/80 font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES PREVIEW */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-4">Comprehensive Health Packages</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Preventive care designed for every age and lifestyle. Up to 60% savings compared to individual tests.</p>
            </div>
            <Link href="/packages">
              <Button variant="outline" className="shrink-0 bg-white">
                View All Packages <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {pkgsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl p-6 h-80 animate-pulse border border-border shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded w-full mb-8"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages?.slice(0, 3).map((pkg) => (
                <motion.div 
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden"
                >
                  {pkg.badge && (
                    <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10">
                      {pkg.badge}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4 text-primary font-semibold">
                    <Activity className="w-5 h-5" />
                    <span>{pkg.parameterCount} Parameters</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold font-sans mb-3 group-hover:text-primary transition-colors">{pkg.name}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-2 min-h-[48px]">{pkg.shortDescription || pkg.description}</p>
                  
                  {pkg.includes && pkg.includes.length > 0 && (
                    <div className="mb-6 flex-1">
                      <p className="text-sm font-semibold mb-3">Includes:</p>
                      <ul className="space-y-2">
                        {pkg.includes.slice(0, 4).map((item, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                            <span className="text-foreground/80 line-clamp-1">{item}</span>
                          </li>
                        ))}
                        {pkg.includes.length > 4 && (
                          <li className="text-sm text-primary font-medium pl-3.5">+ {pkg.includes.length - 4} more tests</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="pt-6 border-t border-border mt-auto flex items-end justify-between">
                    <div>
                      {pkg.mrp && pkg.mrp > pkg.price && (
                        <div className="text-sm text-muted-foreground line-through mb-1">₹{pkg.mrp}</div>
                      )}
                      <div className="text-3xl font-bold text-foreground">₹{pkg.price}</div>
                    </div>
                    <Button 
                      onClick={() => {
                        addItem({ itemId: pkg.id, itemType: 'package', name: pkg.name, price: pkg.price, quantity: 1 });
                        setLocation('/book');
                      }}
                      className="rounded-xl shadow-md group-hover:bg-primary group-hover:text-white"
                      variant="outline"
                    >
                      Book Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOME COLLECTION PROMO */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-5"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-border p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold mb-6">
                <Home className="w-5 h-5" />
                Home Sample Collection
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-sans mb-6">Skip the wait.<br/>We come to you.</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Book a home visit and our trained phlebotomists will collect your sample safely from the comfort of your home. Reports delivered digitally within 24 hours.
              </p>
              
              <ul className="space-y-4 mb-10 max-w-md mx-auto lg:mx-0 text-left">
                {[
                  'Hygienic and safe sample collection',
                  'Flexible time slots (7 AM to 8 PM)',
                  'Free collection on orders above ₹1,500',
                  'Same-day digital reports for most tests'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => setLocation('/book')} className="text-lg px-8">
                  Book Home Collection
                </Button>
                <Link href="/upload-prescription">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-white">
                    Upload Prescription
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full relative min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-primary/10 rounded-[2rem] transform rotate-3 scale-105"></div>
              <div className="absolute inset-0 bg-white rounded-[2rem] shadow-lg border border-border p-6 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="w-48 h-48 rounded-full bg-primary/5 flex items-center justify-center mb-8 relative">
                  <Home className="w-24 h-24 text-primary relative z-10" />
                  <motion.div 
                    className="absolute inset-0 rounded-full border border-primary/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute inset-0 rounded-full border border-primary/20"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Safe & Seamless</h3>
                <p className="text-muted-foreground text-center">Trained professionals with full PPE kits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Trusted by Mumbai</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Hear from patients who have experienced the Kloud difference.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.slice(0, 3).map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 relative"
              >
                <div className="flex gap-1 mb-6 text-accent">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg leading-relaxed mb-8 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-white/50">{testimonial.area} • {testimonial.service}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-4">Our Centers</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Find a premium Kloud Diagnostics center near you.</p>
            </div>
            <Link href="/locations">
              <Button variant="outline" className="shrink-0">
                View All Locations <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations?.slice(0, 3).map((loc) => (
              <div key={loc.id} className="border border-border rounded-2xl p-6 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl font-sans">{loc.name}</h3>
                    <p className="text-muted-foreground text-sm font-semibold">{loc.area}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 mb-6 flex-1">{loc.address}</p>
                <div className="flex justify-between items-center pt-4 border-t border-border mt-auto">
                  <div className="text-sm font-medium">Open: {loc.hours}</div>
                  <a href={loc.mapsUrl || '#'} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-bold">Directions</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
