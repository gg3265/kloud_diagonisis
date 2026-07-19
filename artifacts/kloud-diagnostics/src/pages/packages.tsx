import React from 'react';
import { useListPackages } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight } from 'lucide-react';
import { useBookingModal, PackageInfo } from '@/lib/booking-modal-context';
import { motion } from 'framer-motion';

export default function PackagesPage() {
  const { data: packages, isLoading } = useListPackages();
  const { openPackageModal } = useBookingModal();

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
              <motion.div 
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl p-8 border shadow-sm hover:shadow-[0_20px_60px_rgba(200,16,46,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden border-gray-100"
              >
                {/* Permanent red top border */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-[#7A0C1E]" />
                {pkg.badge && (
                  <div className="absolute top-1.5 right-0 bg-[#C9A227] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10 shadow-sm">
                    {pkg.badge}
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4 text-primary font-semibold">
                  <Activity className="w-5 h-5" />
                  <span>{pkg.parameterCount} Parameters</span>
                  {pkg.fastingRequired && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider bg-warning/10 text-warning px-2 py-1 rounded">
                      Fasting Required
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold font-sans mb-3 group-hover:text-primary transition-colors">{pkg.name}</h3>
                <p className="text-muted-foreground mb-6 text-sm">{pkg.description}</p>
                
                {pkg.includes && pkg.includes.length > 0 && (
                  <div className="mb-6 flex-1">
                    <p className="text-sm font-semibold mb-3">Key tests included:</p>
                    <ul className="space-y-2">
                      {pkg.includes.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                          <span className="text-foreground/80">{item}</span>
                        </li>
                      ))}
                      {pkg.includes.length > 4 && (
                        <li className="text-sm text-primary font-medium pl-3.5 pt-1">
                          + {pkg.includes.length - 4} more tests
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="pt-6 border-t border-border mt-auto flex items-end justify-between bg-white relative z-10">
                  <div>
                    {pkg.mrp && pkg.mrp > pkg.price && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground line-through">₹{pkg.mrp}</span>
                        <span className="text-xs font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">
                          {Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100)}% OFF
                        </span>
                      </div>
                    )}
                    <div className="text-3xl font-bold text-foreground">₹{pkg.price}</div>
                  </div>
                  <Button 
                    onClick={() => openPackageModal({
                      id: pkg.id,
                      name: pkg.name,
                      price: pkg.price,
                      mrp: pkg.mrp,
                      parameterCount: pkg.parameterCount,
                      includes: pkg.includes,
                      fastingRequired: pkg.fastingRequired,
                    } as PackageInfo)}
                    className="rounded-xl shadow-md"
                  >
                    Book Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
