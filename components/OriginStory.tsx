'use client';

import React, { useState } from 'react';
import { ORIGIN_STORIES } from '@/lib/cafeData';
import { Compass, Mountain, Flame, Droplet, ArrowRight } from 'lucide-react';

export default function OriginStory() {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const activeStory = ORIGIN_STORIES[activeStoryIdx];

  return (
    <section id="origins" className="py-20 border-t border-[#26201B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C68A4C] font-mono mb-2">
            <span>Direct Trade & Terroir</span>
            <span aria-hidden="true">·</span>
            <span>Cast Iron Drum Roasting</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-[#EDE8E1] tracking-tight">
            The Philosophy of Single-Origin
          </h2>
          <p className="text-sm text-[#9E9388] mt-2 max-w-2xl leading-relaxed">
            We purchase directly from grower families at 3x Fair Trade minimums. Every roast profile is engineered to honor the native soil, altitude, and climate of the cherry.
          </p>
        </div>

        {/* 3 Origin Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {ORIGIN_STORIES.map((story, idx) => (
            <button
              key={story.country}
              type="button"
              onClick={() => setActiveStoryIdx(idx)}
              className={`p-5 text-left rounded-xl border transition-all ${
                activeStoryIdx === idx
                  ? 'border-[#C68A4C] bg-[#1F1B18] shadow-lg'
                  : 'border-[#26201B] bg-[#161412] hover:border-[#382F27]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#7A7065] font-mono mb-2">
                <span>{story.country}</span>
                <span>{story.elevation}</span>
              </div>
              <h3 className="text-lg font-serif-luxury font-semibold text-[#EDE8E1] mb-1">
                {story.title}
              </h3>
              <p className="text-xs text-[#C68A4C] font-mono line-clamp-1">
                {story.flavorNotes}
              </p>
            </button>
          ))}
        </div>

        {/* Featured Origin Spotlight Card */}
        <div className="bg-[#181615] border border-[#2B241F] rounded-2xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 text-xs text-[#7A7065] font-mono mb-3">
                <span className="text-[#C68A4C]">{activeStory.country} Highlands</span>
                <span aria-hidden="true">·</span>
                <span>Elevation: {activeStory.elevation}</span>
                <span aria-hidden="true">·</span>
                <span>Harvest 2026</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-semibold text-[#EDE8E1] mb-4">
                {activeStory.title}
              </h3>

              <p className="text-sm text-[#BBB1A5] leading-relaxed mb-6">
                {activeStory.story}
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-[#26201B] pt-4 font-mono text-xs">
                <div>
                  <div className="text-[#7A7065] uppercase">Producer</div>
                  <div className="text-[#EDE8E1] font-medium mt-0.5">{activeStory.producer}</div>
                </div>
                <div>
                  <div className="text-[#7A7065] uppercase">Roast Calibration</div>
                  <div className="text-[#C68A4C] font-medium mt-0.5">{activeStory.roastStyle}</div>
                </div>
              </div>
            </div>

            {/* Brewing Metrics / Scientific Precision Card */}
            <div className="lg:col-span-5 bg-[#1C1917] border border-[#2E2823] rounded-xl p-6">
              <div className="text-xs uppercase font-mono text-[#C68A4C] tracking-wider mb-4">
                Atelier Extraction Standard
              </div>

              <div className="space-y-3.5 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#26201B]">
                  <span className="text-[#9E9388]">Water Chemistry:</span>
                  <span className="text-[#EDE8E1] font-semibold">90 PPM (Mg / Ca 3:1)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#26201B]">
                  <span className="text-[#9E9388]">Kettle Temperature:</span>
                  <span className="text-[#EDE8E1] font-semibold">92.5°C Precision</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#26201B]">
                  <span className="text-[#9E9388]">Brew Ratio:</span>
                  <span className="text-[#EDE8E1] font-semibold">1:16.2 Golden Formula</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#26201B]">
                  <span className="text-[#9E9388]">Target Extraction Yield:</span>
                  <span className="text-[#EDE8E1] font-semibold">20.8% Refractometer TDS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9E9388]">Roaster Drum:</span>
                  <span className="text-[#C68A4C] font-semibold">1968 Cast-Iron Probat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
