export type CategoryId =
  | 'all'
  | 'Cakes'
  | 'Muffins'
  | 'Cupcakes'
  | 'Cassava Cake'
  | 'Brownies'
  | 'Desserts';

export interface Product {
  id: string;
  name: string;
  category: Exclude<CategoryId, 'all'>;
  price: number;
  servingSize: string;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isFilipinoFavorite?: boolean;
  statusTag?: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  allergens: string[];
  freshnessNote: string;
  variants: { label: string; priceDelta: number }[];
}

export interface CategoryInfo {
  id: Exclude<CategoryId, 'all'>;
  name: string;
  subtitle: string;
  itemCount: number;
  image: string;
}

export interface CustomCakeConfig {
  occasion: string;
  size: string;
  sizePrice: number;
  flavor: string;
  flavorPrice: number;
  frosting: string;
  frostingPrice: number;
  design: string;
  designPrice: number;
  message: string;
  quantity: number;
  eventDate: string;
  notes: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
  image: string;
  variantLabel: string;
  customDetails?: string;
}

export type PaymentMethod = 'GCash' | 'Maya' | 'Cash on Delivery' | 'Cash on Pickup';
export type FulfilmentMode = 'Local Delivery' | 'Store Pickup' | 'Same-Day Treats' | 'Pre-Order';
export type OrderStatus = 'Order Confirmed' | 'Baking in Oven' | 'Frosting & Packaging' | 'Out for Delivery' | 'Completed';

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  barangayCity: string;
  postalCode: string;
  fulfilmentMode: FulfilmentMode;
  scheduledDate: string;
  scheduledTime: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  dedicationNote?: string;
}

