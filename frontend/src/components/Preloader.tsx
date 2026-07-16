'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has already visited in this session to prevent repetitive loading screens
    const hasVisited = sessionStorage.getItem('visited');
    if (hasVisited) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('visited', 'true');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 bg-primary z-[99999] flex flex-col justify-between p-8 md:p-12 select-none text-off-white font-poppins"
          exit={{ y: '-100vh', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="flex justify-between items-center text-xs tracking-[0.2em] font-medium text-accent-light uppercase">
            <span>Fine Architecture</span>
            <span>Est. 2026</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.h1
                className="text-6xl md:text-[10rem] font-extrabold tracking-tight uppercase leading-none"
                initial={{ y: 250 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
              >
                GRAVITY
              </motion.h1>
            </div>
            <div className="overflow-hidden h-6 mt-3">
              <motion.p
                className="text-xs md:text-sm tracking-[0.4em] font-medium text-accent-light uppercase"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0, delay: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
              >
                ESTATES
              </motion.p>
            </div>
          </div>

          <div className="flex justify-between items-end text-xs tracking-widest text-accent-light uppercase">
            <span>Premium Curation</span>
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-[1px] bg-accent-light origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.3, ease: 'easeInOut' }}
              />
              <span>Loading</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
