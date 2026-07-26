import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, Beaker, ArrowRight, ArrowLeft, Calendar, Clock,
  Phone, MapPin, Home, User, Mail, Activity,
  Droplets, ScanLine, FlaskConical, ChevronRight, RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingModal } from '@/lib/booking-modal-context';
import { searchItems } from '@/lib/data';
import { useDebounce } from '@/lib/use-debounce';

const TIME_SLOTS = [
  '07:00 AM – 08:00 AM', '08:00 AM – 09:00 AM', '09:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM', '12:00 PM – 02:00 PM',
  '02:00 PM – 04:00 PM', '04:00 PM – 06:00 PM', '06:00 PM – 08:00 PM',
];

const POPULAR_TESTS = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', price: 199, mrp: 299, category: 'blood', fastingRequired: false, turnaround: '4–6 hours', description: 'Measures RBC, WBC, haemoglobin, and platelets.' },
  { id: 'thyroid-t3t4tsh', name: 'Thyroid Profile (T3, T4, TSH)', price: 499, mrp: 750, category: 'blood', fastingRequired: false, turnaround: '6–8 hours', description: 'Comprehensive thyroid function assessment.' },
  { id: 'vitd', name: 'Vitamin D (25-OH)', price: 699, mrp: 1100, category: 'blood', fastingRequired: false, turnaround: '24 hours', description: 'Checks Vitamin D levels.' },
  { id: 'hba1c', name: 'HbA1c (Glycated Haemoglobin)', price: 349, mrp: 549, category: 'blood', fastingRequired: false, turnaround: '6–8 hours', description: '3-month average blood sugar.' },
  { id: 'lipid', name: 'Lipid Profile', price: 299, mrp: 499, category: 'blood', fastingRequired: true, turnaround: '4–6 hours', description: 'Cholesterol and triglycerides panel.' },
  { id: 'liver', name: 'Liver Function Test (LFT)', price: 399, mrp: 649, category: 'blood', fastingRequired: false, turnaround: '6–8 hours', description: 'Assesses liver enzymes, bilirubin, and protein.' },
];

interface TestItem {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  category: string;
  fastingRequired: boolean;
  turnaround: string;
  description?: string;
}

const getSampleType = (category: string) => {
  if (category === 'imaging') return 'Visit Center';
  return 'Blood';
};

const getSampleIcon = (category: string) => {
  if (category === 'imaging') return ScanLine;
  return Droplets;
};

const emptyForm = {
  patientName: '', patientAge: '', patientGender: 'male',
  phone: '', email: '', address: '', city: '', pincode: '',
  preferredDate: '', preferredTimeSlot: '08:00 AM – 09:00 AM',
  collectionType: 'home', notes: '',
};

