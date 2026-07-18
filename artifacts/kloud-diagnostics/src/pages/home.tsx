import React from 'react';
import { useGetSiteStats, useListPackages, useListTestimonials, useListLocations } from '@workspace/api-client-react';
import { SearchBar } from '@/components/search-bar';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Clock, MapPin, Activity, Star, ArrowRight,
  Home, Microscope, HeartPulse, Beaker, Phone, FileText,
  ChevronRight, BadgeCheck, Zap, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useBookingModal } from '@/lib/booking-modal-context';

const POPULAR_CHIPS = ['CBC', 'Thyroid Profile', 'Diabetes Panel', 'Full Body Checkup', 'Vitamin D', 'Lipid Profile'];

export default function HomePage() {
  const { data: stats } = useGetSiteStats();
  const { data: packages, isLoading: pkgsLoading } = useListPackages();
  const { data: testimonials } = useListTestimonials();
  const { data: locations } = useListLocations();
  const { openModal } = useBookingModal();

  const heroStats = [
    { label: 'Tests Available', value: stats?.testsCount || '500,000+', icon: Beaker },
    { label: 'Years Experience', value: stats?.yearsExperience || '15+', icon: Clock },
    { label: 'Happy Patients', value: stats?.patientsServed ? `${(stats.patientsServed / 1000000).toFixed(1)}M+` : '2M+', icon: Users },
    { label: 'Locations', value: stats?.locationsCount || '12', icon: MapPin },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ─── HERO ─── */}
      <section className="relative pt-16 pb-28 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50/30">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid dots */}
          <svg className="absolute w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#0d9488"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
          {/* Heartbeat line */}
          <svg className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 text-primary" preserveAspectRatio="none" viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M0,40 L300,40 L330,5 L360,75 L390,40 L500,40 L530,10 L560,70 L590,40 L1200,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.12"
              initial={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
            />
          </svg>
          {/* Large faint circle */}
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-teal-400/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 border border-primary/20"
            >
              <BadgeCheck className="w-4 h-4" />
              NABL & ISO Accredited • Mumbai's Trusted Lab
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold text-foreground tracking-tight mb-6 max-w-5xl mx-auto leading-[1.08]">
              Accurate Diagnostics.<br />
              <span className="text-primary">Trusted Across Mumbai.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Precision testing, fast digital reports, and compassionate care — right at your doorstep or at any of our premium centers.
            </p>

            {/* Search area */}
            <div className="max-w-3xl mx-auto">
              <div className="relative z-30">
                <SearchBar className="mb-5 shadow-xl ring-1 ring-primary/10" />
              </div>

              {/* Popular chips */}
              <div className="flex flex-wrap justify-center gap-2 items-center">
                <span className="text-sm font-semibold text-muted-foreground/70">Popular:</span>
                {POPULAR_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => openModal(chip)}
                    className="px-3.5 py-1.5 bg-white border border-border rounded-full text-xs font-semibold text-foreground/80 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA strip */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button size="lg" onClick={() => openModal()} className="text-base px-8 h-13 h-[52px] shadow-lg gap-2 font-bold">
                <Zap className="w-4 h-4" />
                Book a Test Now
              </Button>
              <Link href="/upload-prescription">
                <Button size="lg" variant="outline" className="text-base px-8 h-[52px] bg-white gap-2 font-bold">
                  <FileText className="w-4 h-4" />
                  Upload Prescription
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="relative z-10 bg-primary text-white py-10 shadow-2xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/15">
            {heroStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center px-6 py-2"
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold font-sans mb-1">{stat.value}</div>
                <div className="text-xs text-white/70 font-semibold uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY KLOUD ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans mb-4">Why Choose Kloud Diagnostics?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Built on precision, trust, and care — here's what sets us apart.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BadgeCheck, color: 'bg-teal-50 text-teal-600', title: 'NABL Accredited', desc: 'ISO 9001:2015 certified labs meeting international standards for diagnostic accuracy.' },
              { icon: Zap, color: 'bg-orange-50 text-orange-500', title: 'Fast Reports', desc: 'Digital reports delivered within 24 hours. Urgent reports available in 4–6 hours.' },
              { icon: Home, color: 'bg-blue-50 text-blue-600', title: 'Home Collection', desc: 'Trained phlebotomists collect samples safely from your home at your preferred time.' },
              { icon: ShieldCheck, color: 'bg-green-50 text-green-600', title: '100% Accurate', desc: 'State-of-the-art equipment and rigorous QC protocols for reliable, precise results.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PACKAGES ─── */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <div className="text-primary text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Health Packages
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-foreground mb-3">Comprehensive Health Packages</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Preventive care designed for every age. Up to 60% savings compared to individual tests.</p>
            </div>
            <Link href="/packages">
              <Button variant="outline" className="shrink-0 gap-2 font-semibold">
                View All Packages <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {pkgsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl p-6 h-80 animate-pulse border border-border shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-20 bg-gray-200 rounded w-full mb-8" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages?.slice(0, 3).map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl p-7 border border-border shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative overflow-hidden"
                >
                  {pkg.badge && (
                    <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-4 py-2 rounded-bl-2xl z-10">
                      {pkg.badge}
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-primary font-bold text-sm">{pkg.parameterCount} Parameters</span>
                  </div>

                  <h3 className="text-xl font-extrabold font-sans mb-2 group-hover:text-primary transition-colors">{pkg.name}</h3>
                  <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">{pkg.shortDescription || pkg.description}</p>

                  {pkg.includes && pkg.includes.length > 0 && (
                    <div className="mb-5 flex-1">
                      <ul className="space-y-1.5">
                        {pkg.includes.slice(0, 4).map((item, i) => (
                          <li key={i} className="text-xs flex items-center gap-2 text-foreground/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                        {pkg.includes.length > 4 && (
                          <li className="text-xs text-primary font-semibold pl-3.5">+ {pkg.includes.length - 4} more tests</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="pt-5 border-t border-border mt-auto flex items-center justify-between gap-4">
                    <div>
                      {pkg.mrp && pkg.mrp > pkg.price && (
                        <div className="text-xs text-muted-foreground line-through mb-0.5">₹{pkg.mrp}</div>
                      )}
                      <div className="text-2xl font-extrabold text-foreground">₹{pkg.price}</div>
                      {pkg.mrp && pkg.mrp > pkg.price && (
                        <div className="text-xs text-green-600 font-semibold">{Math.round((1 - pkg.price / pkg.mrp) * 100)}% off</div>
                      )}
                    </div>
                    <Button
                      onClick={() => openModal(pkg.name)}
                      className="rounded-xl font-bold"
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

      {/* ─── HOME COLLECTION + UPLOAD RX (side by side) ─── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Home Collection Card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 text-white p-8 md:p-10 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-8" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Home className="w-7 h-7" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold font-sans mb-3 leading-tight">
                  Home Sample Collection
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Skip the wait — our trained phlebotomists collect your sample safely from home. Digital reports within 24 hours.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Flexible slots: 7 AM to 8 PM',
                    'Free collection above ₹1,500',
                    'PPE-equipped professionals',
                    'Same-day reports for most tests',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => openModal()}
                  className="bg-white text-teal-700 hover:bg-teal-50 font-bold h-12 px-7 rounded-xl shadow-lg"
                >
                  Book Home Collection
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>

            {/* Upload Prescription Card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-coral-50 to-orange-50 border border-orange-100 p-8 md:p-10 flex flex-col relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)' }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-200/20 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7 text-orange-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold font-sans text-foreground mb-3 leading-tight">
                  Have a Doctor's Prescription?
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Upload it — our experts decode the tests, prepare your quote, and call you back within 30 minutes to confirm.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Accepts JPG, PNG, and PDF files',
                    'Expert team reviews within 30 min',
                    'Best pricing — no hidden costs',
                    'Fully confidential and secure',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-3 h-3 text-orange-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/upload-prescription">
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 font-bold h-12 px-7 rounded-xl bg-white"
                  >
                    Upload Prescription
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-gray-950 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Patient Stories</div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans mb-4">Trusted by Mumbai</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">Real words from real patients who've experienced the Kloud difference.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials?.slice(0, 3).map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 relative"
              >
                <div className="flex gap-1 mb-5 text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-base leading-relaxed mb-7 text-white/85 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center font-bold text-lg text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-xs text-white/40 mt-0.5">{testimonial.area} · {testimonial.service}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT CTA ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-primary to-teal-600 rounded-[2.5rem] p-10 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-24 translate-x-24 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-400/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold font-sans mb-4">Have Questions? We're Here.</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Call us directly or visit any of our 12 centers across Mumbai. Our care team is available 7 days a week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:9699977171">
                  <Button className="bg-white text-primary hover:bg-teal-50 font-bold h-13 h-[52px] px-8 text-base gap-2 shadow-lg rounded-xl">
                    <Phone className="w-5 h-5" />
                    Call: 9699977171
                  </Button>
                </a>
                <Link href="/locations">
                  <Button variant="outline" className="border-white/40 text-white hover:bg-white/15 font-bold h-[52px] px-8 text-base gap-2 rounded-xl">
                    <MapPin className="w-5 h-5" />
                    Find a Center
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOCATIONS PREVIEW ─── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <div className="text-primary text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Our Centers
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-foreground mb-3">Find Us Near You</h2>
              <p className="text-muted-foreground text-lg">12 premium Kloud Diagnostics centers across Mumbai.</p>
            </div>
            <Link href="/locations">
              <Button variant="outline" className="shrink-0 gap-2 font-semibold">
                View All Locations <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {locations?.slice(0, 3).map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-border rounded-2xl p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-sans">{loc.name}</h3>
                    <p className="text-primary text-sm font-semibold">{loc.area}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mb-5 flex-1 leading-relaxed">{loc.address}</p>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {loc.hours}
                  </div>
                  <a href={loc.mapsUrl || '#'} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1">
                    Directions <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
