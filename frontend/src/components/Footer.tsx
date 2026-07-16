'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-off-white pt-20 pb-10 px-6 md:px-12 select-none border-t border-accent-dark/20 font-poppins">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Editorial Brand Section */}
        <div className="md:col-span-2">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            GRAVITY
            <span className="text-accent-light block font-light text-2xl tracking-widest mt-1">ESTATES</span>
          </h2>
          <p className="text-accent-light/75 text-sm max-w-sm font-sans leading-relaxed mb-6">
            Curating and selling the world&apos;s most exceptional architectural achievements. From coastal minimalist pavilions to mountain estates, we bridge visionary design and high-end living.
          </p>
          <div className="flex gap-6">
            {['Instagram', 'LinkedIn', 'Pinterest', 'Vimeo'].map((platform) => (
              <a
                key={platform}
                href="#"
                className="text-xs uppercase tracking-widest hover:text-accent-light transition-colors text-off-white/80"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>

        {/* Sitemap Section */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-light mb-6">Sitemap</h4>
          <ul className="flex flex-col gap-3 font-sans text-sm">
            <li>
              <Link href="/" className="hover:text-accent-light transition-colors text-off-white/80">Home</Link>
            </li>
            <li>
              <Link href="/properties" className="hover:text-accent-light transition-colors text-off-white/80">Properties</Link>
            </li>
            <li>
              <Link href="/agents" className="hover:text-accent-light transition-colors text-off-white/80">Agents</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent-light transition-colors text-off-white/80">About Our Story</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent-light transition-colors text-off-white/80">Contact & Viewing</Link>
            </li>
          </ul>
        </div>

        {/* Contact/HQ details */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-light mb-6">Offices</h4>
          <address className="not-italic flex flex-col gap-4 font-sans text-sm text-off-white/80">
            <div>
              <strong className="block text-xs uppercase tracking-widest text-accent-light/50 mb-1 font-poppins">Malibu Head Office</strong>
              23450 Pacific Coast Highway<br />Malibu, CA 90265
            </div>
            <div>
              <strong className="block text-xs uppercase tracking-widest text-accent-light/50 mb-1 font-poppins">New York Studio</strong>
              100 Franklin Street<br />New York, NY 10013
            </div>
            <div className="mt-2 font-poppins text-xs tracking-wider uppercase">
              <a href="mailto:curator@gravityestates.com" className="block hover:text-accent-light transition-colors">curator@gravityestates.com</a>
              <a href="tel:+15553028800" className="block hover:text-accent-light transition-colors mt-1">+1 (555) 302-8800</a>
            </div>
          </address>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-accent-light/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-accent-light/50 font-sans">
        <div>
          &copy; {currentYear} Gravity Estates. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-accent-light transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-accent-light transition-colors">Terms of Service</a>
          <button onClick={handleScrollToTop} className="hover:text-accent-light transition-colors uppercase tracking-widest font-poppins font-semibold">
            Back to Top &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
