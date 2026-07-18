import React, { useState, useEffect, useRef } from 'react';
import { useSearchTests, DiagnosticTestCategory, CartItemItemType } from '@workspace/api-client-react';
import { useDebounce } from '@/lib/use-debounce';
import { useCart } from '@/lib/cart-context';
import { Search, Loader2, Plus, ArrowRight, Activity, Beaker, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchBar({ className, autoFocus = false }: { className?: string, autoFocus?: boolean }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<DiagnosticTestCategory | 'all'>('all');
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [, setLocation] = useLocation();

  const { data, isLoading } = useSearchTests(
    { q: debouncedQuery, category: category !== 'all' ? category : undefined },
    { query: { enabled: debouncedQuery.length > 1 } }
  );

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

  const hasResults = data && ((data.tests && data.tests.length > 0) || (data.packages && data.packages.length > 0));

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-3xl z-50 ${className}`}>
      <div className="relative flex items-center bg-white rounded-full shadow-lg border border-border/50 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all overflow-hidden h-14 md:h-16">
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
          placeholder="Search for a test, package, or health concern..."
          className="w-full h-full pl-14 pr-4 bg-transparent border-none outline-none text-base md:text-lg text-foreground placeholder:text-muted-foreground font-medium"
        />
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
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-border overflow-hidden"
          >
            <div className="flex border-b border-border bg-gray-50/50 p-2 gap-2 overflow-x-auto">
              {(['all', 'blood', 'imaging', 'packages'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    category === cat 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-muted-foreground hover:bg-gray-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {!isLoading && !hasResults && (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>No tests or packages found for "{query}"</p>
                </div>
              )}

              {data?.packages && data.packages.length > 0 && (
                <div className="mb-4">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-gray-50 rounded-lg mb-2">
                    Health Packages
                  </div>
                  {data.packages.map(pkg => (
                    <div key={pkg.id} className="flex items-center justify-between p-3 hover:bg-primary/5 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-primary/10">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground shrink-0 mt-1">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{pkg.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{pkg.shortDescription || pkg.description}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {pkg.parameterCount} Parameters
                            </span>
                            {pkg.badge && (
                              <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4 shrink-0">
                        <div className="text-right">
                          <div className="font-bold text-lg">₹{pkg.price}</div>
                          {pkg.mrp && pkg.mrp > pkg.price && (
                            <div className="text-xs text-muted-foreground line-through">₹{pkg.mrp}</div>
                          )}
                        </div>
                        <Button size="sm" onClick={() => handleAdd(pkg, 'package')} variant="outline" className="group-hover:bg-primary group-hover:text-white rounded-full">
                          Add <Plus className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {data?.tests && data.tests.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-gray-50 rounded-lg mb-2">
                    Individual Tests
                  </div>
                  {data.tests.map(test => (
                    <div key={test.id} className="flex items-center justify-between p-3 hover:bg-primary/5 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-primary/10">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {test.category === 'imaging' ? <Activity className="w-5 h-5" /> : <Beaker className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{test.name}</h4>
                          <div className="flex items-center gap-3 text-sm mt-1">
                            <span className="text-muted-foreground">{test.turnaround}</span>
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
                          Add <Plus className="w-4 h-4 ml-1" />
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
