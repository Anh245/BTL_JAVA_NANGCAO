import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ZONES = [
  {
    id: 'window',
    label: 'Window Table',
    desc: 'Floor-to-ceiling city views, intimate candlelight',
    capacity: '2–4 guests',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    x: 10, y: 12, w: 30, h: 35,
    tables: [
      { x: 15, y: 18, w: 8, h: 8 },
      { x: 28, y: 18, w: 8, h: 8 },
      { x: 15, y: 33, w: 8, h: 8 },
    ]
  },
  {
    id: 'vip_room',
    label: 'VIP Room',
    desc: 'Secluded alcove, bespoke service, private entrance',
    capacity: '4–8 guests',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80',
    x: 60, y: 10, w: 35, h: 40,
    tables: [
      { x: 65, y: 18, w: 10, h: 10 },
      { x: 80, y: 18, w: 10, h: 10 },
      { x: 72, y: 35, w: 12, h: 10 },
    ]
  },
  {
    id: 'terrace',
    label: 'Terrace',
    desc: 'Open-air dining under the stars',
    capacity: '2–6 guests',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&q=80',
    x: 10, y: 60, w: 35, h: 30,
    tables: [
      { x: 15, y: 65, w: 8, h: 8 },
      { x: 28, y: 65, w: 8, h: 8 },
      { x: 15, y: 78, w: 8, h: 8 },
      { x: 28, y: 78, w: 8, h: 8 },
    ]
  },
  {
    id: 'main_hall',
    label: 'Main Hall',
    desc: 'The heart of the house, ambient orchestra',
    capacity: '2–6 guests',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&q=80',
    x: 48, y: 55, w: 45, h: 35,
    tables: [
      { x: 52, y: 60, w: 8, h: 8 },
      { x: 65, y: 60, w: 8, h: 8 },
      { x: 78, y: 60, w: 8, h: 8 },
      { x: 52, y: 74, w: 8, h: 8 },
      { x: 65, y: 74, w: 8, h: 8 },
    ]
  },
  {
    id: 'private_dining',
    label: 'Private Dining',
    desc: 'Exclusive room for celebrations & proposals',
    capacity: '6–12 guests',
    image: 'https://images.unsplash.com/photo-1515669097368-22e68427d265?w=600&q=80',
    x: 35, y: 35, w: 22, h: 18,
    tables: [
      { x: 40, y: 39, w: 12, h: 10 },
    ]
  },
];

