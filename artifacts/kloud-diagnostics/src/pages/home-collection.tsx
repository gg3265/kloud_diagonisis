import React from 'react';
import { Home, ShieldCheck, Clock, FileText, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function HomeCollectionPage() {
  const steps = [
    {
      title: "Book Online",
      description: "Select your tests or upload a prescription. Choose a date and time slot that suits you.",
      icon: Clock,
    },
    {
      title: "Safe Visit",
      description: "Our certified phlebotomist arrives at your location with a sterile, single-use collection kit.",
      icon: Home,
    },
    {
      title: "Painless Collection",
      description: "Samples are collected quickly and transported to our NABL accredited lab in temperature-controlled bags.",
      icon: ShieldCheck,
    },
    {
      title: "Digital Reports",
      description: "Receive accurate, detailed reports via WhatsApp and email within 12-24 hours.",
      icon: FileText,
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 pt-20 pb-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 text-sm font-bold shadow-sm border border-red-500/20">
                <MapPin className="w-4 h-4" /> Available Only in Mumbai
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-sans text-foreground mb-6 tracking-tight">
              Skip the Visit.<br />We Come to You.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience precise diagnostic care without stepping out. Kloud Diagnostics brings Mumbai's most trusted lab services directly to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book">
                <Button size="lg" className="w-full sm:w-auto px-8 h-14 text-lg">Book Home Collection</Button>
              </Link>
              <Link href="/upload-prescription">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-14 text-lg bg-white">Upload Prescription</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">A seamless, hygienic, and precise process from start to finish.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border -z-10" />

            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-border shadow-sm text-center relative z-10"
              >
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 text-white">
                  <step.icon className="w-10 h-10" />
                </div>
                <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Step {i + 1}</div>
                <h3 className="text-xl font-bold font-sans mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-border shadow-xl flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold font-sans mb-6">Your Safety is Our Priority</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Every home visit follows strict clinical protocols to ensure zero contamination and absolute accuracy in your test results.
              </p>
              <ul className="space-y-4">
                {[
                  "Daily temperature checks for all phlebotomists",
                  "Fresh, sealed collection kits opened in front of you",
                  "Mandatory gloves, masks, and sanitization",
                  "Temperature-controlled sample transport"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full bg-primary/5 rounded-[2rem] p-8 border border-primary/10 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <ShieldCheck className="w-24 h-24 text-primary mx-auto mb-6 opacity-80" />
                <div className="text-2xl font-bold text-foreground">100% Secure</div>
                <div className="text-muted-foreground">NABL Certified Practices</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
