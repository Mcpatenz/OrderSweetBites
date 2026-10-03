import React, { useState } from 'react';
import { Star, ArrowUpRight, MapPin, Clock, Phone, ShieldCheck, Check, Mail, Award } from 'lucide-react';
import {
  GALLERY_ITEMS,
  TESTIMONIALS,
  IMAGES,
  CategoryId,
  OrderRecord,
} from '../data/bakeryData';
import { ResilientImage } from './ResilientImage';
import { calculateLoyaltySummary, REWARD_TIERS } from './SweetRewardsModal';

interface StoryGalleryReviewsProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenAdmin: () => void;
  onOpenOrderTracker: () => void;
  orders: OrderRecord[];
  redeemedPoints: number;
  onOpenRewards: () => void;
}

export const StoryGalleryReviews: React.FC<StoryGalleryReviewsProps> = ({
  onSelectCategory,
  onOpenAdmin,
  onOpenOrderTracker,
  orders,
  redeemedPoints,
  onOpenRewards,
}) => {
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  const loyalty = calculateLoyaltySummary(orders, redeemedPoints);
  const [emailInput, setEmailInput] = useState('');
  const [newsletterTopic, setNewsletterTopic] = useState<
    'All Updates' | 'Monthly Promotions' | 'Seasonal Cakes'
  >('All Updates');
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sweetbites_subscriber_email');
    } catch {
      return null;
    }
  });
  const [emailError, setEmailError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address to receive monthly invitations.');
      return;
    }
    setEmailError('');
    setSubscribedEmail(trimmed);
    setEmailInput('');
    try {
      localStorage.setItem('sweetbites_subscriber_email', trimmed);
    } catch {
      // ignore storage error
    }
  };

  const handleCopyWelcomeCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('SWEET10').catch(() => {});
    }
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 2500);
  };

  const galleryCategories = [
    'All',
    'Cakes',
    'Cupcakes',
    'Cassava Cake',
    'Brownies',
    'Custom Cakes',
    'Behind the Scenes',
  ];

  const visibleGallery =
    galleryFilter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.category === galleryFilter);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ABOUT SECTION: Baked with Passion, Served with Love */}
      <section
        id="story-gallery-section"
        className="py-16 sm:py-24 bg-[#FBF9F6] border-b border-[#E6DFD5]"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-medium text-[#8C6D58]">
                Our Artisanal Kitchen · Est. Makati City
              </p>
              <h2
                className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#231712]"
                style={{ textWrap: 'balance' }}
              >
                Baked with Passion, Served with Love
              </h2>
              <p className="text-sm sm:text-base text-[#5E4E45] leading-relaxed">
                Every morning before sunrise, our pastry chefs grate fresh
                Tagaytay cassava, fold slow-simmered Bohol ube halaya into warm
                sponge batters, and temper 70% Belgian dark couverture alongside
                single-origin Davao cacao tablea.
              </p>
              <p className="text-sm sm:text-base text-[#5E4E45] leading-relaxed">
                Whether you are picking up a warm box of blueberry streusel
                muffins on your way to work, sending fudgy brownies across BGC,
                or commissioning a two-tier celebration cake, SweetBites crafts
                every order with unhurried care.
              </p>

              {/* Philippine Fulfilment Service Highlights (Unboxed Grid) */}
              <div className="pt-4 border-t border-[#E6DFD5] grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#231712]">Store Pickup</p>
                  <p className="text-xs text-[#7A685D] mt-0.5">
                    Ready in 30 mins at Salcedo Village
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#231712]">Local Delivery</p>
                  <p className="text-xs text-[#7A685D] mt-0.5">
                    Chilled van across Metro Manila
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#231712]">Same-Day Treats</p>
                  <p className="text-xs text-[#7A685D] mt-0.5">
                    Daily small-batch bakes until 7 PM
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#231712]">Pre-Order</p>
                  <p className="text-xs text-[#7A685D] mt-0.5">
                    Reserve custom event dates ahead
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-[#E6DFD5] aspect-4/5 bg-[#231712]">
                <ResilientImage
                  src={IMAGES.chocolateDripCake}
                  alt="Artisanal chocolate drip cake freshly glazed in our Makati studio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-[#E6DFD5] aspect-4/3 bg-[#231712]">
                  <ResilientImage
                    src={IMAGES.cassavaCake}
                    alt="Golden baked Filipino cassava cake with caramelized macapuno top"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 rounded-2xl bg-[#231712] text-[#FBF9F6] space-y-1.5">
                  <p className="font-mono-tabular text-2xl font-semibold text-[#C69C53]">
                    100% Real
                  </p>
                  <p className="text-xs text-[#D9C8B8] leading-relaxed">
                    Cultured butter, farm-fresh eggs, Bohol purple yam, and zero
                    artificial cake mixes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* GALLERY SECTION: Masonry-Style Patisserie Lookbook */}
          <div id="gallery-section" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#8C6D58]">
                  Patisserie Lookbook · Fresh from the Deck Oven
                </p>
                <h2
                  className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#231712] mt-1"
                  style={{ textWrap: 'balance' }}
                >
                  Inside the SweetBites Kitchen
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3EFEA] rounded-xl border border-[#E6DFD5]">
                {galleryCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGalleryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      galleryFilter === cat
                        ? 'bg-[#231712] text-white'
                        : 'text-[#6E5D53] hover:text-[#231712]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleGallery.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#231712] border border-[#E6DFD5] aspect-4/3"
                >
                  <ResilientImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                    <p className="text-[11px] text-[#C69C53]">{item.category}</p>
                    <h3 className="font-serif-display text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#E8DDD3] mt-0.5">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TESTIMONIALS: Attributable Customer Reviews */}
          <div className="space-y-8">
            <div className="border-b border-[#E6DFD5] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#8C6D58]">
                  Verified Celebrations Across Metro Manila
                </p>
                <h2
                  className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#231712] mt-1"
                  style={{ textWrap: 'balance' }}
                >
                  Loved at Every Table
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#6E5D53] font-mono-tabular">
                4.9 / 5.0 average across 1,420+ verified orders
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((rev) => (
                <blockquote
                  key={rev.id}
                  className="p-6 rounded-2xl bg-white border border-[#E6DFD5] flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#C69C53]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C69C53]" />
                      ))}
                    </div>
                    <p className="text-sm text-[#231712] leading-relaxed">
                      “{rev.quote}”
                    </p>
                  </div>

                  <footer className="pt-4 border-t border-[#F3EFEA] space-y-1">
                    <p className="text-sm font-semibold text-[#231712]">
                      {rev.name}
                    </p>
                    <p className="text-xs text-[#7A685D]">
                      {rev.role} · {rev.location}
                    </p>
                    <p className="text-[11px] text-[#8C6D58]">
                      Ordered: {rev.productOrdered}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>

          {/* PROMOTIONAL BANNER: Life is Sweeter with SweetBites */}
          <div className="rounded-2xl bg-[#231712] text-[#FBF9F6] p-8 sm:p-12 border border-[#38271F] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <p className="text-xs text-[#C69C53]">
                Treat yourself today · Use code SWEET10 for 10% off your first box
              </p>
              <h2
                className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#FBF9F6]"
                style={{ textWrap: 'balance' }}
              >
                Life is Sweeter with SweetBites
              </h2>
              <p className="text-sm text-[#D6C2B2]">
                Freshly baked cakes, ube cupcakes, golden cassava cake, and
                fudgy brownies delivered straight to your doorstep or ready for
                express Makati pickup.
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToMenu}
              className="px-6 py-3.5 rounded-xl bg-[#B84A62] hover:bg-[#A03B52] text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
            >
              <span>Order Your Favorites</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* MINIMALIST EMAIL SUBSCRIPTION SECTION BEFORE FOOTER */}
      <section
        id="newsletter-section"
        aria-label="Patisserie newsletter subscription"
        className="py-14 sm:py-20 bg-[#F3EFEA] border-b border-[#E6DFD5]"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Editorial Invitation */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C6D58]">
                <span className="font-medium">The Patisserie Dispatch</span>
                <span aria-hidden="true">·</span>
                <span>Monthly Oven Notes</span>
                <span aria-hidden="true">·</span>
                <span>First-Batch Access</span>
              </div>

              <h2
                className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#231712]"
                style={{ textWrap: 'balance' }}
              >
                Warm Updates from Our Deck Ovens
              </h2>

              <p className="text-sm text-[#5E4E45] leading-relaxed max-w-[54ch]">
                Join our private tasting list for seasonal Filipino harvest releases,
                limited-edition celebration cakes, and an exclusive monthly patisserie
                privilege sent on the first Friday of each month.
              </p>
            </div>

            {/* Right Minimalist Subscription Form */}
            <div className="lg:col-span-6">
              {subscribedEmail ? (
                <div className="p-6 sm:p-7 rounded-2xl bg-[#FBF9F6] border border-[#E6DFD5] space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-[#8C6D58]">
                        Subscription Confirmed · {newsletterTopic}
                      </p>
                      <h3 className="font-serif-display text-2xl font-semibold text-[#231712]">
                        Welcome to the SweetBites Table
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5E4E45]">
                        We have registered{' '}
                        <span className="font-medium text-[#231712]">
                          {subscribedEmail}
                        </span>{' '}
                        for our monthly bakery dispatch. Enjoy 10% off your next order
                        with our subscriber welcome code:
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E6DFD5]">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono-tabular text-sm font-semibold text-[#231712] tracking-wider">
                        CODE: SWEET10
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyWelcomeCode}
                        className="px-3 py-1.5 rounded-lg bg-[#231712] hover:bg-[#3A261E] text-white text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#C69C53]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <span>Copy Code</span>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSubscribedEmail(null)}
                      className="text-xs text-[#7A685D] hover:text-[#231712] underline underline-offset-4 cursor-pointer"
                    >
                      Change email address
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  noValidate
                  className="p-6 sm:p-7 rounded-2xl bg-[#FBF9F6] border border-[#E6DFD5] space-y-4"
                >
                  {/* Interactive Preference Selector */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#6E5D53]">
                      Preferred dispatch:
                    </span>
                    <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F3EFEA] rounded-lg border border-[#E6DFD5]">
                      {(
                        [
                          'All Updates',
                          'Monthly Promotions',
                          'Seasonal Cakes',
                        ] as const
                      ).map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setNewsletterTopic(topic)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                            newsletterTopic === topic
                              ? 'bg-white text-[#231712] shadow-2xs'
                              : 'text-[#6E5D53] hover:text-[#231712]'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Single-Row Minimalist Input & Submit */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-[#8C6D58] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        placeholder="Enter your email address (e.g. camille@example.ph)"
                        aria-label="Email address for bakery updates"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-[#E6DFD5] text-sm text-[#231712] placeholder-[#9C897B] focus:outline-none focus:border-[#B84A62]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg bg-[#231712] hover:bg-[#B84A62] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Join the List
                    </button>
                  </div>

                  {emailError ? (
                    <p className="text-xs text-[#B84A62]" role="alert">
                      {emailError}
                    </p>
                  ) : (
                    <p className="text-xs text-[#7A685D]">
                      One thoughtful dispatch per month · Instant 10% welcome privilege ·
                      Unsubscribe anytime
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SOPHISTICATED DARK CHOCOLATE FOOTER */}
      <footer
        id="contact-footer"
        className="bg-[#1B120E] text-[#D9C8B8] border-t border-white/10 pt-14 pb-24 sm:pb-14"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-12">
          {/* SWEET REWARDS LOYALTY SECTION IN FOOTER */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#241813] border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#C69C53]">
                <Award className="w-4 h-4" />
                <span className="font-semibold">Sweet Rewards Loyalty Program</span>
                <span aria-hidden="true">·</span>
                <span>Current Tier: {loyalty.currentTier.name}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'} tracked
                </span>
              </div>

              <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#FBF9F6]">
                You Have{' '}
                <span className="font-mono-tabular text-[#F2C6CF]">
                  {loyalty.availablePoints} Sweet Points
                </span>{' '}
                Ready to Redeem
              </h3>

              <p className="text-xs text-[#B8A596] leading-relaxed">
                Tiers:{' '}
                {REWARD_TIERS.map((t, idx) => (
                  <React.Fragment key={t.name}>
                    <span
                      className={
                        t.name === loyalty.currentTier.name
                          ? 'text-[#FBF9F6] font-semibold'
                          : ''
                      }
                    >
                      {t.name} ({t.maxPoints ? `${t.minPoints}–${t.maxPoints}` : `${t.minPoints}+`} pts)
                    </span>
                    {idx < REWARD_TIERS.length - 1 && (
                      <span aria-hidden="true"> · </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenRewards}
                className="px-5 py-3 rounded-xl bg-[#B84A62] hover:bg-[#A03B52] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>View Rewards & Redeem</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <a
                href="#top"
                className="font-serif-display text-3xl font-semibold text-[#FBF9F6] block"
              >
                SweetBites
              </a>
              <p className="text-xs italic text-[#C69C53]">
                “Made with Love, Baked for Every Moment”
              </p>
              <p className="text-xs sm:text-sm text-[#B8A596] max-w-sm leading-relaxed">
                Luxury contemporary Filipino patisserie and online cake studio
                crafting celebration cakes, ube cupcakes, golden cassava cake,
                brownies, and fresh morning muffins.
              </p>
              <div className="flex items-center gap-4 pt-1 text-xs font-medium text-[#E8DDD3]">
                <a
                  href="#contact-footer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToMenu();
                  }}
                  className="hover:text-[#C69C53] transition-colors"
                >
                  Facebook
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="#contact-footer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToMenu();
                  }}
                  className="hover:text-[#C69C53] transition-colors"
                >
                  Instagram
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="#contact-footer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToMenu();
                  }}
                  className="hover:text-[#C69C53] transition-colors"
                >
                  TikTok
                </a>
              </div>
            </div>

            {/* Menu Column */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#FBF9F6]">Our Menu</h3>
              <ul className="space-y-2 text-xs text-[#B8A596]">
                {(['Cakes', 'Muffins', 'Cupcakes', 'Cassava Cake', 'Brownies', 'Desserts'] as CategoryId[]).map(
                  (c) => (
                    <li key={c}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCategory(c);
                          scrollToMenu();
                        }}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {c}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#FBF9F6]">Quick Links</h3>
              <ul className="space-y-2 text-xs text-[#B8A596]">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('custom-cake-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Custom Celebration Cakes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenRewards}
                    className="text-[#F2C6CF] hover:text-white transition-colors cursor-pointer"
                  >
                    Sweet Rewards ({loyalty.availablePoints} pts)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenOrderTracker}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Track Your Order
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="text-[#C69C53] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Bakery Admin Dashboard</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact & Business Hours */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#FBF9F6]">
                Flagship Café & Hours
              </h3>
              <div className="space-y-2.5 text-xs text-[#B8A596]">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C69C53] shrink-0 mt-0.5" />
                  <span>118 Leviste Street, Salcedo Village, Makati City, Metro Manila 1227</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C69C53] shrink-0" />
                  <span className="font-mono-tabular">+63 (02) 8812 4590 · +63 917 550 8821</span>
                </p>
                <p className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C69C53] shrink-0 mt-0.5" />
                  <span>
                    Mon – Sun: 6:30 AM – 9:00 PM
                    <br />
                    Same-day delivery cut-off: 6:00 PM
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7A6E]">
            <p>© 2026 SweetBites. All Rights Reserved.</p>
            <p>
              Payments Accepted: GCash · Maya · Cash on Delivery · Cash on Pickup
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
