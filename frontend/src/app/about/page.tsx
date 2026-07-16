'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Award, Compass, CompassIcon, Globe, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const milestones = [
  {
    year: '2016',
    title: 'Architectural Curation Studio',
    description: 'Founded in Malibu as an design consultancy and brokerage, bridging architectural research with ultra-high-net-worth real estate placement.',
  },
  {
    year: '2019',
    title: 'Coastal Milestones',
    description: 'Closed the landmark Malibu Pavilion sale, setting regional records and cementing our reputation for handling high-profile off-market inventory.',
  },
  {
    year: '2022',
    title: 'National Expansion',
    description: 'Expanded operations to New York (Tribeca Studio) and Aspen (Eco-residence branch) to service client portfolios across coastlines and retreats.',
  },
  {
    year: '2026',
    title: 'Gravity Estates 2.0',
    description: 'Introducing virtual spatial walk-throughs and an international portfolio registry catering to clients across Switzerland, Tokyo, and CA.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 bg-off-white min-h-screen px-6 md:px-12 select-none font-poppins text-primary">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-dark mb-3 block">
              Philosophy & History
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-primary">
              Our Story
            </h1>
          </div>

          {/* Company Story / Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-start">
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight leading-tight text-primary">
              We curate residences as works of art, bridging spatial design and elite living.
            </h2>
            <div className="flex flex-col gap-6 text-sm text-primary/80 font-sans leading-relaxed">
              <p>
                Gravity Estates was created from a simple realization: luxury real estate had become generic. The industry prioritized transactional metrics over architectural integrity. We set out to build a brokerage that operates like an editorial museum.
              </p>
              <p>
                We do not list properties simply for their zip code or price tag. We catalog properties that represent a clear spatial vision—minimalist brutalism, coastal glass structures, and historic stone villas. Our curation standards are uncompromising.
              </p>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 bg-primary text-off-white p-12 border border-accent-dark/20 mb-32">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent-light/50 font-poppins block mb-2 font-semibold">Curation Ratio</span>
              <h3 className="text-4xl font-extrabold uppercase tracking-tighter mb-2">1 in 40</h3>
              <p className="text-xs text-accent-light/70 font-sans leading-relaxed">
                Only one out of approximately forty audited properties meets our visual and structural curation standards.
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent-light/50 font-poppins block mb-2 font-semibold">Active Portfolios</span>
              <h3 className="text-4xl font-extrabold uppercase tracking-tighter mb-2">$850M+</h3>
              <p className="text-xs text-accent-light/70 font-sans leading-relaxed">
                Our active transaction registry consists of premium architectural investments globally.
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent-light/50 font-poppins block mb-2 font-semibold">Offices</span>
              <h3 className="text-4xl font-extrabold uppercase tracking-tighter mb-2">3 HQ</h3>
              <p className="text-xs text-accent-light/70 font-sans leading-relaxed">
                Positioned in Malibu, New York, and Aspen to cover key luxury zones.
              </p>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="mb-20">
            <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-accent-dark mb-16 text-center">
              Historical Milestones
            </h3>

            <div className="relative border-l border-accent-dark/20 pl-8 ml-4 flex flex-col gap-16">
              {milestones.map((m, idx) => (
                <motion.div
                  key={idx}
                  className="relative group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                >
                  {/* Timeline node */}
                  <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-off-white border-2 border-accent-dark flex items-center justify-center group-hover:bg-accent-light transition-colors duration-300">
                    <div className="w-2 h-2 rounded-full bg-accent-dark" />
                  </div>
                  
                  <span className="text-3xl font-extrabold text-accent-dark block mb-2">
                    {m.year}
                  </span>
                  <h4 className="text-lg font-bold uppercase tracking-tight mb-2 text-primary">
                    {m.title}
                  </h4>
                  <p className="text-xs text-primary/75 font-sans leading-relaxed max-w-xl">
                    {m.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
