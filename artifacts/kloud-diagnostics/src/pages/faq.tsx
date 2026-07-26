import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    question: "Do you process medical tests in your own laboratory?",
    answer: "No, Kloud Diagnostics does not perform tests directly in-house. We are associated with all top labs across Mumbai, such as Metropolis, Apollo, Agilus, Lifenity, LDPL and more, ensuring high accuracy and reliability for all your reports."
  },
  {
    question: "Are your partner labs accredited and certified?",
    answer: "Yes, absolutely. We are associated with all top labs to guarantee that every test result meets strict quality standards."
  },
  {
    question: "Is home sample collection available everywhere?",
    answer: "Currently, our home sample collection services are exclusively available across Mumbai."
  },
  {
    question: "How do I receive my test reports after sample collection?",
    answer: "Once your sample is processed by our accredited partner lab, your digital test reports are delivered directly to you via WhatsApp, Email, or through our website portal."
  },
  {
    question: "How do I book a test or a home collection visit?",
    answer: "You can easily search for your required test on our website, select a package, and click to book or connect with our support team directly via WhatsApp/Call for instant home collection scheduling."
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
