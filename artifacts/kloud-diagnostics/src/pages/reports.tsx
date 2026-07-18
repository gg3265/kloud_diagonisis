import React, { useState } from 'react';
import { useLookupBooking } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { FileSearch, Download, Phone, CheckCircle2, CircleDashed, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'sample_collected', label: 'Sample Collected' },
  { key: 'processing', label: 'Processing in Lab' },
  { key: 'report_ready', label: 'Report Ready' },
];

export default function ReportsPage() {
  const [lookupType, setLookupType] = useState<'mobile' | 'bookingId'>('mobile');
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState<{mobile?: string, bookingId?: string} | null>(null);

  const { data: booking, isLoading, isError } = useLookupBooking(
    submittedValue || {},
    { query: { enabled: !!submittedValue } }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    if (lookupType === 'mobile') {
      setSubmittedValue({ mobile: inputValue });
    } else {
      setSubmittedValue({ bookingId: inputValue });
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return STATUS_STEPS.findIndex(s => s.key === status);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileSearch className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold font-sans text-foreground mb-4">Track Your Report</h1>
          <p className="text-xl text-muted-foreground">
            Enter your booking ID or registered mobile number to check the status or download your digital reports.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-border p-6 md:p-10 mb-8">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${lookupType === 'mobile' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => { setLookupType('mobile'); setInputValue(''); setSubmittedValue(null); }}
            >
              Search by Mobile
            </button>
            <button
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${lookupType === 'bookingId' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => { setLookupType('bookingId'); setInputValue(''); setSubmittedValue(null); }}
            >
              Search by Booking ID
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              {lookupType === 'mobile' ? (
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              ) : (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">#</span>
              )}
              <input
                type={lookupType === 'mobile' ? 'tel' : 'text'}
                placeholder={lookupType === 'mobile' ? 'Enter 10-digit mobile number' : 'Enter Booking ID (e.g. KD-10294)'}
                className="w-full h-14 pl-12 pr-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all text-lg font-medium"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 shrink-0" disabled={isLoading || !inputValue}>
              {isLoading ? 'Searching...' : 'Track Status'}
            </Button>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {isError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-destructive/10 text-destructive p-6 rounded-2xl border border-destructive/20 text-center font-medium"
            >
              No booking found with those details. Please check and try again.
            </motion.div>
          )}

          {booking && !isError && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden"
            >
              <div className="bg-gray-50 border-b border-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{booking.patientName}</h3>
                  <p className="text-muted-foreground text-sm">Booking ID: {booking.bookingId}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-primary">₹{booking.totalAmount}</div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">{booking.status}</p>
                </div>
              </div>

              <div className="p-6 md:p-10">
                {booking.status === 'cancelled' ? (
                  <div className="text-center py-8 text-destructive">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✕</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Booking Cancelled</h4>
                    <p>This booking has been cancelled. Please contact support if you need assistance.</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Status Tracker */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -z-10 md:left-auto md:top-6 md:bottom-auto md:h-0.5 md:w-full md:z-0"></div>
                    
                    <div className="flex flex-col gap-8 md:flex-row md:justify-between md:gap-0 z-10 relative">
                      {STATUS_STEPS.map((step, index) => {
                        const currentIdx = getStepIndex(booking.status);
                        const isCompleted = index <= currentIdx;
                        const isCurrent = index === currentIdx;
                        
                        return (
                          <div key={step.key} className="flex flex-row md:flex-col items-center gap-4 md:gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 bg-white transition-colors duration-500
                              ${isCompleted ? 'border-success text-success' : 'border-muted text-muted'}
                              ${isCurrent ? 'shadow-[0_0_0_4px_rgba(59,178,115,0.2)]' : ''}
                            `}>
                              {isCompleted ? <CheckCircle2 className="w-6 h-6 fill-current text-white" /> : <CircleDashed className="w-6 h-6" />}
                            </div>
                            <div className={`font-semibold text-sm md:text-center ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-border">
                  <h4 className="font-bold mb-4 font-sans text-lg">Tests Included</h4>
                  <ul className="space-y-3 mb-6">
                    {booking.items.map(item => (
                      <li key={item.itemId} className="flex justify-between items-center pb-3 border-b border-border/60 last:border-0 last:pb-0">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-sm font-semibold text-muted-foreground">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  {booking.status === 'report_ready' && booking.reportUrl ? (
                    <Button className="w-full bg-success hover:bg-success/90 text-white h-14 text-lg shadow-lg hover:shadow-xl transition-all">
                      <Download className="w-5 h-5 mr-2" /> Download Digital Report
                    </Button>
                  ) : (
                    <div className="text-center p-4 rounded-xl border border-dashed border-border bg-white text-muted-foreground text-sm font-medium">
                      Reports will be available to download here once ready.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
