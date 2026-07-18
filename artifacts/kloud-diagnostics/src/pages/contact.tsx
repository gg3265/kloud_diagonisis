import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2, Clock, ChevronLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Page header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-foreground flex items-center justify-center transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-xl font-sans leading-none">Contact Us</h1>
            <p className="text-muted-foreground text-xs mt-0.5">We're here to help — reach us anytime</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl pt-10">

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {[
            {
              icon: Phone,
              color: 'bg-teal-50 text-teal-600 border-teal-100',
              iconBg: 'bg-teal-100 text-teal-600',
              title: 'Call / WhatsApp',
              sub: 'Mon–Sat: 7AM – 9PM',
              value: '9699977171',
              href: 'tel:9699977171',
              label: 'Call Now',
            },
            {
              icon: Mail,
              color: 'bg-blue-50 text-blue-600 border-blue-100',
              iconBg: 'bg-blue-100 text-blue-600',
              title: 'Email Us',
              sub: 'For reports & general queries',
              value: 'klouddiagnostics@gmail.com',
              href: 'mailto:klouddiagnostics@gmail.com',
              label: 'Send Email',
            },
            {
              icon: MapPin,
              color: 'bg-orange-50 text-orange-600 border-orange-100',
              iconBg: 'bg-orange-100 text-orange-600',
              title: 'Head Office',
              sub: 'Mumbai, Maharashtra',
              value: '101, Kloud Building, SV Rd, Andheri West, Mumbai 400058',
              href: 'https://maps.google.com/?q=Andheri+West+Mumbai',
              label: 'Get Directions',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white border ${card.color.split(' ')[2]} rounded-2xl p-6 flex flex-col hover:shadow-lg transition-shadow duration-300`}
            >
              <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base mb-1">{card.title}</h3>
              <p className="text-muted-foreground text-xs mb-3">{card.sub}</p>
              <p className="font-semibold text-sm text-foreground/90 mb-4 flex-1 break-all">{card.value}</p>
              <a
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className={`inline-flex items-center gap-2 text-sm font-bold ${card.color.split(' ').slice(1, 2).join(' ')} hover:underline`}
              >
                {card.label} →
              </a>
            </motion.div>
          ))}
        </div>

        {/* Form + info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-7 border border-border shadow-sm">
              <h3 className="text-xl font-extrabold font-sans mb-6">Quick Info</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Working Hours</h4>
                    <p className="text-muted-foreground text-sm mt-0.5">Monday – Saturday: 7 AM – 9 PM</p>
                    <p className="text-muted-foreground text-sm">Sunday: 8 AM – 2 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Phone / WhatsApp</h4>
                    <a href="tel:9699977171" className="text-primary font-bold hover:underline text-sm">9699977171</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Email</h4>
                    <a href="mailto:klouddiagnostics@gmail.com" className="text-primary font-bold hover:underline text-sm break-all">klouddiagnostics@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <h4 className="font-bold mb-2 text-primary">Need Results Fast?</h4>
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">Call or WhatsApp us for urgent test bookings and same-day report requests.</p>
              <a href="https://wa.me/919699977171" target="_blank" rel="noreferrer">
                <Button className="w-full gap-2 font-bold">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp: 9699977171
                </Button>
              </a>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl p-7 md:p-10 shadow-sm border border-border relative overflow-hidden">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">We'll get back to you within 24 hours. For urgent queries, please call us directly.</p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline">Send Another Message</Button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-extrabold font-sans mb-6">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">First Name</label>
                        <input required type="text" className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="Priya" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Last Name</label>
                        <input required type="text" className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="Sharma" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Email Address</label>
                      <input required type="email" className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="priya@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Mobile Number</label>
                      <input required type="tel" className="w-full h-12 px-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="10-digit number" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Your Message</label>
                      <textarea required rows={4} className="w-full p-4 rounded-xl border border-input bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-sm" placeholder="How can we help you?" />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-13 h-[52px] text-base font-bold gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