export const IMAGES = {
  heroSpread: '/src/assets/images/hero_bakery_spread_1790692070071.jpg',
  chocolateDripCake: '/src/assets/images/chocolate_drip_cake_1790692086542.jpg',
  ubeCupcakes: '/src/assets/images/ube_cupcakes_1790692102423.jpg',
  cassavaCake: '/src/assets/images/cassava_cake_1790692114176.jpg',
  fudgyBrownies: '/src/assets/images/fudgy_brownies_1790692128661.jpg',
  customCelebrationCake: '/src/assets/images/custom_celebration_cake_1790692140804.jpg',
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'Cakes',
    name: 'Cakes',
    subtitle: 'Custom cakes and celebration cakes',
    itemCount: 4,
    image: IMAGES.chocolateDripCake,
  },
  {
    id: 'Muffins',
    name: 'Muffins',
    subtitle: 'Soft, fluffy and freshly baked',
    itemCount: 2,
    image: IMAGES.heroSpread,
  },
  {
    id: 'Cupcakes',
    name: 'Cupcakes',
    subtitle: 'Little bites of happiness',
    itemCount: 2,
    image: IMAGES.ubeCupcakes,
  },
  {
    id: 'Cassava Cake',
    name: 'Cassava Cake',
    subtitle: 'Classic Filipino favorite',
    itemCount: 2,
    image: IMAGES.cassavaCake,
  },
  {
    id: 'Brownies',
    name: 'Brownies',
    subtitle: 'Rich, fudgy and chocolatey',
    itemCount: 2,
    image: IMAGES.fudgyBrownies,
  },
  {
    id: 'Desserts',
    name: 'Desserts',
    subtitle: 'Sweet treats for every mood',
    itemCount: 3,
    image: IMAGES.customCelebrationCake,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-choc-drip',
    name: 'Chocolate Drip Cake',
    category: 'Cakes',
    price: 650,
    servingSize: '8–10 slices',
    rating: 4.9,
    reviewCount: 142,
    isBestseller: true,
    statusTag: 'Signature Bake',
    image: IMAGES.chocolateDripCake,
    shortDescription: 'Three layers of moist dark tablea-infused sponge crowned with Belgian chocolate ganache drip and truffles.',
    fullDescription: 'Crafted with 70% Belgian dark couverture and Davao single-origin cacao tablea. Layered with silky dark chocolate mousse, draped in a glossy mirror ganache drip, and finished with hand-rolled truffles and 24k edible gold leaf.',
    ingredients: ['70% Belgian Dark Chocolate', 'Davao Tablea Cacao', 'French Cultured Butter', 'Free-Range Eggs', 'Madagascar Vanilla'],
    allergens: ['Dairy', 'Eggs', 'Wheat', 'Soy'],
    freshnessNote: 'Baked fresh every morning at 5:00 AM. Best enjoyed at cool room temperature.',
    variants: [
      { label: '6" Classic Round (8–10 pax)', priceDelta: 0 },
      { label: '8" Celebration Round (14–16 pax)', priceDelta: 350 },
      { label: '10" Grand Party Size (22–25 pax)', priceDelta: 750 },
    ],
  },
  {
    id: 'prod-ube-cupcakes',
    name: 'Ube Cupcakes',
    category: 'Cupcakes',
    price: 120,
    servingSize: 'Box of 4',
    rating: 4.9,
    reviewCount: 98,
    isBestseller: true,
    isFilipinoFavorite: true,
    statusTag: 'Filipino Heritage',
    image: IMAGES.ubeCupcakes,
    shortDescription: 'Pillow-soft Bohol purple yam sponge piped with halaya Swiss meringue buttercream and macapuno strings.',
    fullDescription: 'Our beloved Filipino classic elevated to patisserie standards. Each cupcake is folded with slow-simmered Bohol ube halaya, filled with young coconut macapuno preserve, and crowned with whipped ube Swiss meringue.',
    ingredients: ['Bohol Purple Yam (Ube Halaya)', 'Sweetened Macapuno', 'Coconut Cream', 'Cultured Butter', 'Cake Flour'],
    allergens: ['Dairy', 'Eggs', 'Wheat', 'Coconut'],
    freshnessNote: 'Prepared in small batches throughout the day.',
    variants: [
      { label: 'Solo Petite Box (4 pcs)', priceDelta: 0 },
      { label: 'Sharing Box (6 pcs)', priceDelta: 55 },
      { label: 'Celebration Dozen (12 pcs)', priceDelta: 190 },
    ],
  },
  {
    id: 'prod-classic-brownies',
    name: 'Classic Brownies',
    category: 'Brownies',
    price: 180,
    servingSize: 'Box of 6 squares',
    rating: 4.8,
    reviewCount: 116,
    isBestseller: true,
    isFilipinoFavorite: true,
    statusTag: 'Fudgy Batch',
    image: IMAGES.fudgyBrownies,
    shortDescription: 'Crackly meringue-like top with a dense, fudgy dark chocolate center and Pangasinan sea salt flakes.',
    fullDescription: 'Baked with browned French butter, roasted cacao nibs, and dark chocolate chunks. Every square delivers a delicate crackled top, an intensely fudgy interior, and a whisper of artisanal Pangasinan sea salt.',
    ingredients: ['Dark Couverture Chunks', 'Browned Butter', 'Muscovado Sugar', 'Roasted Cacao Nibs', 'Artisanal Sea Salt'],
    allergens: ['Dairy', 'Eggs', 'Wheat'],
    freshnessNote: 'Keeps fresh for 5 days sealed; warm for 12 seconds before serving.',
    variants: [
      { label: 'Box of 6 Squares', priceDelta: 0 },
      { label: 'Box of 12 Party Squares', priceDelta: 150 },
      { label: 'Walnut & Espresso Upgrade (6 pcs)', priceDelta: 45 },
    ],
  },
  {
    id: 'prod-cassava-cake',
    name: 'Cassava Cake',
    category: 'Cassava Cake',
    price: 85,
    servingSize: 'Solo platter (3 slices)',
    rating: 5.0,
    reviewCount: 164,
    isBestseller: true,
    isFilipinoFavorite: true,
    statusTag: 'House Favorite',
    image: IMAGES.cassavaCake,
    shortDescription: 'Traditional grated fresh cassava slow-baked with coconut milk and broiled with golden macapuno custard.',
    fullDescription: 'An heirloom Tagaytay family recipe made with freshly grated cassava root, rich gata (first-press coconut cream), condensed milk, and a torched golden custard crown studded with tender macapuno.',
    ingredients: ['Fresh Grated Cassava', 'First-Press Coconut Milk', 'Egg Yolks', 'Macapuno Strings', 'Aged Queso de Bola'],
    allergens: ['Dairy', 'Eggs', 'Coconut'],
    freshnessNote: 'Naturally gluten-free. Freshly broiled to a caramelized golden finish.',
    variants: [
      { label: 'Merienda Pack (3 slices)', priceDelta: 0 },
      { label: 'Family Bilao Tray (9" Round)', priceDelta: 210 },
      { label: 'Fiesta Grand Bilao (12" Round)', priceDelta: 390 },
    ],
  },
  {
    id: 'prod-blueberry-muffins',
    name: 'Blueberry Muffins',
    category: 'Muffins',
    price: 95,
    servingSize: 'Pair (2 large muffins)',
    rating: 4.8,
    reviewCount: 79,
    isBestseller: true,
    statusTag: 'Morning Bake',
    image: IMAGES.heroSpread,
    shortDescription: 'High-domed buttermilk crumb bursting with wild blueberries and topped with cinnamon streusel crunch.',
    fullDescription: 'Golden, bakery-style domed muffins leavened with tangy cultured buttermilk and lemon zest, folded with whole wild blueberries and finished with a crisp brown-butter oat streusel.',
    ingredients: ['Wild Blueberries', 'Cultured Buttermilk', 'Lemon Zest', 'Brown Butter Streusel', 'Organic Honey'],
    allergens: ['Dairy', 'Eggs', 'Wheat'],
    freshnessNote: 'Out of the oven at 6:30 AM daily.',
    variants: [
      { label: 'Duo Box (2 Large Muffins)', priceDelta: 0 },
      { label: 'Breakfast Box (4 Large Muffins)', priceDelta: 85 },
      { label: 'Café Assorted Box (6 Muffins)', priceDelta: 165 },
    ],
  },
  {
    id: 'prod-dessert-cups',
    name: 'Tres Leches & Leche Flan Cups',
    category: 'Desserts',
    price: 110,
    servingSize: 'Single layered jar (220ml)',
    rating: 4.9,
    reviewCount: 87,
    isBestseller: true,
    isFilipinoFavorite: true,
    statusTag: 'Chilled Treat',
    image: IMAGES.customCelebrationCake,
    shortDescription: 'Layered vanilla chiffon soaked in three milks, crowned with silky caramel leche flan and toasted pinipig.',
    fullDescription: 'Our signature chilled dessert cup layers featherlight sponge soaked in carabao milk tres leches, whipped mascarpone cream, and a whole medallion of slow-steamed traditional leche flan with crisp pinipig crunch.',
    ingredients: ['Carabao Milk', 'Egg Yolk Leche Flan', 'Mascarpone Cream', 'Toasted Pinipig', 'Dayap Citrus Zest'],
    allergens: ['Dairy', 'Eggs', 'Wheat'],
    freshnessNote: 'Served chilled in reusable glass patisserie jars.',
    variants: [
      { label: 'Single Patisserie Cup', priceDelta: 0 },
      { label: 'Tasting Trio (Ube, Leche Flan, Mocha)', priceDelta: 195 },
      { label: 'Party Pack (6 Layered Cups)', priceDelta: 490 },
    ],
  },
  {
    id: 'prod-ube-macapuno-cake',
    name: 'Royal Ube Macapuno Cake',
    category: 'Cakes',
    price: 590,
    servingSize: '8 slices',
    rating: 4.9,
    reviewCount: 108,
    isFilipinoFavorite: true,
    statusTag: 'Filipino Classic',
    image: IMAGES.ubeCupcakes,
    shortDescription: 'Velvety purple yam chiffon layered with housemade halaya jam, young coconut cream, and white chocolate.',
    fullDescription: 'Made with 100% real purple yam from Bohol and Laguna macapuno preserves. Three airy chiffon layers embrace rich halaya custard and lightly sweetened chantilly cream.',
    ingredients: ['Bohol Ube Halaya', 'Laguna Macapuno', 'Chantilly Cream', 'Free-Range Egg Whites', 'Pure Vanilla'],
    allergens: ['Dairy', 'Eggs', 'Wheat', 'Coconut'],
    freshnessNote: 'Available for same-day delivery across Metro Manila.',
    variants: [
      { label: '6" Round (8 slices)', priceDelta: 0 },
      { label: '8" Round (14 slices)', priceDelta: 320 },
    ],
  },
  {
    id: 'prod-strawberry-shortcake',
    name: 'Baguio Strawberry Chantilly Cake',
    category: 'Cakes',
    price: 680,
    servingSize: '8–10 slices',
    rating: 4.9,
    reviewCount: 94,
    statusTag: 'Seasonal Harvest',
    image: IMAGES.customCelebrationCake,
    shortDescription: 'Light Japanese-style sponge layered with fresh Highland strawberries and Madagascar vanilla bean cream.',
    fullDescription: 'Inspired by cool Baguio mornings. Featherlight sponge brushed with elderflower syrup, stacked with ruby-red highland strawberries and airy mascarpone chantilly.',
    ingredients: ['Highland Strawberries', 'Mascarpone Cheese', 'Heavy Whipping Cream', 'Elderflower Syrup', 'Pastry Flour'],
    allergens: ['Dairy', 'Eggs', 'Wheat'],
    freshnessNote: 'Keep refrigerated at 4°C.',
    variants: [
      { label: '6" Round (8–10 pax)', priceDelta: 0 },
      { label: '8" Round (14–16 pax)', priceDelta: 380 },
    ],
  },
  {
    id: 'prod-tablea-brownies',
    name: 'Filipino Tablea & Dulce Brownies',
    category: 'Brownies',
    price: 195,
    servingSize: 'Box of 6 squares',
    rating: 4.9,
    reviewCount: 73,
    isFilipinoFavorite: true,
    statusTag: 'Single Origin',
    image: IMAGES.fudgyBrownies,
    shortDescription: 'Roasted Davao cacao tablea brownies marbled with caramelized carabao milk dulce de leche.',
    fullDescription: 'A celebration of Philippine cacao heritage. Stone-ground Davao tablea folded into rich dark batter and swirled with ribbons of slow-cooked carabao milk dulce de leche.',
    ingredients: ['Stone-Ground Davao Tablea', 'Carabao Milk Dulce de Leche', 'Cultured Butter', 'Muscovado Sugar'],
    allergens: ['Dairy', 'Eggs', 'Wheat'],
    freshnessNote: 'Baked fresh daily in small artisanal trays.',
    variants: [
      { label: 'Box of 6 Squares', priceDelta: 0 },
      { label: 'Gift Tin of 12 Squares', priceDelta: 175 },
    ],
  },
  {
    id: 'prod-buko-pandan-cup',
    name: 'Artisanal Buko Pandan Panna Cotta',
    category: 'Desserts',
    price: 115,
    servingSize: 'Single jar (220ml)',
    rating: 4.8,
    reviewCount: 64,
    isFilipinoFavorite: true,
    statusTag: 'Tropical Craft',
    image: IMAGES.cassavaCake,
    shortDescription: 'Fragrant screwpine pandan cream panna cotta topped with young coconut strips, sago pearls, and pinipig.',
    fullDescription: 'Freshly extracted pandan leaf essence infused into silky coconut cream panna cotta, layered with tender young buko strips, translucent sago pearls, and toasted green pinipig.',
    ingredients: ['Fresh Pandan Leaf Extract', 'Young Coconut Meat', 'Coconut Cream', 'Sago Pearls', 'Toasted Pinipig'],
    allergens: ['Dairy', 'Coconut'],
    freshnessNote: 'Gluten-free and served chilled.',
    variants: [
      { label: 'Single Jar (220ml)', priceDelta: 0 },
      { label: 'Box of 4 Jars', priceDelta: 310 },
    ],
  },
  {
    id: 'prod-choc-truffle-cupcakes',
    name: 'Belgian Chocolate & Salted Caramel Cupcakes',
    category: 'Cupcakes',
    price: 135,
    servingSize: 'Box of 4',
    rating: 4.9,
    reviewCount: 84,
    statusTag: 'Patisserie Selection',
    image: IMAGES.chocolateDripCake,
    shortDescription: 'Moist dark tablea cocoa cupcakes cored with Pangasinan salted caramel and whipped chocolate ganache.',
    fullDescription: 'Baked with single-origin Davao cocoa and filled with house-cooked Pangasinan sea salt caramel, finished with a tall rosette of whipped 70% Belgian dark chocolate ganache.',
    ingredients: ['70% Belgian Dark Chocolate', 'Davao Cocoa', 'Salted Caramel Core', 'Cultured Butter', 'Free-Range Eggs'],
    allergens: ['Dairy', 'Eggs', 'Wheat'],
    freshnessNote: 'Piped fresh to order every morning.',
    variants: [
      { label: 'Solo Petite Box (4 pcs)', priceDelta: 0 },
      { label: 'Sharing Box (6 pcs)', priceDelta: 60 },
      { label: 'Celebration Dozen (12 pcs)', priceDelta: 210 },
    ],
  },
];

