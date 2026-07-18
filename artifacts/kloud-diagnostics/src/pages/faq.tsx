import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    question: "Is home sample collection available everywhere in Mumbai?",
    answer: "Yes, we provide home sample collection services across all major locations in Mumbai, Navi Mumbai, and Thane. Enter your pincode during booking to verify exact availability."
  },
  {
    question: "How long does it take to get the reports?",
    answer: "Most routine pathology test reports are delivered digitally via Email and WhatsApp within 12 to 24 hours of sample collection. Specialized tests may take longer."
  },
  {
    question: "Are your labs accredited?",
    answer: "Absolutely. Kloud Diagnostics is NABL (National Accreditation Board for Testing and Calibration Laboratories) accredited and ISO 9001:2015 certified, ensuring the highest standards of precision and quality."
  },
  {
    question: "Do I need to fast before a blood test?",
    answer: "Fasting requirements vary by test. For example, a Fasting Blood Sugar or Lipid Profile typically requires 10-12 hours of overnight fasting. Our test catalog clearly indicates if fasting is required for specific tests or packages."
  },
  {
    question: "Can I book a test without a doctor's prescription?",
    answer: "Yes, you can book preventive health packages and routine blood tests without a prescription. However, certain specialized tests and radiology scans (like MRI or CT) strictly require a valid doctor's prescription."
  },
  {
    question: "How is the home collection fee calculated?",
    answer: "We offer FREE home sample collection for all bookings worth ₹1,500 or more. For bookings below ₹1,500, a nominal home collection fee of ₹150 applies."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about booking tests, reports, and our services.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index}
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-primary/30 shadow-md' : 'border-border shadow-sm'}`}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-lg font-sans pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed border-t border-gray-100 mt-2">
                      <div className="pt-4">{faq.answer}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
