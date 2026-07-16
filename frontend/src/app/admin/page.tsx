'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Calendar, LogOut, Shield, MessageSquare, Home, Trash2, Plus, X, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, Property, Agent } from '@/utils/api';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState('inquiries');

  // Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImages, setNewImages] = useState('');
  const [newBeds, setNewBeds] = useState('3');
  const [newBaths, setNewBaths] = useState('2');
  const [newSqft, setNewSqft] = useState('2000');
  const [newType, setNewType] = useState('Villa');
  const [newStatus, setNewStatus] = useState('Buy');
  const [newAgentId, setNewAgentId] = useState('1');
  const [formSuccess, setFormSuccess] = useState('');

  // Check if already logged in via token
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [inqData, propsData, agentsData] = await Promise.all([
        api.getInquiries(),
        api.getProperties(),
        api.getAgents()
      ]);
      setInquiries(inqData);
      setProperties(propsData);
      setAgents(agentsData);
      if (agentsData.length > 0) {
        setNewAgentId(agentsData[0].id.toString());
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(username, password);
      localStorage.setItem('admin_token', response.access_token);
      setIsAuthenticated(true);
      fetchDashboardData();
    } catch (err: any) {
      setError('Invalid username or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property listing?')) return;
    try {
      await api.deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete property. Check backend logs.');
    }
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess('');

    const imgArray = newImages.split(',').map(img => img.trim()).filter(img => img !== '');

    const propData = {
      title: newTitle,
      description: newDescription,
      price: Number(newPrice),
      location: newLocation,
      images: imgArray.length > 0 ? imgArray : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      beds: Number(newBeds),
      baths: Number(newBaths),
      sqft: Number(newSqft),
      type: newType,
      status: newStatus,
      agentId: Number(newAgentId)
    };

    try {
      await api.createProperty(propData);
      setFormSuccess('Property listing created successfully!');
      
      // Reset form fields
      setNewTitle('');
      setNewDescription('');
      setNewPrice('');
      setNewLocation('');
      setNewImages('');
      
      // Refresh properties list
      const updatedProps = await api.getProperties();
      setProperties(updatedProps);
      
      setTimeout(() => {
        setFormSuccess('');
        setShowAddForm(false);
      }, 2000);
    } catch (err) {
      alert('Failed to add property listing.');
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1F3A] text-white selection:bg-[#C9A27E] selection:text-[#0B1F3A]">
      <Navbar />

      <section className="container mx-auto px-6 pt-32 pb-24 min-h-[75vh] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            // Modern Login Card
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-none"
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-[#8B5E3C] flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="font-poppins font-bold text-3xl uppercase tracking-wider text-center">
                  Admin Login
                </h1>
                <p className="text-white/60 text-sm mt-2 tracking-wide uppercase text-center font-semibold">
                  Access Gravity Estates Management
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 mb-6 text-sm uppercase tracking-wide text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#C9A27E] mb-2 font-poppins font-semibold">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C9A27E] transition-colors rounded-none"
                    placeholder="Enter admin username"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#C9A27E] mb-2 font-poppins font-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C9A27E] transition-colors rounded-none"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8B5E3C] hover:bg-[#C9A27E] text-white hover:text-[#0B1F3A] py-4 transition-all duration-300 font-poppins font-bold uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            </motion.div>
          ) : (
            // Premium Admin Dashboard View
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4">
                <div>
                  <h1 className="font-poppins font-bold text-4xl uppercase tracking-widest">
                    Dashboard
                  </h1>
                  <p className="text-white/60 uppercase tracking-widest text-xs mt-2 font-semibold">
                    Welcome back, Administrator
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 border border-white/10 px-6 py-3 hover:bg-white/5 hover:border-white/30 transition-colors uppercase font-poppins font-semibold tracking-wider text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              {/* Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className={`w-full flex items-center gap-3 px-5 py-4 uppercase font-poppins font-bold tracking-wider text-xs transition-colors rounded-none ${
                      activeTab === 'inquiries' ? 'bg-[#8B5E3C] text-white' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Inquiries ({inquiries.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('properties')}
                    className={`w-full flex items-center gap-3 px-5 py-4 uppercase font-poppins font-bold tracking-wider text-xs transition-colors rounded-none ${
                      activeTab === 'properties' ? 'bg-[#8B5E3C] text-white' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    Properties ({properties.length})
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                  <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-none">
                    
                    {/* inquiries tab */}
                    {activeTab === 'inquiries' && (
                      <div>
                        <h2 className="font-poppins font-bold text-xl uppercase tracking-widest mb-6">
                          Client Viewing Requests
                        </h2>

                        {inquiries.length === 0 ? (
                          <div className="text-center py-16 border border-dashed border-white/10 text-white/40 uppercase tracking-widest text-xs">
                            No viewing requests found.
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {inquiries.map((inq) => (
                              <div
                                key={inq.id}
                                className="border-b border-white/10 pb-6 last:border-0 last:pb-0"
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                  <span className="font-poppins font-bold text-lg text-white">
                                    {inq.name}
                                  </span>
                                  <div className="flex items-center gap-4 text-xs uppercase tracking-wide text-white/60 font-mono">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5" />
                                      {new Date(inq.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-white/80 text-sm leading-relaxed mb-4">
                                  "{inq.message}"
                                </p>

                                <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest font-poppins font-semibold">
                                  <a
                                    href={`mailto:${inq.email}`}
                                    className="flex items-center gap-2 text-[#C9A27E] hover:underline"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    {inq.email}
                                  </a>
                                  <span className="text-white/40">|</span>
                                  <span className="text-[#C9A27E]">
                                    Property: <strong className="text-white">{inq.propertyTitle}</strong>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* properties tab */}
                    {activeTab === 'properties' && (
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="font-poppins font-bold text-xl uppercase tracking-widest">
                            Property Listings
                          </h2>
                          <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#C9A27E] hover:text-[#0B1F3A] px-4 py-2 transition-colors uppercase font-poppins font-bold tracking-wider text-xs"
                          >
                            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {showAddForm ? 'Cancel' : 'Add Listing'}
                          </button>
                        </div>

                        {/* Add Listing Form */}
                        <AnimatePresence>
                          {showAddForm && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border border-white/10 bg-white/5 p-6 mb-8"
                            >
                              <h3 className="text-xs uppercase tracking-widest text-[#C9A27E] mb-4 font-poppins font-bold">
                                Create New Property Listing
                              </h3>

                              {formSuccess && (
                                <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 mb-4 text-xs uppercase tracking-wide text-center">
                                  {formSuccess}
                                </div>
                              )}

                              <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Title</label>
                                  <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white" placeholder="The Glass Pavilion" />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Description</label>
                                  <textarea required value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white h-24" placeholder="Description of the listing..." />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Price (USD)</label>
                                  <input type="number" required value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white" placeholder="8500000" />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Location</label>
                                  <input type="text" required value={newLocation} onChange={e => setNewLocation(e.target.value)} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white" placeholder="Malibu, CA" />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Image URLs (comma separated)</label>
                                  <input type="text" value={newImages} onChange={e => setNewImages(e.target.value)} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white" placeholder="https://url1.com, https://url2.com" />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Beds</label>
                                  <input type="number" required value={newBeds} onChange={e => setNewBeds(e.target.value)} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white" />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Baths</label>
                                  <input type="number" required value={newBaths} onChange={e => setNewBaths(e.target.value)} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white" />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Sqft</label>
                                  <input type="number" required value={newSqft} onChange={e => setNewSqft(e.target.value)} className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white" />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Type</label>
                                  <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-[#0B1F3A] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white">
                                    <option value="Villa">Villa</option>
                                    <option value="Penthouse">Penthouse</option>
                                    <option value="Apartment">Apartment</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Status</label>
                                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full bg-[#0B1F3A] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white">
                                    <option value="Buy">For Sale</option>
                                    <option value="Rent">For Rent</option>
                                    <option value="Sold">Sold</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1">Assigned Agent</label>
                                  <select value={newAgentId} onChange={e => setNewAgentId(e.target.value)} className="w-full bg-[#0B1F3A] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#C9A27E] text-white">
                                    {agents.map(a => (
                                      <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="md:col-span-2 pt-2">
                                  <button type="submit" className="w-full bg-[#8B5E3C] hover:bg-[#C9A27E] text-white hover:text-[#0B1F3A] py-3 transition-colors font-poppins font-bold uppercase tracking-wider text-xs">
                                    Publish Listing
                                  </button>
                                </div>
                              </form>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Listings Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-white/10 text-left text-sm">
                            <thead>
                              <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-[#C9A27E]">
                                <th className="p-4">Listing</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Details</th>
                                <th className="p-4 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {properties.map(p => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                  <td className="p-4 font-poppins font-bold">{p.title}</td>
                                  <td className="p-4 text-white/80">{p.location}</td>
                                  <td className="p-4 font-mono text-[#C9A27E]">${p.price.toLocaleString()}</td>
                                  <td className="p-4 text-xs text-white/60 uppercase">
                                    {p.beds} Beds | {p.baths} Baths | {p.type}
                                  </td>
                                  <td className="p-4 text-center">
                                    <div className="flex justify-center gap-3">
                                      <a
                                        href={`/realestate/properties/${p.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/60 hover:text-white p-1"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </a>
                                      <button
                                        onClick={() => handleDeleteProperty(p.id)}
                                        className="text-red-400/60 hover:text-red-400 p-1"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
}
