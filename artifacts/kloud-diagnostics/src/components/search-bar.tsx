import React, { useState, useEffect, useRef } from 'react';
import { searchItems } from '@/lib/data';
type CartItemItemType = 'test' | 'package';
import { useDebounce } from '@/lib/use-debounce';
import { useCart } from '@/lib/cart-context';
import { Search, Loader2, Plus, ArrowRight, Activity, Beaker, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => regex.test(part) ? (
        <mark key={i} className='bg-primary/15 text-primary rounded px-0.5 not-italic font-semibold'>{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      ))}
    </>
  );
}

export function SearchBar({ className, autoFocus = false }: { className?: string, autoFocus?: boolean }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [, setLocation] = useLocation();

  const data = query.length > 1 ? searchItems(debouncedQuery, "all") : { tests: [], packages: [] };
  const isLoading = false;

  useEffect(() => {
    setFocusedIndex(-1);
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = (item: any, type: CartItemItemType) => {
    addItem({
      itemId: item.id,
      itemType: type,
      name: item.name,
      price: item.price,
      quantity: 1
    });
    setIsOpen(false);
    setLocation('/book');
  };

  const hasResults = data && data.tests && data.tests.length > 0;

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-3xl z-50 ${className}`}>
      <div className="relative flex flex-row items-center w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] border border-white/60 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/20 focus-within:shadow-[0_8px_40px_rgba(13,148,136,0.12)] transition-all duration-300 overflow-hidden h-14 md:h-[60px]">
        <Search className="absolute left-5 text-muted-foreground w-6 h-6" />
        <input
          autoFocus={autoFocus}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            const tests = data?.tests || [];
            if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, tests.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, -1)); }
            else if (e.key === 'Enter' && focusedIndex >= 0 && tests[focusedIndex]) { handleAdd(tests[focusedIndex], 'test'); }
            else if (e.key === 'Escape') { setIsOpen(false); (e.target as HTMLInputElement).blur(); }
          }}
          placeholder="Search Blood Test, CBC, Vitamin D, Thyroid, Lipid Profile..."
          className="w-full h-full pl-14 pr-12 md:pr-16 bg-transparent border-none outline-none text-base md:text-lg text-foreground placeholder:text-muted-foreground font-medium"
        />
        {query && !isLoading && (
          <button type='button' onClick={() => { setQuery(''); setIsOpen(false); }} className='absolute right-5 p-1 rounded-full hover:bg-gray-100 transition-colors z-10'>
            <X className='w-4 h-4 text-muted-foreground' />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-5 w-5 h-5 text-primary animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50"
          >
            <div className="max-h-[400px] overflow-y-auto p-2">
              {!isLoading && !hasResults && (
                <div className='p-10 text-center'>
                  <div className='w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4'>
                    <Search className='w-6 h-6 text-muted-foreground/50' />
                  </div>
                  <p className='font-semibold text-foreground/70 mb-1'>No tests found</p>
                  <p className='text-sm text-muted-foreground'>Try searching CBC, Thyroid, Vitamin D, HbA1c...</p>
                </div>
              )}

              {hasResults && (
                <div>
                  <div className='px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-gray-100 mb-2'>
                    Lab Tests
                  </div>
                  {data.tests.map((test, index) => (
                    <div key={test.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors group cursor-pointer border ${index === focusedIndex ? 'bg-primary/8 border-primary/20' : 'border-transparent hover:bg-primary/5 hover:border-primary/10'}`}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {test.category === 'imaging' ? <Activity className="w-5 h-5" /> : <Beaker className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            <HighlightText text={test.name} query={debouncedQuery} />
                          </h4>
                          <div className="flex items-center gap-3 text-sm mt-1">
                            {(test as any).code && (
                              <span className="text-xs font-mono text-muted-foreground/70 bg-gray-100 px-1.5 py-0.5 rounded">
                                <HighlightText text={(test as any).code} query={debouncedQuery} />
                              </span>
                            )}
                            <span className="text-muted-foreground flex items-center">
                              <Clock className='w-3 h-3 inline mr-1 opacity-60' />
                              {test.turnaround}
                            </span>
                            {test.fastingRequired && (
                              <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded">Fasting Required</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4 shrink-0">
                        <div className="text-right">
                          <div className="font-bold text-lg">₹{test.price}</div>
                          {test.mrp && test.mrp > test.price && (
                            <div className="text-xs text-muted-foreground line-through">₹{test.mrp}</div>
                          )}
                        </div>
                        <Button size="sm" onClick={() => handleAdd(test, 'test')} variant="outline" className="group-hover:bg-primary group-hover:text-white rounded-full">
                          Book Test <Plus className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {hasResults && (
              <div className="border-t border-border p-3 bg-gray-50 text-center">
                <Button variant="ghost-primary" size="sm" className="w-full text-sm font-semibold" onClick={() => setLocation('/book')}>
                  View full catalog <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
