import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-react';
import {
  PRODUCTS,
  INITIAL_ORDERS,
  IMAGES,
  CategoryId,
  Product,
  CartItem,
  CustomCakeConfig,
  OrderRecord,
  OrderStatus,
} from './data/bakeryData';
import { ResilientImage } from './components/ResilientImage';
import { CatalogAndCategories } from './components/CatalogAndCategories';
import { CustomCakeAndFilipino } from './components/CustomCakeAndFilipino';
import { StoryGalleryReviews } from './components/StoryGalleryReviews';
import {
  QuickViewModal,
  CartAndCheckoutDrawer,
  OrderTrackerAndAdminModal,
} from './components/CartCheckoutModals';
import { DailySpecialsCarousel } from './components/DailySpecialsCarousel';
import { VoiceSearchButton } from './components/VoiceSearchButton';
import {
  SweetRewardsModal,
  RedeemableTreat,
} from './components/SweetRewardsModal';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [priceFilter, setPriceFilter] = useState<
    'all' | 'under150' | '150to400' | 'over400'
  >('all');
  const [sortBy, setSortBy] = useState<
    'bestsellers' | 'priceAsc' | 'priceDesc' | 'rating'
  >('bestsellers');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([
    'prod-choc-drip',
    'prod-cassava-cake',
  ]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackerModal, setTrackerModal] = useState<{
    open: boolean;
    mode: 'tracker' | 'admin';
  }>({ open: false, mode: 'tracker' });
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [redeemedPoints, setRedeemedPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sweetbites_redeemed_pts_v1');
      return saved ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sweetbites_cart_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage error
    }
    return [
      {
        cartItemId: 'initial-1',
        productId: 'prod-choc-drip',
        name: 'Chocolate Drip Cake',
        category: 'Cakes',
        unitPrice: 650,
        quantity: 1,
        image: IMAGES.chocolateDripCake,
        variantLabel: '6" Classic Round (8–10 pax)',
      },
      {
        cartItemId: 'initial-2',
        productId: 'prod-ube-cupcakes',
        name: 'Ube Cupcakes',
        category: 'Cupcakes',
        unitPrice: 120,
        quantity: 1,
        image: IMAGES.ubeCupcakes,
        variantLabel: 'Solo Petite Box (4 pcs)',
      },
    ];
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sweetbites_orders_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sweetbites_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sweetbites_orders_v1', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'sweetbites_redeemed_pts_v1',
        String(redeemedPoints)
      );
    } catch {
      // ignore
    }
  }, [redeemedPoints]);

  const handleRedeemTreat = (treat: RedeemableTreat) => {
    setRedeemedPoints((prev) => prev + treat.pointsCost);
    const key = `reward-${treat.id}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === key);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId: key,
          productId: treat.product.id,
          name: `${treat.product.name} (Sweet Reward)`,
          category: treat.product.category,
          unitPrice: 0,
          quantity: 1,
          image: treat.product.image,
          variantLabel: `Redeemed with ${treat.pointsCost} Sweet Points`,
        },
      ];
    });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (priceFilter === 'under150' && p.price >= 150) return false;
      if (priceFilter === '150to400' && (p.price < 150 || p.price > 400)) {
        return false;
      }
      if (priceFilter === 'over400' && p.price <= 400) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchDesc = p.shortDescription.toLowerCase().includes(q);
        const matchIng = p.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!matchName && !matchCategory && !matchDesc && !matchIng) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [selectedCategory, priceFilter, sortBy, searchQuery]);

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (
    product: Product,
    variantIndex = 0,
    qty = 1
  ) => {
    const variant = product.variants[variantIndex] || {
      label: product.servingSize,
      priceDelta: 0,
    };
    const unitPrice = product.price + variant.priceDelta;
    const key = `${product.id}-${variant.label}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === key);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === key
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId: key,
          productId: product.id,
          name: product.name,
          category: product.category,
          unitPrice,
          quantity: qty,
          image: product.image,
          variantLabel: variant.label,
        },
      ];
    });
    setCartOpen(true);
  };

  const handleAddCustomCake = (
    config: CustomCakeConfig,
    unitPrice: number
  ) => {
    const customItem: CartItem = {
      cartItemId: `custom-${Date.now()}`,
      productId: 'custom-celebration-cake',
      name: `Bespoke ${config.occasion} Cake`,
      category: 'Cakes',
      unitPrice,
      quantity: config.quantity,
      image: IMAGES.customCelebrationCake,
      variantLabel: config.size,
      customDetails: `${config.flavor} · ${config.frosting} · ${config.design} · Plaque: "${config.message}" (Event: ${config.eventDate})`,
    };
    setCart((prev) => [...prev, customItem]);
    setCartOpen(true);
  };

  const handleAddSpecialToCart = (
    product: Product,
    specialPrice: number,
    offerLabel: string
  ) => {
    const key = `daily-special-${product.id}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === key);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId: key,
          productId: product.id,
          name: product.name,
          category: product.category,
          unitPrice: specialPrice,
          quantity: 1,
          image: product.image,
          variantLabel: offerLabel,
        },
      ];
    });
    setCartOpen(true);
  };

  const handleUpdateCartQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handlePlaceOrder = (
    orderData: Omit<OrderRecord, 'orderId' | 'createdAt' | 'status'>
  ): OrderRecord => {
    const newOrder: OrderRecord = {
      ...orderData,
      orderId: `SB-${Math.floor(1050 + Math.random() * 8900)}`,
      createdAt: new Date().toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'Order Confirmed',
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    nextStatus: OrderStatus
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  const handleReorderItems = (items: CartItem[]) => {
    setCart((prev) => {
      const next = [...prev];
      items.forEach((orderItem) => {
        const key = `${orderItem.productId}-${orderItem.variantLabel}`;
        const existingIdx = next.findIndex((i) => i.cartItemId === key);
        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + orderItem.quantity,
          };
        } else {
          next.push({
            ...orderItem,
            cartItemId: key,
          });
        }
      });
      return next;
    });
    setCartOpen(true);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F6] text-[#231712]">
      {/* Clean, Responsive Navigation Bar (3-Zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-[#1B120E]/95 backdrop-blur-md border-b border-[#F5EBE1]/10 text-[#FBF9F6]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: SweetBites Brand Wordmark */}
          <a
            href="#top"
            className="font-serif-display text-2xl sm:text-[28px] font-semibold tracking-tight text-[#FBF9F6] whitespace-nowrap shrink-0"
          >
            SweetBites
          </a>

          {/* Zone 2: Standard Menu Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#E8DDD3]">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                scrollToSection('menu-section');
              }}
              className="hover:text-[#FBF9F6] hover:underline underline-offset-8 decoration-[#C69C53] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Our Menu
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Cakes');
                scrollToSection('menu-section');
              }}
              className="hover:text-[#FBF9F6] hover:underline underline-offset-8 decoration-[#C69C53] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cakes
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('filipino-section')}
              className="hover:text-[#FBF9F6] hover:underline underline-offset-8 decoration-[#C69C53] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Desserts
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('custom-cake-section')}
              className="hover:text-[#FBF9F6] hover:underline underline-offset-8 decoration-[#C69C53] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Custom Cakes
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('story-gallery-section')}
              className="hover:text-[#FBF9F6] hover:underline underline-offset-8 decoration-[#C69C53] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() =>
                setTrackerModal({ open: true, mode: 'tracker' })
              }
              className="hover:text-[#FBF9F6] hover:underline underline-offset-8 decoration-[#C69C53] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              My Orders ({orders.length})
            </button>
          </nav>

          {/* Zone 3: Search, Shopping Cart & Order Now CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                if (!searchOpen) {
                  setTimeout(() => {
                    document.getElementById('global-menu-search')?.focus();
                  }, 80);
                }
              }}
              aria-label="Search desserts"
              className="p-2.5 rounded-lg text-[#E8DDD3] hover:text-[#FBF9F6] hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/8 hover:bg-white/14 border border-white/10 text-xs sm:text-sm font-medium text-[#FBF9F6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#C69C53]" />
              <span className="font-mono-tabular">{cartCount}</span>
              {cartSubtotal > 0 && (
                <span className="hidden sm:inline text-[#D9C8B8] font-mono-tabular">
                  · ₱{cartSubtotal.toLocaleString()}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('menu-section')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B84A62] hover:bg-[#A03B52] text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Order Now</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2.5 rounded-lg text-[#E8DDD3] hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar with Voice-to-Text Craving Search */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-[#231712] px-4 sm:px-8 py-3">
            <div className="max-w-[1280px] mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-[#C69C53] shrink-0" />
              <input
                id="global-menu-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  scrollToSection('menu-section');
                }}
                placeholder="Search or speak your craving (e.g., 'show me ube cupcakes')..."
                className="w-full bg-transparent text-sm text-[#FBF9F6] placeholder-[#A69385] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#D9C8B8] hover:text-white whitespace-nowrap cursor-pointer"
                >
                  Clear
                </button>
              )}
              <VoiceSearchButton
                variant="dark"
                onVoiceResult={(parsedQuery) => {
                  setSelectedCategory('all');
                  setSearchQuery(parsedQuery);
                  scrollToSection('menu-section');
                }}
              />
            </div>
          </div>
        )}

        {/* Mobile Hamburger Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#1B120E] px-6 py-5 space-y-3">
            <div className="flex flex-col space-y-2.5 text-sm font-medium text-[#E8DDD3]">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  scrollToSection('menu-section');
                }}
                className="text-left py-1.5 hover:text-white"
              >
                Our Menu
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Cakes');
                  scrollToSection('menu-section');
                }}
                className="text-left py-1.5 hover:text-white"
              >
                Cakes
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('filipino-section')}
                className="text-left py-1.5 hover:text-white"
              >
                Desserts & Filipino Classics
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('custom-cake-section')}
                className="text-left py-1.5 hover:text-white"
              >
                Customize Your Cake
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('story-gallery-section')}
                className="text-left py-1.5 hover:text-white"
              >
                About Us & Gallery
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTrackerModal({ open: true, mode: 'tracker' });
                }}
                className="text-left py-1.5 text-[#C69C53] hover:text-white"
              >
                Track Your Order
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Cinematic Dark Warm Bakery Hero Section */}
        <section
          id="top"
          className="relative bg-[#1B120E] text-[#FBF9F6] overflow-hidden border-b border-[#2E2019]"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Editorial Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#D6C2B2]">
                  <span className="text-[#C69C53] font-medium">
                    Made with Love, Baked for Every Moment
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Fresh Makati Morning Batch</span>
                  <span aria-hidden="true">·</span>
                  <span>Same-Day Delivery</span>
                </div>

                <h1
                  className="font-serif-display text-4xl sm:text-6xl lg:text-[64px] font-semibold leading-[1.06] tracking-tight text-[#FBF9F6]"
                  style={{ textWrap: 'balance' }}
                >
                  Freshly Baked.{' '}
                  <span className="italic font-normal text-[#F2C6CF]">
                    Sweet Moments.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#D9C8B8] leading-relaxed max-w-[58ch]">
                  Cakes, muffins, cupcakes, cassava cake, brownies and more —
                  freshly made with love for every celebration and craving.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('menu-section')}
                    className="px-6 py-3.5 rounded-lg bg-[#B84A62] hover:bg-[#A03B52] text-white text-sm font-semibold transition-transform active:scale-[0.99] flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    <span>Order Now</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('bestsellers-grid')}
                    className="px-6 py-3.5 rounded-lg bg-white/8 hover:bg-white/14 border border-[#F5EBE1]/20 text-[#FBF9F6] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Explore Menu
                  </button>
                </div>

                {/* Unboxed Quantitative Proof Row */}
                <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-left">
                  <div>
                    <p className="font-mono-tabular text-lg sm:text-xl font-semibold text-[#FBF9F6]">
                      ₱85 – ₱680
                    </p>
                    <p className="text-xs text-[#B8A596] mt-0.5">
                      Daily small-batch menu
                    </p>
                  </div>
                  <div>
                    <p className="font-mono-tabular text-lg sm:text-xl font-semibold text-[#FBF9F6]">
                      GCash & Maya
                    </p>
                    <p className="text-xs text-[#B8A596] mt-0.5">
                      Plus Cash on Delivery / Pickup
                    </p>
                  </div>
                  <div>
                    <p className="font-mono-tabular text-lg sm:text-xl font-semibold text-[#FBF9F6]">
                      4.9 ★
                    </p>
                    <p className="text-xs text-[#B8A596] mt-0.5">
                      1,420+ verified celebrations
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Hero Column: Dynamic Daily Specials Carousel */}
              <div className="lg:col-span-6">
                <DailySpecialsCarousel
                  onAddSpecialToCart={handleAddSpecialToCart}
                  onQuickView={(product) => setQuickViewProduct(product)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories & Bestsellers E-Commerce Catalog */}
        <CatalogAndCategories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredProducts={filteredProducts}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onQuickView={(product) => setQuickViewProduct(product)}
          onAddToCart={handleAddToCart}
        />

        {/* Filipino Dessert Feature & Bespoke Custom Cake Studio */}
        <CustomCakeAndFilipino
          onAddToCart={handleAddToCart}
          onAddCustomCake={handleAddCustomCake}
          onQuickView={(product) => setQuickViewProduct(product)}
        />

        {/* Bakery Story, Lookbook Gallery, Attributable Reviews, Promo & Footer */}
        <StoryGalleryReviews
          onSelectCategory={setSelectedCategory}
          onOpenAdmin={() => setTrackerModal({ open: true, mode: 'admin' })}
          onOpenOrderTracker={() =>
            setTrackerModal({ open: true, mode: 'tracker' })
          }
          orders={orders}
          redeemedPoints={redeemedPoints}
          onOpenRewards={() => setRewardsModalOpen(true)}
        />
      </main>

      {/* Mobile Sticky Bottom Cart Bar (<= 15% mobile viewport height) */}
      {cartCount > 0 && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#1B120E]/95 backdrop-blur-md border-t border-white/15 px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="text-xs text-[#FBF9F6]">
            <span className="font-mono-tabular font-semibold">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
            <span className="text-[#C69C53] font-mono-tabular ml-1.5 font-semibold">
              · ₱{cartSubtotal.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#B84A62] text-white text-xs font-semibold whitespace-nowrap"
          >
            View Cart & Order
          </button>
        </div>
      )}

      {/* Product Quick View Modal (Contiguous Purchase Module PDP) */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectProduct={(product) => setQuickViewProduct(product)}
      />

      {/* Cart & Philippine Checkout Drawer */}
      <CartAndCheckoutDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Live Order Tracker & Bakery Admin Dashboard Modal */}
      <OrderTrackerAndAdminModal
        isOpen={trackerModal.open}
        initialMode={trackerModal.mode}
        onClose={() => setTrackerModal((prev) => ({ ...prev, open: false }))}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onReorderItems={handleReorderItems}
      />

      {/* Sweet Rewards Loyalty & Tier Modal */}
      <SweetRewardsModal
        isOpen={rewardsModalOpen}
        onClose={() => setRewardsModalOpen(false)}
        orders={orders}
        redeemedPoints={redeemedPoints}
        onRedeemTreat={handleRedeemTreat}
      />
    </div>
  );
}
