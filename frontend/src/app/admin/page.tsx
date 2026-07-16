'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Calendar, LogOut, Shield, MessageSquare, Home, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/utils/api';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('inquiries');

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
      const data = await api.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
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
                <p className="text-white/60 text-sm mt-2 tracking-wide uppercase text-center">
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
                  <p className="text-white/60 uppercase tracking-widest text-xs mt-2">
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
                    onClick={() => alert('Properties CRUD can be done directly in phpMyAdmin!')}
                    className="w-full flex items-center gap-3 px-5 py-4 uppercase font-poppins font-bold tracking-wider text-xs bg-white/5 hover:bg-white/10 transition-colors rounded-none text-white/50"
                  >
                    <Home className="w-4 h-4" />
                    Properties (Edit via hPanel)
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                  <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-none">
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
