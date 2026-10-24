import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, SlidersHorizontal, Eye, Flame } from 'lucide-react';

interface MenuSectionProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  onSelectItem,
  onQuickAdd
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Complete Atelier' },
    { id: 'smash', label: 'Smash Burgers' },
    { id: 'wagyu', label: 'Wagyu Reserve' },
    { id: 'specialty', label: 'Specialty Chicken' },
    { id: 'sides', label: 'Hand-Cut Sides' },
    { id: 'beverages', label: 'Artisan Shakes' }
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 px-6 bg-[#0c0d10] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-amber-400 font-mono-num mb-2">
              <span>Curated Selection</span>
              <span aria-hidden="true">·</span>
              <span>Freshly Ground Daily</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black font-display text-white uppercase tracking-tight">
              THE BURGER VAULT
            </h2>
          </div>

          {/* Interactive Category Segmented Controls (functional buttons with click handlers) */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900/80 rounded-xl border border-white/[0.08] overflow-x-auto max-w-full">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Product Grid adhering strictly to retail guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <article
              key={item.id}
              className="group flex flex-col bg-[#121318] rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-black/60"
            >
              {/* Product Image taking 65%-70% visual focus */}
              <div 
                className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 cursor-pointer"
                onClick={() => onSelectItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Fallback gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Subtle single text kicker badge (No badge sandwich) */}
                {item.badge && (
                  <span className="absolute top-4 left-4 text-[11px] font-mono-num font-medium tracking-wide uppercase px-2.5 py-1 rounded bg-black/60 text-amber-400 backdrop-blur-md border border-white/10">
                    {item.badge}
                  </span>
                )}

                {/* Hover Quick View Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="absolute bottom-4 right-4 p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-xl text-zinc-300 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  title="View recipe details & customize"
                  aria-label={`View details for ${item.name}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Card Details Body */}
              <div className="p-6 flex flex-col flex-grow justify-between text-left">
                <div>
                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono-num mb-2">
                    <span className="uppercase tracking-wider">{item.category}</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>{item.calories}</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>{item.prepTime}</span>
                  </div>

                  {/* Product Title */}
                  <h3 
                    onClick={() => onSelectItem(item)}
                    className="text-xl font-bold font-display text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  {/* Subtitle / Meat Specification */}
                  <p className="text-xs text-amber-400/80 font-mono-num mb-2">
                    {item.subname}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Footer Strip: Price in tabular numbers & Primary Action */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-mono-num">
                      Price
                    </span>
                    <span className="text-lg font-bold text-white font-mono-num">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.customizable && (
                      <button
                        onClick={() => onSelectItem(item)}
                        className="px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg transition-colors cursor-pointer border border-white/5 flex items-center gap-1.5"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Customize</span>
                      </button>
                    )}

                    <button
                      onClick={() => onQuickAdd(item)}
                      className="px-3.5 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                    >
                      <Plus className="w-4 h-4 text-zinc-950" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
