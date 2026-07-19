import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, ChevronRight, Activity, CalendarCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingModal } from '@/lib/booking-modal-context';
import kloudLogoMark from '@assets/images_1784483749826.jpg';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Packages', path: '/packages' },
  { name: 'Home Collection', path: '/home-collection' },
  { name: 'Locations', path: '/locations' },
  { name: 'Contact', path: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { openModal } = useBookingModal();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
            : 'bg-white/95 backdrop-blur-sm py-5 shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 z-50 group">
            <div className="flex flex-col justify-center">
              <span className="font-sans font-extrabold text-[22px] leading-none text-[#161616] tracking-tight">KLOUD</span>
              <span className="font-sans font-semibold text-[9px] leading-none text-muted-foreground uppercase tracking-[0.18em] mt-1">Diagnostics & Imaging</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-semibold transition-colors relative group ${
                  location === link.path ? 'text-primary' : 'text-foreground/75 hover:text-primary'
                }`}
              >
                {link.name}
                {location === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:9699977171"
              className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors mr-1 text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              9699977171
            </a>

            <Link href="/upload-prescription">
              <Button variant="outline" size="sm" className="text-sm font-semibold">
                Upload Rx
              </Button>
            </Link>

            <Button
              onClick={() => openModal()}
              className="gap-2 text-sm font-bold shadow-md"
              size="sm"
            >
              <CalendarCheck className="w-4 h-4" />
              Book a Test
            </Button>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <a href="tel:9699977171" className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </a>
            <button
              className="p-2 -mr-1 text-foreground z-50 relative"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6 pb-6 lg:hidden"
          >
            <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xl font-bold flex items-center justify-between border-b border-border/50 py-5 ${
                    location === link.path ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.name}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}

              <div className="mt-8 space-y-3">
                <Button
                  className="w-full gap-2 h-14 text-base"
                  onClick={() => { setMobileOpen(false); openModal(); }}
                >
                  <CalendarCheck className="w-5 h-5" />
                  Book a Test
                </Button>
                <Link href="/upload-prescription">
                  <Button variant="outline" className="w-full gap-2 h-12 text-sm">
                    Upload Prescription
                  </Button>
                </Link>
                <a
                  href="tel:9699977171"
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call: 9699977171
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#161616] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pb-12" style={{ borderBottom: '1px solid rgba(201,162,39,0.25)' }}>

          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <img
                src={kloudLogoMark}
                alt="Kloud"
                className="h-12 w-auto object-contain shrink-0"
                style={{ imageRendering: 'high-quality', filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(320deg)' }}
              />
              <div className="flex flex-col">
                <span className="font-sans font-extrabold text-xl leading-none tracking-tight">KLOUD</span>
                <span className="font-sans font-semibold text-[9px] leading-none text-white/50 uppercase tracking-widest mt-0.5">Diagnostics Blood Collection & Imaging</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Mumbai's trusted diagnostic center. NABL accredited labs delivering precision healthcare with warmth and accuracy.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="bg-primary/20 border border-primary/30 rounded-lg px-3 py-1.5 text-xs font-bold text-border">NABL Accredited</div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white/70">ISO 9001:2015</div>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(201,162,39,0.2)', paddingLeft: '2rem' }} className="md:pl-8">
            <h4 className="font-sans font-bold text-base mb-6 text-card">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Services', path: '/services' },
                { name: 'Health Packages', path: '/packages' },
                { name: 'Home Collection', path: '/home-collection' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Contact Us', path: '/contact' },
              ].map(l => (
                <li key={l.path}><Link href={l.path} className="hover:text-white transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div style={{ borderLeft: '1px solid rgba(201,162,39,0.2)', paddingLeft: '2rem' }} className="md:pl-8">
            <h4 className="font-sans font-bold text-base mb-6 text-card">Popular Tests</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {['Complete Blood Count (CBC)', 'Thyroid Profile (T3/T4/TSH)', 'HbA1c (Diabetes)', 'Vitamin D & B12', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test'].map(t => (
                <li key={t}><Link href="/packages" className="hover:text-white transition-colors">{t}</Link></li>
              ))}
            </ul>
          </div>

          <div style={{ borderLeft: '1px solid rgba(201,162,39,0.2)', paddingLeft: '2rem' }} className="md:pl-8">
            <h4 className="font-sans font-bold text-base mb-6 text-card">Contact Us</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Address</div>
                  <p className="text-white text-sm leading-relaxed">Shop No. 2, Abdul Rauf Manzil, Reay Road Station, Rambhau Bhogle Marg, opposite Haji Kasam Police Chowky, Mazgaon, Mumbai – 400010</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Call / WhatsApp</div>
                  <a href="tel:9699977171" className="text-white font-bold hover:text-primary transition-colors text-base">9699977171</a>
                  <div className="text-white/40 text-xs mt-0.5">Mon–Sat: 7AM – 9PM</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Email</div>
                  <a href="mailto:klouddiagnostics@gmail.com" className="text-white font-semibold hover:text-primary transition-colors text-sm break-all">klouddiagnostics@gmail.com</a>
                </div>
              </li>
            </ul>

            <div className="mt-6 space-y-2">
              <Link href="/upload-prescription">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 text-sm h-10">
                  Upload Prescription
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/5 text-sm h-10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
          <p>© {new Date().getFullYear()} Kloud Diagnostics & Imaging. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
      {/* Call Button */}
      <a
        href="tel:9699977171"
        className="w-13 h-13 w-[52px] h-[52px] bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform relative group"
        aria-label="Call us"
      >
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          Call: 9699977171
        </span>
        <Phone className="w-5 h-5" />
      </a>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919699977171"
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform relative group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          WhatsApp Us
        </span>
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Header />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
