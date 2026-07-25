import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Star, Minus, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingModal, PackageInfo } from '@/lib/booking-modal-context';

interface PackageCardProps {
  pkg: PackageInfo;
  index: number;
  featured?: boolean;
}

export function PackageCard({ pkg, index, featured = false }: PackageCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { openPackageModal } = useBookingModal();

  const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity(prev => Math.min(10, prev + 1));

  const totalPrice = pkg.price * quantity;

  // Add the quantity to the package info so the modal can use it
  const handleBook = () => {
    openPackageModal({
      ...pkg,
      defaultQuantity: quantity,
      totalPrice: totalPrice,
    } as any);
  };

  const isPopular = pkg.badge?.toLowerCase().includes('popular');
  const isPremium = pkg.badge?.toLowerCase().includes('premium') || pkg.badge?.toLowerCase().includes('advance') || featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-3xl p-7 border shadow-md hover:shadow-[0_20px_60px_rgba(27,58,107,0.12)] hover:-translate-y-2 transition-all duration-300 flex flex-col group relative overflow-hidden ${
        isPopular ? 'border-primary/30' : isPremium ? 'border-[#C9A227]/50' : 'border-gray-100'
      }`}
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 ${
        isPremium ? 'bg-gradient-to-r from-[#C9A227] to-[#e8c547]' : 'bg-gradient-to-r from-primary to-[#0F2347]'
      }`} />
      
      {pkg.badge && (
        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/10 text-[#A07D10] text-xs font-bold mb-4 border border-[#C9A227]/30 absolute top-4 right-4'>
          <Star className='w-3 h-3 fill-current' /> {pkg.badge}
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 mt-2">
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Activity className="w-4 h-4" />
        </div>
        <span className="text-primary font-bold text-sm">{pkg.parameterCount} Parameters</span>
      </div>

      <h3 className="text-xl font-extrabold font-sans mb-2 group-hover:text-primary transition-colors pr-16">{pkg.name}</h3>
      <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
        {(pkg as any).shortDescription || pkg.description}
      </p>

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

      {/* Quantity Selector & Price Update */}
      <div className='mt-auto pt-5 border-t border-gray-100'>
        <div className='flex items-end justify-between gap-2 mb-4'>
          <div>
            <div className='text-xs text-muted-foreground mb-1'>Total Price</div>
            <div className='text-2xl font-extrabold text-foreground'>₹{totalPrice}</div>
            {pkg.mrp && pkg.mrp > pkg.price && (
              <span className='inline-flex items-center text-[10px] uppercase font-bold text-success'>
                Save ₹{(pkg.mrp - pkg.price) * quantity}
              </span>
            )}
          </div>
          
          <div className="flex flex-col items-end">
             <div className='text-[10px] text-muted-foreground uppercase font-bold mb-1 mr-1'>Persons</div>
             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
               <button 
                 onClick={handleDecrease}
                 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                 disabled={quantity <= 1}
               >
                 <Minus className="w-4 h-4" />
               </button>
               <div className="w-8 text-center font-bold text-sm select-none">
                 {quantity}
               </div>
               <button 
                 onClick={handleIncrease}
                 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                 disabled={quantity >= 10}
               >
                 <Plus className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>

        <Button 
          onClick={handleBook}
          className='w-full rounded-xl font-bold h-12 shadow-[0_8px_20px_rgba(27,58,107,0.12)] hover:shadow-[0_12px_25px_rgba(27,58,107,0.2)] transition-all'
        >
          Book Test
        </Button>
      </div>
    </motion.div>
  );
}
