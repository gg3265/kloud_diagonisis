import React from 'react';
import { PACKAGES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight } from 'lucide-react';
import { PackageCard } from '@/components/package-card';
import { motion } from 'framer-motion';

export default function PackagesPage() {
  const packages = PACKAGES;
  const isLoading = false;

  return (
    <div className="bg-[#FDFBF9] min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">Health Packages</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Comprehensive preventive care designed for your lifestyle. Select a package to book a home collection or walk-in appointment.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl p-6 h-80 animate-pulse border border-border shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded w-full mb-8"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages?.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg as any} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
