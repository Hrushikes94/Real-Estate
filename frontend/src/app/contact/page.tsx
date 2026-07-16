'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/utils/api';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    try {
      await api.submitInquiry({
        name,
        email,
        message: `GENERAL INQUIRY: ${message}`,
      });
      setSubmitted(true);
      // Trigger success confetti pop!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0B1F3A', '#8B5E3C', '#C9A27E', '#F7F5F2'],
      });
    } catch (err) {
      console.error('Failed to submit contact inquiry', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 bg-off-white min-h-screen px-6 md:px-12 select-none font-poppins text-primary">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-dark mb-3 block">
              Connect With Us
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-primary">
              Contact HQ
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column: Office info & Contour Mock Map */}
            <div className="flex flex-col gap-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-4">Gravity Offices</h2>
                <p className="text-xs text-primary/75 font-sans leading-relaxed max-w-md">
                  Whether you are seeking an off-market coastal acquisition or wish to list an architectural masterpiece, our team provides discreet, flawless advisory representation globally.
                </p>
              </div>

              {/* HQ Locations list */}
              <div className="flex flex-col gap-8">
                <div className="flex gap-4 items-start bg-primary/5 p-6 border-l-2 border-accent-dark">
                  <MapPin className="text-accent-dark mt-1 flex-shrink-0" size={18} />
                  <div>
                    <h4 className="text-sm font-bold uppercase mb-1">Malibu Head Office</h4>
                    <p className="text-xs text-primary/80 font-sans leading-relaxed">
                      23450 Pacific Coast Highway, Malibu, CA 90265
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-primary/5 p-6 border-l-2 border-accent-dark">
                  <MapPin className="text-accent-dark mt-1 flex-shrink-0" size={18} />
                  <div>
                    <h4 className="text-sm font-bold uppercase mb-1">New York Studio</h4>
                    <p className="text-xs text-primary/80 font-sans leading-relaxed">
                      100 Franklin Street, New York, NY 10013
                    </p>
                  </div>
                </div>
              </div>

              {/* Vector connection lines Map Mockup */}
              <div className="relative bg-primary border border-accent-dark/20 h-[260px] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <style jsx>{`
                  .bg-grid-pattern {
                    background-size: 25px 25px;
                    background-image: linear-gradient(to right, #C9A27E 1px, transparent 1px),
                                      linear-gradient(to bottom, #C9A27E 1px, transparent 1px);
                  }
                `}</style>
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 120 180 Q 250 80 420 160" fill="none" stroke="#C9A27E" strokeWidth="0.8" strokeDasharray="4,4" />
                </svg>

                <div className="absolute left-20 bottom-16 text-center">
                  <span className="relative flex h-3 w-3 mx-auto mb-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-light/50 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-dark border border-off-white"></span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-off-white font-bold block">MALIBU</span>
                </div>

                <div className="absolute right-24 top-20 text-center">
                  <span className="relative flex h-3 w-3 mx-auto mb-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-light/50 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-dark border border-off-white"></span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-off-white font-bold block">NEW YORK</span>
                </div>

                <span className="absolute bottom-4 left-6 z-10 text-[9px] uppercase tracking-widest text-accent-light/75">Gravity Network Registry</span>
              </div>
            </div>

            {/* Right Column: Inquiry Contact Form */}
            <div className="bg-off-white border border-accent-dark/20 p-10 md:p-12 shadow-md">
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-accent-dark mb-8">Inquiry Form</h3>

              {submitted ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="text-4xl block mb-4">✓</span>
                  <h4 className="text-lg font-bold uppercase tracking-widest text-primary mb-3">Transmission Successful</h4>
                  <p className="text-xs text-primary/70 leading-relaxed font-sans max-w-sm mx-auto">
                    We appreciate your outreach. An architectural curator will follow up with your private inquiry shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitContact} className="flex flex-col gap-6 text-xs">
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-accent-dark font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="bg-transparent border-b border-accent-dark/20 text-primary focus:border-accent-dark outline-none py-2 font-poppins"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-accent-dark font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="bg-transparent border-b border-accent-dark/20 text-primary focus:border-accent-dark outline-none py-2 font-poppins"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-accent-dark font-semibold mb-1">Your Message</label>
                    <textarea
                      rows={6}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Brief details about your acquisition preferences or questions..."
                      className="bg-transparent border-b border-accent-dark/20 text-primary focus:border-accent-dark outline-none py-2 font-poppins resize-none font-sans text-sm leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 mt-6 bg-primary text-off-white uppercase tracking-widest text-[10px] font-bold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Transmitting...' : (
                      <>
                        Transmit Inquiry <Send size={12} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
