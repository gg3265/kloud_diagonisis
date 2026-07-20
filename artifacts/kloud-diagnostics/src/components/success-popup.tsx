import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Calendar } from 'lucide-react';
import { useBookingModal } from '@/lib/booking-modal-context';

export function SuccessPopup() {
  const { isSuccessPopupOpen, successPopupMessage, hideSuccessPopup } = useBookingModal();

  return (
    <AnimatePresence>
      {isSuccessPopupOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={hideSuccessPopup}
            className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm"
          />

          {/* Popup card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 24, stiffness: 340 }}
            className="fixed z-[301] inset-0 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Green top bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />

              <div className="p-8 pt-7 text-center relative">
                {/* Close button */}
                <button
                  onClick={hideSuccessPopup}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 260, delay: 0.1 }}
                  className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 font-sans">
                    Booking Confirmed!
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {successPopupMessage || 'Our team will contact you shortly to confirm your slot.'}
                  </p>

                  {/* Info pill */}
                  <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full mb-7">
                    <Calendar className="w-3.5 h-3.5" />
                    We'll call you within 30 minutes
                  </div>

                  <button
                    onClick={hideSuccessPopup}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm transition-all shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 active:scale-[0.98]"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
