import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="bg-white min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or need assistance with a booking? Our team is here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Contact Info */}
          <div className="md:col-span-5 space-y-8">
            <div className="bg-gray-50 rounded-3xl p-8 border border-border">
              <h3 className="text-2xl font-bold font-sans mb-8">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Call Us</h4>
                    <p className="text-muted-foreground mb-1">Mon-Sat from 7am to 9pm</p>
                    <a href="tel:02245678900" className="text-primary font-bold hover:underline">022-4567-8900</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email Us</h4>
                    <p className="text-muted-foreground mb-1">For reports & general queries</p>
                    <a href="mailto:care@klouddiagnostics.in" className="text-primary font-bold hover:underline">care@klouddiagnostics.in</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Head Office</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      101, Kloud Building, SV Road,<br />
                      Andheri West, Mumbai - 400058
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-border/50 relative overflow-hidden">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-success mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. We will get back to you shortly.</p>
                </motion.div>
              ) : null}

              <h3 className="text-2xl font-bold font-sans mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">First Name</label>
                    <input required type="text" className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Last Name</label>
                    <input required type="text" className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <input required type="email" className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Mobile Number</label>
                  <input required type="tel" className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="10-digit number" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Your Message</label>
                  <textarea required rows={4} className="w-full p-4 rounded-xl border border-input bg-transparent focus:ring-2 focus:ring-primary outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <Button type="submit" size="lg" className="w-full h-14 text-lg">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
