'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'Agents', href: '/agents' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center transition-colors duration-300 mix-blend-difference select-none">
        <Link href="/" className="font-poppins font-extrabold text-2xl tracking-tighter text-off-white hover:opacity-85 transition-opacity">
          GRAVITY<span className="text-accent-light font-light ml-1">ESTATES</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm uppercase tracking-widest font-poppins font-medium text-off-white hover:text-accent-light transition-colors py-1 group"
              >
                {link.name}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-light origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-300"
                  initial={false}
                  animate={isActive ? { scaleX: 1 } : {}}
                />
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:block">
          <Link href="/contact" className="magnetic-btn px-6 py-3 border border-off-white text-off-white text-xs uppercase tracking-widest font-poppins font-semibold hover:bg-off-white hover:text-primary transition-all duration-300">
            Schedule Viewing
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-off-white hover:text-accent-light transition-colors p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-primary z-[45] flex flex-col justify-center items-center md:hidden"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-poppins font-bold uppercase tracking-widest text-off-white hover:text-accent-light transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1, duration: 0.5 }}
                className="mt-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-4 border border-off-white text-off-white uppercase tracking-widest font-poppins text-sm hover:bg-off-white hover:text-primary transition-colors"
                >
                  Schedule Viewing
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
