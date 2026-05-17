import { useRef } from 'react';
import { motion } from 'framer-motion';

const MENU_ITEMS = [
  {
    name: 'Wagyu Tasting',
    category: 'Main Course',
    price: '$185',
    desc: 'A5 Japanese Wagyu, bone marrow butter, black truffle reduction',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=85',
  },
  {
    name: 'Caviar Service',
    category: 'Première',
    price: '$95',
    desc: 'Oscietra caviar, crème fraîche, blinis, chilled vodka pairing',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=85',
  },
  {
    name: 'Saffron Bisque',
    category: 'Soups',
    price: '$48',
    desc: 'Persian saffron, Brittany lobster, sourdough crisp',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=85',
  },
  {
    name: 'Citrus Soufflé',
    category: 'Dessert',
    price: '$38',
    desc: 'Yuzu curd, Earl Grey ice cream, gold leaf',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=85',
  },
  {
    name: 'Duck Confit',
    category: 'Main Course',
    price: '$78',
    desc: 'Slow-rendered duck leg, cherry jus, pomme dauphinoise',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=85',
  },
  {
    name: 'Sea Scallops',
    category: 'Seafood',
    price: '$65',
    desc: 'Hand-dived scallops, pea purée, pancetta crisps',
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=500&q=85',
  },
];

export default function MenuSection() {
  const scrollRef = useRef(null);

  return (
    <section id="menu" className="py-32 overflow-hidden bg-[#070707]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-4">Curated Selections</p>
          <div className="hairline-gold w-20 mx-auto mb-6" />
          <h2 className="font-playfair text-4xl md:text-5xl text-bone">Gallery of Flavors</h2>
          <p className="font-playfair italic text-champagne mt-4 text-lg max-w-xl mx-auto">
            Each dish is a chapter in an evening's story.
          </p>
        </div>
      </div>

      {/* Filmstrip scroll */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 pb-8 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {MENU_ITEMS.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group relative flex-shrink-0 w-72 overflow-hidden border border-gold/20 cursor-pointer"
            style={{ willChange: 'transform' }}
          >
            {/* Image */}
            <div className="relative h-80 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />

              {/* Reveal on hover */}
              <div className="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6">
                <p className="font-playfair italic text-champagne text-sm leading-relaxed">{item.desc}</p>
              </div>

              {/* Gold border expand */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/60 transition-all duration-400" />
            </div>

            {/* Info */}
            <div className="p-5 bg-[#0d0d0d]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-gold mb-1">{item.category}</p>
                  <h3 className="font-playfair text-lg text-bone">{item.name}</h3>
                </div>
                <span className="font-inter text-gold font-light text-lg">{item.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hint */}
      <div className="text-center mt-6">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-champagne/40">Scroll to explore →</p>
      </div>
    </section>
  );
}