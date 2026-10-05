'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, CheckCircle, Sparkles, ChevronRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cafeAudio } from '@/lib/audio';

interface SlowBarReservationProps {
  isOpenModal?: boolean;
  onClose?: () => void;
}

export default function SlowBarReservation({ isOpenModal = false, onClose }: SlowBarReservationProps) {
  const [experience, setExperience] = useState<'flight' | 'pairing' | 'table'>('flight');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('11:30 AM');
  const [partySize, setPartySize] = useState(2);
  const [zone, setZone] = useState<'counter' | 'garden' | 'mezzanine'>('counter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<{
    code: string;
    experienceTitle: string;
  } | null>(null);

  const timeSlots = ['09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    cafeAudio.playCeramicClink();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    const expTitle =
      experience === 'flight'
        ? 'Pour-Over Tasting Flight (3 Rare Origins)'
        : experience === 'pairing'
        ? 'Omotesando Espresso & Pastry Pairing'
        : 'Slow Bar Counter Seating';

    const bookingCode = `KOHI-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedBooking({
      code: bookingCode,
      experienceTitle: expTitle
    });
  };

  const content = (
    <div className="bg-[#181615] border border-[#2B241F] rounded-2xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto">
      {/* Title & Header */}
      <div className="border-b border-[#28221D] pb-5 mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C68A4C] font-mono mb-1.5">
            <span>Slow Bar Omakase</span>
            <span aria-hidden="true">·</span>
            <span>Intimate Seating</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#EDE8E1]">
            Table & Tasting Flight Reservation
          </h2>
          <p className="text-xs sm:text-sm text-[#9E9388] mt-1.5 leading-relaxed">
            Reserve dedicated counter seats with our head roaster. Explore terroir flights and seasonal micro-lots brewed to order.
          </p>
        </div>
        {isOpenModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-[#9E9388] hover:text-[#EDE8E1] hover:bg-[#25201C] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {confirmedBooking ? (
        /* Confirmed Voucher Screen */
        <div className="bg-[#1F1B18] border border-[#3E342B] rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="text-xs font-mono text-[#C68A4C] uppercase tracking-wider">
            Reservation Confirmed
          </div>
          <h3 className="text-xl font-display font-semibold text-[#EDE8E1] mt-1">
            {confirmedBooking.experienceTitle}
          </h3>
          <div className="my-4 py-3 px-4 bg-[#141210] border border-[#2B241F] rounded-lg max-w-sm mx-auto font-mono text-xs text-[#BBB1A5] space-y-1">
            <div className="flex justify-between">
              <span>Booking Code:</span>
              <span className="text-[#C68A4C] font-bold">{confirmedBooking.code}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span>{date} · {timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span>{partySize} Guests ({zone} Zone)</span>
            </div>
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{name}</span>
            </div>
          </div>
          <p className="text-xs text-[#9E9388] max-w-md mx-auto mb-6">
            A confirmation receipt has been dispatched to {email}. We look forward to pouring for you at Atelier Kōhī.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setConfirmedBooking(null)}
              className="py-2 px-4 text-xs font-medium text-[#BBB1A5] hover:text-[#EDE8E1] bg-[#28221D] rounded-lg transition-colors"
            >
              Book Another Session
            </button>
            {isOpenModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-5 text-xs font-semibold text-[#121110] bg-[#C68A4C] hover:bg-[#D69A5C] rounded-lg transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Reservation Booking Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Experience Selection */}
          <div>
            <label className="block text-xs font-medium text-[#BBB1A5] mb-2 font-mono uppercase tracking-wider">
              1. Choose Experience
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'flight',
                  title: 'Pour-Over Flight',
                  desc: '3 Single-Origin Terroir Cups',
                  price: '$18 / person'
                },
                {
                  id: 'pairing',
                  title: 'Espresso & Pastry',
                  desc: 'Doppio + Fresh Canelé / Roll',
                  price: '$14 / person'
                },
                {
                  id: 'table',
                  title: 'Slow Bar Counter',
                  desc: 'General Table Seating & A La Carte',
                  price: 'Free Booking'
                }
              ].map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setExperience(exp.id as typeof experience)}
                  className={`p-3.5 text-left rounded-xl border transition-all ${
                    experience === exp.id
                      ? 'border-[#C68A4C] bg-[#27211C] text-[#EDE8E1]'
                      : 'border-[#28221D] bg-[#1C1917] text-[#9E9388] hover:border-[#382F27] hover:text-[#EDE8E1]'
                  }`}
                >
                  <div className="text-sm font-semibold">{exp.title}</div>
                  <div className="text-xs text-[#9E9388] mt-0.5">{exp.desc}</div>
                  <div className="text-xs text-[#C68A4C] font-mono font-medium mt-2">{exp.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Date, Time & Party Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#BBB1A5] mb-1.5 font-mono">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full py-2.5 px-3 bg-[#1C1917] border border-[#2D2620] rounded-lg text-xs text-[#EDE8E1] focus:border-[#C68A4C] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#BBB1A5] mb-1.5 font-mono">
                Party Size
              </label>
              <div className="flex items-center gap-1 bg-[#1C1917] border border-[#2D2620] rounded-lg p-1">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPartySize(num)}
                    className={`flex-1 py-1.5 text-xs font-mono font-medium rounded transition-all ${
                      partySize === num
                        ? 'bg-[#C68A4C] text-[#121110] font-bold'
                        : 'text-[#9E9388] hover:text-[#EDE8E1]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#BBB1A5] mb-1.5 font-mono">
                Seating Atmosphere
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as typeof zone)}
                className="w-full py-2.5 px-3 bg-[#1C1917] border border-[#2D2620] rounded-lg text-xs text-[#EDE8E1] focus:border-[#C68A4C] focus:outline-hidden"
              >
                <option value="counter">Slow Bar Counter (Watch Roaster)</option>
                <option value="garden">Sunlit Courtyard Patio</option>
                <option value="mezzanine">Quiet Mezzanine Library</option>
              </select>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-xs font-medium text-[#BBB1A5] mb-2 font-mono">
              Available Seating Times
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 px-2 text-xs font-mono rounded-lg border transition-all text-center ${
                    timeSlot === slot
                      ? 'border-[#C68A4C] bg-[#27211C] text-[#C68A4C] font-semibold'
                      : 'border-[#28221D] bg-[#1C1917] text-[#9E9388] hover:border-[#382F27] hover:text-[#EDE8E1]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Guest Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#BBB1A5] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kenji Tanaka"
                required
                className="w-full py-2.5 px-3 bg-[#1C1917] border border-[#2D2620] rounded-lg text-xs text-[#EDE8E1] placeholder:text-[#5E554C] focus:border-[#C68A4C] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#BBB1A5] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kenji@example.com"
                required
                className="w-full py-2.5 px-3 bg-[#1C1917] border border-[#2D2620] rounded-lg text-xs text-[#EDE8E1] placeholder:text-[#5E554C] focus:border-[#C68A4C] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#BBB1A5] mb-1">
              Mobile Number (for SMS reminder) & Special Requests
            </label>
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Phone number, oat milk preference, decaf, quiet table..."
              className="w-full py-2.5 px-3 bg-[#1C1917] border border-[#2D2620] rounded-lg text-xs text-[#EDE8E1] placeholder:text-[#5E554C] focus:border-[#C68A4C] focus:outline-hidden"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-[#C68A4C] hover:bg-[#D69A5C] active:scale-[0.99] text-[#121110] font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Confirm Table & Slow Bar Booking</span>
          </button>
        </form>
      )}
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div className="w-full max-w-3xl my-8">
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="omakase" className="py-20 border-t border-[#26201B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
}
