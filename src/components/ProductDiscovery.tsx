import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserState } from '../types';
import { 
  ShoppingCart, Trash2, ArrowLeft, Check, Star, ShieldAlert, Award, FileText, 
  ChevronRight, X, Sparkles, Send, Mail, MapPin, Truck, Box, CheckCircle2, 
  BadgePercent, Eye, Plus, Minus, CheckCircle
} from 'lucide-react';

interface ProductDiscoveryProps {
  session: UserState;
  saveSession: (updated: UserState) => void;
}

export interface StoreProduct {
  id: string;
  name: string;
  brand: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
  whyRecommended: string;
  healthBenefits: string[];
  vetNotes: string;
  reviews: { user: string; text: string; rating: number }[];
  tags: string[];
  ingredients: string;
}

const PRODUCTS_DATA: StoreProduct[] = [
  {
    id: 'prod-1',
    name: "Harrison's Adult Lifetime Course/Fine",
    brand: "Harrison's Avian Medicine",
    rating: 4.9,
    reviewCount: 342,
    originalPrice: 2599.00,
    discountPrice: 1999.00,
    imageUrl: "https://images.unsplash.com/photo-1608096299266-ff376ba9957a?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "Formulated by clinical avian veterinarians to replace dangerous all-seed diets. Highly recommended for correcting nutritional deficiencies and extending life.",
    healthBenefits: [
      "No artificial preservatives, chemicals, or colorings.",
      "Organic formulation rich in natural vitamins.",
      "Optimized protein/fat ratios preventing hyperlipidemia."
    ],
    vetNotes: "Dr. Angela Roberts, DVM: 'Whenever a client brings in a feather-plucking cockatiel or budgie on a poor diet, transition to Harrison's lifetime fine is always my mandatory first recommendation. The feathers restore their shine within 30 days.'",
    reviews: [
      { user: "Sarah K.", text: "Transition took 2 weeks but Kiwi looks like a brand new healthy bird. Feathers are so smooth!", rating: 5 },
      { user: "Marcus V.", text: "Our African Grey absolutely thrives on this. Best quality on earth.", rating: 5 }
    ],
    tags: ["Budgie", "Lovebird", "Cockatiel", "African Grey", "Macaw"],
    ingredients: "Ground Yellow Corn, Ground Hulled Barley, Ground Soybeans, Ground Peas, Lentils, Ground Peanut Kernels, Ground Sunflower Kernels, Chia Seed, Alfalfa Meal, Calcium Carbonate."
  },
  {
    id: 'prod-2',
    name: "Lafeber's Classic Tropical Fruit Nutri-Berries",
    brand: "Lafeber Avian Research",
    rating: 4.8,
    reviewCount: 218,
    originalPrice: 1899.00,
    discountPrice: 1499.00,
    imageUrl: "https://images.unsplash.com/photo-1594005374738-23f10e9685a5?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "Offers nutrition identical to pellets while promoting foraging behavior. Prevents cage boredom and mimics natural tearing, chewing, and holding.",
    healthBenefits: [
      "Balanced Omega 3 & 6 fatty acids for beak/skin health.",
      "Non-GMO formula bound in tasty honey-coated clumps.",
      "Interactive shape stimulates natural parrot curiosity."
    ],
    vetNotes: "Dr. Howard Dunn, Avian Specialist: 'Nutri-Berries is exceptional because it satisfies a parrot's mental need to manipulate and forage food instead of just gulping standard powdery dust.'",
    reviews: [
      { user: "Linda P.", text: "Cookie (my Ringneck) screams in excitement whenever she hears the Nutribox open!", rating: 5 },
      { user: "Alex T.", text: "Highly interactive! Keeps my Macaw busy for half an hour.", rating: 4 }
    ],
    tags: ["Lovebird", "Cockatiel", "Macaw", "Budgie"],
    ingredients: "Corn, Hulled White Proso Millet, Oat Groats, Red Millet, Dried Papaya, Dried Pineapple, Dried Mango, Soybean Meal, Wheat Flour, Ground Limestone, Dicalcium Phosphate."
  },
  {
    id: 'prod-3',
    name: "Higgins Safflower Gold Premium (No Sunflower)",
    brand: "Higgins Premium Products",
    rating: 4.7,
    reviewCount: 195,
    originalPrice: 1699.00,
    discountPrice: 1299.00,
    imageUrl: "https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "A high-fidelity transition food that bypasses fatty black sunflower seeds while loading organic safflower, oat groats, and dried fruit chunks.",
    healthBenefits: [
      "Rich in natural pro-biotics boosting gut digestion.",
      "No peanuts or harmful artificial colors or dyes.",
      "Enriched with DHA plant-based microalgae."
    ],
    vetNotes: "Dr. Celeste Vance: 'Avoid high-sunflower seed mixes. Higgins Safflower Gold replaces them with nutrient-dense safflower which has thinner hulls and lower cholesterol fats.'",
    reviews: [
      { user: "Jonathan D.", text: "Great for picky cockatiels who refuse traditional pellets initially. Excellent seed transition.", rating: 5 }
    ],
    tags: ["Cockatiel", "Budgie", "Lovebird", "Other"],
    ingredients: "Safflower, White Proso Millet, Oats, Wheat, Red Proso Millet, Canary Rye, Flaked Peas, Dried Bananas, Raisins, Papaya, Coconut, Carrots, Pineapple, Soybean Meal."
  },
  {
    id: 'prod-4',
    name: "Nekton-S Multi-Vitamin Avian Supplement",
    brand: "Nekton Germany Quality",
    rating: 4.9,
    reviewCount: 512,
    originalPrice: 2299.00,
    discountPrice: 1799.00,
    imageUrl: "https://images.unsplash.com/photo-1626200414243-7f72f2e20dc0?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "Clinical soluble powder containing 18 vital amino acids and complex Vitamin D3 supporting indoor birds with limited direct sunlight.",
    healthBenefits: [
      "Soluble in drinking water or wet vegetable chops.",
      "Supports difficult molting periods seamlessly.",
      "D3 enables efficient calcium absorption for strong eggshells."
    ],
    vetNotes: "Dr. Klaus Richter: 'Nekton is the global gold standard for captive birds of all species. It fills the crucial blank spaces of winter lighting conditions and solves calcium absorption issues.'" ,
    reviews: [
      { user: "Emma F.", text: "Our Budgies look significantly more energetic during winter now. Perfect molting support.", rating: 5 }
    ],
    tags: ["Budgie", "Lovebird", "Cockatiel", "African Grey", "Macaw", "Other"],
    ingredients: "Dextrose, Vitamin A, Vitamin D3, Vitamin E, Vitamin B1, Vitamin B2, Calcium-D-pantothenate, Niacinamide, Vitamin B6, Folic Acid, Vitamin B12, Vitamin C, Vitamin K3, Biotin."
  },
  {
    id: 'prod-5',
    name: "Harrison's High Potency Coarse Pellet",
    brand: "Harrison's Avian Medicine",
    rating: 4.8,
    reviewCount: 164,
    originalPrice: 2799.00,
    discountPrice: 2199.00,
    imageUrl: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "Premium coarse pellets formulated for larger parrots (Macaws, African Greys) or recovering birds needing higher protein, fat, and calcium levels.",
    healthBenefits: [
      "Enriched protein content for breeding or molting birds.",
      "Certified organic ingredients with high bioavailability.",
      "Replaces fatty treats and provides complete cellular energy."
    ],
    vetNotes: "Dr. Angela Roberts: 'High Potency Course is ideal for transition periods, underweight birds, or large parrots like Macaws who naturally require a richer oil-base.'" ,
    reviews: [
      { user: "Danielle H.", text: "My African Grey has stopped feather chewing since moving to this. High fat content is great for them.", rating: 5 }
    ],
    tags: ["African Grey", "Macaw", "Other"],
    ingredients: "Ground Hulled Barley, Ground Yellow Corn, Ground Soybeans, Ground Peanut Kernels, Ground Sunflower Kernels, Ground Green Peas, Ground Lentils, Ground Toasted Oat Groats, Alfalfa."
  },
  {
    id: 'prod-6',
    name: "Lafeber's Avi-Era Powder Multivitamin",
    brand: "Lafeber Avian Research",
    rating: 4.6,
    reviewCount: 92,
    originalPrice: 2099.00,
    discountPrice: 1599.00,
    imageUrl: "https://images.unsplash.com/photo-1522858880629-653768f5195e?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "Highly concentrated avian vitamin powder that easily dissolves in water. Solves chronic vitamin A and D3 deficiencies in budgies and cockatiels.",
    healthBenefits: [
      "Highly concentrated, a tiny pinch is enough.",
      "Contains all 13 essential vitamins in proper avian proportions.",
      "Essential for birds showing lethargy or dull plumage."
    ],
    vetNotes: "Dr. Howard Dunn: 'If water intake is normal, dissolving Avi-Era is the fastest way to stabilize micro-nutrient levels in malnourished rescue budgies.'" ,
    reviews: [
      { user: "Cynthia M.", text: "Very easy to mix. My budgie doesn't even notice it in his fresh water.", rating: 4 }
    ],
    tags: ["Budgie", "Lovebird", "Cockatiel", "Other"],
    ingredients: "Vitamin A Supplement, Vitamin D3 Supplement, Vitamin E Supplement, Choline Chloride, Niacin, Riboflavin, d-Pantothenic Acid, Pyridoxine Hydrochloride, Thiamine Mononitrate."
  },
  {
    id: 'prod-7',
    name: "Higgins Sunburst Gourmet Blend (Cockatiel/Conure)",
    brand: "Higgins Premium Products",
    rating: 4.8,
    reviewCount: 275,
    originalPrice: 1599.00,
    discountPrice: 1199.00,
    imageUrl: "https://images.unsplash.com/photo-1480044965905-02098d419e96?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "A gourmet blend of premium seeds, fruits, vegetables, and pre-mixed extruded pellets. High food appeal for medium parrots.",
    healthBenefits: [
      "Includes Higgins InTune avian pellets mixed in.",
      "Rich in dried papaya, pineapple, and pumpkin seeds.",
      "Protected with active gut probiotics."
    ],
    vetNotes: "Dr. Celeste Vance: 'Sunburst is an excellent premium treats-mix. Unlike cheap seed packs, it adds probiotics and balanced pellets so the bird doesn't select only fat seeds.'" ,
    reviews: [
      { user: "Kevin L.", text: "Our Cockatiel loves the dried banana chips! Extremely clean pack.", rating: 5 }
    ],
    tags: ["Cockatiel", "Lovebird", "Other"],
    ingredients: "Safflower, White Millet, Oats, Canary Seed, Red Millet, Buckwheat, Ground Corn, Flaked Peas, Soybean Meal, Flaxseed, Dried Bananas, Raisins, Pineapple, Carrots."
  },
  {
    id: 'prod-8',
    name: "Nekton-B-Complex Vitamin Supplement",
    brand: "Nekton Germany Quality",
    rating: 4.7,
    reviewCount: 112,
    originalPrice: 2199.00,
    discountPrice: 1699.00,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "Clinical B-vitamin powder that acts directly on the nervous system. Reduces stress, controls muscle tremors, and supports skin healing during feather plucking.",
    healthBenefits: [
      "Promotes healthy nerve tissue and skin cell metabolism.",
      "Reduces high stress levels caused by environmental shifts.",
      "Highly recommended for chronic pluckers."
    ],
    vetNotes: "Dr. Klaus Richter: 'B-Complex is crucial when dealing with behavioral seizures or heavy molt distress. It supports nerve repair when raw seeds fail to deliver thiamine.'" ,
    reviews: [
      { user: "Arthur P.", text: "My feather-chewing conure seems much calmer after 3 weeks. Recommended.", rating: 5 }
    ],
    tags: ["Budgie", "Lovebird", "Cockatiel", "African Grey", "Macaw", "Other"],
    ingredients: "Dextrose, Niacinamide, Pantothenic Acid, Vitamin B6, Thiamine Hydrochloride, Riboflavin, Folic Acid, Vitamin B12."
  },
  {
    id: 'prod-9',
    name: "ZuPreem FruitBlend Pellets (Medium)",
    brand: "ZuPreem Avian Nutrition",
    rating: 4.5,
    reviewCount: 418,
    originalPrice: 1499.00,
    discountPrice: 1149.00,
    imageUrl: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "Extremely popular, fruit-flavored multi-colored pellets that provide full balanced nutrition with high taste appeal.",
    healthBenefits: [
      "Fruit flavors attract birds who reject dull grey pellets.",
      "Enriched with 21 essential vitamins and minerals.",
      "Uniform pieces prevent selective eating patterns."
    ],
    vetNotes: "Dr. Angela Roberts: 'While I prefer organic pellets like Harrison's, ZuPreem FruitBlend is an outstanding stepping stone because the bright colors appeal to stubborn seed-addicts.'" ,
    reviews: [
      { user: "Mindy J.", text: "My Cockatiel loved the colors. Transitioned in just 5 days!", rating: 4 }
    ],
    tags: ["Cockatiel", "Lovebird", "Budgie"],
    ingredients: "Ground Corn, Soybean Meal, Ground Wheat, Wheat Germ Meal, Sugar, Vegetable Oil, Oranges, Apples, Grapes, Bananas, Calcium Carbonate, Dicalcium Phosphate."
  },
  {
    id: 'prod-10',
    name: "TOPS Outstanding Organic Parrot Pellets",
    brand: "TOPS Organic Avian",
    rating: 4.8,
    reviewCount: 147,
    originalPrice: 2699.00,
    discountPrice: 2149.00,
    imageUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&h=600&q=80",
    whyRecommended: "Cold-pressed alfalfa-based organic pellets. Contains no soy, peanuts, or artificial sugars. Peak clean dietary integrity.",
    healthBenefits: [
      "Cold-pressed to preserve vitamins and active enzymes.",
      "Soy-free and corn-free, avoiding common avian allergens.",
      "Loaded with organic rosemary, rosehips, and nettle leaf."
    ],
    vetNotes: "Dr. Celeste Vance: 'TOPS is the cleanest pellet on the market. Cold pressing keeps nutrients active instead of baking them away. Excellent for allergy-prone birds.'" ,
    reviews: [
      { user: "Ronald S.", text: "Kiwi has so much energy now. Love that it has no soy filler.", rating: 5 }
    ],
    tags: ["Cockatiel", "Budgie", "Lovebird", "African Grey", "Macaw", "Other"],
    ingredients: "Organic Alfalfa Barley, Organic Hulled Millet, Organic Rice, Organic Sunflower Seed, Organic Sesame Seeds, Organic Flaxseeds, Organic Rosehips, Organic Orange Peel."
  }
];

