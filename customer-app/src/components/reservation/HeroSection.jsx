import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Background Image with Ken Burns */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=90"
          alt="Fine dining ambiance"
          className="w-full h-full object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/50 to-obsidian/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/40 via-transparent to-obsidian/40" />
      </div>

      {/* Spotlight following cursor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 400px at ${mousePos.x}% ${mousePos.y}%, rgba(212,175,55,0.06) 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-8"
        >
          Fine Dining · Est. 2018
        </motion.p>

        {/* Hairline */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '80px', opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mx-auto mb-8 h-px bg-gold"
        />

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-playfair text-5xl md:text-7xl lg:text-8xl text-bone leading-tight mb-6"
        >
          Where Every Meal
          <br />
          <em className="text-gold">Becomes Memory</em>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="font-playfair italic text-champagne text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed"
        >
          An intimate evening awaits — curated with precision, served with grace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#reservation"
            className="shimmer-btn font-inter text-sm tracking-[0.2em] uppercase px-10 py-4 bg-gold text-obsidian font-semibold transition-all duration-300 hover:bg-brass hover:gold-glow inline-block"
          >
            Reserve Your Table
          </a>
          <a
            href="#menu"
            className="font-inter text-sm tracking-[0.2em] uppercase px-10 py-4 border border-gold/50 text-bone hover:border-gold hover:text-gold transition-all duration-300 inline-block"
          >
            View Menu
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-inter text-xs tracking-[0.3em] uppercase text-champagne">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}