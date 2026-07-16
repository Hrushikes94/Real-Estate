'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Mail, Phone, ChevronLeft, ChevronRight, Maximize2, MapPin, X, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, Property, MOCK_PROPERTIES } from '@/utils/api';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const propertyId = Number(resolvedParams.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prop = await api.getProperty(propertyId);
        setProperty(prop);

        // Fetch similar properties (same type, excluding current)
        const allProps = await api.getProperties();
        const filtered = allProps
          .filter(p => p.id !== propertyId && (p.type === prop.type || p.location.includes(prop.location.split(',')[0])))
          .slice(0, 2);
        
        // Fallback to any 2 properties if none similar
        if (filtered.length === 0) {
          setSimilarProperties(allProps.filter(p => p.id !== propertyId).slice(0, 2));
        } else {
          setSimilarProperties(filtered);
        }
      } catch (err) {
        console.error('Failed to load property details', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [propertyId]);

  const handleSubmitViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date || !time) return;

    setSubmitting(true);
    try {
      const inquiryMessage = `SCHEDULE VIEWING Request on ${date} at ${time}. Client Message: ${message || 'No message provided.'}`;
      await api.submitInquiry({
        name,
        email,
        message: inquiryMessage,
        propertyId,
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
      console.error('Failed to submit viewing inquiry', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextImage = () => {
    if (lightboxIndex === null || !property?.images) return;
    setLightboxIndex((lightboxIndex + 1) % property.images.length);
  };

  const handlePrevImage = () => {
    if (lightboxIndex === null || !property?.images) return;
    setLightboxIndex((lightboxIndex - 1 + property.images.length) % property.images.length);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-off-white">
        <div className="w-10 h-10 border-2 border-accent-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-off-white font-poppins">
        <h2 className="text-2xl font-bold mb-4">Acquisition Not Found</h2>
        <Link href="/properties" className="text-xs uppercase tracking-widest text-accent-dark border-b border-accent-dark hover:text-primary transition-colors">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* Main Container */}
      <main className="pt-24 pb-32 bg-off-white px-6 md:px-12 select-none">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Link href="/properties" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-poppins font-semibold text-accent-dark hover:text-primary mb-8 transition-colors">
            <ChevronLeft size={14} /> Back to Catalog
          </Link>

          {/* Heading */}
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-dark font-poppins mb-3 block">
              {property.location}
            </span>
            <h1 className="text-4xl md:text-6xl font-poppins font-extrabold uppercase tracking-tight text-primary leading-none mb-4">
              {property.title}
            </h1>
            <span className="text-2xl md:text-3xl font-poppins font-extrabold text-primary">
              ${Number(property.price).toLocaleString()}
            </span>
          </div>

          {/* Editorial Grid Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div
              className="md:col-span-2 relative h-[400px] md:h-[600px] overflow-hidden group cursor-pointer"
              onClick={() => setLightboxIndex(0)}
            >
              <Image
                src={property.images && property.images[0] ? property.images[0] : 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'}
                alt={`${property.title} main`}
                fill
                priority
                className="object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="text-off-white" size={32} />
              </div>
            </div>
            
            <div className="flex flex-col gap-6 h-[400px] md:h-[600px]">
              {property.images && property.images.slice(1, 3).map((img, index) => (
                <div
                  key={index}
                  className="flex-1 relative overflow-hidden group cursor-pointer"
                  onClick={() => setLightboxIndex(index + 1)}
                >
                  <Image
                    src={img}
                    alt={`${property.title} detail`}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="text-off-white" size={24} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Action Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Left specifications */}
            <div className="lg:col-span-2">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-dark font-poppins mb-6">Synopsis</h3>
              <p className="text-primary/80 font-sans text-sm leading-relaxed mb-12 max-w-2xl whitespace-pre-line">
                {property.description}
              </p>

              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-dark font-poppins mb-6">Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                <div className="bg-primary/5 p-6 border-l-2 border-accent-dark">
                  <span className="text-[10px] uppercase tracking-widest text-accent-dark font-poppins font-semibold block mb-1">Residence Type</span>
                  <span className="text-sm font-poppins font-bold text-primary">{property.type}</span>
                </div>
                <div className="bg-primary/5 p-6 border-l-2 border-accent-dark">
                  <span className="text-[10px] uppercase tracking-widest text-accent-dark font-poppins font-semibold block mb-1">Bedrooms</span>
                  <span className="text-sm font-poppins font-bold text-primary">{property.beds} Bedrooms</span>
                </div>
                <div className="bg-primary/5 p-6 border-l-2 border-accent-dark">
                  <span className="text-[10px] uppercase tracking-widest text-accent-dark font-poppins font-semibold block mb-1">Bathrooms</span>
                  <span className="text-sm font-poppins font-bold text-primary">{property.baths} Bathrooms</span>
                </div>
                <div className="bg-primary/5 p-6 border-l-2 border-accent-dark">
                  <span className="text-[10px] uppercase tracking-widest text-accent-dark font-poppins font-semibold block mb-1">Total Space</span>
                  <span className="text-sm font-poppins font-bold text-primary">{property.sqft.toLocaleString()} SqFt</span>
                </div>
              </div>

              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-dark font-poppins mb-6">Residences Amenities</h3>
              <ul className="grid grid-cols-2 gap-4 text-xs uppercase tracking-widest font-poppins font-medium text-primary/85 mb-12">
                <li className="flex items-center gap-2">&bull; Subterranean Parking Pavilion</li>
                <li className="flex items-center gap-2">&bull; Heated Saltwater Quartz Pool</li>
                <li className="flex items-center gap-2">&bull; Integrated Smart Home System</li>
                <li className="flex items-center gap-2">&bull; Biometric Security Entry</li>
                <li className="flex items-center gap-2">&bull; Floor-to-Ceiling Thermal Glazing</li>
                <li className="flex items-center gap-2">&bull; Detached Curator Guest Suite</li>
              </ul>

              {/* Mock Map Vector layout */}
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-dark font-poppins mb-6">Location Plot</h3>
              <div className="relative bg-primary border border-accent-dark/20 h-[300px] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <style jsx>{`
                  .bg-grid-pattern {
                    background-size: 25px 25px;
                    background-image: linear-gradient(to right, #C9A27E 1px, transparent 1px),
                                      linear-gradient(to bottom, #C9A27E 1px, transparent 1px);
                  }
                `}</style>
                <div className="relative z-10 text-center font-poppins p-6">
                  <MapPin size={24} className="text-accent-light mx-auto mb-3 animate-bounce" />
                  <span className="text-xs uppercase tracking-[0.25em] text-off-white font-bold block mb-1">{property.location}</span>
                  <span className="text-[10px] text-accent-light block font-sans">Geographical coordinates plotted successfully</span>
                </div>
              </div>
            </div>

            {/* Right stick card */}
            <div className="lg:sticky lg:top-32 flex flex-col gap-8">
              {/* Agent card */}
              {property.agent && (
                <div className="bg-primary text-off-white border border-accent-dark/20 p-8 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-accent-light/30 mb-4">
                    <Image
                      src={property.agent.photo}
                      alt={property.agent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-poppins font-bold uppercase tracking-tight mb-1">{property.agent.name}</h4>
                  <span className="text-[10px] tracking-widest uppercase text-accent-light font-poppins font-semibold mb-6">Assigned Curator</span>
                  <div className="w-full flex flex-col gap-3 font-sans text-xs border-t border-accent-dark/30 pt-6 text-accent-light/80">
                    <a href={`tel:${property.agent.phone}`} className="flex items-center justify-center gap-2 hover:text-off-white transition-colors">
                      <Phone size={12} /> {property.agent.phone}
                    </a>
                    <a href={`mailto:${property.agent.email}`} className="flex items-center justify-center gap-2 hover:text-off-white transition-colors">
                      <Mail size={12} /> {property.agent.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Schedule viewing form */}
              <div className="bg-off-white border border-accent-dark/20 p-8 shadow-md">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-dark font-poppins mb-6">Schedule Private Viewing</h4>
                
                {submitted ? (
                  <motion.div
                    className="text-center py-8 font-poppins"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="text-2xl block mb-3">✓</span>
                    <h5 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Request Transmitted</h5>
                    <p className="text-xs text-primary/70 leading-relaxed font-sans">
                      Our private curator will coordinate dates and details with you via email within the hour.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitViewing} className="flex flex-col gap-4 text-xs font-poppins">
                    <div className="flex flex-col">
                      <label className="text-[9px] uppercase tracking-widest text-accent-dark font-semibold mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alice Smith"
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
                        placeholder="e.g. alice@example.com"
                        className="bg-transparent border-b border-accent-dark/20 text-primary focus:border-accent-dark outline-none py-2 font-poppins"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-[9px] uppercase tracking-widest text-accent-dark font-semibold mb-1 flex items-center gap-1"><Calendar size={10} /> Date</label>
                        <input
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="bg-transparent border-b border-accent-dark/20 text-primary focus:border-accent-dark outline-none py-2 font-poppins cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[9px] uppercase tracking-widest text-accent-dark font-semibold mb-1 flex items-center gap-1"><Clock size={10} /> Time</label>
                        <select
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="bg-transparent border-b border-accent-dark/20 text-primary focus:border-accent-dark outline-none py-2 font-poppins cursor-pointer"
                        >
                          <option value="">Select Time</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="07:00 PM">07:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[9px] uppercase tracking-widest text-accent-dark font-semibold mb-1">Message (Optional)</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Special instructions or questions..."
                        className="bg-transparent border-b border-accent-dark/20 text-primary focus:border-accent-dark outline-none py-2 font-poppins resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 mt-4 bg-primary text-off-white uppercase tracking-widest text-[10px] font-bold hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Transmitting...' : 'Request Viewing'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Similar listings */}
          <div className="mt-32 pt-20 border-t border-accent-dark/10">
            <h3 className="text-2xl font-poppins font-extrabold uppercase tracking-tight text-primary mb-12">
              Similar Acquisitions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {similarProperties.map((prop) => (
                <div key={prop.id} className="group bg-primary border border-accent-dark/10 flex flex-col text-off-white">
                  <div className="relative h-[300px] w-full overflow-hidden">
                    <Image
                      src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'}
                      alt={prop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8">
                    <span className="text-[10px] tracking-widest text-accent-light uppercase font-poppins font-semibold block mb-2">{prop.location}</span>
                    <h4 className="text-lg font-poppins font-bold uppercase tracking-tight mb-4 group-hover:text-accent-light transition-colors">{prop.title}</h4>
                    <div className="flex justify-between items-center border-t border-accent-dark/30 pt-6">
                      <span className="text-base font-poppins font-extrabold text-off-white">${(prop.price / 1000000).toFixed(1)}M</span>
                      <Link href={`/properties/${prop.id}`} className="text-[10px] uppercase tracking-widest font-poppins font-semibold text-accent-light hover:text-off-white transition-colors flex items-center gap-1">
                        Discover <ArrowUpRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && property.images && (
          <motion.div
            className="fixed inset-0 bg-primary z-[200] flex flex-col justify-between p-6 select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header / Close */}
            <div className="flex justify-between items-center text-off-white font-poppins text-xs uppercase tracking-widest">
              <span>{property.title}</span>
              <button onClick={() => setLightboxIndex(null)} className="text-accent-light hover:text-off-white p-2">
                <X size={24} />
              </button>
            </div>

            {/* Main Image View */}
            <div className="relative flex-1 flex items-center justify-center">
              <button
                onClick={handlePrevImage}
                className="absolute left-4 z-10 text-off-white hover:text-accent-light transition-colors p-4"
              >
                <ChevronLeft size={48} />
              </button>

              <div className="relative w-full max-w-5xl h-[70vh]">
                <Image
                  src={property.images[lightboxIndex]}
                  alt={`${property.title} slide`}
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={handleNextImage}
                className="absolute right-4 z-10 text-off-white hover:text-accent-light transition-colors p-4"
              >
                <ChevronRight size={48} />
              </button>
            </div>

            {/* Index indicator */}
            <div className="text-center text-accent-light font-poppins text-xs tracking-widest py-4">
              {lightboxIndex + 1} / {property.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
