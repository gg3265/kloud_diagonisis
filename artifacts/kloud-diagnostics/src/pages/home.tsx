import React, { useState } from 'react';
import { PACKAGES, searchItems } from '@/lib/data';
import { SearchBar } from '@/components/search-bar';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Clock, MapPin, Activity, Star, ArrowRight,
  Home, Microscope, HeartPulse, Beaker, Phone, FileText,
  ChevronRight, BadgeCheck, Zap, Users, ChevronDown, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useBookingModal, PackageInfo } from '@/lib/booking-modal-context';
import { PackageCard } from '@/components/package-card';
import { AnimatePresence } from 'framer-motion';

const POPULAR_CHIPS = ['CBC', 'Vitamin D', 'HbA1c', 'Thyroid Profile', 'LFT', 'KFT', 'Lipid Profile', 'Vitamin B12', 'Dengue', 'Fever Profile'];

const FAQS = [
  {
    question: "Do you process medical tests in your own laboratory?",
    answer: "No, Kloud Diagnostics does not perform tests directly in-house. We are strategically associated with top NABL & ISO accredited network labs across Mumbai, such as Lupin Diagnostics, Max Healthcare, and other leading diagnostic partners, ensuring high accuracy and reliability for all your reports."
  },
  {
    question: "Are your partner labs accredited and certified?",
    answer: "Yes, absolutely. We work exclusively with top-tier, NABL & ISO accredited laboratories to guarantee that every test result meets strict quality standards."
  },
  {
    question: "Is home sample collection available everywhere?",
    answer: "Currently, our home sample collection services are exclusively available across Mumbai."
  },
  {
    question: "How do I receive my test reports after sample collection?",
    answer: "Once your sample is processed by our accredited partner lab, your digital test reports are delivered directly to you via WhatsApp, Email, or through our website portal."
  },
  {
    question: "How do I book a test or a home collection visit?",
    answer: "You can easily search for your required test on our website, select a package, and click to book or connect with our support team directly via WhatsApp/Call for instant home collection scheduling."
  }
];

