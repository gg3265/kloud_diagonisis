import React from 'react';
import { SearchBar } from '@/components/search-bar';
import { Microscope, Activity, Beaker, HeartPulse, Bone, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const PATHOLOGY_SERVICES = [
  { name: 'Complete Blood Count (CBC)', icon: Beaker },
  { name: 'Thyroid Profile', icon: Activity },
  { name: 'Lipid Profile', icon: HeartPulse },
  { name: 'Liver Function Test', icon: Beaker },
  { name: 'Kidney Function Test', icon: Beaker },
  { name: 'Diabetes Screening', icon: Activity },
];

const IMAGING_SERVICES = [
  { name: 'Digital X-Ray', icon: Bone },
  { name: 'High-Res Ultrasound', icon: Microscope },
  { name: 'ECG / EKG', icon: HeartPulse },
  { name: 'MRI Scan', icon: Brain },
  { name: 'CT Scan', icon: Brain },
  { name: 'Color Doppler', icon: Activity },
];

export default function ServicesPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-6">Medical Diagnostics & Imaging</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Comprehensive testing facilities equipped with advanced technology. We offer thousands of tests across pathology, radiology, and specialized diagnostics.
          </p>
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-border/50 transform -translate-y-4">
            <h2 className="text-lg font-bold mb-4">Find a Specific Test</h2>
            <SearchBar className="max-w-none" />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          
          {/* Pathology */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-border shadow-sm"
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
              <Beaker className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold font-sans mb-4">Pathology Lab</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Fully automated, NABL-accredited pathology laboratory ensuring precise and rapid results for blood, urine, and body fluid tests.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {PATHOLOGY_SERVICES.map((svc, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-border">
                  <svc.icon className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">{svc.name}</span>
                </div>
              ))}
            </div>

            <Link href="/book" className="inline-flex items-center text-primary font-bold hover:underline group">
              Book a Blood Test <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Radiology */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-border shadow-sm"
          >
            <div className="w-16 h-16 bg-secondary/20 text-secondary-foreground rounded-2xl flex items-center justify-center mb-8">
              <Bone className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold font-sans mb-4">Radiology & Imaging</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              State-of-the-art imaging center providing high-resolution scans for accurate clinical diagnosis. Walk-in appointments available.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {IMAGING_SERVICES.map((svc, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-border">
                  <svc.icon className="w-5 h-5 text-secondary-foreground" />
                  <span className="font-semibold text-sm">{svc.name}</span>
                </div>
              ))}
            </div>

            <Link href="/contact" className="inline-flex items-center text-primary font-bold hover:underline group">
              Find an Imaging Center <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