export default function TableMapSection({ onZoneSelect, selectedZone }) {
  const [hoveredZone, setHoveredZone] = useState(null);
  const activeZone = ZONES.find(z => z.id === (hoveredZone || selectedZone));

  return (
    <section className="py-32 px-6 bg-obsidian">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-4">Select Your Space</p>
          <div className="hairline-gold w-20 mx-auto mb-6" />
          <h2 className="font-playfair text-4xl md:text-5xl text-bone">The Cartography of Taste</h2>
          <p className="font-playfair italic text-champagne mt-4 text-lg max-w-xl mx-auto">
            Choose the setting that speaks to your occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* SVG Floor Plan */}
          <div className="relative">
            <div className="border border-gold/20 p-2 bg-obsidian">
              <div className="relative">
                <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-champagne/50 text-center mb-3">— Floor Plan · Level 1 —</p>
                <svg
                  viewBox="0 0 100 100"
                  className="w-full"
                  style={{ aspectRatio: '1' }}
                >
                  {/* Background */}
                  <rect x="0" y="0" width="100" height="100" fill="#0D0D0D" />

                  {/* Outer walls */}
                  <rect x="5" y="5" width="90" height="90" fill="none" stroke="#D4AF37" strokeWidth="0.3" strokeDasharray="2,1" />

                  {/* Entrance */}
                  <line x1="45" y1="94" x2="55" y2="94" stroke="#D4AF37" strokeWidth="0.8" />
                  <text x="50" y="98" fill="#A39072" fontSize="2.5" textAnchor="middle" fontFamily="Inter">ENTRANCE</text>

                  {/* Zone Regions */}
                  {ZONES.map(zone => {
                    const isHovered = hoveredZone === zone.id;
                    const isSelected = selectedZone === zone.id;
                    return (
                      <g key={zone.id} onClick={() => onZoneSelect(zone.id)} style={{ cursor: 'pointer' }}>
                        {/* Zone area */}
                        <rect
                          x={zone.x} y={zone.y} width={zone.w} height={zone.h}
                          fill={isSelected ? 'rgba(212,175,55,0.12)' : isHovered ? 'rgba(212,175,55,0.07)' : 'rgba(212,175,55,0.02)'}
                          stroke={isSelected || isHovered ? '#D4AF37' : '#D4AF3730'}
                          strokeWidth={isSelected ? 0.6 : 0.3}
                          onMouseEnter={() => setHoveredZone(zone.id)}
                          onMouseLeave={() => setHoveredZone(null)}
                          className="transition-all duration-300"
                        />

                        {/* Tables */}
                        {zone.tables.map((table, i) => (
                          <rect
                            key={i}
                            x={table.x} y={table.y} width={table.w} height={table.h}
                            rx="0.5"
                            fill={isSelected ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.1)'}
                            stroke={isSelected || isHovered ? '#D4AF37' : '#D4AF3750'}
                            strokeWidth="0.3"
                            className="transition-all duration-300"
                          />
                        ))}

                        {/* Label */}
                        <text
                          x={zone.x + zone.w / 2}
                          y={zone.y + zone.h / 2 + 1.5}
                          fill={isSelected || isHovered ? '#D4AF37' : '#A39072'}
                          fontSize="3"
                          textAnchor="middle"
                          fontFamily="Inter"
                          fontWeight={isSelected ? "600" : "400"}
                          className="transition-all duration-300 pointer-events-none"
                        >
                          {zone.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <p className="font-inter text-[10px] text-champagne/40 tracking-widest text-center mt-3">
              Hover to preview · Click to select
            </p>
          </div>

          {/* Zone Info Panel */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {activeZone ? (
                <motion.div
                  key={activeZone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gold/30 overflow-hidden"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={activeZone.image}
                      alt={activeZone.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="font-playfair text-2xl text-bone">{activeZone.label}</h3>
                      <p className="font-inter text-xs text-gold tracking-wider mt-1">{activeZone.capacity}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-[#0d0d0d]">
                    <p className="font-playfair italic text-champagne text-lg leading-relaxed">{activeZone.desc}</p>
                    {selectedZone === activeZone.id ? (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gold pulse-gold" />
                        <span className="font-inter text-xs tracking-[0.2em] uppercase text-gold">Selected</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onZoneSelect(activeZone.id)}
                        className="mt-4 font-inter text-xs tracking-[0.2em] uppercase text-gold border border-gold/50 px-6 py-2 hover:bg-gold/10 transition-all duration-300"
                      >
                        Select This Zone
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-gold/10 p-10 text-center"
                >
                  <div className="hairline-gold w-12 mx-auto mb-6" />
                  <p className="font-playfair italic text-champagne text-lg">Hover over a zone to preview its atmosphere.</p>
                  <div className="hairline-gold w-12 mx-auto mt-6" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zone List */}
            <div className="space-y-0 border border-gold/10 divide-y divide-gold/10">
              {ZONES.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => onZoneSelect(zone.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-200 ${
                    selectedZone === zone.id ? 'bg-gold/10' : 'hover:bg-gold/5'
                  }`}
                >
                  <div>
                    <span className={`font-inter text-sm ${selectedZone === zone.id ? 'text-gold' : 'text-bone'}`}>{zone.label}</span>
                    <span className="font-inter text-xs text-champagne ml-3">{zone.capacity}</span>
                  </div>
                  {selectedZone === zone.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}