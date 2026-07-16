'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, Map, SlidersHorizontal, ArrowUpRight, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, Property } from '@/utils/api';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active view: 'grid' or 'map'
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [beds, setBeds] = useState(searchParams.get('beds') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [sortBy, setSortBy] = useState('price-desc');

  // Trigger query fetch
  const fetchFilteredProperties = async () => {
    setLoading(true);
    try {
      const filters = {
        location: location || undefined,
        type: type || undefined,
        beds: beds ? Number(beds) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        status: status || undefined,
      };
      const res = await api.getProperties(filters);
      
      // Sort logic client side
      const sorted = [...res];
      if (sortBy === 'price-asc') {
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortBy === 'price-desc') {
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sortBy === 'sqft') {
        sorted.sort((a, b) => Number(b.sqft) - Number(a.sqft));
      }
      setProperties(sorted);
    } catch (err) {
      console.error('Error fetching filtered properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProperties();
  }, [searchParams, sortBy]);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (type) params.append('type', type);
    if (beds) params.append('beds', beds);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (status) params.append('status', status);
    
    router.push(`/properties?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setLocation('');
    setType('');
    setBeds('');
    setMinPrice('');
    setMaxPrice('');
    setStatus('');
    router.push('/properties');
    setIsFilterOpen(false);
  };

  // Mock geographical positions mapping for the Mapbox alternative
  const getCoordinates = (loc: string) => {
    const l = loc.toLowerCase();
    if (l.includes('malibu')) return { x: 30, y: 70 };
    if (l.includes('new york')) return { x: 80, y: 40 };
    if (l.includes('napa')) return { x: 25, y: 45 };
    if (l.includes('aspen')) return { x: 45, y: 55 };
    if (l.includes('portland')) return { x: 20, y: 35 };
    return { x: 50, y: 50 }; // Center
  };

  return (
    <>
      <Navbar />

      {/* Main Section */}
      <main className="pt-32 pb-24 bg-off-white min-h-screen px-6 md:px-12 select-none">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-accent-dark font-poppins mb-3 block">
                Exclusive Collection
              </span>
              <h1 className="text-4xl md:text-5xl font-poppins font-extrabold uppercase tracking-tight text-primary">
                Acquisitions
              </h1>
            </div>
            
            {/* View toggles & Sort */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 bg-primary text-off-white px-4 py-2 text-xs uppercase tracking-widest font-poppins font-semibold border border-transparent hover:bg-transparent hover:text-primary hover:border-primary transition-all cursor-pointer"
              >
                <Filter size={14} /> Filter
              </button>

              <div className="flex border border-accent-dark/20 rounded-none overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-poppins font-semibold flex items-center gap-2 transition-all cursor-pointer ${view === 'grid' ? 'bg-primary text-off-white' : 'bg-transparent text-primary hover:bg-accent-light/10'}`}
                >
                  <Grid size={14} /> Grid
                </button>
                <button
                  onClick={() => setView('map')}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-poppins font-semibold flex items-center gap-2 transition-all cursor-pointer ${view === 'map' ? 'bg-primary text-off-white' : 'bg-transparent text-primary hover:bg-accent-light/10'}`}
                >
                  <Map size={14} /> Map
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border border-accent-dark/20 px-4 py-2 text-xs uppercase tracking-widest font-poppins font-semibold text-primary focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="sqft">Size: Largest</option>
              </select>
            </div>
          </div>

          {/* Core Content Views */}
          {loading ? (
            <div className="h-[60vh] flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-accent-dark border-t-transparent rounded-full animate-spin" />
            </div>
          ) : view === 'grid' ? (
            /* Properties Grid */
            properties.length === 0 ? (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                <p className="text-lg font-poppins font-bold text-primary/75 mb-4">No matching acquisitions found.</p>
                <button onClick={handleResetFilters} className="text-xs uppercase tracking-widest font-semibold border-b border-accent-dark text-accent-dark hover:text-primary transition-all">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map((prop) => (
                  <motion.div
                    key={prop.id}
                    className="group bg-primary border border-accent-dark/10 flex flex-col text-off-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative h-[300px] w-full overflow-hidden">
                      <Image
                        src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'}
                        alt={prop.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                      <h3 className="text-lg font-poppins font-bold uppercase tracking-tight mb-4 group-hover:text-accent-light transition-colors">
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
                          View details <ArrowUpRight size={10} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            /* Interactive Map Mockup (Editorial Vector Plot) */
            <div className="relative bg-primary border border-accent-dark/30 h-[70vh] w-full overflow-hidden flex">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <style jsx>{`
                .bg-grid-pattern {
                  background-size: 40px 40px;
                  background-image: linear-gradient(to right, #C9A27E 1px, transparent 1px),
                                    linear-gradient(to bottom, #C9A27E 1px, transparent 1px);
                }
              `}</style>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Visual contour lines or vector links between nodes */}
                <path d="M 100 200 Q 400 100 700 300 T 1100 200" fill="none" stroke="#8B5E3C" strokeWidth="0.5" strokeDasharray="5,5" />
                <path d="M 200 400 Q 600 300 900 600" fill="none" stroke="#C9A27E" strokeWidth="0.5" strokeDasharray="3,3" />
              </svg>

              {/* Plotted property points */}
              {properties.map((prop) => {
                const coords = getCoordinates(prop.location);
                return (
                  <div
                    key={prop.id}
                    className="absolute group/node cursor-pointer"
                    style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      {/* Pulse animation ring */}
                      <span className="absolute inline-flex h-6 w-6 rounded-full bg-accent-light/30 animate-ping" />
                      {/* Interactive dot node */}
                      <div className="relative w-4 h-4 rounded-full bg-accent-dark border-2 border-off-white hover:bg-accent-light transition-all flex items-center justify-center" />
                      
                      {/* Interactive floating card details on hover */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/node:opacity-100 transition-opacity duration-300 w-56 bg-primary border border-accent-dark/50 p-4 shadow-2xl z-20">
                        <div className="relative h-24 w-full mb-3">
                          <Image
                            src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1613490493576-7fde63acd811'}
                            alt={prop.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="text-xs uppercase tracking-wider font-poppins font-bold text-off-white truncate">{prop.title}</h4>
                        <span className="text-[10px] text-accent-light block mt-1">${(prop.price / 1000000).toFixed(1)}M &bull; {prop.location}</span>
                        <Link href={`/properties/${prop.id}`} className="pointer-events-auto block mt-2 text-[9px] uppercase tracking-widest text-accent-light border-b border-accent-light hover:text-off-white hover:border-off-white text-center">
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-6 left-6 z-10 bg-primary/90 border border-accent-dark/20 p-4 font-poppins text-off-white max-w-xs">
                <h4 className="text-xs uppercase tracking-widest font-bold text-accent-light mb-1">Interactive Map Vector</h4>
                <p className="text-[10px] text-accent-light/75 font-sans leading-relaxed">
                  Nodes represent geographical estate footprints. Hover nodes to view acquisitions details.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Filter Sidebar Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full max-w-md bg-primary z-[101] p-10 flex flex-col justify-between text-off-white font-poppins select-none"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
            >
              <div>
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-bold uppercase tracking-wider">Search Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="text-accent-light hover:text-off-white p-1">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleApplyFilters} className="flex flex-col gap-6 text-sm">
                  {/* Location input */}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-accent-light/70 font-semibold mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Malibu"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-transparent border-b border-accent-light/20 text-off-white focus:border-accent-light outline-none py-2 font-poppins"
                    />
                  </div>

                  {/* Residence Type */}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-accent-light/70 font-semibold mb-2">Residence Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="bg-transparent border-b border-accent-light/20 text-off-white focus:border-accent-light outline-none py-2 font-poppins cursor-pointer"
                    >
                      <option value="" className="bg-primary text-off-white">All Residences</option>
                      <option value="Villa" className="bg-primary text-off-white">Villa</option>
                      <option value="Penthouse" className="bg-primary text-off-white">Penthouse</option>
                      <option value="Apartment" className="bg-primary text-off-white">Apartment</option>
                    </select>
                  </div>

                  {/* Min Beds */}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-accent-light/70 font-semibold mb-2">Min Bedrooms</label>
                    <select
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      className="bg-transparent border-b border-accent-light/20 text-off-white focus:border-accent-light outline-none py-2 font-poppins cursor-pointer"
                    >
                      <option value="" className="bg-primary text-off-white">Any Bedrooms</option>
                      <option value="2" className="bg-primary text-off-white">2+ Beds</option>
                      <option value="3" className="bg-primary text-off-white">3+ Beds</option>
                      <option value="4" className="bg-primary text-off-white">4+ Beds</option>
                      <option value="5" className="bg-primary text-off-white">5+ Beds</option>
                    </select>
                  </div>

                  {/* Max Price */}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-accent-light/70 font-semibold mb-2">Max Price</label>
                    <select
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="bg-transparent border-b border-accent-light/20 text-off-white focus:border-accent-light outline-none py-2 font-poppins cursor-pointer"
                    >
                      <option value="" className="bg-primary text-off-white">Any Price</option>
                      <option value="5000000" className="bg-primary text-off-white">Under $5.0M</option>
                      <option value="10000000" className="bg-primary text-off-white">Under $10.0M</option>
                      <option value="20000000" className="bg-primary text-off-white">Under $20.0M</option>
                    </select>
                  </div>

                  {/* Status Type */}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-accent-light/70 font-semibold mb-2">Status</label>
                    <div className="flex gap-4 mt-2">
                      {['Buy', 'Rent', 'Sold'].map((statusOption) => (
                        <button
                          key={statusOption}
                          type="button"
                          onClick={() => setStatus(status === statusOption ? '' : statusOption)}
                          className={`flex-1 py-2 text-xs uppercase tracking-widest border font-poppins font-semibold transition-colors cursor-pointer ${status === statusOption ? 'bg-accent-light text-primary border-accent-light' : 'border-accent-light/20 text-off-white hover:border-off-white'}`}
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex gap-4 pt-6 border-t border-accent-dark/30">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-4 border border-accent-light/30 text-accent-light uppercase tracking-widest text-xs font-semibold hover:border-off-white hover:text-off-white transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => handleApplyFilters()}
                  className="flex-1 py-4 bg-accent-dark text-off-white uppercase tracking-widest text-xs font-bold hover:bg-accent-light hover:text-primary transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-off-white">
        <div className="w-10 h-10 border-2 border-accent-dark border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
