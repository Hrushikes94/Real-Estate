'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, ArrowUpRight, Award, Shield, Key } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, Agent, Property } from '@/utils/api';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      setLoading(true);
      try {
        const data = await api.getAgents();
        setAgents(data);
        if (data.length > 0) {
          setSelectedAgent(data[0]); // default select first agent
        }
      } catch (err) {
        console.error('Failed to load agents', err);
      } finally {
        setLoading(false);
      }
    }
    loadAgents();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-off-white">
        <div className="w-10 h-10 border-2 border-accent-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 bg-off-white min-h-screen px-6 md:px-12 select-none font-poppins">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-dark mb-3 block">
              The Curators
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-primary">
              Brokerage Team
            </h1>
          </div>

          {/* Curators List selector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`group border p-8 flex flex-col items-center text-center cursor-pointer transition-all ${selectedAgent?.id === agent.id ? 'bg-primary text-off-white border-primary shadow-2xl' : 'bg-transparent text-primary border-accent-dark/20 hover:border-primary'}`}
                whileHover={{ y: -5 }}
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-accent-light/30 mb-6">
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight mb-1">{agent.name}</h3>
                <span className={`text-[10px] tracking-widest uppercase font-semibold mb-4 ${selectedAgent?.id === agent.id ? 'text-accent-light' : 'text-accent-dark'}`}>
                  Global Property Specialist
                </span>
                <p className={`text-xs font-sans leading-relaxed line-clamp-3 mb-6 ${selectedAgent?.id === agent.id ? 'text-accent-light/80' : 'text-primary/70'}`}>
                  {agent.bio}
                </p>
                <button className={`text-[10px] uppercase tracking-widest font-semibold border-b ${selectedAgent?.id === agent.id ? 'text-off-white border-off-white' : 'text-accent-dark border-accent-dark'}`}>
                  {selectedAgent?.id === agent.id ? 'Selected Curator' : 'View Catalog & Profile'}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Curated Agent details & active listings */}
          <AnimatePresence mode="wait">
            {selectedAgent && (
              <motion.div
                key={selectedAgent.id}
                className="grid grid-cols-1 lg:grid-cols-3 gap-16 border-t border-accent-dark/10 pt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                {/* Agent Profile info card */}
                <div className="lg:col-span-1 bg-primary text-off-white border border-accent-dark/20 p-10 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-extrabold uppercase tracking-tight mb-2">{selectedAgent.name}</h2>
                    <span className="text-xs uppercase tracking-widest text-accent-light font-semibold mb-8 block">Global Agent</span>
                    <p className="text-xs text-accent-light/75 font-sans leading-relaxed mb-8">
                      {selectedAgent.bio}
                    </p>

                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-accent-light/50 font-bold mb-4 font-poppins">Accreditation</h4>
                    <ul className="flex flex-col gap-3 text-[10px] uppercase tracking-wider text-accent-light mb-8">
                      <li className="flex items-center gap-2"><Shield size={12} /> Certified HNW Negotiator</li>
                      <li className="flex items-center gap-2"><Award size={12} /> Million Dollar Guild Elite</li>
                      <li className="flex items-center gap-2"><Key size={12} /> Coastal Land Expert</li>
                    </ul>
                  </div>

                  <div className="border-t border-accent-dark/30 pt-8 flex flex-col gap-3 font-sans text-xs text-accent-light/85">
                    <a href={`tel:${selectedAgent.phone}`} className="flex items-center gap-2 hover:text-off-white transition-colors">
                      <Phone size={12} /> {selectedAgent.phone}
                    </a>
                    <a href={`mailto:${selectedAgent.email}`} className="flex items-center gap-2 hover:text-off-white transition-colors">
                      <Mail size={12} /> {selectedAgent.email}
                    </a>
                  </div>
                </div>

                {/* Agent Properties grid */}
                <div className="lg:col-span-2">
                  <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-accent-dark mb-8">
                    Active Portfolios ({selectedAgent.properties?.length || 0})
                  </h3>
                  
                  {(!selectedAgent.properties || selectedAgent.properties.length === 0) ? (
                    <div className="bg-primary/5 p-12 border border-accent-dark/10 text-center font-sans text-xs text-primary/60">
                      Currently preparing exclusive off-market catalogs for this curator.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {selectedAgent.properties.map((prop) => (
                        <div key={prop.id} className="group bg-primary border border-accent-dark/10 text-off-white flex flex-col">
                          <div className="relative h-[240px] w-full overflow-hidden">
                            <Image
                              src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'}
                              alt={prop.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-3 left-3 bg-primary/95 text-accent-light px-2 py-[2px] font-poppins text-[9px] uppercase tracking-widest font-bold">
                              {prop.status}
                            </div>
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <span className="text-[10px] tracking-widest text-accent-light uppercase font-semibold mb-1">{prop.location}</span>
                            <h4 className="text-base font-bold uppercase tracking-tight mb-4 group-hover:text-accent-light transition-colors truncate">{prop.title}</h4>
                            <div className="flex justify-between items-center border-t border-accent-dark/20 pt-4 mt-auto">
                              <span className="text-sm font-extrabold">${(prop.price / 1000000).toFixed(1)}M</span>
                              <Link href={`/properties/${prop.id}`} className="text-[9px] uppercase tracking-widest font-semibold text-accent-light hover:text-off-white transition-colors flex items-center gap-1">
                                Discover <ArrowUpRight size={10} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </>
  );
}
