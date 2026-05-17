import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Dining Rooms', href: '#tables' },
    { label: 'Reserve', href: '#reservation' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass-noir py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex flex-col items-start group">
          <span className="font-playfair text-xl text-bone tracking-wider group-hover:text-gold transition-colors duration-300">
            AURELIAN
          </span>
          <span className="font-inter text-[9px] tracking-[0.5em] uppercase text-gold">
            Fine Dining
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="font-inter text-xs tracking-[0.25em] uppercase text-champagne hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/lookup"
            className="flex items-center gap-1.5 font-inter text-[10px] tracking-[0.3em] uppercase text-champagne/50 hover:text-champagne transition-colors duration-300"
          >
            <Search className="w-3 h-3" />
            Tra Cứu
          </Link>
          <a
            href="#reservation"
            className="shimmer-btn font-inter text-xs tracking-[0.2em] uppercase px-7 py-3 bg-gold text-obsidian font-semibold hover:bg-brass transition-all duration-300"
          >
            Reserve
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-bone hover:text-gold transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-noir mt-3 mx-4 border border-gold/20 divide-y divide-gold/10"
        >
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 font-inter text-xs tracking-[0.25em] uppercase text-champagne hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/lookup"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 font-inter text-xs tracking-[0.25em] uppercase text-champagne hover:text-gold transition-colors"
          >
            🔍 Tra Cứu Đặt Bàn
          </Link>
          <a
            href="#reservation"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 font-inter text-xs tracking-[0.25em] uppercase text-gold"
          >
            Reserve a Table →
          </a>
        </motion.div>
      )}
    </header>
  );
}
