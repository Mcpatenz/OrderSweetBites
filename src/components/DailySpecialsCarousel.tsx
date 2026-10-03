import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';
import { PRODUCTS, Product } from '../data/bakeryData';
import { ResilientImage } from './ResilientImage';

export interface DailySpecialOffer {
  id: string;
  dayLabel: string;
  offerTitle: string;
  batchWindow: string;
  remainingCount: number;
  specialPrice: number;
  regularPrice: number;
  highlightNote: string;
  product: Product;
}

const DAILY_SPECIALS: DailySpecialOffer[] = [
  {
    id: 'special-choc-drip',
    dayLabel: 'Chef’s Signature Feature',
    offerTitle: 'Belgian 70% Chocolate Drip Cake & Truffle Box',
    batchWindow: 'Glazed at 6:00 AM · Limited 12 cakes today',
    remainingCount: 4,
    specialPrice: 580,
    regularPrice: 650,
    highlightNote:
      'Three layers of Davao tablea sponge with warm mirror ganache drip and complimentary gold-dusted truffles.',
    product: PRODUCTS[0],
  },
  {
    id: 'special-cassava-bilao',
    dayLabel: 'Merienda Golden Hour Offer',
    offerTitle: 'Caramelized Macapuno Cassava Cake Platter',
    batchWindow: 'Torched to order · Afternoon batch',
    remainingCount: 7,
    specialPrice: 75,
    regularPrice: 85,
    highlightNote:
      'Heirloom Tagaytay grated cassava slow-baked in first-press coconut cream with a broiled custard crown.',
    product: PRODUCTS[3],
  },
  {
    id: 'special-ube-box',
    dayLabel: 'Bohol Harvest Spotlight',
    offerTitle: 'Halaya Ube & Young Coconut Cupcake Quartet',
    batchWindow: 'Small-batch piping · Fresh out of the kitchen',
    remainingCount: 5,
    specialPrice: 105,
    regularPrice: 120,
    highlightNote:
      'Pillow-soft purple yam sponge cored with Laguna macapuno strings and silky Swiss meringue buttercream.',
    product: PRODUCTS[1],
  },
  {
    id: 'special-brownie-tin',
    dayLabel: 'Evening Craving Pairing',
    offerTitle: 'Fudgy Sea Salt & Brown-Butter Brownie Six-Pack',
    batchWindow: 'Warm deck oven tray · 2:00 PM bake',
    remainingCount: 6,
    specialPrice: 155,
    regularPrice: 180,
    highlightNote:
      'Crackly meringue crust over molten 70% dark couverture chunks finished with Pangasinan sea salt flakes.',
    product: PRODUCTS[2],
  },
];

interface DailySpecialsCarouselProps {
  onAddSpecialToCart: (product: Product, customPrice: number, offerTitle: string) => void;
  onQuickView: (product: Product) => void;
}

export const DailySpecialsCarousel: React.FC<DailySpecialsCarouselProps> = ({
  onAddSpecialToCart,
  onQuickView,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
    new Date()
  );

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DAILY_SPECIALS.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const currentSpecial = DAILY_SPECIALS[activeIndex];
  const savings = currentSpecial.regularPrice - currentSpecial.specialPrice;

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + DAILY_SPECIALS.length) % DAILY_SPECIALS.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % DAILY_SPECIALS.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="rounded-2xl bg-[#241813] border border-[#F5EBE1]/12 overflow-hidden shadow-2xl flex flex-col justify-between"
    >
      {/* Top Carousel Header Bar (Unboxed Metadata + Prev/Next Controls) */}
      <div className="px-5 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#1E1410]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#D9C8B8]">
          <span className="font-semibold text-[#C69C53]">
            {todayName} Daily Specials
          </span>
          <span aria-hidden="true">·</span>
          <span>{currentSpecial.dayLabel}</span>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span className="hidden sm:inline font-mono-tabular text-[#E8C5B0]">
            {activeIndex + 1} / {DAILY_SPECIALS.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous daily special"
            className="w-8 h-8 rounded-lg border border-white/10 hover:border-[#C69C53] bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#FBF9F6] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next daily special"
            className="w-8 h-8 rounded-lg border border-white/10 hover:border-[#C69C53] bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#FBF9F6] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Featured Visual & Offer Content */}
      <div>
        <div className="relative aspect-16/10 overflow-hidden bg-[#1B120E]">
          <ResilientImage
            key={currentSpecial.id}
            src={currentSpecial.product.image}
            alt={currentSpecial.offerTitle}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-5 sm:p-6">
            <div className="space-y-1.5">
              {/* Quiet Unboxed Limited-Time Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#E8C5B0]">
                <span>{currentSpecial.batchWindow}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular text-[#F2C6CF]">
                  {currentSpecial.remainingCount} left at special price
                </span>
              </div>

              <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-white leading-tight">
                {currentSpecial.offerTitle}
              </h2>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <p className="text-xs sm:text-sm text-[#D9C8B8] leading-relaxed">
            {currentSpecial.highlightNote}
          </p>

          {/* Pricing & Primary Action Bar */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-tabular text-2xl font-semibold text-[#FBF9F6]">
                  ₱{currentSpecial.specialPrice.toLocaleString()}
                </span>
                <span className="font-mono-tabular text-xs text-[#9C897B] line-through">
                  ₱{currentSpecial.regularPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-[#C69C53] font-mono-tabular mt-0.5">
                Limited-time offer · Save ₱{savings} today
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onQuickView(currentSpecial.product)}
                aria-label={`Inspect ${currentSpecial.product.name}`}
                className="px-3.5 py-2.5 rounded-lg border border-white/15 hover:border-white/35 text-xs font-medium text-[#FBF9F6] transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onAddSpecialToCart(
                    currentSpecial.product,
                    currentSpecial.specialPrice,
                    `${currentSpecial.dayLabel} (${todayName} Special)`
                  )
                }
                className="px-4 py-2.5 rounded-lg bg-[#B84A62] hover:bg-[#A03B52] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Claim Daily Special</span>
              </button>
            </div>
          </div>

          {/* Interactive Slide Selector Tabs */}
          <div className="pt-2 grid grid-cols-4 gap-2" role="tablist" aria-label="Select daily special">
            {DAILY_SPECIALS.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(idx)}
                  className={`text-left p-2 rounded-lg border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white/12 border-[#C69C53] text-white'
                      : 'bg-white/4 border-white/8 text-[#A69385] hover:text-[#E8DDD3]'
                  }`}
                >
                  <p className="text-[11px] font-medium truncate">
                    {item.product.name}
                  </p>
                  <p className="font-mono-tabular text-[11px] text-[#C69C53] mt-0.5">
                    ₱{item.specialPrice}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
