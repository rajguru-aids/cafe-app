'use client';

import React, { useState } from 'react';
import { MENU_ITEMS } from '@/lib/cafeData';
import { MenuItem, DrinkType } from '@/lib/types';
import { Plus, Eye, Check } from 'lucide-react';
import { cafeAudio } from '@/lib/audio';

interface CafeMenuProps {
  onSelectDrinkFor3D: (drink: DrinkType) => void;
  onAddToCart: (item: MenuItem) => void;
}

export default function CafeMenu({ onSelectDrinkFor3D, onAddToCart }: CafeMenuProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'espresso' | 'filter' | 'cold' | 'pastry' | 'beans'>('all');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Curations' },
    { id: 'espresso', label: 'Espresso & Slow Bar' },
    { id: 'filter', label: 'Filter Single-Origins' },
    { id: 'cold', label: 'Cold & Cascara' },
    { id: 'pastry', label: 'Artisanal Bakes' },
    { id: 'beans', label: 'Whole Bean Bags' }
  ] as const;

  const filteredItems = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const handleQuickAdd = (item: MenuItem) => {
    cafeAudio.playCeramicClink();
    onAddToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1200);
  };

  const handleViewIn3D = (drinkPreset?: DrinkType) => {
    if (drinkPreset) {
      onSelectDrinkFor3D(drinkPreset);
      const element = document.getElementById('craft-bar');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="menu" className="py-20 border-t border-[#26201B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#28221D] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C68A4C] font-mono mb-2">
              <span>Seasonal Bar & Roastery</span>
              <span aria-hidden="true">·</span>
              <span>Tokyo & Kyoto Roasts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-[#EDE8E1] tracking-tight">
              Artisanal Menu & Offerings
            </h2>
            <p className="text-sm text-[#9E9388] mt-2 max-w-xl leading-relaxed">
              Every extraction is calibrated daily for refractometer TDS yield and temperature accuracy using 90 PPM magnesium-conditioned soft water.
            </p>
          </div>

          {/* Interactive Filter Control Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#1C1917] border border-[#2E2822] rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#C68A4C] text-[#121110] font-semibold shadow-xs'
                    : 'text-[#9E9388] hover:text-[#EDE8E1] hover:bg-[#25201C]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#181615] border border-[#2B241F] rounded-xl p-6 flex flex-col justify-between hover:border-[#3D332B] transition-all group"
            >
              <div>
                {/* Clean Unboxed Metadata with Typographic Separators */}
                <div className="flex items-center justify-between text-xs text-[#7A7065] mb-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.japaneseName}</span>
                  </div>
                  {item.isPopular && (
                    <span className="text-[#C68A4C]">Barista Pick</span>
                  )}
                </div>

                {/* Primary Title & Price */}
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="text-lg font-serif-luxury font-semibold text-[#EDE8E1] group-hover:text-[#C68A4C] transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-base font-mono font-medium text-[#EDE8E1] tabular-nums whitespace-nowrap">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#9E9388] leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Tasting Notes (Unboxed Text with Separators) */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#C68A4C]/90 font-mono mb-4">
                  {item.notes.map((note, idx) => (
                    <React.Fragment key={idx}>
                      <span>{note}</span>
                      {idx < item.notes.length - 1 && <span aria-hidden="true" className="text-[#554A40]">/</span>}
                    </React.Fragment>
                  ))}
                </div>

                {/* Origin / Elevation Details if applicable */}
                {item.origin && (
                  <div className="text-[11px] text-[#7A7065] font-mono border-t border-[#231E19] pt-2 mb-4">
                    <div>Origin: {item.origin}</div>
                    {item.altitude && <div>Elevation: {item.altitude}</div>}
                  </div>
                )}
              </div>

              {/* Action Buttons: 3D Preview (if drink) + Add to Order */}
              <div className="flex items-center gap-2 pt-3 border-t border-[#231E19]">
                {item.drinkPreset && (
                  <button
                    type="button"
                    onClick={() => handleViewIn3D(item.drinkPreset)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-[#BBB1A5] bg-[#221D19] hover:bg-[#2C2520] hover:text-[#EDE8E1] border border-[#302720] rounded-lg transition-colors whitespace-nowrap"
                    title="View cup in 3D bar viewer above"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C68A4C]" />
                    <span>View in 3D</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleQuickAdd(item)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    item.drinkPreset ? 'flex-1' : 'w-full'
                  } ${
                    addedItemId === item.id
                      ? 'bg-emerald-800 text-white border border-emerald-600'
                      : 'bg-[#2A231D] hover:bg-[#C68A4C] text-[#EDE8E1] hover:text-[#121110] border border-[#3D332B]'
                  }`}
                >
                  {addedItemId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
