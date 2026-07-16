"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GoldenDragonWave from "../home/GoldenDragonWave";

interface ContactData {
  contact1: string;
  contact2: string;
  email: string;
  address: string;
  mon_fri: string;
  saturday: string;
  sunday: string;
}

interface ContactContentProps {
  contact: ContactData;
}

export default function ContactContent({ contact }: ContactContentProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const res = await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#FCFAFD]">
      {/* TOP WAVE DIVIDER */}
      <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          <defs>
            <linearGradient id="topWaveGradTrust" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#FCFAFD"
          />

          {/* Faint Background Track for the Stroke */}
          <path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            className="opacity-20"
            transform="translate(0, 3)"
          />

          {/* Animated Wave Stroke */}
          <motion.path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            transform="translate(0, 3)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </svg>
      </div>
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            
            
            {/* Left Column: Direct Channels & Hours */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div>
                <span className="font-display text-xs font-bold uppercase tracking-widest text-[#F000E2]">
                  Get In Touch
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#2D2136]">
                  Direct Channels
                </h2>
              </div>

              {/* Channels Grid */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-[#E0A2F5]/20 text-[#1E227D]">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] font-bold uppercase tracking-widest text-[#2D2136]/50">
                      Clinical Hotline
                    </span>
                    <a href={`tel:${contact.contact1.replace(/\s/g, '')}`} className="font-display text-lg font-bold text-[#2D2136] hover:text-[#1E227D] transition-colors">
                      {contact.contact1}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-[#E0A2F5]/20 text-[#25D366]">
                    <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-display text-[10px] font-bold uppercase tracking-widest text-[#2D2136]/50">
                      Mobile / WhatsApp
                    </span>
                    <a href={`https://wa.me/44${contact.contact2.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-display text-lg font-bold text-[#2D2136] hover:text-[#25D366] transition-colors">
                      {contact.contact2}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-[#E0A2F5]/20 text-[#1E227D]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] font-bold uppercase tracking-widest text-[#2D2136]/50">
                      Booking Inquiries
                    </span>
                    <a href={`mailto:${contact.email}`} className="font-display text-[14.5px] font-bold text-[#2D2136] hover:text-[#1E227D] transition-colors break-all">
                      {contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border border-[#E0A2F5]/20 text-[#1E227D]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] font-bold uppercase tracking-widest text-[#2D2136]/50">
                      Visit Clinic
                    </span>
                    <span className="font-display text-[14.5px] font-bold text-[#2D2136]">
                      {contact.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Opening Hours Box */}
              <div className="relative overflow-hidden rounded-[2rem] border border-zinc-300 bg-white p-6">
                <GoldenDragonWave className="opacity-15" />
                <div className="relative z-10 flex items-center gap-3 text-[#F000E2] mb-6">
                  <Clock size={20} />
                  <h3 className="font-display text-lg font-bold text-[#2D2136]">
                    Opening Hours
                  </h3>
                </div>
                <div className="flex flex-col gap-4 font-body text-sm text-[#2D2136]/80">
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span>Monday - Friday</span>
                    <span className="font-bold text-[#2D2136]">{contact.mon_fri}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span>Saturday</span>
                    <span className="font-bold text-[#2D2136]">{contact.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-bold text-[#2D2136]">{contact.sunday}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Send a Message Form */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-[2rem] border border-zinc-300 bg-white p-8">
                <GoldenDragonWave className="opacity-10" />
                <div className="relative z-10">
                  <h3 className="font-display text-2xl font-bold text-[#2D2136] mb-2">
                  Send a Message
                </h3>
                <p className="font-body text-sm text-[#2D2136]/60 mb-8">
                  We aim to respond to all inquiries within 2 hours during working hours.
                </p>

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-6"
                    >
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block font-display text-[13px] font-bold text-[#2D2136] mb-1.5">
                            First Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="Jane"
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 font-body text-sm text-[#2D2136] outline-none transition-all focus:border-[#E0A2F5]/80 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-display text-[13px] font-bold text-[#2D2136] mb-1.5">
                            Last Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Doe"
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 font-body text-sm text-[#2D2136] outline-none transition-all focus:border-[#E0A2F5]/80 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-display text-[13px] font-bold text-[#2D2136] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jane@example.com"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 font-body text-sm text-[#2D2136] outline-none transition-all focus:border-[#E0A2F5]/80 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-display text-[13px] font-bold text-[#2D2136] mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="07123 456 789"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 font-body text-sm text-[#2D2136] outline-none transition-all focus:border-[#E0A2F5]/80 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-display text-[13px] font-bold text-[#2D2136] mb-1.5">
                          How can we help?
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Please describe your inquiry..."
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 font-body text-sm text-[#2D2136] outline-none transition-all focus:border-[#E0A2F5]/80 focus:bg-white resize-none"
                        />
                      </div>

                      {submitError && (
                        <p className="text-sm text-red-500 text-center">{submitError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-gradient-to-r from-[#1E227D] to-[#F000E2] py-4 font-display text-sm font-bold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <Send size={15} />
                        <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500 mb-4 border border-green-150">
                        <Check size={28} />
                      </div>
                      <h4 className="font-display text-xl font-bold text-[#2D2136] mb-2">
                        Message Sent Successfully!
                      </h4>
                      <p className="font-body text-sm text-[#2D2136]/60 max-w-[280px]">
                        Thank you for contacting us. One of our specialists will reply shortly.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          </div>

          {/* Interactive Google Map Section */}
          <div className="mt-16 overflow-hidden rounded-[2.5rem] border border-zinc-200 shadow-lg h-[450px] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.912580375504!2d-1.9771834229683511!3d52.558455133381294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870a3e6bdb711ff%3A0xa7585efd65fb6193!2sInsight%20Health%20Services%20Ltd!5e1!3m2!1sen!2sin!4v1784107993446!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