export const CUSTOM_CAKE_OPTIONS = {
  occasions: ['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Special Events'],
  sizes: [
    { label: '6" Petite Celebration (8–10 servings)', price: 1250 },
    { label: '8" Classic Gathering (15–18 servings)', price: 1750 },
    { label: '10" Grand Banquet (25–30 servings)', price: 2450 },
    { label: 'Two-Tier Bespoke (45–50 servings)', price: 4200 },
  ],
  flavors: [
    { label: '70% Belgian Dark Chocolate & Tablea', price: 0 },
    { label: 'Real Bohol Ube Halaya & Macapuno', price: 150 },
    { label: 'Madagascar Vanilla Bean & Berry Compote', price: 100 },
    { label: 'Roasted Espresso & Salted Caramel', price: 150 },
    { label: 'Lemon Elderflower & Mascarpone', price: 180 },
  ],
  frostings: [
    { label: 'Silky Swiss Meringue Buttercream', price: 0 },
    { label: 'Dark Chocolate Mirror Ganache Drip', price: 180 },
    { label: 'Whipped Ube Chantilly Cream', price: 140 },
    { label: 'Tangy Madagascar Vanilla Cream Cheese', price: 160 },
  ],
  designs: [
    { label: 'Minimalist Patisserie & 24k Gold Leaf', price: 0 },
    { label: 'Vintage Lambeth Ribbon Piping', price: 250 },
    { label: 'Fresh Highland Berry & Fig Crown', price: 320 },
    { label: 'Pressed Edible Botanicals & Rose Accent', price: 280 },
  ],
};

