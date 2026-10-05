'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, MapPin, Clock, Mail } from 'lucide-react';
import { cafeAudio } from '@/lib/audio';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    cafeAudio.playCeramicClink();
    setIsSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#0E0D0C] border-t border-[#231E19] text-[#BBB1A5] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#231E19]">
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <span className="text-xl font-display font-bold text-[#EDE8E1] tracking-wider block mb-3">
              Atelier Kōhī
            </span>
            <p className="text-xs text-[#9E9388] leading-relaxed max-w-sm mb-4">
              Specialty micro-roastery and slow bar dedicated to single-origin precision, ceremonial tea craft, and kissaten hospitality.
            </p>
            <div className="flex items-center gap-2 text-[#7A7065] font-mono text-[11px]">
              <span>Tokyo</span>
              <span aria-hidden="true">·</span>
              <span>Kyoto</span>
              <span aria-hidden="true">·</span>
              <span>Direct Trade Roastery</span>
            </div>
          </div>

          {/* Hours & Service */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C68A4C]">
              Roastery & Slow Bar Hours
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span>Tuesday – Friday:</span>
                <span className="text-[#EDE8E1]">07:30 – 18:30</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday – Sunday:</span>
                <span className="text-[#EDE8E1]">08:00 – 19:00</span>
              </div>
              <div className="flex justify-between text-[#7A7065]">
                <span>Monday:</span>
                <span>Roasting & Sourcing Day</span>
              </div>
            </div>
            <div className="text-[11px] text-[#7A7065] pt-2">
              Slow Bar Omakase Flights: 10:00 – 16:30 Daily
            </div>
          </div>

          {/* Location & Contact */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C68A4C]">
              Slow Bar Sanctuary
            </h4>
            <div className="text-xs space-y-1 text-[#9E9388] leading-relaxed">
              <div>42 Omotesando Kōhī Lane</div>
              <div>Minato-ku, Tokyo 107-0062</div>
              <div className="pt-2 text-[#EDE8E1] font-mono">contact@atelierkohi.coffee</div>
            </div>
          </div>

          {/* Newsletter / Roaster Journal */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C68A4C]">
              Harvest Dispatch
            </h4>
            <p className="text-xs text-[#9E9388] leading-relaxed">
              Receive notifications when seasonal micro-lots arrive from Ethiopia and Colombia.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-1.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="flex-1 py-2 px-3 bg-[#181614] border border-[#2B241F] rounded-lg text-xs text-[#EDE8E1] placeholder:text-[#5E554C] focus:border-[#C68A4C] focus:outline-hidden"
              />
              <button
                type="submit"
                className="p-2 bg-[#C68A4C] hover:bg-[#D69A5C] text-[#121110] rounded-lg transition-colors flex items-center justify-center shrink-0"
                aria-label="Subscribe to harvest dispatch"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {isSubscribed && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Subscribed to harvest dispatch.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A7065] gap-3 font-mono">
          <div>
            © {new Date().getFullYear()} Atelier Kōhī. Single-origin specialty coffee roastery. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#menu" className="hover:text-[#EDE8E1] transition-colors">Menu</a>
            <span>·</span>
            <a href="#omakase" className="hover:text-[#EDE8E1] transition-colors">Slow Bar</a>
            <span>·</span>
            <a href="#origins" className="hover:text-[#EDE8E1] transition-colors">Origins</a>
            <span>·</span>
            <span className="text-[#9E9388]">Soft Water 90 PPM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
