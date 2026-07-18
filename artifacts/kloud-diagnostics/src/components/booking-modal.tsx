import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Trash2, User, Phone, Home, MapPin, Calendar, Clock, CheckCircle2, ArrowLeft, ArrowRight, Beaker, Activity, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingModal } from '@/lib/booking-modal-context';
import { useCart } from '@/lib/cart-context';
import { useSearchTests, useCreateBooking, DiagnosticTestCategory, CartItemItemType, BookingInputCollectionType, BookingInputPatientGender } from '@workspace/api-client-react';
import { useDebounce } from '@/lib/use-debounce';

const TIME_SLOTS = [
  '07:00 AM - 08:00 AM',
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

export function BookingModal() {
  const { isOpen, closeModal, preSearch } = useBookingModal();
  const { items, addItem, removeItem, total, clearCart } = useCart();
  const createBooking = useCreateBooking();

  const [step, setStep] = useState(1); // 1 = select tests, 2 = patient details, 3 = success
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [category, setCategory] = useState<DiagnosticTestCategory | 'all'>('all');

  const { data: searchData, isLoading } = useSearchTests(
    { q: debouncedQuery, category: category !== 'all' ? category : undefined },
    { query: { enabled: debouncedQuery.length > 1 } }
  );

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'male' as BookingInputPatientGender,
    phone: '',
    address: '',
    pincode: '',
    preferredDate: '',
    preferredTimeSlot: '08:00 AM - 09:00 AM',
    collectionType: 'home' as BookingInputCollectionType,
    notes: '',
  });

  const isHome = formData.collectionType === 'home';
  const homeFee = isHome ? (total >= 1500 ? 0 : 150) : 0;
  const grandTotal = total + homeFee;

  useEffect(() => {
    if (isOpen && preSearch) {
      setSearchQuery(preSearch);
      setSearchOpen(true);
    }
    if (isOpen) setStep(1);
  }, [isOpen, preSearch]);

  const handleAdd = (item: any, type: CartItemItemType) => {
    addItem({ itemId: item.id, itemType: type, name: item.name, price: item.price, quantity: 1 });
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    createBooking.mutate({
      data: {
        ...formData,
        patientAge: parseInt(formData.patientAge, 10),
        items,
        totalAmount: grandTotal,
        homeCollectionFee: homeFee,
      }
    }, {
      onSuccess: () => {
        setStep(3);
        clearCart();
      }
    });
  };

  const handleClose = () => {
    closeModal();
    setTimeout(() => {
      setStep(1);
      setSearchQuery('');
      setFormData({
        patientName: '', patientAge: '', patientGender: 'male',
        phone: '', address: '', pincode: '',
        preferredDate: '', preferredTimeSlot: '08:00 AM - 09:00 AM',
        collectionType: 'home', notes: '',
      });
    }, 300);
  };

  const hasResults = searchData && ((searchData.tests && searchData.tests.length > 0) || (searchData.packages && searchData.packages.length > 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[201] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-teal-50 shrink-0">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="w-8 h-8 rounded-full bg-white shadow-sm border border-border flex items-center justify-center hover:bg-gray-50 transition-colors mr-1">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg font-sans leading-none">
                    {step === 1 ? 'Book a Test' : step === 2 ? 'Your Details' : 'Booking Confirmed!'}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step === 1 ? 'Search & select tests or packages' : step === 2 ? 'Fill patient & collection info' : 'We\'ll contact you shortly'}
                  </p>
                </div>
              </div>

              {/* Step dots */}
              <div className="hidden md:flex items-center gap-2 mr-4">
                {[1, 2].map(s => (
                  <div key={s} className={`h-2 rounded-full transition-all duration-300 ${step >= s ? 'bg-primary w-8' : 'bg-gray-200 w-2'}`} />
                ))}
              </div>

              <button onClick={handleClose} className="w-9 h-9 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {/* ─── STEP 1: Search & Select ─── */}
              {step === 1 && (
                <div className="flex flex-col lg:flex-row h-full min-h-0">
                  {/* Left: Search */}
                  <div className="flex-1 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
                    <h3 className="font-bold text-base mb-4 text-foreground/70 uppercase tracking-wider text-xs">Search Tests & Packages</h3>

                    {/* Search input */}
                    <div className="relative mb-3">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                        onFocus={() => setSearchOpen(true)}
                        placeholder="Search CBC, Thyroid, Full Body..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium"
                        autoFocus
                      />
                    </div>

                    {/* Category pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                      {(['all', 'blood', 'imaging', 'packages'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => { setCategory(cat); setSearchOpen(true); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${category === cat ? 'bg-primary text-white' : 'bg-gray-100 text-foreground/70 hover:bg-gray-200'}`}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Results */}
                    {searchOpen && debouncedQuery.length > 1 && (
                      <div className="rounded-2xl border border-border overflow-hidden bg-white shadow-sm">
                        {isLoading && (
                          <div className="p-6 text-center text-muted-foreground text-sm">Searching...</div>
                        )}

                        {!isLoading && !hasResults && (
                          <div className="p-8 text-center text-muted-foreground">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No results for "{debouncedQuery}"</p>
                          </div>
                        )}

                        {searchData?.packages && searchData.packages.length > 0 && (
                          <div>
                            <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-gray-50 border-b border-border">Health Packages</div>
                            {searchData.packages.map(pkg => (
                              <div key={pkg.id} className="flex items-center justify-between p-3 hover:bg-primary/5 transition-colors border-b border-border/50 last:border-0 group">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-primary flex items-center justify-center shrink-0">
                                    <Activity className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">{pkg.name}</p>
                                    <p className="text-xs text-muted-foreground">{pkg.parameterCount} Parameters</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 ml-2">
                                  <span className="font-bold text-sm">₹{pkg.price}</span>
                                  <button onClick={() => handleAdd(pkg, 'package')} className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center">
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {searchData?.tests && searchData.tests.length > 0 && (
                          <div>
                            <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-gray-50 border-b border-border">Individual Tests</div>
                            {searchData.tests.map(test => (
                              <div key={test.id} className="flex items-center justify-between p-3 hover:bg-primary/5 transition-colors border-b border-border/50 last:border-0 group">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Beaker className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">{test.name}</p>
                                    <p className="text-xs text-muted-foreground">{test.turnaround}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 ml-2">
                                  <span className="font-bold text-sm">₹{test.price}</span>
                                  <button onClick={() => handleAdd(test, 'test')} className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center">
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Popular quick picks */}
                    {!searchOpen || debouncedQuery.length < 2 ? (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Popular Searches</p>
                        <div className="flex flex-wrap gap-2">
                          {['CBC', 'Thyroid Profile', 'Diabetes Panel', 'Vitamin D', 'Liver Function', 'HbA1c', 'Lipid Profile'].map(chip => (
                            <button
                              key={chip}
                              onClick={() => { setSearchQuery(chip); setSearchOpen(true); }}
                              className="px-3 py-1.5 bg-white border border-border rounded-full text-xs font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors shadow-sm"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Right: Selected items */}
                  <div className="w-full lg:w-[340px] shrink-0 p-6 md:p-8 flex flex-col bg-gray-50/50">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Selected Tests ({items.length})</h3>

                    {items.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center mx-auto mb-4 text-primary/30">
                          <Beaker className="w-8 h-8" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">No tests added yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Search and add tests or packages</p>
                      </div>
                    ) : (
                      <div className="flex-1 space-y-2 overflow-y-auto mb-6">
                        <AnimatePresence>
                          {items.map(item => (
                            <motion.div
                              key={item.itemId}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="bg-white rounded-xl p-3 flex items-center justify-between border border-border shadow-sm"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{item.itemType}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span className="font-bold text-sm text-primary">₹{item.price}</span>
                                <button onClick={() => removeItem(item.itemId)} className="w-7 h-7 rounded-full hover:bg-red-50 hover:text-red-500 text-muted-foreground flex items-center justify-center transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}

                    {items.length > 0 && (
                      <div className="mt-auto space-y-3">
                        <div className="bg-white rounded-2xl p-4 border border-border">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-semibold">₹{total}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Home Collection</span>
                            <span className="font-semibold text-green-600">{homeFee === 0 ? 'FREE' : `₹${homeFee}`}</span>
                          </div>
                          <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                            <span>Total</span>
                            <span className="text-primary">₹{grandTotal}</span>
                          </div>
                        </div>

                        <Button onClick={() => setStep(2)} size="lg" className="w-full gap-2">
                          Continue to Details <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─── STEP 2: Patient Details ─── */}
              {step === 2 && (
                <form id="modal-booking-form" onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                  {/* Patient info */}
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Patient Information</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Full Name</label>
                    <input required type="text" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="e.g. Priya Sharma" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Age</label>
                      <input required type="number" min="1" max="120" value={formData.patientAge}
                        onChange={e => setFormData({ ...formData, patientAge: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        placeholder="Years" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Gender</label>
                      <select value={formData.patientGender} onChange={e => setFormData({ ...formData, patientGender: e.target.value as BookingInputPatientGender })}
                        className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm appearance-none">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Mobile Number</label>
                    <input required type="tel" pattern="[0-9]{10}" value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="10-digit number" />
                  </div>

                  {/* Collection type */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-sm font-semibold block">Collection Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div onClick={() => setFormData({ ...formData, collectionType: 'home' })}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${isHome ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/40'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isHome ? 'border-primary' : 'border-muted-foreground/30'}`}>
                          {isHome && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm flex items-center gap-1.5"><Home className="w-3.5 h-3.5" /> Home Collection</div>
                          <p className="text-xs text-muted-foreground mt-0.5">We come to you</p>
                        </div>
                      </div>
                      <div onClick={() => setFormData({ ...formData, collectionType: 'walkin' })}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${!isHome ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/40'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${!isHome ? 'border-primary' : 'border-muted-foreground/30'}`}>
                          {!isHome && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Walk-in Center</div>
                          <p className="text-xs text-muted-foreground mt-0.5">Visit our lab</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isHome && (
                    <>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Full Address</label>
                        <textarea required rows={2} value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                          className="w-full p-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-sm"
                          placeholder="House/Flat No, Building, Street, Area" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Pincode</label>
                        <input required type="text" pattern="[0-9]{6}" value={formData.pincode}
                          onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                          placeholder="6-digit pincode" />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Preferred Date</label>
                    <input required type="date" min={new Date().toISOString().split('T')[0]} value={formData.preferredDate}
                      onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Preferred Time Slot</label>
                    <select required value={formData.preferredTimeSlot}
                      onChange={e => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm appearance-none">
                      {TIME_SLOTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Order summary strip */}
                  <div className="md:col-span-2 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">₹{grandTotal}</p>
                      {isHome && total < 1500 && (
                        <p className="text-xs text-orange-600 mt-0.5">Includes ₹150 home collection fee</p>
                      )}
                      {isHome && total >= 1500 && (
                        <p className="text-xs text-green-600 mt-0.5">Free home collection unlocked 🎉</p>
                      )}
                    </div>
                    <Button type="submit" form="modal-booking-form" size="lg" className="px-8" disabled={createBooking.isPending}>
                      {createBooking.isPending ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                  </div>
                </form>
              )}

              {/* ─── STEP 3: Success ─── */}
              {step === 3 && (
                <div className="flex-1 flex items-center justify-center p-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="text-center max-w-md"
                  >
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold font-sans mb-3">Booking Confirmed!</h2>
                    <p className="text-muted-foreground text-lg mb-2">
                      Thank you, <strong>{formData.patientName}</strong>!
                    </p>
                    <p className="text-muted-foreground mb-8">
                      Our team will call you on <strong>{formData.phone}</strong> to confirm your slot. Report will be available within 24 hours.
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-border text-sm mb-8 text-left space-y-2">
                      <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-semibold">{formData.preferredDate}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-semibold">{formData.preferredTimeSlot}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-semibold capitalize">{formData.collectionType === 'home' ? 'Home Collection' : 'Walk-in'}</span></div>
                      <div className="flex justify-between border-t border-border pt-2"><span className="font-bold">Total</span><span className="font-bold text-primary">₹{grandTotal}</span></div>
                    </div>
                    <Button size="lg" onClick={handleClose} className="w-full">Close</Button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