export const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'Belgian Dark Chocolate Drip Cake',
    category: 'Cakes',
    caption: 'Hand-tempered 70% dark chocolate ganache with gold leaf',
    image: IMAGES.chocolateDripCake,
    aspect: 'tall',
  },
  {
    id: 'gal-2',
    title: 'Bohol Ube & Macapuno Cupcakes',
    category: 'Cupcakes',
    caption: 'Swirled with real purple yam halaya buttercream',
    image: IMAGES.ubeCupcakes,
    aspect: 'square',
  },
  {
    id: 'gal-3',
    title: 'Golden Macapuno Cassava Squares',
    category: 'Cassava Cake',
    caption: 'Torched custard crown over slow-baked grated cassava',
    image: IMAGES.cassavaCake,
    aspect: 'square',
  },
  {
    id: 'gal-4',
    title: 'Two-Tier Blush Rose Wedding Cake',
    category: 'Custom Cakes',
    caption: 'Bespoke Swiss meringue piping with fresh berries',
    image: IMAGES.customCelebrationCake,
    aspect: 'tall',
  },
  {
    id: 'gal-5',
    title: 'Davao Tablea Sea Salt Brownies',
    category: 'Brownies',
    caption: 'Fudgy center with glossy crackled crust',
    image: IMAGES.fudgyBrownies,
    aspect: 'square',
  },
  {
    id: 'gal-6',
    title: 'Morning Harvest Patisserie Table',
    category: 'Behind the Scenes',
    caption: 'Fresh out of our Makati flagship deck ovens at dawn',
    image: IMAGES.heroSpread,
    aspect: 'wide',
  },
];

