import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { BookingInputCollectionType, BookingInputPatientGender } from '@workspace/api-client-react';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Trash2, Home, MapPin, Calendar, Clock, User, Phone, CheckCircle2, ChevronLeft, Search } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';

export default function BookPage() {
  const { items, removeItem, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
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
    notes: ''
  });

  const isHomeCollection = formData.collectionType === 'home';
  const standardHomeFee = 200;
  const isFreeCollectionApplied = isHomeCollection && total >= 1500;
  const homeCollectionFee = isHomeCollection ? (isFreeCollectionApplied ? 0 : standardHomeFee) : 0;
  const grandTotal = total + homeCollectionFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('Patient_Name', formData.patientName);
      fd.append('Age', formData.patientAge.toString());
      fd.append('Gender', formData.patientGender);
      fd.append('Mobile_Number', formData.phone);
      
      const testNames = items.map(i => `${i.name} (₹${i.price})`).join(', ');
      fd.append('Booked_Tests', testNames);
      
      fd.append('Total_Amount', `₹${grandTotal}`);
      fd.append('Collection_Type', isHomeCollection ? 'Home Collection' : 'Walk-in Center');
      fd.append('Preferred_Date', formData.preferredDate);
      fd.append('Preferred_Time', formData.preferredTimeSlot);
      
      if (isHomeCollection) {
        fd.append('Address', formData.address);
        fd.append('Pincode', formData.pincode);
      }

      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      const uid = Math.random().toString(36).slice(2, 6).toUpperCase();
      fd.append('subject', `New Cart Checkout - ${formData.patientName || 'Patient'} - ${timeStr} - ${uid}`);
      fd.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '08af8615-e180-46cf-8efe-ae605c6c7c66');
      fd.append('from_name', 'Kloud Diagnostics Cart');

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setIsSuccess(true);
        clearCart();
        window.scrollTo(0, 0);
      } else {
        alert('Booking failed. Please try again or call us.');
      }
    } catch (error) {
      alert('Network error. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl text-center max-w-2xl border border-border"
        >
          <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-sans font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you, {formData.patientName}. Your booking has been received. Our team will contact you shortly to confirm the details.
          </p>
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left border border-border text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground block mb-1">Date & Time</span>
                <span className="font-semibold">{formData.preferredDate} | {formData.preferredTimeSlot}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Type</span>
                <span className="font-semibold capitalize">{formData.collectionType}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Total Paid/Payable</span>
                <span className="font-bold text-primary text-lg">₹{grandTotal}</span>
              </div>
            </div>
          </div>
          <Button size="lg" onClick={() => setLocation('/')}>Return Home</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="rounded-full bg-white shadow-sm border border-border">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold font-sans">Book a Test</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Forms & Search */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Search Box */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
                Add Tests or Packages
              </h2>
              <SearchBar />
            </div>

            {/* Patient Details Form */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
                Patient Details
              </h2>
              
              <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                      <User className="w-4 h-4" /> Full Name
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.patientName}
                      onChange={e => setFormData({...formData, patientName: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground/80">Age</label>
                      <input 
                        required
                        type="number" 
                        min="1" max="120"
                        value={formData.patientAge}
                        onChange={e => setFormData({...formData, patientAge: e.target.value})}
                        className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="Years"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground/80">Gender</label>
                      <select 
                        value={formData.patientGender}
                        onChange={e => setFormData({...formData, patientGender: e.target.value as BookingInputPatientGender})}
                        className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Mobile Number
                    </label>
                    <input 
                      required
                      type="tel" 
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="10-digit number"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-foreground/80 mb-3 block">Collection Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setFormData({...formData, collectionType: 'home'})}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-4 transition-all ${isHomeCollection ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/50'}`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isHomeCollection ? 'border-primary' : 'border-muted'}`}>
                          {isHomeCollection && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <div className="font-bold mb-1 flex items-center gap-2">
                            <Home className="w-4 h-4" /> Home Collection
                          </div>
                          <p className="text-xs text-muted-foreground">Safe & hygienic sample collection at your doorstep.</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setFormData({...formData, collectionType: 'walkin'})}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-4 transition-all ${!isHomeCollection ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/50'}`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${!isHomeCollection ? 'border-primary' : 'border-muted'}`}>
                          {!isHomeCollection && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <div className="font-bold mb-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Walk-in Center
                          </div>
                          <p className="text-xs text-muted-foreground">Visit any of our premium testing centers.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isHomeCollection ? (
                    <>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Full Address
                        </label>
                        <textarea 
                          required={isHomeCollection}
                          rows={2}
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="w-full p-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                          placeholder="House/Flat No, Building, Street, Area"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground/80">Pincode</label>
                        <input 
                          required={isHomeCollection}
                          type="text" 
                          pattern="[0-9]{6}"
                          value={formData.pincode}
                          onChange={e => setFormData({...formData, pincode: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                          placeholder="6-digit pincode"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2 space-y-4 mb-2">
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" /> Walk-in Center Address
                        </h4>
                        <p className="text-sm text-blue-800 leading-relaxed font-medium">
                          Shop No 2, Abdul Rauf Manzil, Opposite Piramal Aranya, Rambhau Bhogale Marg, Mazgaon, Mumbai - 400010
                        </p>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-48 w-full bg-gray-100">
                        <iframe 
                          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Shop%20No%202,%20Abdul%20Rauf%20Manzil,%20Opposite%20Piramal%20Aranya,%20Rambhau%20Bhogale%20Marg,%20Mazgaon,%20Mumbai%20-%20400010+(Kloud%20Diagnostics)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
                          width="100%" 
                          height="100%"
                          className="border-0"
                          allowFullScreen={false} 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Kloud Diagnostics Location on Map"
                        ></iframe>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Preferred Date
                    </label>
                    <input 
                      required
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={e => setFormData({...formData, preferredDate: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Preferred Time Slot
                    </label>
                    <select 
                      required
                      value={formData.preferredTimeSlot}
                      onChange={e => setFormData({...formData, preferredTimeSlot: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                    >
                      <option>07:00 AM - 08:00 AM</option>
                      <option>08:00 AM - 09:00 AM</option>
                      <option>09:00 AM - 10:00 AM</option>
                      <option>10:00 AM - 11:00 AM</option>
                      <option>11:00 AM - 12:00 PM</option>
                      <option>12:00 PM - 02:00 PM</option>
                      <option>02:00 PM - 04:00 PM</option>
                      <option>04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-border/50 relative overflow-hidden">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
              
              <h3 className="text-xl font-bold font-sans mb-6 pt-2">Order Summary</h3>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                  <p className="text-sm">Search for tests or packages to add them here.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map(item => (
                      <div key={item.itemId} className="flex justify-between items-start gap-4 pb-4 border-b border-border/60">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm leading-tight mb-1">{item.name}</h4>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.itemType}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold">₹{item.price}</div>
                          <button 
                            onClick={() => removeItem(item.itemId)}
                            className="text-xs text-destructive hover:underline mt-1 flex items-center justify-end gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isHomeCollection && !isFreeCollectionApplied && total > 0 && (
                    <div className="mb-4 bg-blue-50/80 border border-blue-200 text-blue-800 text-sm px-4 py-3 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-base">✨</span>
                      </div>
                      <p className="font-medium">
                        Add <span className="font-bold">₹{1500 - total}</span> more to get <span className="font-bold">FREE</span> Home Collection!
                      </p>
                    </div>
                  )}

                  {isFreeCollectionApplied && total > 0 && (
                    <div className="mb-4 bg-green-50/80 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                      <p className="font-semibold">
                        Free Home Collection Applied!
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tests Total</span>
                      <span className="font-semibold">₹{total}</span>
                    </div>
                    {isHomeCollection && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Home Collection</span>
                        {isFreeCollectionApplied ? (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground line-through">₹{standardHomeFee}</span>
                            <span className="font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-xs uppercase">Free</span>
                          </div>
                        ) : (
                          <span className="font-semibold">₹{homeCollectionFee}</span>
                        )}
                      </div>
                    )}
                    <div className="pt-3 border-t border-border flex justify-between items-end">
                      <span className="font-bold">Total Amount</span>
                      <span className="text-2xl font-bold text-primary">₹{grandTotal}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    form="booking-form" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By confirming, you agree to our Terms of Service & Privacy Policy.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
