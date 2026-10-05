'use client';

import React from 'react';
import { DrinkType, VesselFinish, RoastLevel, MilkOption, CupSize, Temperature, CustomizationState } from '@/lib/types';
import { DRINK_CONFIGS } from '@/lib/cafeData';
import { Flame, Droplets, Check, Plus } from 'lucide-react';
import { cafeAudio } from '@/lib/audio';

interface DrinkCustomizerProps {
  customization: CustomizationState;
  onChange: (next: CustomizationState) => void;
  onAddToCart: () => void;
  price: number;
}

export default function DrinkCustomizer({
  customization,
  onChange,
  onAddToCart,
  price
}: DrinkCustomizerProps) {
  const currentCfg = DRINK_CONFIGS[customization.drink];

  const update = (partial: Partial<CustomizationState>) => {
    onChange({ ...customization, ...partial });
  };

  const handleAdd = () => {
    cafeAudio.playCeramicClink();
    onAddToCart();
  };

  return (
    <div className="bg-[#181615] border border-[#2E2823] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header & Subtitle */}
        <div className="border-b border-[#28221D] pb-4 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#C68A4C] font-mono">
              Slow Bar Specification
            </span>
            <span className="text-lg font-mono font-medium text-[#EDE8E1] tabular-nums">
              ${price.toFixed(2)}
            </span>
          </div>
          <h3 className="text-xl font-display font-semibold text-[#EDE8E1] mt-1">
            {currentCfg.name}
          </h3>
          <p className="text-xs text-[#9E9388] mt-1 leading-relaxed">
            {currentCfg.description}
          </p>
        </div>

        {/* Option 1: Cup Size */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-[#BBB1A5]">Serving Volume</label>
            <span className="text-xs text-[#7A7065] font-mono">{customization.size}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['8oz', '12oz', '16oz'] as CupSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => update({ size })}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all text-center ${
                  customization.size === size
                    ? 'border-[#C68A4C] bg-[#27211C] text-[#EDE8E1]'
                    : 'border-[#2A2420] bg-[#1E1B18] text-[#9E9388] hover:border-[#3D342D] hover:text-[#EDE8E1]'
                }`}
              >
                <div className="font-mono text-sm">{size}</div>
                <div className="text-[10px] text-[#7A7065]">
                  {size === '8oz' ? 'Corto / Traditional' : size === '12oz' ? 'Standard Bar' : 'Grande Slow'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Option 2: Roast Profile */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-[#BBB1A5]">Single-Origin Roast Profile</label>
            <span className="text-xs text-[#7A7065] font-mono capitalize">{customization.roast} Roast</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', name: 'Light Floral', origin: 'Ethiopia Guji', notes: 'Jasmine & Peach' },
              { id: 'medium', name: 'Medium Citrus', origin: 'Colombia Huila', notes: 'Pink Bourbon Honey' },
              { id: 'dark', name: 'Dark Velvet', origin: 'Sumatra Kissaten', notes: 'Smoky Cacao' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => update({ roast: r.id as RoastLevel })}
                className={`p-2 text-left rounded-lg border transition-all ${
                  customization.roast === r.id
                    ? 'border-[#C68A4C] bg-[#27211C] text-[#EDE8E1]'
                    : 'border-[#2A2420] bg-[#1E1B18] text-[#9E9388] hover:border-[#3D342D] hover:text-[#EDE8E1]'
                }`}
              >
                <div className="text-xs font-semibold">{r.name}</div>
                <div className="text-[10px] text-[#C68A4C] font-mono mt-0.5">{r.origin}</div>
                <div className="text-[10px] text-[#7A7065] truncate">{r.notes}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Option 3: Milk Selection (if applicable) */}
        {customization.drink !== 'pourover' && customization.drink !== 'cold_brew' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[#BBB1A5]">Artisanal Milk Choice</label>
              <span className="text-xs text-[#7A7065] font-mono capitalize">{customization.milk}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'whole', name: 'Farmstead Whole', sub: 'Creamy' },
                { id: 'oat', name: 'Barista Oat', sub: 'Silky' },
                { id: 'almond', name: 'Organic Almond', sub: 'Nutty' },
                { id: 'none', name: 'Black / Pure', sub: 'Zero' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => update({ milk: m.id as MilkOption })}
                  className={`p-2 text-center rounded-lg border transition-all ${
                    customization.milk === m.id
                      ? 'border-[#C68A4C] bg-[#27211C] text-[#EDE8E1]'
                      : 'border-[#2A2420] bg-[#1E1B18] text-[#9E9388] hover:border-[#3D342D]'
                  }`}
                >
                  <div className="text-xs font-medium truncate">{m.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-[#7A7065]">{m.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Option 4: Temperature */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-[#BBB1A5]">Extraction Temperature</label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hot', label: 'Barista 65°C', desc: 'Silky Microfoam' },
              { id: 'extra_hot', label: 'Extra Warm 72°C', desc: 'Comfort Sip' },
              { id: 'iced', label: 'Clear Sphere Ice', desc: 'Japanese Ice' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => update({ temperature: t.id as Temperature })}
                className={`p-2 text-left rounded-lg border transition-all ${
                  customization.temperature === t.id
                    ? 'border-[#C68A4C] bg-[#27211C] text-[#EDE8E1]'
                    : 'border-[#2A2420] bg-[#1E1B18] text-[#9E9388] hover:border-[#3D342D]'
                }`}
              >
                <div className="text-xs font-medium">{t.label}</div>
                <div className="text-[10px] text-[#7A7065]">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Option 5: Natural Sweetener */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-[#BBB1A5]">Natural Infusion & Sweetener</label>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {['Unsweetened', 'Raw Demerara', 'Madagascar Vanilla', 'Cardamom Pod'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update({ sweetness: s })}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all truncate ${
                  customization.sweetness === s
                    ? 'border-[#C68A4C] bg-[#27211C] text-[#EDE8E1]'
                    : 'border-[#2A2420] bg-[#1E1B18] text-[#9E9388] hover:border-[#3D342D]'
                }`}
              >
                <span className="text-[11px]">{s.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Add to Order CTA */}
      <div className="pt-2 border-t border-[#28221D]">
        <button
          onClick={handleAdd}
          className="w-full py-3.5 px-4 bg-[#C68A4C] hover:bg-[#D69A5C] active:scale-[0.99] text-[#121110] font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Customized Cup to Order</span>
          </span>
          <span className="font-mono text-base font-bold tabular-nums">
            ${price.toFixed(2)}
          </span>
        </button>
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A7065] mt-2.5">
          <span>Freshly hand-pulled</span>
          <span aria-hidden="true">·</span>
          <span>Single-origin verified</span>
          <span aria-hidden="true">·</span>
          <span>Zero artificial syrups</span>
        </div>
      </div>
    </div>
  );
}