export function TestBookingModal() {
  const { isOpen, closeModal, preSearch, preSelectedTest, showSuccessPopup } = useBookingModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState(emptyForm);

  const debouncedQuery = useDebounce(searchQuery, 250);
  const searchData = showDropdown && debouncedQuery.length >= 1 ? searchItems(debouncedQuery, "all") : null;
  const isLoading = false;

  // Only individual tests — never packages
  const tests: TestItem[] = (searchData?.tests || []) as TestItem[];

  const isHome = formData.collectionType === 'home';
  const homeFee = isHome && selectedTest ? 200 : 0;
  const grandTotal = selectedTest ? selectedTest.price + homeFee : 0;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (preSelectedTest) {
        setStep(2); // Jump straight to booking form
        setSelectedTest(preSelectedTest);
        setSearchQuery(preSelectedTest.name);
        setShowDropdown(false);
        setFocusedIndex(-1);
      } else {
        setStep(1);
        setSelectedTest(null);
        setFocusedIndex(-1);
        if (preSearch) {
          setSearchQuery(preSearch);
          setShowDropdown(true);
        } else {
          setSearchQuery('');
          setShowDropdown(false);
        }
      }
      setFormData(emptyForm);
    }
  }, [isOpen, preSearch, preSelectedTest]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const selectTest = (test: TestItem) => {
    setSelectedTest(test);
    setSearchQuery(test.name);
    setShowDropdown(false);
    setFocusedIndex(-1);
  };

  const clearTest = () => {
    setSelectedTest(null);
    setSearchQuery('');
    setShowDropdown(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSelectedTest(null);
    setShowDropdown(val.length >= 1);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || tests.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, tests.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && tests[focusedIndex]) selectTest(tests[focusedIndex]);
        break;
      case 'Escape':
        setShowDropdown(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTest) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('Patient_Name', formData.patientName);
      fd.append('Age', formData.patientAge);
      fd.append('Gender', formData.patientGender);
      fd.append('Mobile_Number', formData.phone);
      fd.append('Email', formData.email || 'Not provided');
      fd.append('Test_Name', selectedTest.name);
      fd.append('Test_Price', `₹${selectedTest.price}`);
      fd.append('Collection_Type', formData.collectionType === 'home' ? 'Home Collection' : 'Walk-in Center');
      fd.append('Preferred_Date', formData.preferredDate);
      fd.append('Preferred_Time', formData.preferredTimeSlot);
      if (formData.address) fd.append('Address', formData.address);
      if (formData.city) fd.append('City', formData.city);
      if (formData.pincode) fd.append('Pincode', formData.pincode);
      if (formData.notes) fd.append('Additional_Notes', formData.notes);
      fd.append('Total_Amount', `₹${grandTotal}`);
      // Unique subject to prevent Gmail threading
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      const uid = Math.random().toString(36).slice(2, 6).toUpperCase();
      const uniqueSubject = `New Test Booking - ${formData.patientName || 'Patient'} - ${timeStr} - ${uid}`;
      fd.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);
      fd.append('subject', uniqueSubject);
      fd.append('from_name', 'Kloud Diagnostics');

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        handleClose();
        showSuccessPopup('Our team will call you shortly to confirm your slot.');
      } else {
        alert('Submission failed. Please try again or call us directly.');
      }
    } catch {
      alert('Network error. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();
    setTimeout(() => {
      setStep(1); setSelectedTest(null); setSearchQuery('');
      setShowDropdown(false); setFormData(emptyForm);
    }, 300);
  };

  const field = (key: keyof typeof formData, val: string) => setFormData(f => ({ ...f, [key]: val }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-3 md:inset-8 lg:inset-[6%] z-[201] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: 'calc(100dvh - 48px)' }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-border bg-gradient-to-r from-teal-50 to-cyan-50 shrink-0">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="w-8 h-8 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors mr-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Back to test selection"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base md:text-lg font-sans leading-tight">
                    {step === 1 ? 'Book a Test' : step === 2 ? 'Your Details' : 'Booking Confirmed!'}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    {step === 1 ? 'Book Individual Diagnostic Tests' : step === 2 ? 'Fill in patient & collection details' : 'Our team will contact you shortly'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Step indicator */}
                <div className="hidden md:flex items-center gap-1.5">
                  {[1, 2].map(s => (
                    <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step > s ? 'bg-primary w-6' : step === s ? 'bg-primary w-8' : 'bg-gray-200 w-3'}`} />
                  ))}
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">

              {/* ── STEP 1: Select Test ── */}
              {step === 1 && (
                <div className="p-5 md:p-8 max-w-2xl mx-auto w-full">

                  {/* Search input */}
                  <div className="relative mb-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleInputChange}
                      onFocus={() => { if (searchQuery.length >= 1) setShowDropdown(true); }}
                      onKeyDown={handleKeyDown}
                      placeholder="Search CBC, Thyroid, Vitamin D, LFT…"
                      autoFocus
                      aria-label="Search for a diagnostic test"
                      aria-expanded={showDropdown}
                      aria-autocomplete="list"
                      className="w-full h-13 h-[52px] pl-11 pr-12 rounded-2xl border-2 border-input bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all text-sm font-medium shadow-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearTest}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* ── Inline dropdown results ── */}
                  <AnimatePresence>
                    {showDropdown && searchQuery.length >= 1 && (
                      <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden mb-4"
                      >
                        <div className="border-2 border-border rounded-2xl overflow-hidden bg-white shadow-lg">
                          {isLoading && (
                            <div className="p-6 text-center">
                              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Searching tests…</p>
                            </div>
                          )}

                          {!isLoading && tests.length === 0 && (
                            <div className="p-8 text-center">
                              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                <FlaskConical className="w-7 h-7 text-gray-300" />
                              </div>
                              <p className="font-semibold text-foreground/70 mb-1">No matching test found</p>
                              <p className="text-xs text-muted-foreground">Try searching CBC, Thyroid, Vitamin D, or LFT</p>
                            </div>
                          )}

                          {tests.map((test, i) => {
                            const SampleIcon = getSampleIcon(test.category);
                            const isFocused = focusedIndex === i;
                            return (
                              <button
                                key={test.id}
                                role="option"
                                aria-selected={isFocused}
                                onClick={() => selectTest(test)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-border/50 last:border-0 transition-colors text-left focus:outline-none
                                  ${isFocused ? 'bg-primary/8 bg-primary/[0.08]' : 'hover:bg-gray-50'}`}
                              >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${test.category === 'imaging' ? 'bg-purple-50 text-purple-500' : 'bg-teal-50 text-primary'}`}>
                                  <SampleIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate">{test.name}</p>
                                  <p className="text-xs text-muted-foreground">{getSampleType(test.category)} · {test.turnaround}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="font-bold text-sm text-foreground">₹{test.price}</p>
                                  {test.mrp && test.mrp > test.price && (
                                    <p className="text-[10px] text-muted-foreground line-through">₹{test.mrp}</p>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 px-1">
                          {tests.length > 0 ? `${tests.length} test${tests.length > 1 ? 's' : ''} found · Use ↑↓ keys to navigate, Enter to select` : ''}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Selected test card ── */}
                  <AnimatePresence>
                    {selectedTest && !showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                      >
                        <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-teal-50/60 to-white p-5 md:p-6 shadow-sm">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${selectedTest.category === 'imaging' ? 'bg-purple-100 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                                {selectedTest.category === 'imaging' ? <ScanLine className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-base text-foreground leading-tight">{selectedTest.name}</h3>
                                {selectedTest.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{selectedTest.description}</p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={clearTest}
                              className="shrink-0 flex items-center gap-1 text-xs text-primary hover:text-primary/70 font-semibold transition-colors focus:outline-none focus:underline"
                            >
                              <RotateCcw className="w-3 h-3" /> Change
                            </button>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 mb-5">
                            <span className="text-3xl font-extrabold text-foreground">₹{selectedTest.price}</span>
                            {selectedTest.mrp && selectedTest.mrp > selectedTest.price && (
                              <>
                                <span className="text-sm text-muted-foreground line-through">₹{selectedTest.mrp}</span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                  {Math.round((1 - selectedTest.price / selectedTest.mrp) * 100)}% off
                                </span>
                              </>
                            )}
                          </div>

                          {/* Details grid */}
                          <div className="grid grid-cols-3 gap-3 mb-5">
                            {[
                              { label: 'Sample', value: getSampleType(selectedTest.category) },
                              { label: 'Fasting', value: selectedTest.fastingRequired ? 'Yes (8 hrs)' : 'Not required' },
                              { label: 'Report', value: selectedTest.turnaround },
                            ].map(({ label, value }) => (
                              <div key={label} className="bg-white rounded-xl p-3 border border-border text-center">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                                <p className="text-xs font-bold text-foreground leading-tight">{value}</p>
                              </div>
                            ))}
                          </div>

                          <Button
                            onClick={() => setStep(2)}
                            size="lg"
                            className="w-full gap-2 font-bold text-base h-[50px] rounded-xl shadow-lg"
                          >
                            Book This Test <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Popular tests (empty state) ── */}
                  {!showDropdown && !selectedTest && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        Popular Tests
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {POPULAR_TESTS.map(test => (
                          <button
                            key={test.id}
                            onClick={() => selectTest(test)}
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-white hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all duration-200 text-left group focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                              <Droplets className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-xs truncate text-foreground/90">{test.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{test.turnaround}</p>
                            </div>
                            <div className="shrink-0">
                              <p className="text-xs font-bold text-primary">₹{test.price}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-6 text-center py-6 border-2 border-dashed border-border rounded-2xl">
                        <FlaskConical className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Search and select a diagnostic test above</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">500+ tests available at discounted prices</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ── STEP 2: Patient Details ── */}
              {step === 2 && (
                <form id="test-booking-form" onSubmit={handleSubmit}>
                  <div className="p-5 md:p-8 max-w-2xl mx-auto w-full space-y-5">

                    {/* Selected test reminder */}
                    {selectedTest && (
                      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Beaker className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold text-foreground">{selectedTest.name}</span>
                        </div>
                        <span className="font-extrabold text-primary">₹{selectedTest.price}</span>
                      </div>
                    )}

                    {/* Patient info header */}
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pt-1">Patient Information</h3>

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground/80">
                        <User className="w-3.5 h-3.5 text-primary" /> Full Name
                      </label>
                      <input required type="text" value={formData.patientName}
                        onChange={e => field('patientName', e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                    </div>

                    {/* Age + Gender */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground/80">Age</label>
                        <input required type="number" min="1" max="120" value={formData.patientAge}
                          onChange={e => field('patientAge', e.target.value)}
                          placeholder="Years"
                          className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground/80">Gender</label>
                        <select value={formData.patientGender}
                          onChange={e => field('patientGender', e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Phone + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground/80">
                          <Phone className="w-3.5 h-3.5 text-primary" /> Mobile Number
                        </label>
                        <input required type="tel" pattern="[0-9]{10}" value={formData.phone}
                          onChange={e => field('phone', e.target.value)}
                          placeholder="10-digit number"
                          className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground/80">
                          <Mail className="w-3.5 h-3.5 text-primary" /> Email (optional)
                        </label>
                        <input type="email" value={formData.email}
                          onChange={e => field('email', e.target.value)}
                          placeholder="your@email.com"
                          className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                      </div>
                    </div>

                    {/* Collection type */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground/80 block">Collection Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { val: 'home', label: 'Home Collection', sub: 'We come to you', icon: Home },
                          { val: 'walkin', label: 'Walk-in Center', sub: 'Visit our lab', icon: MapPin },
                        ].map(({ val, label, sub, icon: Icon }) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => field('collectionType', val)}
                            className={`rounded-xl border-2 p-4 flex items-center gap-3 transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary
                              ${formData.collectionType === val ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/40'}`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.collectionType === val ? 'border-primary' : 'border-muted-foreground/30'}`}>
                              {formData.collectionType === val && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                            <div>
                              <div className="font-bold text-sm flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {label}</div>
                              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Address (home only) */}
                    {isHome && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground/80">
                              <MapPin className="w-3.5 h-3.5 text-primary" /> Full Address
                            </label>
                            <textarea required rows={2} value={formData.address}
                              onChange={e => field('address', e.target.value)}
                              placeholder="Flat/House No, Building, Street, Area"
                              className="w-full p-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-foreground/80">City</label>
                              <input type="text" value={formData.city}
                                onChange={e => field('city', e.target.value)}
                                placeholder="Mumbai"
                                className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-foreground/80">Pincode</label>
                              <input required type="text" pattern="[0-9]{6}" value={formData.pincode}
                                onChange={e => field('pincode', e.target.value)}
                                placeholder="6-digit pincode"
                                className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Date + Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground/80">
                          <Calendar className="w-3.5 h-3.5 text-primary" /> Preferred Date
                        </label>
                        <input required type="date" min={new Date().toISOString().split('T')[0]} value={formData.preferredDate}
                          onChange={e => field('preferredDate', e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground/80">
                          <Clock className="w-3.5 h-3.5 text-primary" /> Preferred Time
                        </label>
                        <select required value={formData.preferredTimeSlot}
                          onChange={e => field('preferredTimeSlot', e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none">
                          {TIME_SLOTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground/80">Additional Notes (optional)</label>
                      <textarea rows={2} value={formData.notes}
                        onChange={e => field('notes', e.target.value)}
                        placeholder="Any special instructions or medical notes…"
                        className="w-full p-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-sm" />
                    </div>

                    {/* Order summary + submit */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Amount</p>
                        <p className="text-2xl font-extrabold text-primary">₹{grandTotal}</p>
                        {isHome && homeFee > 0 && <p className="text-xs text-orange-500 mt-0.5">Includes ₹200 home collection fee</p>}
                      </div>
                      <Button
                        type="submit"
                        form="test-booking-form"
                        size="lg"
                        className="w-full sm:w-auto px-8 font-bold rounded-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</span>
                        ) : 'Confirm Booking'}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
