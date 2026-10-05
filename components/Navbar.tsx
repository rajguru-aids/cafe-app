'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShoppingBag, Calendar } from 'lucide-react';
import { cafeAudio } from '@/lib/audio';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
}

export default function Navbar({ cartCount, onOpenCart, onOpenReservation }: NavbarProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAudio = () => {
    const nextState = cafeAudio.toggleAmbience((state) => {
      setIsPlayingAudio(state);
    });
    setIsPlayingAudio(nextState);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#121110]/95 backdrop-blur-md border-b border-[#28221D] shadow-xl py-3.5'
          : 'bg-gradient-to-b from-[#121110]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single Text Element Wordmark */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-display font-bold tracking-wider text-[#EDE8E1] hover:text-[#C68A4C] transition-colors"
        >
          Atelier Kōhī
        </a>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#BBB1A5]">
          <a
            href="#craft-bar"
            className="hover:text-[#EDE8E1] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
          >
            3D Bar
          </a>
          <a
            href="#menu"
            className="hover:text-[#EDE8E1] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
          >
            Artisanal Menu
          </a>
          <a
            href="#omakase"
            className="hover:text-[#EDE8E1] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
          >
            Slow Bar Omakase
          </a>
          <a
            href="#origins"
            className="hover:text-[#EDE8E1] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
          >
            Origins & Roastery
          </a>
        </nav>

        {/* Zone 3: 1-2 Primary Working Actions */}
        <div className="flex items-center gap-3">
          {/* Ambient Soundscape Toggle */}
          <button
            onClick={handleToggleAudio}
            type="button"
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
              isPlayingAudio
                ? 'bg-[#2B231D] border-[#C68A4C] text-[#C68A4C]'
                : 'bg-[#1C1917] border-[#332B25] text-[#9E9388] hover:text-[#EDE8E1]'
            }`}
            title={isPlayingAudio ? 'Mute cafe ambience' : 'Play analog vinyl & cafe room ambience'}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Ambience On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ambience</span>
              </>
            )}
          </button>

          {/* Book Tasting / Table CTA */}
          <button
            onClick={onOpenReservation}
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#EDE8E1] bg-[#221D1A] hover:bg-[#2E2722] border border-[#3A3029] rounded-lg transition-colors whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C68A4C]" />
            <span>Reserve Table</span>
          </button>

          {/* Shopping Bag Drawer Button */}
          <button
            onClick={onOpenCart}
            type="button"
            className="relative flex items-center justify-center p-2.5 bg-[#C68A4C] hover:bg-[#D69A5C] text-[#121110] rounded-lg shadow-md transition-all active:scale-95"
            aria-label="View Order Bag"
          >
            <ShoppingBag className="w-4 h-4 font-semibold" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#121110] text-[#C68A4C] border border-[#C68A4C] rounded-full text-[10px] font-mono font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
