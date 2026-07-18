import React, { useState, useRef } from 'react';
import { useSubmitPrescription } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, CheckCircle2, User, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';

export default function UploadPrescriptionPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitPrescription = useSubmitPrescription();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredArea: '',
    preferredTimeSlot: 'Morning (8 AM - 12 PM)',
    notes: ''
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Check max size 10MB
    const validFiles = newFiles.filter(file => {
      const isOk = file.size <= 10 * 1024 * 1024;
      if (!isOk) alert(`File ${file.name} is too large. Max 10MB allowed.`);
      return isOk;
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please upload at least one prescription file.");
      return;
    }
    
    // Convert File objects to names to match the mocked API schema
    const fileNames = files.map(f => f.name);

    submitPrescription.mutate({
      data: {
        ...formData,
        fileNames
      }
    }, {
      onSuccess: () => setIsSuccess(true)
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl text-center max-w-lg border border-border"
        >
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-sans font-bold mb-4">Prescription Received!</h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Our medical experts will review your prescription and call you within <strong className="text-foreground">30 minutes</strong> to confirm the exact tests and costs.
          </p>
          <Link href="/">
            <Button size="lg" className="w-full">Back to Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">
            Have a Doctor's Prescription?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Just upload it — we'll decode the medical jargon, prepare your cart, and call you back to confirm.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-border p-6 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Upload Zone */}
            <div>
              <h2 className="text-xl font-bold font-sans mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
                Upload Documents
              </h2>
              
              <div 
                className={`border-3 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-primary bg-primary/5 scale-[1.02]' 
                    : 'border-border hover:border-primary/50 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  multiple 
                  accept="image/png, image/jpeg, image/jpg, application/pdf" 
                  onChange={(e) => {
                    if (e.target.files) handleFiles(Array.from(e.target.files));
                  }}
                />
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Drag & Drop files here</h3>
                <p className="text-muted-foreground text-sm mb-6">or click to browse from your device</p>
                <div className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                  Supports JPG, PNG, PDF (Max 10MB)
                </div>
              </div>

              {/* File Preview */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 space-y-3"
                  >
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 border border-border p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm line-clamp-1">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(i)}
                          className="w-8 h-8 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 mt-4 text-xs font-medium text-muted-foreground justify-center">
                <ShieldCheck className="w-4 h-4 text-success" />
                Your medical documents are kept strictly confidential.
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-xl font-bold font-sans mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
                Your Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
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
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Preferred Area / Location
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.preferredArea}
                    onChange={e => setFormData({...formData, preferredArea: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. Andheri West"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Callback Time
                  </label>
                  <select 
                    value={formData.preferredTimeSlot}
                    onChange={e => setFormData({...formData, preferredTimeSlot: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                  >
                    <option>Anytime</option>
                    <option>Morning (8 AM - 12 PM)</option>
                    <option>Afternoon (12 PM - 4 PM)</option>
                    <option>Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground/80">Any specific notes? (Optional)</label>
                  <textarea 
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="e.g. Doctor asked for fasting sugar..."
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-lg h-14 rounded-2xl"
              disabled={submitPrescription.isPending}
            >
              {submitPrescription.isPending ? 'Submitting...' : 'Submit Prescription'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