export default function ProductDiscovery({ session, saveSession }: ProductDiscoveryProps) {
  const [activeSubTab, setActiveSubTab] = useState<'shop' | 'comparison' | 'cart' | 'tracking'>('shop');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [compareId1, setCompareId1] = useState<string>(PRODUCTS_DATA[0].id);
  const [compareId2, setCompareId2] = useState<string>(PRODUCTS_DATA[1].id);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkout Form State
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [useSeedsDiscount, setUseSeedsDiscount] = useState(false);
  const [showOrderEmail, setShowOrderEmail] = useState<any>(null);

  // Sync state variables
  const cart = session.cart || [];
  const orders = session.orders || [];
  const seedsCount = session.seeds || 0;

  // Telemetry checks for clinical recommendations
  const obs = session.healthObservations;
  const hasAppetiteIssue = obs?.appetite === 'poor';
  const hasDroppingsIssue = obs?.droppings === 'abnormal';
  const hasEnergyIssue = obs?.energy === 'lethargic';

  const telemetryAlert = hasAppetiteIssue || hasDroppingsIssue || hasEnergyIssue;

  // Determine recommendation based on telemetry
  const getTelemetryRecommendation = () => {
    if (hasAppetiteIssue) {
      return {
        product: PRODUCTS_DATA[0], // Harrison's Adult Lifetime
        reason: "Poor appetite has been logged. Harrison's Adult Lifetime Fine Pellets provide organic elements that correct nutritional deficiencies and restore crop health.",
        discountCode: "APPETITE20",
        discountPercent: 20
      };
    }
    if (hasDroppingsIssue) {
      return {
        product: PRODUCTS_DATA[3], // Nekton-S Multi-Vitamin
        reason: "Abnormal/loose droppings are flagged. Nekton-S supplies soluble vitamins and 18 amino acids that stabilize internal osmotic balance and aid digestive flora.",
        discountCode: "DIGEST20",
        discountPercent: 20
      };
    }
    if (hasEnergyIssue) {
      return {
        product: PRODUCTS_DATA[7], // Nekton-B-Complex
        reason: "Lethargy has been detected. Nekton-B-Complex contains key B-vitamins that stimulate nervous cellular metabolism, reduce physical stress, and support vitality.",
        discountCode: "ENERGY20",
        discountPercent: 20
      };
    }
    return null;
  };

  const rec = getTelemetryRecommendation();

  // Helper to add item to cart
  const addToCart = (productId: string, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.productId === productId);
    let updatedCart = [...cart];
    
    if (existingIndex > -1) {
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + quantity
      };
    } else {
      updatedCart.push({ productId, quantity });
    }

    saveSession({
      ...session,
      cart: updatedCart
    });
  };

  // Update quantity in cart
  const updateCartQuantity = (productId: string, delta: number) => {
    let updatedCart = cart.map(item => {
      if (item.productId === productId) {
        const nextQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, nextQty) };
      }
      return item;
    }).filter(item => item.quantity > 0);

    saveSession({
      ...session,
      cart: updatedCart
    });
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    saveSession({
      ...session,
      cart: updatedCart
    });
  };

  // Compute cart counts
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const getProductDetails = (id: string) => {
    return PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];
  };

  const cartSubtotal = cart.reduce((acc, item) => {
    const prod = getProductDetails(item.productId);
    return acc + (prod.discountPrice * item.quantity);
  }, 0);

  const seedsDiscountValue = useSeedsDiscount ? Math.min(seedsCount * 0.1, cartSubtotal) : 0;
  const cartTotal = Math.max(0, cartSubtotal - seedsDiscountValue);

  // Handle Order Placement
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !address.trim() || !phone.trim()) {
      alert("Please fill in all shipping details!");
      return;
    }

    const orderId = `AVL-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString(),
      items: [...cart],
      total: Number(cartTotal.toFixed(2)),
      status: 'ordered' as const,
      address: address
    };

    const nextSeeds = useSeedsDiscount 
      ? Math.max(0, seedsCount - Math.round(seedsDiscountValue * 10))
      : seedsCount;

    const updatedSession: UserState = {
      ...session,
      cart: [], // Empty cart
      orders: [newOrder, ...orders],
      seeds: nextSeeds
    };

    saveSession(updatedSession);
    setIsCheckoutMode(false);

    // Show simulated Email popup
    setShowOrderEmail({
      orderId,
      fullName,
      address,
      phone,
      total: newOrder.total,
      items: newOrder.items.map(item => ({
        ...getProductDetails(item.productId),
        qty: item.quantity
      }))
    });
  };

  // Advance delivery status instantly (Simulation)
  const advanceOrderStatus = (orderId: string) => {
    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        let nextStatus: 'ordered' | 'shipped' | 'out_for_delivery' | 'delivered' = 'ordered';
        if (ord.status === 'ordered') nextStatus = 'shipped';
        else if (ord.status === 'shipped') nextStatus = 'out_for_delivery';
        else if (ord.status === 'out_for_delivery') nextStatus = 'delivered';
        else return ord; // already delivered

        return { ...ord, status: nextStatus };
      }
      return ord;
    });

    saveSession({
      ...session,
      orders: updatedOrders
    });
  };

  // Filter products based on search query
  const filteredProducts = PRODUCTS_DATA.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-3 font-sans">
      {/* Flipkart-Style Header */}
      <div className="bg-[#2874f0] text-white p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg text-[#2874f0]">
            <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-display font-black text-base italic tracking-tight">
              avelyn<span className="text-yellow-400">Plus</span>
            </h1>
            <p className="text-[10px] text-slate-100 flex items-center gap-0.5 font-bold font-sans">
              Explore Plus <span className="text-yellow-400">✨ Curated Avian Care</span>
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full md:max-w-xs relative text-slate-700">
          <input 
            type="text"
            placeholder="Search Harrison's, Lafeber's, supplements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 bg-white text-xs rounded-lg border-none outline-none font-medium shadow-inner placeholder:text-slate-400"
          />
          <Sparkles className="w-4 h-4 text-slate-400 absolute right-2.5 top-2" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'shop', label: 'Shop Catalog', count: null },
            { id: 'comparison', label: 'Compare Brands', count: null },
            { id: 'cart', label: 'Shopping Cart', count: totalCartItems },
            { id: 'tracking', label: 'Track Orders', count: orders.length }
          ].map(subTab => {
            const isSelected = activeSubTab === subTab.id;
            return (
              <button
                key={subTab.id}
                onClick={() => {
                  setActiveSubTab(subTab.id as any);
                  setIsCheckoutMode(false);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all text-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-yellow-400 text-slate-900 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span>{subTab.label}</span>
                {subTab.count !== null && subTab.count > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 leading-none shadow-xs">
                    {subTab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinical Telemetry Recommendation Alert at the very top of shop page */}
      {activeSubTab === 'shop' && telemetryAlert && rec && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3 flex flex-col md:flex-row items-center gap-3 shadow-xs"
        >
          <div className="w-14 h-14 bg-gradient-to-tr from-rose-400 to-red-500 rounded-xl overflow-hidden shadow-inner shrink-0 relative flex items-center justify-center text-white text-xl">
            🦜
          </div>
          <div className="flex-1 space-y-1 text-center md:text-left">
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-black rounded uppercase tracking-wider">
              🚨 Vet Telemetry Recommendation
            </span>
            <h4 className="font-display font-black text-xs text-slate-800 leading-snug">
              Clinical Alert: Recommended Food/Supplement for recovery
            </h4>
            <p className="text-[11px] text-slate-655 leading-relaxed font-medium">
              {rec.reason}
            </p>
            <div className="text-[10px] text-red-600 font-bold flex items-center justify-center md:justify-start gap-1">
              <BadgePercent className="w-3.5 h-3.5" />
              <span>Telemetry Discount Code: <strong className="bg-red-100 px-1 rounded">{rec.discountCode}</strong> (20% Off at checkout!)</span>
            </div>
          </div>
          <div className="shrink-0 flex flex-col gap-1 w-full md:w-auto">
            <button
              onClick={() => {
                addToCart(rec.product.id, 1);
                setActiveSubTab('cart');
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Buy Recovery Diet
            </button>
            <button
              onClick={() => setSelectedProduct(rec.product)}
              className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1"
            >
              <Eye className="w-3 h-3" /> View Vet Profile
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        
        {/* SHOP CATALOG TAB */}
        {activeSubTab === 'shop' && (
          <motion.div 
            key="shop-catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Products Flipkart Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map(prod => {
                const discountPercent = Math.round(((prod.originalPrice - prod.discountPrice) / prod.originalPrice) * 100);
                return (
                  <motion.div
                    key={prod.id}
                    whileHover={{ y: -4 }}
                    className="bg-white border-2 border-slate-100 hover:border-slate-200 rounded-2xl p-2.5 shadow-2xs hover:shadow-sm flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 bg-[#ff6161] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs z-10 font-sans">
                      {discountPercent}% OFF
                    </div>

                    <div>
                      {/* Product Image */}
                      <div className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden relative group">
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/0 transition-colors" />
                      </div>

                      {/* Brand & Assured */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          {prod.brand}
                        </span>
                        <span className="bg-[#2874f0]/10 text-[#2874f0] text-[8px] font-extrabold px-1 py-0.2 rounded-sm italic uppercase font-sans">
                          Avelyn Assured ✓
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-slate-800 text-xs mt-1 leading-snug line-clamp-2 min-h-[32px]">
                        {prod.name}
                      </h3>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mt-1 text-[10px]">
                        <span className="bg-emerald-600 text-white text-[9px] font-bold px-1 py-0.2 rounded flex items-center gap-0.5">
                          {prod.rating} <Star className="w-2.5 h-2.5 fill-white" />
                        </span>
                        <span className="text-slate-400 font-medium">({prod.reviewCount})</span>
                      </div>

                      {/* Flipkart Price block */}
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-sm font-black text-slate-800">
                          ₹{prod.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{prod.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 pt-2.5 border-t border-slate-50 grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                      <button
                        onClick={() => {
                          addToCart(prod.id, 1);
                        }}
                        className="py-1.5 bg-[#ff9f00] hover:bg-[#ff9f00]/90 text-white text-[10px] font-black rounded-lg cursor-pointer flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-transform"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add Cart
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* BRAND COMPARISON TAB */}
        {activeSubTab === 'comparison' && (
          <motion.div 
            key="brand-compare"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border-2 border-slate-100 rounded-2xl p-3 space-y-3 shadow-xs"
          >
            <div className="space-y-0.5 text-center">
              <h2 className="font-display font-black text-sm text-slate-800">
                Avian Formula Ingredient Compare
              </h2>
              <p className="text-xs text-slate-500">
                Audit nutrients and clinical notes side-by-side to make intelligent, transparent buying choices.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Product A</label>
                <select 
                  value={compareId1}
                  onChange={(e) => setCompareId1(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl px-2 py-1.5 bg-[#FFFDF8] outline-none cursor-pointer"
                >
                  {PRODUCTS_DATA.map(p => (
                    <option key={p.id} value={p.id}>{p.name.split(':')[0]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Product B</label>
                <select 
                  value={compareId2}
                  onChange={(e) => setCompareId2(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl px-2 py-1.5 bg-[#FFFDF8] outline-none cursor-pointer"
                >
                  {PRODUCTS_DATA.map(p => (
                    <option key={p.id} value={p.id}>{p.name.split(':')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="border border-slate-100 rounded-xl overflow-hidden text-xs divide-y divide-slate-100 mt-2 max-w-2xl mx-auto shadow-inner">
              {/* Row: Brand */}
              <div className="grid grid-cols-3 p-2 bg-slate-50/50">
                <span className="font-bold text-slate-500 uppercase font-mono">Manufacturer</span>
                <span className="font-semibold text-slate-800">{getProductDetails(compareId1).brand}</span>
                <span className="font-semibold text-slate-800">{getProductDetails(compareId2).brand}</span>
              </div>

              {/* Row: Rating */}
              <div className="grid grid-cols-3 p-2">
                <span className="font-bold text-slate-500 uppercase font-mono">Rating</span>
                <span className="font-black text-amber-500 flex items-center gap-0.5">★ {getProductDetails(compareId1).rating}</span>
                <span className="font-black text-amber-500 flex items-center gap-0.5">★ {getProductDetails(compareId2).rating}</span>
              </div>

              {/* Row: Pricing */}
              <div className="grid grid-cols-3 p-2 bg-slate-50/50">
                <span className="font-bold text-slate-500 uppercase font-mono">Price</span>
                <span className="font-black text-slate-800">₹{getProductDetails(compareId1).discountPrice.toFixed(2)}</span>
                <span className="font-black text-slate-800">₹{getProductDetails(compareId2).discountPrice.toFixed(2)}</span>
              </div>

              {/* Row: Benefit */}
              <div className="grid grid-cols-3 p-2">
                <span className="font-bold text-slate-500 uppercase font-mono">Benefit</span>
                <span className="text-slate-600 leading-snug">{getProductDetails(compareId1).healthBenefits[0]}</span>
                <span className="text-slate-600 leading-snug">{getProductDetails(compareId2).healthBenefits[0]}</span>
              </div>

              {/* Row: Ingredients */}
              <div className="grid grid-cols-3 p-2 bg-slate-50/50">
                <span className="font-bold text-slate-500 uppercase font-mono">Ingredients</span>
                <span className="text-[10px] text-slate-500 leading-tight pr-2 line-clamp-3 font-sans">{getProductDetails(compareId1).ingredients}</span>
                <span className="text-[10px] text-slate-500 leading-tight line-clamp-3 font-sans">{getProductDetails(compareId2).ingredients}</span>
              </div>

              {/* Row: Vet Trust */}
              <div className="grid grid-cols-3 p-2">
                <span className="font-bold text-slate-500 uppercase font-mono">Vet Trust</span>
                <span className="text-[10px] italic text-slate-550 leading-relaxed pr-2 line-clamp-3 font-sans">"{getProductDetails(compareId1).vetNotes}"</span>
                <span className="text-[10px] italic text-slate-550 leading-relaxed line-clamp-3 font-sans">"{getProductDetails(compareId2).vetNotes}"</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* SHOPPING CART TAB */}
        {activeSubTab === 'cart' && (
          <motion.div 
            key="shopping-cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto space-y-3"
          >
            {cart.length === 0 ? (
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 text-center space-y-3 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-slate-700">Your Shopping Cart is Empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Select premium bird food, vitamins, or seed-transitions from our curated shop catalog.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSubTab('shop')}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-lg cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : !isCheckoutMode ? (
              /* Cart List & Summary view */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Cart Items List */}
                <div className="md:col-span-2 space-y-2">
                  <h3 className="font-display font-black text-xs text-slate-800 uppercase tracking-wider">
                    My Cart ({totalCartItems} items)
                  </h3>

                  {cart.map(item => {
                    const prod = getProductDetails(item.productId);
                    return (
                      <div 
                        key={item.productId}
                        className="bg-white border border-slate-100 rounded-xl p-2 flex gap-3 shadow-2xs justify-between items-center"
                      >
                        <div className="w-12 h-12 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-slate-800 text-xs truncate leading-snug">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono block">{prod.brand}</span>
                          <div className="text-xs font-black text-slate-800 mt-0.5">
                            ₹{prod.discountPrice.toFixed(2)}
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(item.productId, -1)}
                            className="p-1 text-slate-500 hover:text-slate-700 hover:bg-white rounded-md cursor-pointer transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-slate-800 w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, 1)}
                            className="p-1 text-slate-500 hover:text-slate-700 hover:bg-white rounded-md cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Bill Summary */}
                <div className="bg-white border-2 border-slate-100 rounded-2xl p-3 h-fit space-y-3 shadow-2xs">
                  <h3 className="font-display font-black text-xs text-slate-800 uppercase tracking-wider pb-1.5 border-b border-slate-50">
                    Price Details
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Price ({totalCartItems} items)</span>
                      <span className="font-bold text-slate-800">₹{cartSubtotal.toFixed(2)}</span>
                    </div>

                    {/* Seeds redemption toggle */}
                    {seedsCount > 0 && (
                      <div className="flex items-center justify-between border-t border-b border-slate-50 py-1.5 my-1">
                        <label className="flex items-center gap-1.5 cursor-pointer min-w-0">
                          <input 
                            type="checkbox"
                            checked={useSeedsDiscount}
                            onChange={(e) => setUseSeedsDiscount(e.target.checked)}
                            className="w-3.5 h-3.5 rounded accent-emerald-500 cursor-pointer"
                          />
                          <span className="text-[10px] font-bold text-emerald-600 truncate">
                            Apply {seedsCount} Seeds (₹{(seedsCount * 0.1).toFixed(2)} off)
                          </span>
                        </label>
                        {useSeedsDiscount && (
                          <span className="font-bold text-emerald-600 shrink-0">
                            -₹{seedsDiscountValue.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="text-emerald-600 font-bold">FREE</span>
                    </div>

                    <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-black text-slate-800">
                      <span>Total Amount</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckoutMode(true)}
                    className="w-full py-2 bg-[#fb641b] hover:bg-[#fb641b]/90 text-white text-xs font-black rounded-lg cursor-pointer shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1"
                  >
                    <span>Proceed to Buy</span> <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              /* CHECKOUT FORM VIEW */
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-3.5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <button 
                    onClick={() => setIsCheckoutMode(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-650" />
                  </button>
                  <h3 className="font-display font-black text-sm text-slate-800">
                    Shipping & Payment Details
                  </h3>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 text-left">Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Hribhu Tapadar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 bg-[#FFFDF8]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 text-left">Shipping Address</label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="e.g. 123 Finch Way, Kolkata, West Bengal, 700001"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 bg-[#FFFDF8] resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 text-left">Contact Number</label>
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. +91 12345 67890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 bg-[#FFFDF8]"
                    />
                  </div>

                  {/* Payment Simulator Options */}
                  <div className="space-y-1 pt-1.5 border-t border-slate-50">
                    <label className="block font-bold text-slate-700 mb-1 text-left">Select Payment Gateway</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border-2 border-emerald-500 bg-emerald-50/10 rounded-xl p-2 flex items-center gap-2 cursor-pointer">
                        <input type="radio" defaultChecked className="accent-emerald-500" />
                        <div className="min-w-0 text-left">
                          <span className="font-bold text-slate-800 block">Mock UPI & Card</span>
                          <span className="text-[9px] text-slate-400 block">Instant processing</span>
                        </div>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-2 flex items-center gap-2 opacity-50">
                        <input type="radio" disabled className="accent-emerald-500" />
                        <div className="min-w-0 text-left">
                          <span className="font-bold text-slate-500 block">Cash on Delivery</span>
                          <span className="text-[9px] text-slate-400 block">Unavailable</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Checkout summary block */}
                  <div className="bg-[#FFFDF8] border border-slate-100 rounded-xl p-3 space-y-1.5 font-medium text-left">
                    <div className="flex justify-between">
                      <span>Cart Subtotal</span>
                      <span>₹{cartSubtotal.toFixed(2)}</span>
                    </div>
                    {useSeedsDiscount && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Seeds Savings</span>
                        <span>-₹{seedsDiscountValue.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-slate-100 pt-1.5 font-black text-sm text-slate-800">
                      <span>Total Amount Pay</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-lg cursor-pointer shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Place Order & Complete Payment
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}

        {/* ORDER TRACKING & TRANSPARENCY TAB */}
        {activeSubTab === 'tracking' && (
          <motion.div 
            key="order-tracking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto space-y-3"
          >
            <h3 className="font-display font-black text-xs text-slate-800 uppercase tracking-wider">
              Transparent Delivery Tracking
            </h3>

            {orders.length === 0 ? (
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 text-center space-y-2 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-slate-700">No Active Shipments Found</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Once you complete a check-out purchase, your package dispatch updates will record here instantly.
                  </p>
                </div>
              </div>
            ) : (
              orders.map(ord => {
                return (
                  <div 
                    key={ord.id}
                    className="bg-white border border-slate-100 rounded-2xl p-3 shadow-2xs space-y-3 relative overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2 border-b border-slate-50 pb-2">
                      <div className="text-left">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Order ID: {ord.id}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Purchased on {ord.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-800 block">₹{ord.total.toFixed(2)}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block uppercase tracking-wider font-mono">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-500 text-left">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="truncate">Deliver to: <strong className="text-slate-650">{ord.address}</strong></p>
                    </div>

                    {/* Status Tracking Steps Progress Bar */}
                    <div className="pt-2">
                      <div className="relative flex justify-between items-center w-full max-w-sm mx-auto">
                        
                        {/* Progress Line */}
                        <div className="absolute left-0 right-0 h-1 bg-slate-100 -z-10" />
                        <div 
                          className="absolute left-0 h-1 bg-emerald-500 -z-10 transition-all duration-500" 
                          style={{
                            width: 
                              ord.status === 'ordered' ? '0%' : 
                              ord.status === 'shipped' ? '33%' : 
                              ord.status === 'out_for_delivery' ? '66%' : '100%'
                          }}
                        />

                        {/* Step 1: Ordered */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                            ord.status === 'ordered' || ord.status === 'shipped' || ord.status === 'out_for_delivery' || ord.status === 'delivered'
                              ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                          }`}>
                            ✓
                          </div>
                          <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Ordered</span>
                        </div>

                        {/* Step 2: Shipped */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                            ord.status === 'shipped' || ord.status === 'out_for_delivery' || ord.status === 'delivered'
                              ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                          }`}>
                            <Box className="w-3 h-3" />
                          </div>
                          <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Shipped</span>
                        </div>

                        {/* Step 3: Out For Delivery */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                            ord.status === 'out_for_delivery' || ord.status === 'delivered'
                              ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                          }`}>
                            <Truck className="w-3 h-3" />
                          </div>
                          <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Out Delivery</span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white text-slate-400 border border-slate-200'
                          }`}>
                            🎁
                          </div>
                          <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* Instant Status Simulator Controller (Production transparent feature) */}
                    {ord.status !== 'delivered' && (
                      <div className="pt-2 border-t border-slate-50 flex justify-end">
                        <button
                          onClick={() => advanceOrderStatus(ord.id)}
                          className="px-3 py-1 bg-sky-50 text-sky-600 border border-sky-100 hover:bg-sky-100 text-[10px] font-black rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> Simulate Next Shipping Stage
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-2 border-emerald-500 rounded-2xl p-4 max-w-sm w-full shadow-lg relative space-y-3 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-2.5 right-2.5 bg-slate-100 p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-650"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Product Header details */}
              <div className="space-y-1 pt-1.5 text-left">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded uppercase tracking-wider inline-flex items-center gap-0.5">
                  <Award className="w-3 h-3" /> Certified Avian Diet
                </span>
                <h3 className="font-display font-black text-slate-800 text-sm leading-snug">
                  {selectedProduct.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold block">{selectedProduct.brand}</span>
              </div>

              {/* High-res Image preview */}
              <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-2">
                <span className="text-base font-black text-slate-800">₹{selectedProduct.discountPrice.toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through">₹{selectedProduct.originalPrice.toFixed(2)}</span>
                <span className="text-xs text-emerald-600 font-bold">({Math.round(((selectedProduct.originalPrice - selectedProduct.discountPrice) / selectedProduct.originalPrice) * 100)}% Off)</span>
              </div>

              {/* Ingredients tabs */}
              <div className="bg-[#FFFDF8] border border-slate-100 p-2.5 rounded-xl space-y-1.5 text-left">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  📋 Premium Ingredients
                </h4>
                <p className="text-[11px] text-slate-600 leading-normal font-medium font-sans">
                  {selectedProduct.ingredients}
                </p>
              </div>

              {/* Health check values */}
              <div className="space-y-1.5 text-xs text-slate-700 text-left">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  ✓ Clinical Health Benefits
                </h4>
                <ul className="space-y-1 pl-1">
                  {selectedProduct.healthBenefits.map((b, idx) => (
                    <li key={idx} className="flex gap-1.5 items-start leading-snug font-medium font-sans">
                      <span className="text-emerald-500 font-black font-sans">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vet Endorsement notes */}
              <div className="bg-emerald-50/20 border-l-4 border-l-emerald-500 p-2.5 rounded-r-xl text-left">
                <h4 className="text-[9px] font-bold text-emerald-700 uppercase tracking-wide mb-1 font-mono">
                  Avian Veterinary Assessment
                </h4>
                <p className="text-[11px] text-slate-655 italic leading-relaxed font-medium font-sans">
                  {selectedProduct.vetNotes}
                </p>
              </div>

              {/* Add to Cart CTA */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50">
                <button
                  onClick={() => {
                    addToCart(selectedProduct.id, 1);
                    setSelectedProduct(null);
                  }}
                  className="py-2 bg-[#ff9f00] hover:bg-[#ff9f00]/90 text-white text-xs font-black rounded-xl cursor-pointer shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" /> Add Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct.id, 1);
                    setSelectedProduct(null);
                    setActiveSubTab('cart');
                    setIsCheckoutMode(true);
                  }}
                  className="py-2 bg-[#fb641b] hover:bg-[#fb641b]/90 text-white text-xs font-black rounded-xl cursor-pointer shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1"
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simulated Email Confirmation Modal Popup */}
      <AnimatePresence>
        {showOrderEmail && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-slate-800 rounded-3xl p-4 max-w-sm w-full shadow-2xl relative space-y-4"
            >
              {/* Email Envelope Header */}
              <div className="flex items-center gap-2 bg-[#2874f0] text-white p-2.5 -mx-4 -mt-4 rounded-t-2xl">
                <Mail className="w-5 h-5" />
                <div className="min-w-0 text-left">
                  <h4 className="text-xs font-black">Gmail Inbox Mockup</h4>
                  <span className="text-[9px] opacity-80 block truncate font-mono">From: support@avelynplus.com</span>
                </div>
                <button
                  onClick={() => setShowOrderEmail(null)}
                  className="ml-auto bg-white/20 p-1 rounded-full hover:bg-white/30 cursor-pointer text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Email Body */}
              <div className="space-y-3 text-xs text-slate-750 text-left">
                <div className="pb-2 border-b border-slate-105">
                  <h2 className="font-display font-black text-sm text-slate-800">
                    Order Confirmation Receipt 🦜
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Order ID: {showOrderEmail.orderId}</p>
                </div>

                <p className="leading-relaxed">
                  Hi <strong>{showOrderEmail.fullName}</strong>,<br />
                  Thank you for placing your purchase with AvelynPlus! Avian health is our highest priority. Your package is currently being packaged for secure dispatch.
                </p>

                {/* Items Ordered List */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 space-y-1.5 text-left">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Items Invoice</h4>
                  {showOrderEmail.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[11px] font-sans">
                      <span className="truncate pr-2">{item.name} x {item.qty}</span>
                      <span className="font-bold text-slate-800">₹{(item.discountPrice * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold font-sans">
                    <span>Total Amount Charged</span>
                    <span>₹{showOrderEmail.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery details */}
                <div className="text-[10px] text-slate-500 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span>Shipping To:</span>
                    <strong className="text-slate-700 truncate max-w-[150px]">{showOrderEmail.address}</strong>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span>Contact Phone:</span>
                    <strong className="text-slate-700">{showOrderEmail.phone}</strong>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span>Est. Delivery Date:</span>
                    <strong className="text-emerald-600 font-bold">Within 2 Days (Track via App)</strong>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center text-emerald-800 text-[10px] leading-relaxed font-bold">
                  ✓ Dispatch status updates are available immediately on your "Track Orders" dashboard tab!
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowOrderEmail(null);
                  setActiveSubTab('tracking'); // Redirect to tracking dashboard
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-xl cursor-pointer"
              >
                Close Receipt & Track Order
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
