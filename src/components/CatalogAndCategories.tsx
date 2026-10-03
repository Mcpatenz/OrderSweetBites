import React from 'react';
import { ArrowUpRight, Heart, Star, Plus, Eye, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, Product, CategoryId } from '../data/bakeryData';
import { ResilientImage } from './ResilientImage';
import { VoiceSearchButton } from './VoiceSearchButton';

interface CatalogAndCategoriesProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  priceFilter: 'all' | 'under150' | '150to400' | 'over400';
  onPriceFilterChange: (f: 'all' | 'under150' | '150to400' | 'over400') => void;
  sortBy: 'bestsellers' | 'priceAsc' | 'priceDesc' | 'rating';
  onSortByChange: (s: 'bestsellers' | 'priceAsc' | 'priceDesc' | 'rating') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredProducts: Product[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variantIndex?: number, qty?: number) => void;
}

export const CatalogAndCategories: React.FC<CatalogAndCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  priceFilter,
  onPriceFilterChange,
  sortBy,
  onSortByChange,
  searchQuery,
  onSearchChange,
  filteredProducts,
  favorites,
  onToggleFavorite,
  onQuickView,
  onAddToCart,
}) => {
  return (
    <section id="menu-section" className="py-16 sm:py-24 bg-[#FBF9F6]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-16">
        {/* Category Showcase: Sweet Treats for Every Craving */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6DFD5] pb-6">
            <div>
              <p className="text-xs text-[#8C6D58] font-medium">
                Artisanal Patisserie Collections · Freshly Baked Daily
              </p>
              <h2
                className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#231712] mt-1"
                style={{ textWrap: 'balance' }}
              >
                Sweet Treats for Every Craving
              </h2>
            </div>
            <p className="text-sm text-[#6E5D53] max-w-md">
              Select a category below to filter our morning bake table or view all bestsellers.
            </p>
          </div>

          {/* 6 Premium Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(isSelected ? 'all' : cat.id);
                    const gridEl = document.getElementById('bestsellers-grid');
                    if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`group text-left rounded-2xl overflow-hidden bg-[#F4EFEA] border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                    isSelected
                      ? 'border-[#B84A62] ring-2 ring-[#B84A62]/20'
                      : 'border-[#E6DFD5] hover:border-[#C69C53]'
                  }`}
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-[#231712]">
                    <ResilientImage
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <h3 className="font-serif-display text-2xl font-semibold">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-[#E8DDD3] mt-0.5">
                          {cat.subtitle}
                        </p>
                      </div>
                      <span className="w-9 h-9 rounded-full bg-white/15 group-hover:bg-[#B84A62] backdrop-blur-sm flex items-center justify-center transition-colors shrink-0">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bestsellers & Interactive E-Commerce Catalog */}
        <div id="bestsellers-grid" className="space-y-8 pt-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8C6D58]">
                <span>Freshly Made, Always Delicious</span>
                <span aria-hidden="true">·</span>
                <span>Philippine Peso (₱) Pricing</span>
              </div>
              <h2
                className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#231712] mt-1"
                style={{ textWrap: 'balance' }}
              >
                Our Bestsellers & Daily Menu
              </h2>
            </div>

            {/* Interactive Segmented Category Filter Controls */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F3EFEA] rounded-xl border border-[#E6DFD5]">
              {(['all', 'Cakes', 'Cupcakes', 'Cassava Cake', 'Brownies', 'Muffins', 'Desserts'] as CategoryId[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#231712] text-[#FBF9F6] shadow-xs'
                        : 'text-[#6E5D53] hover:text-[#231712]'
                    }`}
                  >
                    {cat === 'all' ? 'All Treats' : cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Search, Price & Sort Control Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-[#F3EFEA] border border-[#E6DFD5]">
            <div className="flex items-center gap-2.5 flex-1">
              <SlidersHorizontal className="w-4 h-4 text-[#8C6D58] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search or speak a craving (e.g., 'show me ube cupcakes')..."
                className="w-full bg-white px-3.5 py-2 rounded-lg border border-[#E6DFD5] text-sm text-[#231712] placeholder-[#8C7A6E] focus:outline-none focus:border-[#B84A62]"
              />
              <VoiceSearchButton
                variant="light"
                onVoiceResult={(parsedQuery) => {
                  onSelectCategory('all');
                  onSearchChange(parsedQuery);
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Price Filter Buttons */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E6DFD5]">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under150', label: 'Under ₱150' },
                  { id: '150to400', label: '₱150–₱400' },
                  { id: 'over400', label: '₱400+' },
                ].map((pf) => (
                  <button
                    key={pf.id}
                    type="button"
                    onClick={() => onPriceFilterChange(pf.id as any)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      priceFilter === pf.id
                        ? 'bg-[#B84A62] text-white'
                        : 'text-[#6E5D53] hover:text-[#231712]'
                    }`}
                  >
                    {pf.label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as any)}
                className="bg-white px-3 py-2 rounded-lg border border-[#E6DFD5] text-xs font-medium text-[#231712] focus:outline-none focus:border-[#B84A62] cursor-pointer"
              >
                <option value="bestsellers">Sort: Bestsellers</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* 3-Column Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-[#F3EFEA] border border-[#E6DFD5] space-y-3">
              <p className="font-serif-display text-2xl text-[#231712]">
                No pastries match your current filter
              </p>
              <p className="text-sm text-[#6E5D53]">
                Try resetting the price range or searching for another treat.
              </p>
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  onPriceFilterChange('all');
                  onSearchChange('');
                }}
                className="px-4 py-2 rounded-lg bg-[#231712] text-white text-xs font-medium hover:bg-[#3A261E] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProducts.map((product) => {
                const isFav = favorites.includes(product.id);
                return (
                  <article
                    key={product.id}
                    className="group rounded-2xl bg-white border border-[#E6DFD5] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      {/* 4:3 Product Image Container */}
                      <div className="relative aspect-4/3 overflow-hidden bg-[#F4EFEA]">
                        <ResilientImage
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Favorite & Quick View Action Buttons */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onQuickView(product)}
                            aria-label={`Quick view ${product.name}`}
                            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#231712] flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleFavorite(product.id)}
                            aria-label={`Save ${product.name} to favorites`}
                            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#231712] flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isFav ? 'fill-[#B84A62] text-[#B84A62]' : 'text-[#231712]'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Card Body: Unboxed Metadata + Title + Description */}
                      <div className="p-5 space-y-2.5">
                        {/* Unboxed quiet metadata line */}
                        <div className="flex items-center justify-between text-xs text-[#7A685D]">
                          <div className="flex items-center gap-1.5">
                            <span className="uppercase tracking-wider font-medium text-[#8C6D58]">
                              {product.category}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{product.servingSize}</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono-tabular text-[#231712]">
                            <Star className="w-3.5 h-3.5 fill-[#C69C53] text-[#C69C53]" />
                            <span>{product.rating.toFixed(1)}</span>
                            <span className="text-[#8C7A6E]">({product.reviewCount})</span>
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-base font-semibold text-[#231712] group-hover:text-[#B84A62] transition-colors">
                            <button
                              type="button"
                              onClick={() => onQuickView(product)}
                              className="text-left hover:underline cursor-pointer"
                            >
                              {product.name}
                            </button>
                          </h3>
                          <span className="font-mono-tabular text-base font-semibold text-[#231712] shrink-0">
                            ₱{product.price.toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#6E5D53] line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Quick View & Add to Cart */}
                    <div className="px-5 pb-5 pt-2 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onQuickView(product)}
                        className="px-3.5 py-2.5 rounded-lg border border-[#E6DFD5] hover:border-[#231712] text-xs font-medium text-[#231712] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Quick View
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product, 0, 1)}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-[#231712] hover:bg-[#B84A62] text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart · ₱{product.price}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
