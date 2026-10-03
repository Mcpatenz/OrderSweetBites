import React, { useState } from 'react';
import { Check, Plus, Sparkles } from 'lucide-react';
import {
  PRODUCTS,
  CUSTOM_CAKE_OPTIONS,
  IMAGES,
  Product,
  CustomCakeConfig,
} from '../data/bakeryData';
import { ResilientImage } from './ResilientImage';

interface CustomCakeAndFilipinoProps {
  onAddToCart: (product: Product, variantIndex?: number, qty?: number) => void;
  onAddCustomCake: (config: CustomCakeConfig, unitPrice: number) => void;
  onQuickView: (product: Product) => void;
}

export const CustomCakeAndFilipino: React.FC<CustomCakeAndFilipinoProps> = ({
  onAddToCart,
  onAddCustomCake,
  onQuickView,
}) => {
  const filipinoFavorites = PRODUCTS.filter((p) => p.isFilipinoFavorite);

  const [occasion, setOccasion] = useState(CUSTOM_CAKE_OPTIONS.occasions[0]);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [flavorIdx, setFlavorIdx] = useState(1); // Ube Halaya default
  const [frostingIdx, setFrostingIdx] = useState(0);
  const [designIdx, setDesignIdx] = useState(0);
  const [message, setMessage] = useState('Happy Birthday, Mahal!');
  const [quantity, setQuantity] = useState(1);
  const [eventDate, setEventDate] = useState('2026-10-03');
  const [notes, setNotes] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  const selectedSize = CUSTOM_CAKE_OPTIONS.sizes[sizeIdx];
  const selectedFlavor = CUSTOM_CAKE_OPTIONS.flavors[flavorIdx];
  const selectedFrosting = CUSTOM_CAKE_OPTIONS.frostings[frostingIdx];
  const selectedDesign = CUSTOM_CAKE_OPTIONS.designs[designIdx];

  const unitPrice =
    selectedSize.price +
    selectedFlavor.price +
    selectedFrosting.price +
    selectedDesign.price;

  const totalPrice = unitPrice * quantity;

  const handleCreateCustomCake = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCustomCake(
      {
        occasion,
        size: selectedSize.label,
        sizePrice: selectedSize.price,
        flavor: selectedFlavor.label,
        flavorPrice: selectedFlavor.price,
        frosting: selectedFrosting.label,
        frostingPrice: selectedFrosting.price,
        design: selectedDesign.label,
        designPrice: selectedDesign.price,
        message: message.trim() || 'SweetBites Celebration',
        quantity,
        eventDate,
        notes,
      },
      unitPrice
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2600);
  };

  return (
    <>
      {/* FILIPINO DESSERT FEATURE: Made with Filipino Flavors */}
      <section
        id="filipino-section"
        className="py-16 sm:py-24 bg-[#231712] text-[#FBF9F6] border-y border-[#38271F]"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#C69C53]">
                <span>Philippine Heritage Patisserie</span>
                <span aria-hidden="true">·</span>
                <span>Bohol Ube · Tagaytay Cassava · Davao Tablea · Laguna Macapuno</span>
              </div>
              <h2
                className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#FBF9F6]"
                style={{ textWrap: 'balance' }}
              >
                Made with Filipino Flavors
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#D6C2B2] max-w-xl leading-relaxed">
              Heirloom regional ingredients elevated with contemporary patisserie
              technique — from slow-baked golden cassava cake with torched
              macapuno custard to Bohol purple yam and roasted Davao cacao.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filipinoFavorites.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-[#2C1E18] border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-[#C69C53]/50 transition-colors"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-[#1B120E]">
                    <ResilientImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#F5EBE1]">
                      <span>{item.statusTag || 'Filipino Classic'}</span>
                      <span className="font-mono-tabular font-semibold text-[#FBF9F6] text-sm">
                        ₱{item.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-xs text-[#C69C53]">
                      <span>{item.category}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{item.servingSize}</span>
                    </div>
                    <h3 className="font-serif-display text-2xl font-semibold text-[#FBF9F6]">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D6C2B2] leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onQuickView(item)}
                    className="px-3.5 py-2 rounded-lg border border-white/15 hover:border-white/40 text-xs font-medium text-[#FBF9F6] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddToCart(item, 0, 1)}
                    className="flex-1 px-4 py-2 rounded-lg bg-[#B84A62] hover:bg-[#A03B52] text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Box · ₱{item.price}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM CAKE SECTION: Your Dream Cake, Made Just for You */}
      <section id="custom-cake-section" className="py-16 sm:py-24 bg-[#F3EFEA] border-b border-[#E6DFD5]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs sm:text-sm font-medium text-[#8C6D58]">
              Birthday · Wedding · Anniversary · Graduation · Special Events
            </p>
            <h2
              className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#231712]"
              style={{ textWrap: 'balance' }}
            >
              Your Dream Cake, Made Just for You
            </h2>
            <p className="text-sm sm:text-base text-[#6E5D53] leading-relaxed">
              Design your bespoke centerpiece cake in real time. Every custom
              tier is hand-masked in silky buttercream or mirror ganache and
              includes a hand-lettered chocolate dedication plaque.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Live Visual Preview & Plaque */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <div className="relative rounded-2xl overflow-hidden bg-[#231712] border border-[#E6DFD5] shadow-lg aspect-4/3">
                <ResilientImage
                  src={IMAGES.customCelebrationCake}
                  alt="Custom two-tier celebration cake with ivory Swiss meringue buttercream and rose accents"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#F5EBE1]">
                    <span>{occasion} Bespoke Commission</span>
                    <span className="font-mono-tabular font-semibold text-[#C69C53]">
                      ₱{totalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Live Dedication Plaque Preview */}
                  <div className="space-y-2">
                    <div className="p-3.5 rounded-xl bg-[#1B120E]/90 backdrop-blur-md border border-[#C69C53]/40 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-[#C69C53]">
                        Hand-Piped Dedication Plaque
                      </p>
                      <p className="font-serif-display italic text-xl text-[#FBF9F6] mt-0.5">
                        “{message || 'Your Custom Message Here'}”
                      </p>
                    </div>
                    <p className="text-xs text-[#E8DDD3]">
                      {selectedSize.label} · {selectedFlavor.label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Specification Summary Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E6DFD5] space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD5]">
                  <span className="font-semibold text-[#231712]">
                    Bespoke Specification Summary
                  </span>
                  <span className="font-mono-tabular text-[#8C6D58]">
                    Ready in 24h
                  </span>
                </div>
                <div className="space-y-1.5 text-[#6E5D53]">
                  <div className="flex justify-between gap-2">
                    <span>Occasion:</span>
                    <span className="font-medium text-[#231712]">{occasion}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Size & Tier:</span>
                    <span className="font-medium text-[#231712] text-right">
                      {selectedSize.label}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Sponge Flavor:</span>
                    <span className="font-medium text-[#231712] text-right">
                      {selectedFlavor.label}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Frosting Finish:</span>
                    <span className="font-medium text-[#231712] text-right">
                      {selectedFrosting.label}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Artisanal Styling:</span>
                    <span className="font-medium text-[#231712] text-right">
                      {selectedDesign.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Cake Customizer Form */}
            <form
              onSubmit={handleCreateCustomCake}
              className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD5] space-y-6"
            >
              {/* 1. Occasion Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#231712]">
                  01. Celebration Occasion
                </label>
                <div className="flex flex-wrap gap-2">
                  {CUSTOM_CAKE_OPTIONS.occasions.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        occasion === occ
                          ? 'bg-[#231712] text-white'
                          : 'bg-[#F3EFEA] text-[#6E5D53] hover:text-[#231712]'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Cake Size */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#231712]">
                  02. Cake Size & Servings
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CUSTOM_CAKE_OPTIONS.sizes.map((sz, idx) => (
                    <button
                      key={sz.label}
                      type="button"
                      onClick={() => setSizeIdx(idx)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        sizeIdx === idx
                          ? 'border-[#B84A62] bg-[#B84A62]/5 text-[#231712]'
                          : 'border-[#E6DFD5] hover:border-[#8C6D58] text-[#6E5D53]'
                      }`}
                    >
                      <span className="text-xs font-medium text-[#231712]">
                        {sz.label}
                      </span>
                      <span className="font-mono-tabular text-xs font-semibold text-[#B84A62] shrink-0">
                        ₱{sz.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Sponge Flavor & 4. Frosting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="cake-flavor-select"
                    className="block text-xs font-semibold text-[#231712]"
                  >
                    03. Cake Sponge Flavor
                  </label>
                  <select
                    id="cake-flavor-select"
                    value={flavorIdx}
                    onChange={(e) => setFlavorIdx(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD5] bg-[#FBF9F6] text-xs sm:text-sm text-[#231712] focus:outline-none focus:border-[#B84A62]"
                  >
                    {CUSTOM_CAKE_OPTIONS.flavors.map((fl, i) => (
                      <option key={fl.label} value={i}>
                        {fl.label} {fl.price > 0 ? `(+₱${fl.price})` : '(Included)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cake-frosting-select"
                    className="block text-xs font-semibold text-[#231712]"
                  >
                    04. Frosting & Ganache
                  </label>
                  <select
                    id="cake-frosting-select"
                    value={frostingIdx}
                    onChange={(e) => setFrostingIdx(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD5] bg-[#FBF9F6] text-xs sm:text-sm text-[#231712] focus:outline-none focus:border-[#B84A62]"
                  >
                    {CUSTOM_CAKE_OPTIONS.frostings.map((fr, i) => (
                      <option key={fr.label} value={i}>
                        {fr.label} {fr.price > 0 ? `(+₱${fr.price})` : '(Included)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Design Style */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#231712]">
                  05. Finishing Design Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CUSTOM_CAKE_OPTIONS.designs.map((ds, idx) => (
                    <button
                      key={ds.label}
                      type="button"
                      onClick={() => setDesignIdx(idx)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        designIdx === idx
                          ? 'border-[#B84A62] bg-[#B84A62]/5 text-[#231712]'
                          : 'border-[#E6DFD5] hover:border-[#8C6D58] text-[#6E5D53]'
                      }`}
                    >
                      <span className="text-xs font-medium text-[#231712]">
                        {ds.label}
                      </span>
                      <span className="font-mono-tabular text-xs text-[#8C6D58] shrink-0">
                        {ds.price > 0 ? `+₱${ds.price}` : 'Included'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Dedication Message, Date & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="cake-dedication-msg"
                    className="block text-xs font-semibold text-[#231712]"
                  >
                    06. Dedication Plaque Message (Max 40 chars)
                  </label>
                  <input
                    id="cake-dedication-msg"
                    type="text"
                    maxLength={40}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Happy 30th Birthday, Bea!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6DFD5] bg-[#FBF9F6] text-sm text-[#231712] focus:outline-none focus:border-[#B84A62]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="cake-event-date"
                    className="block text-xs font-semibold text-[#231712]"
                  >
                    Celebration Date
                  </label>
                  <input
                    id="cake-event-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E6DFD5] bg-[#FBF9F6] text-xs sm:text-sm text-[#231712] focus:outline-none focus:border-[#B84A62]"
                  />
                </div>
              </div>

              {/* Submit Bar */}
              <div className="pt-4 border-t border-[#E6DFD5] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#6E5D53]">Quantity:</span>
                  <div className="flex items-center border border-[#E6DFD5] rounded-lg bg-[#FBF9F6]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-sm font-medium text-[#231712] hover:bg-[#E6DFD5]/50 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-3 font-mono-tabular text-sm font-semibold text-[#231712]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1.5 text-sm font-medium text-[#231712] hover:bg-[#E6DFD5]/50 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-[#B84A62] hover:bg-[#A03B52] text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-xs"
                >
                  {addedToast ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Custom Cake Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        Customize Your Cake · ₱{totalPrice.toLocaleString()}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