export default function HomePage() {
  const stats = { testsCount: '500+', yearsExperience: '15+', patientsServed: 2000000 };
  const packages = PACKAGES;
  const pkgsLoading = false;
  const testimonials = [
    { id: '1', rating: 5, text: "Great diagnostic centre. Very quick and easy service with experienced staff. Highly recommended.", name: "Kanu Kedia", verified: true },
    { id: '2', rating: 5, text: "Very Nice diagnostic centre. Quick service with expert staff.", name: "RAJENDRA PATIL", verified: true },
    { id: '3', rating: 5, text: "Excellent diagnostic centre with quick service and great Staff.", name: "Triveni Lande", verified: true },
    { id: '4', rating: 5, text: "Excellent diagnostic centre with quick service and great staff.", name: "abhishree goyal", verified: true },
    { id: '5', rating: 5, text: "Good service and competitive rates.", name: "Ridhi Behal", verified: true },
    { id: '6', rating: 5, text: "Fast & Good services 👌👍👏", name: "Tanishka G", verified: true },
    { id: '7', rating: 5, text: "Very courteous and friendly.", name: "Darshit Jain", verified: true }
  ];
  const { openModal, openPackageModal } = useBookingModal();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const heroStats = [
    { label: 'Tests Available', value: stats?.testsCount || '500,000+', icon: Beaker },
    { label: 'Years Experience', value: stats?.yearsExperience || '15+', icon: Clock },
    { label: 'Happy Patients', value: stats?.patientsServed ? `${(stats.patientsServed / 1000000).toFixed(1)}M+` : '2M+', icon: Users },
    { label: 'NABL Accredited', value: '100%', icon: BadgeCheck },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative pt-16 pb-28 overflow-hidden" style={{ background: 'linear-gradient(180deg, #EEF3FA 0%, #FDFBF9 45%, #FDFBF9 100%)' }}>
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid dots */}
          <svg className="absolute w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#c8171e"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>

          {/* Large faint circle */}
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl" />
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
              Associated with all top NABL & ISO Accredited labs • Mumbai's Trusted Lab
            </motion.div>

            {/* Search area relocated (Replaces Heading) */}
            <div className="max-w-3xl mx-auto mb-10 mt-4 px-2 sm:px-6">
              <div className="relative z-30 w-full mx-auto">
                <SearchBar className="mb-6 shadow-2xl ring-1 ring-primary/20" />
              </div>

              {/* Popular Test chips */}
              <div className="flex flex-wrap justify-center gap-2 items-center mb-6">
                <span className="text-sm font-semibold text-muted-foreground/70">Popular Tests:</span>
                {POPULAR_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      const match = searchItems(chip, "test")?.tests?.[0];
                      if (match) {
                        openModal(chip, match);
                      } else {
                        openModal(chip);
                      }
                    }}
                    className="px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-semibold text-foreground/80 hover:border-primary hover:text-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-150 shadow-sm cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Popular Packages Quick-links */}
              <div className="flex flex-wrap justify-center gap-3 items-center">
                <span className="text-sm font-semibold text-muted-foreground/70">Popular Packages:</span>
                {['Basic Health Checkup', 'Comprehensive Full Body', 'Senior Citizen Profile'].map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => {
                      document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-xl text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    {pkg}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Precision testing, fast digital reports, and compassionate care — right at your doorstep or at any of our premium centers.
            </p>

            {/* CTA strip */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button size="lg" onClick={() => openModal()} className="text-base px-10 h-[54px] shadow-[0_8px_30px_rgba(27,58,107,0.28)] hover:shadow-[0_12px_40px_rgba(27,58,107,0.38)] hover:-translate-y-0.5 transition-all duration-200 rounded-xl gap-2 font-bold">
                <Zap className="w-4 h-4" />
                Book a Test Now
              </Button>
              <Link href="/upload-prescription">
                <Button size="lg" variant="outline" className="text-base px-8 h-[52px] bg-white/80 backdrop-blur-sm gap-2 font-bold hover:-translate-y-0.5 transition-all duration-200 rounded-xl shadow-sm">
                  <FileText className="w-4 h-4" />
                  Upload Prescription
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ─── PACKAGES ─── */}
      <section id="packages" className="py-24 bg-gradient-to-b from-[#FDFBF9] to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <div className="text-primary text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Health Packages
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-foreground mb-3 pb-3 border-b-[3px] border-[#C9A227] inline-block">Comprehensive Health Packages</h2>
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
                <PackageCard key={pkg.id} pkg={pkg as any} index={idx} featured={idx === Math.min(2, (packages?.length ?? 0) - 1)} />
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
              className="rounded-3xl bg-gradient-to-br from-[#0F2347] to-[#1B3A6B] text-white p-8 md:p-10 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-8" />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Home className="w-7 h-7" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 text-red-100 text-xs font-bold border border-red-500/30">
                    <MapPin className="w-3.5 h-3.5" /> Only in Mumbai
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold font-sans mb-3 leading-tight">
                  Home Sample Collection
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  <strong className="text-white">Available exclusively across Mumbai.</strong> Skip the wait — our trained phlebotomists collect your sample safely from home. Digital reports within 24 hours.
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
                  className="bg-white text-primary hover:bg-red-50 font-bold h-12 px-7 rounded-xl shadow-lg"
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
              className="rounded-3xl border border-primary/15 p-8 md:p-10 flex flex-col relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #FDFBF9, #FEF2F2)' }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7 text-primary" />
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
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-3 h-3 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/upload-prescription">
                  <Button
                    variant="outline"
                    className="font-bold h-12 px-7 rounded-xl bg-white"
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
      {/* ─── WHY KLOUD ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans mb-3 pb-3 border-b-[3px] border-[#C9A227] inline-block">Why Choose Kloud Diagnostics?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Built on precision, trust, and care — here's what sets us apart.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BadgeCheck, color: 'bg-red-50 text-red-600', title: 'NABL Accredited', desc: 'ISO 9001:2015 certified labs meeting international standards for diagnostic accuracy.' },
              { icon: Zap, color: 'bg-[#C9A227]/10 text-[#A07D10]', title: 'Fast Reports', desc: 'Digital reports delivered within 24 hours. Urgent reports available in 4–6 hours.' },
              { icon: Home, color: 'bg-primary/10 text-primary', title: 'Home Collection', desc: 'Trained phlebotomists collect samples safely from your home at your preferred time.' },
              { icon: ShieldCheck, color: 'bg-success/10 text-success', title: '100% Accurate', desc: 'State-of-the-art equipment and rigorous QC protocols for reliable, precise results.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
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
      {/* ─── STATS STRIP ─── */}
      <section className="relative z-10 bg-gradient-to-r from-[#0F2347] via-primary to-[#0F2347] text-white py-12 shadow-2xl">
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
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold font-sans mb-1">{stat.value}</div>
                <div className="text-xs text-white/70 font-semibold uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-[#161616] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#C9A227] text-sm font-bold mb-4 border border-white/20">
              <span className="font-extrabold text-white">5.0</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <span className="text-white/80">(25+ Google Reviews)</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans mb-4">Trusted by Mumbai</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">Real words from our patients about our quick service, expert staff, and competitive rates.</p>
          </div>

          <div className="flex overflow-x-auto pb-10 -mx-4 px-4 md:mx-0 md:px-0 gap-6 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="hide-scrollbar min-w-[300px] md:min-w-[360px] snap-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 relative flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-1 text-[#C9A227]">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    {testimonial.verified && (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-success bg-success/10 px-2 py-1 rounded-full border border-success/20">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-base leading-relaxed mb-7 text-white/85 italic font-medium line-clamp-4">"{testimonial.text}"</p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center font-bold text-lg text-white shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{testimonial.name}</div>
                    <div className="text-[11px] text-white/40 mt-0.5">Google Reviewer</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a href="https://www.google.com/search?sca_esv=19f3513a7e185d8b&sxsrf=APpeQnt41rtX5uCGHjXI07eMGAGrDpzBwg:1785051367452&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-__PxNNunxOPuuvbcLHvCmapu88XbN239AxVoxf4yedoYM95LD5k7TdxWBQBzm0p0Oz_-0NjhVWNDpruuIehQwbIvtQBy8ultHnMdqIOgz00TVly2NA%3D%3D&q=KLOUD+Diagnostics+Reviews&sa=X&ved=2ahUKEwiPnqbF6u-VAxWm6jgGHYt4Ma8Q0bkNegQIKRAF&biw=1280&bih=665&dpr=1.5" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-extrabold h-[54px] px-10 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Write a Google Review
              </Button>
            </a>
          </div>
        </div>
      </section>
      {/* ─── FAQ SECTION ─── */}
      <section id="faq" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about booking tests, reports, and our services.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'border-primary/30 shadow-md' : 'border-border shadow-sm'}`}
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <span className="font-bold text-lg font-sans pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-primary' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed border-t border-gray-100 mt-2">
                        <div className="pt-4">{faq.answer}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT CTA ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-[#0F2347] to-primary rounded-[2.5rem] p-10 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-24 translate-x-24 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-red-400/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold font-sans mb-4">Have Questions? We're Here.</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Call us directly or visit our diagnostic center in Mazgaon, Mumbai. Our care team is available 7 days a week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:9699977171">
                  <Button className="bg-white text-primary hover:bg-red-50 font-bold h-[52px] px-8 text-base gap-2 shadow-lg rounded-xl">
                    <Phone className="w-5 h-5" />
                    Call: 9699977171
                  </Button>
                </a>
                <Link href="/contact">
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
    </div>
  );
}
