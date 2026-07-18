import React from 'react';
import { useListLocations } from '@workspace/api-client-react';
import { MapPin, Phone, Mail, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocationsPage() {
  const { data: locations, isLoading } = useListLocations();

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">Our Centers</h1>
          <p className="text-xl text-muted-foreground">
            Visit any of our premium NABL-accredited diagnostic centers across Mumbai. Equipped with world-class technology and compassionate staff.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-3xl p-6 h-64 animate-pulse border border-border shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations?.map((loc, i) => (
              <motion.div 
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-sans mb-1 group-hover:text-primary transition-colors">{loc.name}</h2>
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {loc.area}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                    <p className="text-sm text-foreground/80 leading-relaxed">{loc.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                    <a href={`tel:${loc.phone.replace(/[^0-9+]/g, '')}`} className="text-sm font-semibold hover:text-primary">{loc.phone}</a>
                  </div>
                  {loc.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                      <a href={`mailto:${loc.email}`} className="text-sm font-medium hover:text-primary">{loc.email}</a>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                    <p className="text-sm font-medium">{loc.hours}</p>
                  </div>
                </div>

                <a 
                  href={loc.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(loc.name + ' ' + loc.address)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-auto flex items-center justify-center w-full py-4 rounded-xl border-2 border-primary/20 text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors gap-2"
                >
                  Get Directions <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
