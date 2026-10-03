import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  Star,
  Truck,
  Store,
  CreditCard,
  PackageCheck,
  Plus,
  RotateCcw,
} from 'lucide-react';
import {
  PRODUCTS,
  Product,
  CartItem,
  OrderRecord,
  PaymentMethod,
  FulfilmentMode,
  OrderStatus,
} from '../data/bakeryData';
import { ResilientImage } from './ResilientImage';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variantIndex: number, qty: number) => void;
  onSelectProduct?: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onSelectProduct,
}) => {
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setVariantIdx(0);
    setQty(1);
  }, [product?.id]);

  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    const text = `${product.name} ${product.shortDescription} ${product.ingredients.join(' ')}`.toLowerCase();
    const flavorKeywords = [
      { kw: 'ube', label: 'Shared Ube Flavor' },
      { kw: 'chocolate', label: 'Shared Chocolate Profile' },
      { kw: 'tablea', label: 'Davao Tablea Pairing' },
      { kw: 'cassava', label: 'Cassava & Gata Pairing' },
      { kw: 'macapuno', label: 'Shared Macapuno Note' },
      { kw: 'strawberry', label: 'Berry Patisserie Pairing' },
      { kw: 'blueberry', label: 'Morning Berry Pairing' },
      { kw: 'coconut', label: 'Tropical Coconut Pairing' },
    ];
    const matchedFlavors = flavorKeywords.filter(({ kw }) => text.includes(kw));

    return PRODUCTS.filter((cand) => cand.id !== product.id)
      .map((cand) => {
        let score = 0;
        let reason = `Popular with ${product.category}`;
        const candText = `${cand.name} ${cand.shortDescription} ${cand.ingredients.join(' ')}`.toLowerCase();

        if (cand.category === product.category) {
          score += 4;
          reason = `More in ${product.category}`;
        }

        for (const { kw, label } of matchedFlavors) {
          if (candText.includes(kw)) {
            score += 6;
            reason = label;
            break;
          }
        }

        if (cand.isFilipinoFavorite && product.isFilipinoFavorite) {
          score += 2;
          if (reason.startsWith('Popular')) {
            reason = 'Filipino Heritage Pairing';
          }
        }
        if (cand.isBestseller) score += 1;
        return { cand, score, reason };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [product]);

  if (!product) return null;

  const selectedVariant = product.variants[variantIdx] || {
    label: product.servingSize,
    priceDelta: 0,
  };
  const unitPrice = product.price + selectedVariant.priceDelta;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#FBF9F6] border border-[#E6DFD5] shadow-2xl overflow-hidden my-8 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#231712] flex items-center justify-center shadow-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Contiguous Purchase Module (PDP) */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Sticky Gallery */}
          <div className="md:col-span-6 bg-[#231712] relative min-h-[260px] md:min-h-[420px]">
            <ResilientImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-black/65 backdrop-blur-xs text-xs text-[#F5EBE1]">
              {product.freshnessNote}
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#8C6D58]">
                <span className="uppercase tracking-wider font-semibold">
                  {product.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{product.servingSize}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono-tabular text-[#231712]">
                  <Star className="w-3.5 h-3.5 fill-[#C69C53] text-[#C69C53]" />
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif-display text-3xl font-semibold text-[#231712]">
                  {product.name}
                </h2>
                <span className="font-mono-tabular text-2xl font-semibold text-[#B84A62] shrink-0">
                  ₱{unitPrice.toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-[#5E4E45] leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Size / Box Variant Selection */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-[#231712]">
                  Select Box / Size Option:
                </label>
                <div className="space-y-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => setVariantIdx(i)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        variantIdx === i
                          ? 'border-[#B84A62] bg-[#B84A62]/8 text-[#231712]'
                          : 'border-[#E6DFD5] bg-white text-[#6E5D53] hover:text-[#231712]'
                      }`}
                    >
                      <span>{v.label}</span>
                      <span className="font-mono-tabular font-semibold text-[#231712]">
                        ₱{(product.price + v.priceDelta).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients & Allergens */}
              <div className="pt-2 border-t border-[#E6DFD5] space-y-1 text-xs text-[#6E5D53]">
                <p>
                  <strong className="text-[#231712]">Key Ingredients:</strong>{' '}
                  {product.ingredients.join(' · ')}
                </p>
                <p>
                  <strong className="text-[#231712]">Allergens:</strong>{' '}
                  {product.allergens.join(' · ')}
                </p>
              </div>
            </div>

            {/* Quantity & Primary Buy CTA */}
            <div className="pt-4 border-t border-[#E6DFD5] flex items-center gap-3">
              <div className="flex items-center border border-[#E6DFD5] rounded-xl bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-sm font-medium text-[#231712] cursor-pointer"
                >
                  −
                </button>
                <span className="px-3 font-mono-tabular text-sm font-semibold text-[#231712]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3.5 py-2.5 text-sm font-medium text-[#231712] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, variantIdx, qty);
                  onClose();
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-[#B84A62] hover:bg-[#A03B52] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Add to Order · ₱{(unitPrice * qty).toLocaleString()}
              </button>
            </div>
          </div>
        </div>

        {/* Recommended for You Section */}
        {recommendedProducts.length > 0 && (
          <div className="p-6 sm:p-8 bg-[#F3EFEA] border-t border-[#E6DFD5] space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-[#8C6D58]">
                  Curated Pairing · Matched by Flavor & Category
                </p>
                <h3 className="font-serif-display text-2xl font-semibold text-[#231712]">
                  Recommended for You
                </h3>
              </div>
              <span className="text-xs text-[#6E5D53]">
                Pairs well with {product.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedProducts.map(({ cand: rec, reason }) => (
                <div
                  key={rec.id}
                  className="rounded-xl bg-white border border-[#E6DFD5] p-3.5 flex flex-col justify-between gap-3 transition-all hover:border-[#C69C53]"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectProduct && onSelectProduct(rec)}
                      className="w-16 h-16 rounded-lg overflow-hidden bg-[#231712] shrink-0 cursor-pointer"
                    >
                      <ResilientImage
                        src={rec.image}
                        alt={rec.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-[#B84A62] truncate">
                        {reason}
                      </p>
                      <button
                        type="button"
                        onClick={() => onSelectProduct && onSelectProduct(rec)}
                        className="text-xs font-semibold text-[#231712] hover:text-[#B84A62] text-left truncate block w-full cursor-pointer mt-0.5"
                      >
                        {rec.name}
                      </button>
                      <p className="font-mono-tabular text-xs font-semibold text-[#231712] mt-0.5">
                        ₱{rec.price.toLocaleString()}{' '}
                        <span className="text-[11px] font-normal text-[#8C6D58]">
                          · ★ {rec.rating.toFixed(1)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#F3EFEA]">
                    {onSelectProduct && (
                      <button
                        type="button"
                        onClick={() => onSelectProduct(rec)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E6DFD5] hover:border-[#231712] text-[11px] font-medium text-[#231712] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Inspect
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onAddToCart(rec, 0, 1)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#231712] hover:bg-[#B84A62] text-white text-[11px] font-medium transition-colors flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add · ₱{rec.price}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onPlaceOrder: (orderData: Omit<OrderRecord, 'orderId' | 'createdAt' | 'status'>) => OrderRecord;
}

export const CartAndCheckoutDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Checkout state
  const [fulfilmentMode, setFulfilmentMode] = useState<FulfilmentMode>('Local Delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('GCash');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+63 917 ');
  const [address, setAddress] = useState('');
  const [barangayCity, setBarangayCity] = useState('Makati City');
  const [postalCode, setPostalCode] = useState('1227');
  const [scheduledDate, setScheduledDate] = useState('2026-09-29');
  const [scheduledTime, setScheduledTime] = useState('2:00 PM – 4:00 PM');
  const [dedicationNote, setDedicationNote] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const isPickup = fulfilmentMode === 'Store Pickup';
  const deliveryFee = isPickup || subtotal >= 1500 || subtotal === 0 ? 0 : 120;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'SWEET10') {
      setPromoApplied(true);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = onPlaceOrder({
      customerName: customerName.trim() || 'Valued Guest',
      phone: phone.trim() || '+63 917 000 0000',
      address: isPickup ? 'SweetBites Flagship, 118 Leviste St, Salcedo Village' : address,
      barangayCity,
      postalCode,
      fulfilmentMode,
      scheduledDate,
      scheduledTime,
      paymentMethod,
      items: [...cart],
      subtotal,
      deliveryFee,
      discount,
      total,
      dedicationNote,
    });
    setConfirmedOrder(created);
    setStep('confirmed');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
    >
      <div className="w-full max-w-lg bg-[#FBF9F6] h-full flex flex-col justify-between overflow-hidden shadow-2xl border-l border-[#E6DFD5]">
        {/* Top Drawer Header */}
        <div className="px-6 py-5 bg-[#1B120E] text-[#FBF9F6] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C69C53]" />
            <h2 className="font-serif-display text-2xl font-semibold">
              {step === 'cart' && 'Your Pastry Box'}
              {step === 'checkout' && 'Philippine Checkout'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep('cart');
              onClose();
            }}
            className="p-2 rounded-lg text-[#D9C8B8] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 'cart' && (
            <>
              {/* Free Delivery Threshold Banner */}
              <div className="p-3.5 rounded-xl bg-[#F3EFEA] border border-[#E6DFD5] text-xs text-[#5E4E45]">
                {subtotal >= 1500 ? (
                  <p className="font-medium text-[#231712]">
                    ✓ You have unlocked complimentary Metro Manila chilled delivery!
                  </p>
                ) : (
                  <p>
                    Add{' '}
                    <span className="font-mono-tabular font-semibold text-[#B84A62]">
                      ₱{(1500 - subtotal).toLocaleString()}
                    </span>{' '}
                    more for complimentary Metro Manila delivery (or choose free Store Pickup).
                  </p>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="font-serif-display text-2xl text-[#231712]">
                    Your pastry box is currently empty
                  </p>
                  <p className="text-xs text-[#6E5D53]">
                    Explore our freshly baked cakes, ube cupcakes, cassava cake, and brownies.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-4 rounded-xl bg-white border border-[#E6DFD5] flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#231712] shrink-0">
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-[#231712] truncate">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            aria-label={`Remove ${item.name}`}
                            className="text-[#8C7A6E] hover:text-[#B84A62] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#7A685D]">{item.variantLabel}</p>
                        {item.customDetails && (
                          <p className="text-[11px] text-[#8C6D58] leading-snug">
                            {item.customDetails}
                          </p>
                        )}
                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center border border-[#E6DFD5] rounded-lg bg-[#FBF9F6]">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartItemId, -1)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#231712] cursor-pointer"
                            >
                              −
                            </button>
                            <span className="px-2.5 font-mono-tabular text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartItemId, 1)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#231712] cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-mono-tabular text-sm font-semibold text-[#231712]">
                            ₱{(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (Try SWEET10)"
                      className="flex-1 px-3.5 py-2 rounded-lg border border-[#E6DFD5] bg-white text-xs text-[#231712] focus:outline-none focus:border-[#B84A62]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#231712] text-white text-xs font-medium hover:bg-[#3A261E] cursor-pointer"
                    >
                      {promoApplied ? 'Applied (10%)' : 'Apply'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-5">
              {/* Fulfilment Mode Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#231712]">
                  Fulfilment Option (Philippines)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'Local Delivery',
                      'Store Pickup',
                      'Same-Day Treats',
                      'Pre-Order',
                    ] as FulfilmentMode[]
                  ).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFulfilmentMode(mode)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        fulfilmentMode === mode
                          ? 'border-[#B84A62] bg-[#B84A62]/8 text-[#231712]'
                          : 'border-[#E6DFD5] bg-white text-[#6E5D53]'
                      }`}
                    >
                      {mode === 'Store Pickup' ? (
                        <Store className="w-3.5 h-3.5 text-[#B84A62] shrink-0" />
                      ) : (
                        <Truck className="w-3.5 h-3.5 text-[#B84A62] shrink-0" />
                      )}
                      <span>{mode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#231712]">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Maria Clara Santos"
                    className="w-full px-3 py-2 rounded-lg border border-[#E6DFD5] bg-white text-xs text-[#231712]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#231712]">
                    Mobile Number (GCash / SMS) *
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 917 555 0192"
                    className="w-full px-3 py-2 rounded-lg border border-[#E6DFD5] bg-white text-xs text-[#231712]"
                  />
                </div>
              </div>

              {/* Address if not Store Pickup */}
              {!isPickup && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[#231712]">
                      Street Address / Building / Unit *
                    </label>
                    <input
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Unit 14A The Residences at Greenbelt, Esperanza St."
                      className="w-full px-3 py-2 rounded-lg border border-[#E6DFD5] bg-white text-xs text-[#231712]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-[#231712]">
                        Barangay & City *
                      </label>
                      <input
                        required
                        type="text"
                        value={barangayCity}
                        onChange={(e) => setBarangayCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E6DFD5] bg-white text-xs text-[#231712]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-[#231712]">
                        Postal Code *
                      </label>
                      <input
                        required
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E6DFD5] bg-white text-xs text-[#231712]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Time Window */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#231712]">
                    Order Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E6DFD5] bg-white text-xs text-[#231712]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#231712]">
                    Time Window
                  </label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E6DFD5] bg-white text-xs text-[#231712]"
                  >
                    <option>9:00 AM – 11:00 AM</option>
                    <option>11:00 AM – 1:00 PM</option>
                    <option>2:00 PM – 4:00 PM</option>
                    <option>4:00 PM – 6:00 PM</option>
                    <option>6:00 PM – 8:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#231712]">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'GCash',
                      'Maya',
                      'Cash on Delivery',
                      'Cash on Pickup',
                    ] as PaymentMethod[]
                  ).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        paymentMethod === pm
                          ? 'border-[#B84A62] bg-[#B84A62]/8 text-[#231712]'
                          : 'border-[#E6DFD5] bg-white text-[#6E5D53]'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#B84A62] shrink-0" />
                      <span>{pm}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gift / Card Note */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#231712]">
                  Complimentary Gift Card Note (Optional)
                </label>
                <input
                  type="text"
                  value={dedicationNote}
                  onChange={(e) => setDedicationNote(e.target.value)}
                  placeholder="Write a warm note to accompany your pastry box..."
                  className="w-full px-3 py-2 rounded-lg border border-[#E6DFD5] bg-white text-xs text-[#231712]"
                />
              </div>
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="p-5 rounded-2xl bg-white border border-[#E6DFD5] space-y-5">
              <div className="flex items-center gap-3 text-[#231712]">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 shrink-0" />
                <div>
                  <p className="text-xs text-[#8C6D58]">
                    Thank you, {confirmedOrder.customerName}
                  </p>
                  <h3 className="font-serif-display text-2xl font-semibold">
                    Order #{confirmedOrder.orderId} Confirmed
                  </h3>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F3EFEA] text-xs space-y-1.5 text-[#5E4E45]">
                <p>
                  <strong className="text-[#231712]">Status:</strong>{' '}
                  {confirmedOrder.status} — Sent to Makati Deck Ovens
                </p>
                <p>
                  <strong className="text-[#231712]">Fulfilment:</strong>{' '}
                  {confirmedOrder.fulfilmentMode} ({confirmedOrder.scheduledDate},{' '}
                  {confirmedOrder.scheduledTime})
                </p>
                <p>
                  <strong className="text-[#231712]">Payment:</strong>{' '}
                  {confirmedOrder.paymentMethod} · Total Paid/Due:{' '}
                  <span className="font-mono-tabular font-semibold text-[#231712]">
                    ₱{confirmedOrder.total.toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-[#231712]">Items in Your Box:</p>
                {confirmedOrder.items.map((it) => (
                  <div
                    key={it.cartItemId}
                    className="flex justify-between py-1 border-b border-[#F3EFEA]"
                  >
                    <span>
                      {it.quantity}× {it.name} ({it.variantLabel})
                    </span>
                    <span className="font-mono-tabular font-medium">
                      ₱{(it.unitPrice * itemQty(it)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 bg-white border-t border-[#E6DFD5] space-y-4">
          {step !== 'confirmed' && cart.length > 0 && (
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6E5D53]">
                <span>Subtotal</span>
                <span className="font-mono-tabular">₱{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>SWEET10 Discount (10%)</span>
                  <span className="font-mono-tabular">−₱{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6E5D53]">
                <span>{isPickup ? 'Store Pickup (Makati)' : 'Chilled Delivery'}</span>
                <span className="font-mono-tabular">
                  {deliveryFee === 0 ? 'FREE' : `₱${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#231712] pt-2 border-t border-[#E6DFD5]">
                <span>Total (PHP)</span>
                <span className="font-mono-tabular text-base text-[#B84A62]">
                  ₱{total.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {step === 'cart' && cart.length > 0 && (
            <button
              type="button"
              onClick={() => setStep('checkout')}
              className="w-full py-3.5 px-5 rounded-xl bg-[#B84A62] hover:bg-[#A03B52] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Proceed to Checkout · ₱{total.toLocaleString()}
            </button>
          )}

          {step === 'checkout' && (
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="px-4 py-3 rounded-xl border border-[#E6DFD5] text-xs font-medium text-[#231712] cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                form="checkout-form"
                className="flex-1 py-3.5 px-5 rounded-xl bg-[#231712] hover:bg-[#B84A62] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Confirm Order ({paymentMethod}) · ₱{total.toLocaleString()}
              </button>
            </div>
          )}

          {step === 'confirmed' && (
            <button
              type="button"
              onClick={() => {
                setStep('cart');
                onClose();
              }}
              className="w-full py-3 px-5 rounded-xl bg-[#231712] text-white text-xs font-semibold cursor-pointer"
            >
              Continue Exploring SweetBites
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function itemQty(it: CartItem) {
  return it.quantity;
}

interface OrderTrackerAndAdminModalProps {
  isOpen: boolean;
  initialMode: 'tracker' | 'admin';
  onClose: () => void;
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onReorderItems?: (items: CartItem[]) => void;
}

export const OrderTrackerAndAdminModal: React.FC<OrderTrackerAndAdminModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  orders,
  onUpdateOrderStatus,
  onReorderItems,
}) => {
  const [mode, setMode] = useState<'tracker' | 'admin'>(initialMode);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const statuses: OrderStatus[] = [
    'Order Confirmed',
    'Baking in Oven',
    'Frosting & Packaging',
    'Out for Delivery',
    'Completed',
  ];

  const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);
  const completedCount = orders.filter((o) => o.status === 'Completed').length;
  const activeCount = orders.length - completedCount;
  const totalItemsPurchased = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'active' && ord.status === 'Completed') return false;
    if (statusFilter === 'completed' && ord.status !== 'Completed') return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = ord.orderId.toLowerCase().includes(q);
      const matchCustomer = ord.customerName.toLowerCase().includes(q);
      const matchItems = ord.items.some((i) => i.name.toLowerCase().includes(q));
      if (!matchId && !matchCustomer && !matchItems) return false;
    }
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="My Orders History, Live Tracker and Bakery Admin"
    >
      <div className="w-full max-w-4xl rounded-2xl bg-[#FBF9F6] border border-[#E6DFD5] shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#1B120E] text-[#FBF9F6] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PackageCheck className="w-5 h-5 text-[#C69C53]" />
            <div>
              <h2 className="font-serif-display text-2xl font-semibold">
                {mode === 'tracker'
                  ? 'My Orders & Purchase History'
                  : 'SweetBites Kitchen & Order Admin'}
              </h2>
              <p className="text-xs text-[#D9C8B8]">
                {mode === 'tracker'
                  ? 'Review your past bakery purchases, live order statuses, and total spent'
                  : 'Manage live Makati oven queue and update customer order stages'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'tracker' ? 'admin' : 'tracker')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-[#F5EBE1] cursor-pointer"
            >
              Switch to {mode === 'tracker' ? 'Kitchen Admin' : 'My Orders View'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#D9C8B8] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* My Orders Summary & Total Spent Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F3EFEA] border border-[#E6DFD5]">
            <div>
              <p className="text-xs text-[#7A685D]">
                {mode === 'tracker' ? 'Total Spent (PHP)' : 'Total Revenue (PHP)'}
              </p>
              <p className="font-mono-tabular text-2xl font-semibold text-[#B84A62] mt-0.5">
                ₱{totalSpent.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#7A685D]">Past Purchases</p>
              <p className="font-mono-tabular text-2xl font-semibold text-[#231712] mt-0.5">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#7A685D]">Order Status Breakdown</p>
              <p className="font-mono-tabular text-sm font-semibold text-[#231712] mt-1.5">
                {activeCount} Active · {completedCount} Completed
              </p>
            </div>
            <div>
              <p className="text-xs text-[#7A685D]">
                {mode === 'tracker' ? 'Treats Purchased' : 'Kitchen Queue'}
              </p>
              <p className="font-mono-tabular text-sm font-semibold text-emerald-800 mt-1.5">
                {mode === 'tracker'
                  ? `${totalItemsPurchased} Artisanal Boxes`
                  : 'Makati Ovens Active'}
              </p>
            </div>
          </div>

          {/* My Orders Filter & Search Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F3EFEA] border border-[#E6DFD5] self-start">
              {(
                [
                  { id: 'all', label: `All Orders (${orders.length})` },
                  { id: 'active', label: `In Progress (${activeCount})` },
                  { id: 'completed', label: `Completed (${completedCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-[#231712] text-white'
                      : 'text-[#6E5D53] hover:text-[#231712]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Filter by Order # or dessert name..."
              className="px-3.5 py-2 rounded-xl border border-[#E6DFD5] bg-white text-xs text-[#231712] focus:outline-none focus:border-[#B84A62] sm:w-64"
            />
          </div>

          {/* My Orders Purchase History List */}
          {filteredOrders.length === 0 ? (
            <div className="p-8 rounded-xl bg-white border border-[#E6DFD5] text-center space-y-2">
              <p className="font-serif-display text-xl text-[#231712]">
                No matching orders found
              </p>
              <p className="text-xs text-[#7A685D]">
                Try switching the status filter or clearing your search query.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => {
                const isCompleted = ord.status === 'Completed';
                return (
                  <div
                    key={ord.orderId}
                    className="p-5 rounded-xl bg-white border border-[#E6DFD5] space-y-4 shadow-2xs"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3EFEA] pb-3">
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-tabular text-sm font-bold text-[#231712]">
                            Order #{ord.orderId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                              isCompleted
                                ? 'bg-emerald-950/10 text-emerald-800'
                                : 'bg-[#B84A62]/12 text-[#B84A62]'
                            }`}
                          >
                            {ord.status}
                          </span>
                          <span className="text-xs text-[#8C6D58]">
                            · Placed {ord.createdAt}
                          </span>
                        </div>
                        <p className="text-xs text-[#7A685D]">
                          {ord.customerName} · {ord.fulfilmentMode} ({ord.paymentMethod}) ·{' '}
                          {ord.scheduledDate} ({ord.scheduledTime})
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] text-[#8C6D58]">Order Total</p>
                        <p className="font-mono-tabular text-base font-semibold text-[#B84A62]">
                          ₱{ord.total.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Itemized Past Purchase Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ord.items.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="p-2.5 rounded-lg bg-[#FBF9F6] border border-[#E6DFD5] flex items-center gap-3"
                        >
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-[#231712] shrink-0">
                            <ResilientImage
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#231712] truncate">
                              {item.quantity}× {item.name}
                            </p>
                            <p className="text-[11px] text-[#7A685D] truncate">
                              {item.variantLabel}
                            </p>
                          </div>
                          <span className="font-mono-tabular text-xs font-semibold text-[#231712] shrink-0">
                            ₱{(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Address & Dedication Details */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5E4E45]">
                      <p>
                        <strong className="text-[#231712]">Destination:</strong>{' '}
                        {ord.address}, {ord.barangayCity}
                        {ord.dedicationNote ? ` · Note: "${ord.dedicationNote}"` : ''}
                      </p>

                      {onReorderItems && (
                        <button
                          type="button"
                          onClick={() => {
                            onReorderItems(ord.items);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6DFD5] hover:border-[#B84A62] text-xs font-semibold text-[#231712] hover:text-[#B84A62] transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Order Again</span>
                        </button>
                      )}
                    </div>

                    {/* Live Progress Steps */}
                    <div className="pt-2 border-t border-[#F3EFEA] flex flex-wrap items-center gap-2">
                      {statuses.map((st) => {
                        const isCurrent = ord.status === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            disabled={mode !== 'admin'}
                            onClick={() => onUpdateOrderStatus(ord.orderId, st)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              isCurrent
                                ? 'bg-[#231712] text-white'
                                : 'bg-[#F3EFEA] text-[#7A685D]'
                            } ${mode === 'admin' ? 'hover:border-[#B84A62] cursor-pointer' : ''}`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
