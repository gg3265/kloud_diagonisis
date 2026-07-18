import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Phone, Menu, X, ShoppingCart, ChevronRight, Activity, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Packages', path: '/packages' },
  { name: 'Home Collection', path: '/home-collection' },
  { name: 'Locations', path: '/locations' },
  { name: 'Track Report', path: '/reports' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
            : 'bg-white py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-50 group">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center transform transition-transform group-hover:scale-105 group-hover:rotate-3 shadow-md">
              <CloudRain className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-xl leading-none text-primary tracking-tight">Kloud</span>
              <span className="font-sans font-semibold text-[10px] leading-none text-muted-foreground uppercase tracking-wider">Diagnostics & Imaging</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-semibold transition-colors hover:text-primary ${
                  location === link.path ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary font-bold mr-2">
              <Phone className="w-4 h-4" />
              <span>022-4567-8900</span>
            </div>
            
            <Link href="/book">
              <div className="relative cursor-pointer text-foreground hover:text-primary transition-colors p-2">
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>

            <Button variant="secondary" onClick={() => setLocation('/book')}>
              Book a Test
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-4">
            <Link href="/book">
              <div className="relative cursor-pointer text-foreground p-2">
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>
            <button
              className="p-2 -mr-2 text-foreground z-50 relative"
              onClick={() => setMobileOpen(!mobileOpen)}
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6 pb-6 lg:hidden"
          >
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-sans font-bold flex items-center justify-between border-b border-border pb-4 ${
                    location === link.path ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.name}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
              
              <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 text-primary font-bold text-xl mb-4">
                  <Phone className="w-6 h-6" />
                  <span>022-4567-8900</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Call us directly to book a home collection or ask for assistance.</p>
                <Button className="w-full" size="lg" variant="secondary" onClick={() => { setMobileOpen(false); setLocation('/book'); }}>
                  Book a Test
                </Button>
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
    <footer className="bg-foreground text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
          
          <div>
            <div className="flex items-center gap-2 mb-6 opacity-90">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <CloudRain className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-xl leading-none tracking-tight">Kloud</span>
                <span className="font-sans font-semibold text-[10px] leading-none text-white/60 uppercase tracking-wider">Diagnostics & Imaging</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Mumbai's premium diagnostic center bringing precision healthcare and warmth together. Accredited excellence.
            </p>
            <div className="flex gap-4">
              {/* Accreditations fake badges */}
              <div className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs font-bold text-white/80">NABL Accredited</div>
              <div className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs font-bold text-white/80">ISO 9001:2015</div>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/home-collection" className="hover:text-white transition-colors">Home Collection</Link></li>
              <li><Link href="/locations" className="hover:text-white transition-colors">Branch Locations</Link></li>
              <li><Link href="/reports" className="hover:text-white transition-colors">Track Report</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-bold text-lg mb-6">Popular Packages</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/packages" className="hover:text-white transition-colors">Complete Body Checkup</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Senior Citizen Package</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Diabetes Care Panel</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Women's Health Check</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <div className="font-bold text-white">022-4567-8900</div>
                  <div className="text-xs">Mon-Sat: 7AM - 9PM</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <div className="text-white">care@klouddiagnostics.in</div>
                </div>
              </li>
            </ul>
            
            <div className="mt-6">
              <Link href="/upload-prescription">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Upload Prescription
                </Button>
              </Link>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Kloud Diagnostics & Imaging. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a 
        href="whatsapp://send?phone=+919876543210" 
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform relative group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute right-full mr-4 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat on WhatsApp
        </span>
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
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
