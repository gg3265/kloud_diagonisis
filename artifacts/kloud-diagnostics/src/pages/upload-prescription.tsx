import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, User, Phone, MapPin, Clock, ShieldCheck, ChevronLeft, FileImage, BadgeCheck, Stethoscope, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingModal } from '@/lib/booking-modal-context';

export default function UploadPrescriptionPage() {
  const { showSuccessPopup } = useBookingModal();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  // Track whether the iframe load is from an actual submission (not its initial mount)
  const submittedRef = useRef(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    collectionType: 'home' as 'home' | 'walkin',
    address: '',
    city: '',
    pincode: '',
    preferredTimeSlot: 'Anytime',
    referringDoctor: '',
    notes: '',
  });

  const isHome = formData.collectionType === 'home';

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const valid = newFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) { alert(`"${file.name}" exceeds 10MB limit.`); return false; }
      return true;
    });
    setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) { alert('Please upload at least one prescription file.'); return; }

    // Sync drag-and-dropped files into the real file input via DataTransfer API
    // (FormSubmit needs a real multipart/form-data POST to attach files to email)
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      files.forEach(f => dt.items.add(f));
      fileInputRef.current.files = dt.files;
    }

    // Set a unique subject to prevent Gmail threading
    if (subjectRef.current) {
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      const uid = Math.random().toString(36).slice(2, 6).toUpperCase();
      subjectRef.current.value = `New Prescription - ${formData.name || 'Patient'} - ${timeStr} - ${uid}`;
    }

    setIsSubmitting(true);
    submittedRef.current = true;
    // Native form submit — targets the hidden iframe so the page never redirects
    formRef.current?.submit();
  };

  // Called when FormSubmit redirects inside the hidden iframe after processing
  const handleIframeLoad = () => {
    if (!submittedRef.current) return; // ignore the initial empty-src iframe load
    submittedRef.current = false;
    setIsSubmitting(false);
    setFiles([]);
    setFormData({ name: '', phone: '', collectionType: 'home', address: '', city: '', pincode: '', preferredTimeSlot: 'Anytime', referringDoctor: '', notes: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
    showSuccessPopup('Our team will review your prescription and call you within 30 minutes.');
  };

  return (
    <div className="bg-gradient-to-br from-orange-50/50 to-white min-h-screen pb-24">
      {/* Page header */}
      <div className="bg-white border-b border-border sticky top-20 z-20">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-foreground flex items-center justify-center transition-colors shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-xl font-sans leading-none">Upload Prescription</h1>
            <p className="text-muted-foreground text-xs mt-0.5">Our team will decode it and call you back</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Sidebar info */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
              <h3 className="font-bold text-base mb-5 flex items-center gap-2 text-foreground">
                <BadgeCheck className="w-5 h-5 text-orange-500" />
                How it works
              </h3>
              <ol className="space-y-4">
                {[
                  { step: '1', title: 'Upload Prescription', desc: 'Drag & drop or browse your files' },
                  { step: '2', title: 'Expert Review', desc: 'Our team identifies all required tests' },
                  { step: '3', title: 'We Call You', desc: 'Confirmation within 30 minutes' },
                  { step: '4', title: 'Book & Test', desc: 'Home collection or walk-in, your choice' },
                ].map(item => (
                  <li key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <h4 className="font-bold text-sm text-orange-900">100% Confidential</h4>
              </div>
              <p className="text-xs text-orange-800/80 leading-relaxed">
                Your prescriptions are encrypted and only accessible to our medical team. We never share your data with third parties.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-border text-sm space-y-3">
              <p className="font-bold text-foreground/70 text-xs uppercase tracking-wider">Accepted formats</p>
              <div className="flex items-center gap-3 text-foreground/80">
                <FileImage className="w-4 h-4 text-blue-500" /> JPG & PNG images
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <FileText className="w-4 h-4 text-red-500" /> PDF documents
              </div>
              <p className="text-xs text-muted-foreground">Max 10MB per file</p>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2">
            {/*
              Hidden iframe: FormSubmit POSTs a redirect into here after processing.
              onLoad fires → we show the success popup without any page navigation.
            */}
            <iframe
              name="prescription-iframe"
              title="prescription-submit"
              style={{ display: 'none' }}
              onLoad={handleIframeLoad}
            />
            <div className="bg-white rounded-3xl shadow-lg border border-border p-6 md:p-9">
              <form
                ref={formRef}
                action="https://formsubmit.co/harshitpandey8194@gmail.com"
                method="POST"
                encType="multipart/form-data"
                target="prescription-iframe"
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {/* FormSubmit control fields */}
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                {/* Subject is set dynamically in handleSubmit for unique threading */}
                <input type="hidden" name="_subject" ref={subjectRef} defaultValue="New Prescription Upload" />
                {/* Collection type sent as readable text in email */}
                <input type="hidden" name="Collection_Type" value={isHome ? 'Home Collection' : 'Walk-in Center'} />

                {/* Upload Zone */}
                <div>
                  <h2 className="text-lg font-extrabold font-sans mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">1</span>
                    Upload Your Prescription
                  </h2>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? 'border-orange-400 bg-orange-50 scale-[1.02]'
                        : 'border-border hover:border-orange-300 hover:bg-orange-50/30'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {/* name="attachment" is required by FormSubmit.co to attach the file */}
                    <input
                      type="file"
                      name="attachment"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/png, image/jpeg, image/jpg, application/pdf"
                      onChange={e => { if (e.target.files) handleFiles(Array.from(e.target.files)); }}
                    />
                    <motion.div
                      animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                      className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600"
                    >
                      <Upload className="w-7 h-7" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-1">Drag & drop files here</h3>
                    <p className="text-muted-foreground text-sm mb-4">or click to browse from your device</p>
                    <span className="inline-block bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full">
                      JPG · PNG · PDF · Max 10MB
                    </span>
                  </div>

                  <AnimatePresence>
                    {files.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 space-y-2"
                      >
                        {files.map((file, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center justify-between bg-orange-50 border border-orange-100 p-3 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-semibold text-sm line-clamp-1">{file.name}</div>
                                <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="w-8 h-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contact Details */}
                <div>
                  <h2 className="text-lg font-extrabold font-sans mb-5 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">2</span>
                    Your Contact Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                        <User className="w-4 h-4 text-orange-500" /> Full Name
                      </label>
                      <input
                        required
                        type="text"
                        name="Full_Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm"
                        placeholder="e.g. Priya Sharma"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                        <Phone className="w-4 h-4 text-orange-500" /> Mobile Number
                      </label>
                      <input
                        required
                        type="tel"
                        name="Mobile_Number"
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm"
                        placeholder="10-digit mobile number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                        <Clock className="w-4 h-4 text-orange-500" /> Best Time to Call
                      </label>
                      <select
                        name="Best_Time_to_Call"
                        value={formData.preferredTimeSlot}
                        onChange={e => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm appearance-none"
                      >
                        <option>Anytime</option>
                        <option>Morning (8 AM – 12 PM)</option>
                        <option>Afternoon (12 PM – 4 PM)</option>
                        <option>Evening (4 PM – 8 PM)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                        <Stethoscope className="w-4 h-4 text-orange-500" /> Referring Doctor <span className="text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="Referring_Doctor"
                        value={formData.referringDoctor}
                        onChange={e => setFormData({ ...formData, referringDoctor: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm"
                        placeholder="e.g. Dr. Rajesh Sharma / Dr. Priya Mehta"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-foreground/80">Additional Notes <span className="text-muted-foreground font-normal">(Optional)</span></label>
                      <textarea
                        rows={2}
                        name="Additional_Notes"
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full p-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all resize-none text-sm"
                        placeholder="e.g. Doctor advised fasting test, preferred morning slot..."
                      />
                    </div>
                  </div>
                </div>

                {/* Collection Type */}
                <div>
                  <h2 className="text-lg font-extrabold font-sans mb-5 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">3</span>
                    Collection Preference
                  </h2>

                  <div className="space-y-5">
                    {/* Home / Walk-in toggle */}
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { val: 'home', label: 'Home Collection', sub: 'We come to you', icon: Home },
                        { val: 'walkin', label: 'Walk-in Center', sub: 'Visit our lab', icon: MapPin },
                      ] as const).map(({ val, label, sub, icon: Icon }) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormData({ ...formData, collectionType: val, address: '', city: '', pincode: '' })}
                          className={`rounded-xl border-2 p-4 flex items-center gap-3 transition-all text-left focus:outline-none focus:ring-2 focus:ring-orange-400
                            ${formData.collectionType === val
                              ? 'border-orange-500 bg-orange-50 shadow-sm'
                              : 'border-border hover:border-orange-300'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.collectionType === val ? 'border-orange-500' : 'border-muted-foreground/30'}`}>
                            {formData.collectionType === val && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm flex items-center gap-1.5">
                              <Icon className="w-3.5 h-3.5" /> {label}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Address fields — animated in/out for Home Collection */}
                    <AnimatePresence>
                      {isHome && (
                        <motion.div
                          key="address-block"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground/80">
                              <MapPin className="w-3.5 h-3.5 text-orange-500" /> Full Address
                            </label>
                            <textarea
                              required={isHome}
                              rows={2}
                              name="Address"
                              value={formData.address}
                              onChange={e => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Flat/House No, Building, Street, Area"
                              className="w-full p-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all resize-none text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-foreground/80">City</label>
                              <input
                                type="text"
                                name="City"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                placeholder="Mumbai"
                                className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-semibold text-foreground/80">Pincode</label>
                              <input
                                required={isHome}
                                type="text"
                                name="Pincode"
                                pattern="[0-9]{6}"
                                value={formData.pincode}
                                onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                placeholder="6-digit pincode"
                                className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 outline-none transition-all text-sm"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full text-base h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 gap-2 font-bold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting…
                    </span>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Submit Prescription
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting, you agree to our Privacy Policy. Your documents are 100% confidential.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
