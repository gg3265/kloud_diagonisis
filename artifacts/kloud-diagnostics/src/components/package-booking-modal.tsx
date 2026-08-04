import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Activity, Calendar, Clock, Phone, MapPin, Home, User,
  Mail, CheckCircle2, Users, UserPlus, ArrowLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingModal } from '@/lib/booking-modal-context';
import { BookingInputCollectionType, BookingInputPatientGender } from '@workspace/api-client-react';

const TIME_SLOTS = [
  '07:00 AM – 08:00 AM', '08:00 AM – 09:00 AM', '09:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM', '12:00 PM – 02:00 PM',
  '02:00 PM – 04:00 PM', '04:00 PM – 06:00 PM', '06:00 PM – 08:00 PM',
];

const emptyPerson = {
  name: '', age: '', gender: 'male' as BookingInputPatientGender,
  phone: '', email: '',
};

const emptyForm = {
  person1: { ...emptyPerson },
  address: '',
  city: '',
  pincode: '',
  preferredDate: '',
  preferredTimeSlot: '08:00 AM – 09:00 AM',
  collectionType: 'home' as BookingInputCollectionType,
  notes: '',
};

type FormState = typeof emptyForm;
type PersonKey = 'person1';

export function PackageBookingModal() {
  const { isPackageModalOpen, closePackageModal, selectedPackage, showSuccessPopup } = useBookingModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  const isHome = formData.collectionType === 'home';
  const personCount = (selectedPackage as any)?.defaultQuantity || 1;
  const packageTotal = selectedPackage ? ((selectedPackage as any)?.totalPrice || selectedPackage.price * personCount) : 0;
  const isFreeCollectionApplied = isHome && packageTotal >= 1500;
  const homeFee = isHome && !isFreeCollectionApplied ? 200 : 0;
  const grandTotal = packageTotal + homeFee;

  useEffect(() => {
    if (isPackageModalOpen) {
      setStep(2); // Skip straight to the form
      setFormData(emptyForm);
    }
  }, [isPackageModalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    if (isPackageModalOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isPackageModalOpen]);

  const setPerson = (person: PersonKey, key: string, val: string) =>
    setFormData(f => ({ ...f, [person]: { ...f[person], [key]: val } }));

  const setField = (key: keyof FormState, val: any) =>
    setFormData(f => ({ ...f, [key]: val }));

  const handleClose = () => {
    closePackageModal();
    setTimeout(() => { setStep(2); setFormData(emptyForm); }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setIsSubmitting(true);

    const { person1 } = formData;
    try {
      const fd = new FormData();
      fd.append('Package_Name', selectedPackage.name);
      fd.append('Number_of_Persons', String(personCount));
      fd.append('Lead_Patient_Name', person1.name);
      fd.append('Lead_Patient_Age', person1.age);
      fd.append('Lead_Patient_Gender', person1.gender);
      fd.append('Lead_Patient_Mobile', person1.phone);
      if (person1.email) fd.append('Lead_Patient_Email', person1.email);
      fd.append('Collection_Type', formData.collectionType === 'home' ? 'Home Collection' : 'Walk-in Center');
      if (formData.address) fd.append('Address', formData.address);
      if (formData.city) fd.append('City', formData.city);
      if (formData.pincode) fd.append('Pincode', formData.pincode);
      fd.append('Preferred_Date', formData.preferredDate);
      fd.append('Preferred_Time', formData.preferredTimeSlot);
      if (formData.notes) fd.append('Additional_Notes', formData.notes);
      fd.append('Total_Amount', `₹${grandTotal}`);
      // Unique subject to prevent Gmail threading
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      const uid = Math.random().toString(36).slice(2, 6).toUpperCase();
      const uniqueSubject = `New Package Booking - ${person1.name || 'Patient'} - ${timeStr} - ${uid}`;
      fd.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '08af8615-e180-46cf-8efe-ae605c6c7c66');
      fd.append('subject', uniqueSubject);
      fd.append('from_name', 'Kloud Diagnostics');

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        handleClose();
        showSuccessPopup('Our team will call you shortly to confirm your package slot.');
      } else {
        alert('Submission failed. Please try again or call us directly.');
      }
    } catch {
      alert('Network error. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const homeFee = 0; // Home collection is completely waived/free for packages
  const personCount = (selectedPackage as any)?.defaultQuantity || 1;
  const totalAmount = (selectedPackage as any)?.totalPrice || (selectedPackage ? selectedPackage.price * personCount : 0);

  if (!isPackageModalOpen) return null;

  return (
    <AnimatePresence>
      {isPackageModalOpen && (
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
                    aria-label="Back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base md:text-lg font-sans leading-tight">
                    {step === 1 ? 'Book Health Package' : step === 2 ? 'Patient Details' : 'Booking Confirmed!'}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    {step === 1 ? selectedPackage?.name : step === 2 ? 'Fill in patient information' : 'Our team will contact you shortly'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">



              {/* ── STEP 2: Patient details ── */}
              {step === 2 && selectedPackage && (
                <form id="package-booking-form" onSubmit={handleSubmit}>
                  <div className="p-5 md:p-8 max-w-2xl mx-auto w-full space-y-5">

                    {/* Package reminder */}
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold">{selectedPackage.name}</span>
                        <span className="text-xs text-muted-foreground">· {personCount} {personCount === 1 ? 'person' : 'persons'}</span>
                        <span className="ml-2 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          ✨ Free Home Visit
                        </span>
                      </div>
                      <span className="font-extrabold text-primary">₹{totalAmount}</span>
                    </div>

                    {/* Person 1 */}
                    <PersonSection
                      label="Person 1"
                      icon={<User className="w-4 h-4 text-primary" />}
                      data={formData.person1}
                      onChange={(k, v) => setPerson('person1', k, v)}
                      required
                    />



                    {/* Collection type */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block">Collection Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { val: 'home', label: 'Home Collection', sub: 'We come to you', icon: Home },
                          { val: 'walkin', label: 'Walk-in Center', sub: 'Visit our lab', icon: MapPin },
                        ].map(({ val, label, sub, icon: Icon }) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setField('collectionType', val)}
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

                    {/* Walk-in Info */}
                    {formData.collectionType === 'walkin' && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 bg-primary/5 rounded-2xl p-4 md:p-6 border border-primary/10">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="flex-1 space-y-5">
                                <div>
                                  <h4 className="font-bold text-primary flex items-center gap-2 mb-2"><MapPin className="w-4 h-4"/> Official Address</h4>
                                  <p className="text-sm text-foreground/80 leading-relaxed">Shop No 2, Abdul Rauf Manzil, Opposite Piramal Aranya, Rambhau Bhogale Marg, Mazgaon, Mumbai - 400010</p>
                                </div>
                                <div>
                                  <h4 className="font-bold text-primary flex items-center gap-2 mb-2"><Phone className="w-4 h-4"/> Contact / Collection Info</h4>
                                  <p className="text-sm font-semibold">+91 9699977171 | Home Collection Available (₹200)</p>
                                </div>
                              </div>
                              <div className="w-full md:w-1/2 h-[300px] md:h-[350px] rounded-xl overflow-hidden shadow-sm">
                                <iframe
                                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.338104871217!2d72.8398!3d18.9723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU4JzIwLjMiTiA3MsKwNTAnMjMuMyJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                                  width="100%"
                                  height="100%"
                                  style={{ border: 0, minHeight: '280px', borderRadius: '12px' }}
                                  allowFullScreen={false}
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}

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
                              onChange={e => setField('address', e.target.value)}
                              placeholder="Flat/House No, Building, Street, Area"
                              className="w-full p-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-foreground/80">City</label>
                              <input type="text" value={formData.city}
                                onChange={e => setField('city', e.target.value)}
                                placeholder="Mumbai"
                                className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-foreground/80">Pincode</label>
                              <input required type="text" pattern="[0-9]{6}" value={formData.pincode}
                                onChange={e => setField('pincode', e.target.value)}
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
                          onChange={e => setField('preferredDate', e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground/80">
                          <Clock className="w-3.5 h-3.5 text-primary" /> Preferred Time
                        </label>
                        <select required value={formData.preferredTimeSlot}
                          onChange={e => setField('preferredTimeSlot', e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none">
                          {TIME_SLOTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground/80">Additional Notes (optional)</label>
                      <textarea rows={2} value={formData.notes}
                        onChange={e => setField('notes', e.target.value)}
                        placeholder="Any special instructions…"
                        className="w-full p-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-sm" />
                    </div>

                    {/* Order summary + submit */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Amount</p>
                        <p className="text-2xl font-extrabold text-primary">₹{grandTotal}</p>
                        {isHome && <p className="text-xs text-green-600 font-bold mt-1">✓ Free Home Collection Included</p>}
                      </div>
                      <Button
                        type="submit"
                        form="package-booking-form"
                        size="lg"
                        className="w-full sm:w-auto px-8 font-bold rounded-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing…
                          </span>
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

// ── Reusable person form section ──
interface PersonSectionProps {
  label: string;
  icon: React.ReactNode;
  data: { name: string; age: string; gender: string; phone: string; email: string };
  onChange: (key: string, val: string) => void;
  required?: boolean;
}

function PersonSection({ label, icon, data, onChange, required }: PersonSectionProps) {
  return (
    <div className="space-y-4 p-4 md:p-5 rounded-2xl bg-gray-50 border border-border">
      <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
        {icon} {label}
      </h4>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
        <input
          type="text"
          required={required}
          value={data.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="e.g. Priya Sharma"
          className="w-full h-11 px-4 rounded-xl border border-input bg-white focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
        />
      </div>

      {/* Age + Gender */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Age</label>
          <input
            type="number"
            required={required}
            min="1" max="120"
            value={data.age}
            onChange={e => onChange('age', e.target.value)}
            placeholder="Years"
            className="w-full h-11 px-4 rounded-xl border border-input bg-white focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Gender</label>
          <select
            value={data.gender}
            onChange={e => onChange('gender', e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-input bg-white focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Phone className="w-3 h-3" /> Mobile Number
          </label>
          <input
            type="tel"
            required={required}
            pattern="[0-9]{10}"
            value={data.phone}
            onChange={e => onChange('phone', e.target.value)}
            placeholder="10-digit number"
            className="w-full h-11 px-4 rounded-xl border border-input bg-white focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Mail className="w-3 h-3" /> Email (optional)
          </label>
          <input
            type="email"
            value={data.email}
            onChange={e => onChange('email', e.target.value)}
            placeholder="your@email.com"
            className="w-full h-11 px-4 rounded-xl border border-input bg-white focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
      </div>
    </div>
  );
}
