'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, DollarSign, Home as HomeIcon, ArrowUpRight, Shield, Award, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, Property, Agent } from '@/utils/api';

export default function HomePage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  
  // Search state
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Parallax Hero
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroTextY = useTransform(scrollY, [0, 800], [0, -100]);

  useEffect(() => {
    async function fetchData() {
      try {
        const propsData = await api.getProperties();
        setProperties(propsData.slice(0, 3)); // show first 3
        const agentsData = await api.getAgents();
        setAgents(agentsData);
      } catch (err) {
        console.error('Error fetching homepage data', err);
      }
    }
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (location) queryParams.append('location', location);
    if (propertyType) queryParams.append('type', propertyType);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);
    router.push(`/properties?${queryParams.toString()}`);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-primary">
        <motion.div 
          className="absolute inset-0 z-0 opacity-60"
          style={{ y: heroBgY }}
        >
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Cliffside Pavilion"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent z-1" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full mt-20 flex flex-col items-center">
          <motion.div 
            className="text-center mb-12 select-none"
            style={{ y: heroTextY }}
          >
            <span className="text-xs md:text-sm tracking-[0.4em] font-semibold text-accent-light uppercase block mb-4">
              Gravity Estates
            </span>
            <h1 className="text-5xl md:text-8xl lg:text-[7.5rem] font-poppins font-extrabold text-off-white tracking-tighter leading-[0.9] uppercase">
              DEFYING<br />
              <span className="text-transparent stroke-text">STRUCTURE</span>
            </h1>
            <style jsx>{`
              .stroke-text {
                -webkit-text-stroke: 1px #F7F5F2;
              }
            `}</style>
          </motion.div>

          {/* Search bar overlay */}
          <motion.form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-4xl bg-primary/95 border border-accent-dark/30 backdrop-blur-md p-6 md:p-8 flex flex-col md:flex-row gap-6 shadow-2xl relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex-1 flex flex-col justify-center">
              <label className="text-xs uppercase tracking-widest text-accent-light/70 font-poppins font-semibold mb-2 flex items-center gap-2">
                <MapPin size={12} /> Location
              </label>
              <input
                type="text"
                placeholder="Malibu, Napa Valley, Aspen..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-b border-accent-light/20 text-off-white focus:border-accent-light outline-none py-2 text-sm font-poppins placeholder:text-off-white/30"
              />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <label className="text-xs uppercase tracking-widest text-accent-light/70 font-poppins font-semibold mb-2 flex items-center gap-2">
                <HomeIcon size={12} /> Residence Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-transparent border-b border-accent-light/20 text-off-white focus:border-accent-light outline-none py-2 text-sm font-poppins cursor-pointer"
              >
                <option value="" className="bg-primary text-off-white">All Residences</option>
                <option value="Villa" className="bg-primary text-off-white">Villas</option>
                <option value="Penthouse" className="bg-primary text-off-white">Penthouses</option>
                <option value="Apartment" className="bg-primary text-off-white">Apartments</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <label className="text-xs uppercase tracking-widest text-accent-light/70 font-poppins font-semibold mb-2 flex items-center gap-2">
                <DollarSign size={12} /> Max Price
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-transparent border-b border-accent-light/20 text-off-white focus:border-accent-light outline-none py-2 text-sm font-poppins cursor-pointer"
              >
                <option value="" className="bg-primary text-off-white">Any Price</option>
                <option value="5000000" className="bg-primary text-off-white">Under $5.0M</option>
                <option value="10000000" className="bg-primary text-off-white">Under $10.0M</option>
                <option value="20000000" className="bg-primary text-off-white">Under $20.0M</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-accent-dark hover:bg-accent-light text-off-white hover:text-primary transition-colors py-4 px-8 flex items-center justify-center gap-3 font-poppins text-xs uppercase tracking-widest font-bold self-center md:self-end mt-4 md:mt-0 w-full md:w-auto"
            >
              <Search size={14} /> Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-24 bg-off-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h3 className="text-5xl md:text-6xl font-poppins font-extrabold text-primary mb-2">$1.2B+</h3>
              <p className="text-xs uppercase tracking-widest text-accent-dark font-poppins font-semibold">Total Sales Volume</p>
            </div>
            <div>
              <h3 className="text-5xl md:text-6xl font-poppins font-extrabold text-primary mb-2">340+</h3>
              <p className="text-xs uppercase tracking-widest text-accent-dark font-poppins font-semibold">Luxury Estates Managed</p>
            </div>
            <div>
              <h3 className="text-5xl md:text-6xl font-poppins font-extrabold text-primary mb-2">100%</h3>
              <p className="text-xs uppercase tracking-widest text-accent-dark font-poppins font-semibold">Client Discretion Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="py-24 bg-primary text-off-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-light font-poppins mb-3 block">
                Curation Catalog
              </span>
              <h2 className="text-4xl md:text-5xl font-poppins font-extrabold tracking-tight uppercase">
                Featured Residences
              </h2>
            </div>
            <Link href="/properties" className="group flex items-center gap-2 text-xs uppercase tracking-widest font-poppins font-semibold text-accent-light hover:text-off-white transition-colors">
              View All Listings <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {properties.map((prop) => (
              <motion.div
                key={prop.id}
                className="group flex flex-col bg-primary border border-accent-dark/20 relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative h-[400px] w-full overflow-hidden">
                  <Image
                    src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'}
                    alt={prop.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary/95 text-accent-light px-3 py-1 font-poppins text-[10px] uppercase tracking-widest font-bold">
                    {prop.status}
                  </div>
                  <div className="absolute top-4 right-4 bg-accent-dark text-off-white px-3 py-1 font-poppins text-[10px] uppercase tracking-widest font-bold">
                    {prop.type}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <span className="text-xs tracking-widest text-accent-light font-poppins font-semibold mb-2">
                    {prop.location}
                  </span>
                  <h3 className="text-xl font-poppins font-bold uppercase tracking-tight mb-4 group-hover:text-accent-light transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.15em] font-poppins text-accent-light/50 mb-6">
                    {prop.beds} Beds &bull; {prop.baths} Baths &bull; {prop.sqft.toLocaleString()} SqFt
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-accent-dark/30 flex justify-between items-center">
                    <span className="text-lg font-poppins font-extrabold text-off-white">
                      ${(prop.price / 1000000).toFixed(1)}M
                    </span>
                    <Link href={`/properties/${prop.id}`} className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-poppins font-semibold hover:text-accent-light transition-colors">
                      Discover Details <ArrowUpRight size={10} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-off-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-24">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-dark font-poppins mb-3 block">
              Our Foundations
            </span>
            <h2 className="text-4xl md:text-5xl font-poppins font-extrabold uppercase tracking-tight">
              A Philosophy of Distinction
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-accent-light/10 flex items-center justify-center text-accent-dark mb-8">
                <Shield size={32} />
              </div>
              <h3 className="text-lg font-poppins font-bold uppercase mb-4">Visionary Curation</h3>
              <p className="text-sm text-primary/75 leading-relaxed font-sans">
                We represent only residential artifacts—properties defined by their architectural significance, purity of materials, and harmony with landscape.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-accent-light/10 flex items-center justify-center text-accent-dark mb-8">
                <Users size={32} />
              </div>
              <h3 className="text-lg font-poppins font-bold uppercase mb-4">Discreet Counsel</h3>
              <p className="text-sm text-primary/75 leading-relaxed font-sans">
                Our operations remain entirely confidential. We cater to high-net-worth individuals requiring strict discretion and bespoke transaction pathways.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-accent-light/10 flex items-center justify-center text-accent-dark mb-8">
                <Award size={32} />
              </div>
              <h3 className="text-lg font-poppins font-bold uppercase mb-4">Uncompromising Standards</h3>
              <p className="text-sm text-primary/75 leading-relaxed font-sans">
                From structural inspection to contractual closing, our processes are executed at the highest standards of financial accuracy and legal governance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Agents Section */}
      <section className="py-24 bg-primary text-off-white px-6 md:px-12 border-t border-accent-dark/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-light font-poppins mb-3 block">
              Expert Curators
            </span>
            <h2 className="text-4xl md:text-5xl font-poppins font-extrabold uppercase tracking-tight">
              Meet Our Agents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                className="group flex flex-col items-center bg-primary border border-accent-dark/10 p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-accent-light/30 mb-6">
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-555"
                  />
                </div>
                <h3 className="text-xl font-poppins font-bold uppercase tracking-tight mb-2">
                  {agent.name}
                </h3>
                <span className="text-xs tracking-widest text-accent-light/80 uppercase font-poppins font-semibold mb-4">
                  Global Property Specialist
                </span>
                <p className="text-xs text-accent-light/60 font-sans leading-relaxed text-center mb-6 line-clamp-3">
                  {agent.bio}
                </p>
                <Link href={`/agents`} className="text-[10px] uppercase tracking-widest font-poppins font-semibold border-b border-accent-light text-accent-light hover:text-off-white hover:border-off-white transition-colors">
                  View Listings
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-off-white px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center font-poppins">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-dark mb-8 block">
            Endorsements
          </span>
          <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed text-primary mb-8 font-sans">
            &ldquo;Gravity Estates handled our beachfront acquisition in Malibu with absolute precision and confidentiality. Their understanding of modern architectural aesthetics is simply unmatched.&rdquo;
          </blockquote>
          <cite className="not-italic text-sm uppercase tracking-widest font-bold text-accent-dark font-poppins block">
            — HNW Investor, Malibu Acquisition
          </cite>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-primary text-off-white py-32 border-t border-accent-light/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-6xl font-poppins font-extrabold uppercase mb-8">
            Acquire An Architectural Masterpiece
          </h2>
          <p className="text-accent-light/80 max-w-xl mx-auto text-sm leading-relaxed mb-12 font-sans">
            Register your interests today and receive exclusive priority updates on high-end off-market acquisitions and modern estates.
          </p>
          <Link href="/contact" className="magnetic-btn inline-block bg-accent-dark hover:bg-accent-light text-off-white hover:text-primary transition-colors px-12 py-5 font-poppins text-xs uppercase tracking-widest font-bold">
            Get In Touch
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
