'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ThreeCoffeeViewer from '@/components/ThreeCoffeeViewer';
import DrinkCustomizer from '@/components/DrinkCustomizer';
import CafeMenu from '@/components/CafeMenu';
import SlowBarReservation from '@/components/SlowBarReservation';
import OriginStory from '@/components/OriginStory';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import Footer from '@/components/Footer';
import {
  DrinkType,
  VesselFinish,
  CustomizationState,
  CartItem,
  MenuItem
} from '@/lib/types';
import { DRINK_CONFIGS, MENU_ITEMS } from '@/lib/cafeData';
import { Sparkles, ArrowRight, Compass, Shield, Award, Droplet } from 'lucide-react';
import { cafeAudio } from '@/lib/audio';

export default function HomePage() {
  // 3D Customization State
  const [customization, setCustomization] = useState<CustomizationState>({
    drink: 'flat_white',
    vessel: 'obsidian',
    roast: 'medium',
    milk: 'oat',
    size: '12oz',
    temperature: 'hot',
    sweetness: 'Unsweetened'
  });

  // Cart & UI Modal States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState<{
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    total: number;
    orderType: 'dine_in' | 'takeaway' | 'delivery';
    appliedPromo: string | null;
  } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Dynamic price computation for customized drink
  const computePrice = (c: CustomizationState) => {
    let p = DRINK_CONFIGS[c.drink].basePrice;
    if (c.size === '12oz') p += 0.65;
    if (c.size === '16oz') p += 1.25;
    if (c.milk === 'oat' || c.milk === 'almond') p += 0.60;
    if (c.sweetness === 'Madagascar Vanilla' || c.sweetness === 'Cardamom Pod') p += 0.50;
    return p;
  };

  const currentPrice = computePrice(customization);

  // Handle Add 3D customized drink to cart
  const handleAddCustomizedToCart = () => {
    const config = DRINK_CONFIGS[customization.drink];
    const newCartItem: CartItem = {
      cartId: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      itemId: `cup-${customization.drink}`,
      name: `${config.name} (Bespoke 3D)`,
      category: 'espresso',
      price: currentPrice,
      quantity: 1,
      customization: { ...customization }
    };
    setCartItems(prev => [...prev, newCartItem]);
    setIsCartOpen(true);
  };

  // Handle Add standard menu item to cart
  const handleAddMenuItemToCart = (item: MenuItem) => {
    const newCartItem: CartItem = {
      cartId: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      itemId: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: 1
    };
    setCartItems(prev => [...prev, newCartItem]);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleProceedToCheckout = (details: typeof checkoutDetails) => {
    setCheckoutDetails(details);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
  };

  // Sync menu "View in 3D" with 3D viewer
  const handleSelectDrinkFor3D = (drink: DrinkType) => {
    setCustomization(prev => ({
      ...prev,
      drink,
      milk: drink === 'pourover' || drink === 'cold_brew' ? 'none' : 'oat'
    }));
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#EDE8E1] font-sans">
      {/* Top Bar Contract Navigation */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Subtle Warm Amber Gradient Backdrops */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(198, 138, 76, 0.3) 0%, rgba(18, 17, 16, 0) 70%)'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Natural Human Editorial Kicker */}
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#C68A4C] font-mono mb-4">
            <span>Specialty Micro-Roastery</span>
            <span aria-hidden="true">·</span>
            <span>Slow Bar Experience</span>
            <span aria-hidden="true">·</span>
            <span>Omotesando Sanctuary</span>
          </div>

          {/* Balanced Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-semibold tracking-tight text-[#EDE8E1] max-w-4xl mx-auto leading-[1.1] text-balance">
            Where Kissaten Serenity Meets Third-Wave Extraction
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#BBB1A5] max-w-2xl mx-auto mt-6 leading-relaxed">
            Every pour is calibrated to refractometer TDS precision. Inspect and customize your cup in real-time 3D, savor single-origin micro-lots, or reserve our intimate slow bar omakase.
          </p>

          {/* Working Primary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href="#craft-bar"
              className="py-3.5 px-6 bg-[#C68A4C] hover:bg-[#D69A5C] text-[#121110] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all active:scale-98"
            >
              Craft Your Cup in 3D
            </a>
            <a
              href="#menu"
              className="py-3.5 px-6 bg-[#1F1B18] hover:bg-[#2A2420] text-[#EDE8E1] border border-[#382F27] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all"
            >
              Explore Seasonal Menu
            </a>
            <button
              onClick={() => setIsReservationOpen(true)}
              className="py-3.5 px-6 bg-[#251E19] hover:bg-[#322822] text-[#C68A4C] border border-[#C68A4C]/40 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all"
            >
              Book Slow Bar Tasting
            </button>
          </div>

          {/* Four Core Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-[#231E19] text-left max-w-5xl mx-auto">
            <div className="p-3">
              <div className="text-xs font-mono text-[#C68A4C]">90 PPM WATER</div>
              <div className="text-sm font-semibold text-[#EDE8E1] mt-0.5">Magnesium-Conditioned</div>
              <div className="text-xs text-[#7A7065] mt-1">Optimal mineral extraction ratio</div>
            </div>
            <div className="p-3">
              <div className="text-xs font-mono text-[#C68A4C]">1968 PROBAT UG15</div>
              <div className="text-sm font-semibold text-[#EDE8E1] mt-0.5">Cast-Iron Drum</div>
              <div className="text-xs text-[#7A7065] mt-1">Conducted heat development</div>
            </div>
            <div className="p-3">
              <div className="text-xs font-mono text-[#C68A4C]">DIRECT TRADE</div>
              <div className="text-sm font-semibold text-[#EDE8E1] mt-0.5">3× Fair Minimums</div>
              <div className="text-xs text-[#7A7065] mt-1">Sourced from grower partners</div>
            </div>
            <div className="p-3">
              <div className="text-xs font-mono text-[#C68A4C]">HAND-THROWN</div>
              <div className="text-sm font-semibold text-[#EDE8E1] mt-0.5">Stoneware Ceramics</div>
              <div className="text-xs text-[#7A7065] mt-1">Kiln-fired tactile vessels</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Craft Bar Section */}
      <section id="craft-bar" className="py-16 md:py-24 border-t border-[#26201B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-wider text-[#C68A4C] font-mono mb-2">
              <span>Real-Time WebGL Engine</span>
              <span aria-hidden="true">·</span>
              <span>Spatial Drink Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-[#EDE8E1]">
              Interactive 3D Coffee Bar
            </h2>
            <p className="text-sm text-[#9E9388] mt-2 max-w-2xl leading-relaxed">
              Drag to orbit 360°, inspect microfoam art, switch artisan glaze finishes, and observe tactile liquid physics. Every parameter updates in real time.
            </p>
          </div>

          {/* 3D Studio Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 3D WebGL Canvas Viewport (7 Cols) */}
            <div className="lg:col-span-7 w-full">
              <ThreeCoffeeViewer
                currentDrink={customization.drink}
                currentVessel={customization.vessel}
                onDrinkChange={(drink) => handleSelectDrinkFor3D(drink)}
                onVesselChange={(vessel) => setCustomization(prev => ({ ...prev, vessel }))}
                onOrderClick={handleAddCustomizedToCart}
                price={currentPrice}
              />
            </div>

            {/* Drink Customization & Order Spec Module (5 Cols) */}
            <div className="lg:col-span-5 w-full">
              <DrinkCustomizer
                customization={customization}
                onChange={setCustomization}
                onAddToCart={handleAddCustomizedToCart}
                price={currentPrice}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Artisanal Curated Menu */}
      <CafeMenu
        onSelectDrinkFor3D={handleSelectDrinkFor3D}
        onAddToCart={handleAddMenuItemToCart}
      />

      {/* Slow Bar Omakase Table Reservation */}
      <SlowBarReservation />

      {/* Origin Stories & Terroir Science */}
      <OriginStory />

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartDetails={checkoutDetails}
        onOrderComplete={handleOrderCompleted}
      />

      {/* Modal Table Reservation (if triggered from navbar) */}
      {isReservationOpen && (
        <SlowBarReservation
          isOpenModal={true}
          onClose={() => setIsReservationOpen(false)}
        />
      )}
    </div>
  );
}