export const TESTIMONIALS = [
  {
    id: 'rev-1',
    name: 'Camille Villanueva-Santos',
    role: 'Bride & Event Stylist',
    location: 'Salcedo Village, Makati',
    rating: 5,
    productOrdered: 'Two-Tier Bespoke Celebration Cake & Ube Cupcake Tower',
    quote: 'Absolutely delicious! The cake looked like a piece of sculpture and tasted even better. Our wedding guests finished every single slice of the Bohol Ube and Belgian Chocolate tiers within twenty minutes.',
  },
  {
    id: 'rev-2',
    name: 'Marco Antonio Reyes',
    role: 'Executive Chef & Food Columnist',
    location: 'Bonifacio Global City, Taguig',
    rating: 5,
    productOrdered: 'Golden Cassava Cake Bilao & Davao Tablea Brownies',
    quote: 'Finding a cassava cake that balances real grated root texture with a properly caramelized macapuno custard top is rare. SweetBites nails the heritage flavor while presenting it like a Parisian patisserie.',
  },
  {
    id: 'rev-3',
    name: 'Dr. Patricia Lim-Chua',
    role: 'Pediatrician & Mother of Three',
    location: 'Alabang, Muntinlupa',
    rating: 5,
    productOrdered: 'Custom 8" Birthday Cake & Blueberry Muffin Box',
    quote: 'We ordered at 9:00 AM via GCash for my daughter’s birthday dinner and the cake arrived chilled in pristine condition. Not overly sweet, rich buttercream, and the custom dedication plaque was flawless.',
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    orderId: 'SB-1042',
    createdAt: '2026-09-29 08:15 AM',
    customerName: 'Camille Villanueva',
    phone: '+63 917 842 9910',
    address: 'Unit 18B One Roxas Triangle, Paseo de Roxas',
    barangayCity: 'Bel-Air, Makati City',
    postalCode: '1209',
    fulfilmentMode: 'Same-Day Treats',
    scheduledDate: '2026-09-29',
    scheduledTime: '2:00 PM – 4:00 PM',
    paymentMethod: 'GCash',
    items: [
      {
        cartItemId: 'seed-1',
        productId: 'prod-choc-drip',
        name: 'Chocolate Drip Cake',
        category: 'Cakes',
        unitPrice: 650,
        quantity: 1,
        image: IMAGES.chocolateDripCake,
        variantLabel: '6" Classic Round (8–10 pax)',
      },
      {
        cartItemId: 'seed-2',
        productId: 'prod-cassava-cake',
        name: 'Cassava Cake',
        category: 'Cassava Cake',
        unitPrice: 295,
        quantity: 1,
        image: IMAGES.cassavaCake,
        variantLabel: 'Family Bilao Tray (9" Round)',
      },
    ],
    subtotal: 945,
    deliveryFee: 120,
    discount: 0,
    total: 1065,
    status: 'Frosting & Packaging',
    dedicationNote: 'Happy Anniversary Mahal!',
  },
  {
    orderId: 'SB-0988',
    createdAt: '2026-09-18 03:40 PM',
    customerName: 'Camille Villanueva',
    phone: '+63 917 842 9910',
    address: 'SweetBites Flagship, 118 Leviste St, Salcedo Village',
    barangayCity: 'Salcedo Village, Makati City',
    postalCode: '1227',
    fulfilmentMode: 'Store Pickup',
    scheduledDate: '2026-09-18',
    scheduledTime: '4:00 PM – 6:00 PM',
    paymentMethod: 'Maya',
    items: [
      {
        cartItemId: 'seed-3',
        productId: 'prod-ube-macapuno-cake',
        name: 'Royal Ube Macapuno Cake',
        category: 'Cakes',
        unitPrice: 590,
        quantity: 1,
        image: IMAGES.ubeCupcakes,
        variantLabel: '6" Round (8 slices)',
      },
      {
        cartItemId: 'seed-4',
        productId: 'prod-ube-cupcakes',
        name: 'Ube Cupcakes',
        category: 'Cupcakes',
        unitPrice: 175,
        quantity: 2,
        image: IMAGES.ubeCupcakes,
        variantLabel: 'Sharing Box (6 pcs)',
      },
    ],
    subtotal: 940,
    deliveryFee: 0,
    discount: 94,
    total: 846,
    status: 'Completed',
    dedicationNote: 'Congrats on the launch!',
  },
];
