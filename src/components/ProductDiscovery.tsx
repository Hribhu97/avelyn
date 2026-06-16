import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductRecommendation } from '../types';
import { BadgeCheck, Star, ShieldAlert, Award, FileText, ArrowRightLeft, ThumbsUp, X } from 'lucide-react';

interface ProductDiscoveryProps {
  userBirdTypes: string[];
}

const PRODUCTS_DATA: ProductRecommendation[] = [
  {
    id: 'prod-1',
    name: "Harrison's Bird Foods: Adult Lifetime Course/Fine",
    brand: "Harrison's Avian Medicine",
    rating: 4.9,
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
    priceRange: '$$$',
    tags: ["Budgie", "Lovebird", "Cockatiel", "African Grey", "Macaw"],
    imageColor: "from-emerald-400 to-green-600"
  },
  {
    id: 'prod-2',
    name: "Lafeber's Classic Tropical Fruit Nutri-Berries",
    brand: "Lafeber Avian Research",
    rating: 4.8,
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
    priceRange: '$$',
    tags: ["Indian Ringneck", "Lovebird", "Cockatiel", "Macaw"],
    imageColor: "from-amber-400 to-orange-500"
  },
  {
    id: 'prod-3',
    name: "Higgins Safflower Gold Premium (No Sunflower)",
    brand: "Higgins Premium Products",
    rating: 4.7,
    whyRecommended: "A high-fidelity transition food that bypasses fatty black helper sunflower seeds while loading organic millet, oat groats, and dried fruit chunks.",
    healthBenefits: [
      "Rich in natural pro-biotics boosting gut digestion.",
      "No peanuts or harmful artificial colors or dyes.",
      "Enriched with DHA plant-based microalgae."
    ],
    vetNotes: "Dr. Celeste Vance: 'Avoid high-sunflower seed mixes. Higgins Safflower Gold replaces them with nutrient-dense safflower which has thinner hulls and lower cholesterol fats.'",
    reviews: [
      { user: "Jonathan D.", text: "Great for picky cockatiels who refuse traditional pellets initially.", rating: 5 }
    ],
    priceRange: '$$',
    tags: ["Cockatiel", "Budgie", "Lovebird", "Other"],
    imageColor: "from-sky-400 to-blue-600"
  },
  {
    id: 'prod-4',
    name: "Nekton-S Multi-Vitamin Avian Supplement",
    brand: "Nekton Germany Quality",
    rating: 4.9,
    whyRecommended: "Clinical soluble powder containing 18 vital amino acids and complex Vitamin D3 supporting indoor birds with limited direct sunlight.",
    healthBenefits: [
      "Soluble in drinking water or wet vegetable chops.",
      "Supports difficult molting periods seamlessly.",
      "D3 enables efficient calcium absorption for strong eggshells."
    ],
    vetNotes: "Dr. Klaus Richter: 'Nekton is the global gold standard for captive birds of all species. It fills the crucial blank spaces of winter lighting conditions.'",
    reviews: [
      { user: "Emma F.", text: "Our Budgies look significantly more energetic during winter now. Perfect molting support.", rating: 5 }
    ],
    priceRange: '$$',
    tags: ["Budgie", "Lovebird", "Cockatiel", "Indian Ringneck", "African Grey", "Macaw", "Other"],
    imageColor: "from-violet-400 to-purple-600"
  }
];

export default function ProductDiscovery({ userBirdTypes }: ProductDiscoveryProps) {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'comparison'>('recommendations');
  const [selectedProduct, setSelectedProduct] = useState<ProductRecommendation | null>(null);

  // Comparison State
  const [compareId1, setCompareId1] = useState<string>(PRODUCTS_DATA[0].id);
  const [compareId2, setCompareId2] = useState<string>(PRODUCTS_DATA[1].id);

  // Filter recommendations based on user's flock selections
  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    if (!userBirdTypes || userBirdTypes.length === 0) return true;
    // Show match if product tags contain any bird matching user flock
    return p.tags.some((tag) =>
      userBirdTypes.some((ubt) => ubt.toLowerCase() === tag.toLowerCase() || tag === 'Other')
    );
  });

  const getProductById = (id: string) => PRODUCTS_DATA.find((p) => p.id === id) || PRODUCTS_DATA[0];

  return (
    <div className="bg-[#FFFDF8] border-2 border-slate-100 rounded-xl p-2 shadow-xs space-y-2">
      {/* Tab Selectors */}
      <div className="flex border border-slate-100 rounded-xl p-0.5 bg-white max-w-xs">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'recommendations'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          id="tab-product-recs"
        >
          Avelyn Approved
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          id="tab-product-compare"
        >
          Avian Compare Tool
        </button>
      </div>

      {activeTab === 'recommendations' ? (
        <div className="space-y-2">
          <div className="space-y-0.5">
            <h2 className="font-display font-bold text-sm text-slate-800">
              Approved Veterinary Recommendations
            </h2>
            <p className="text-[11px] text-slate-500">
              These items are curated clinical bird food and wellness solutions matching your flock.
            </p>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-100 rounded-xl p-2 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header (Product Logo Representation) */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {p.brand}
                      </span>
                      <h3 className="font-display font-semibold text-slate-800 text-xs leading-snug">
                        {p.name}
                      </h3>
                    </div>

                    {/* Cute color block illustration */}
                    <div className={`w-10 h-10 rounded-lg grad-bg bg-gradient-to-tr ${p.imageColor} shrink-0 shadow-inner flex items-center justify-center text-white font-serif font-black text-lg`}>
                      🦜
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2 text-[10px]">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" /> {p.rating}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 font-mono font-bold">{p.priceRange}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <BadgeCheck className="w-3 h-3" /> Approved
                    </span>
                  </div>

                  {/* Summary info snippet */}
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-2 font-sans">
                    {p.whyRecommended}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold uppercase rounded px-1.5 py-0.5">
                    {p.tags[0]} Focus
                  </span>

                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    id={`view-rec-${p.id}`}
                  >
                    View Health Record <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Side-by-Side Product Comparison Tool */
        <div className="space-y-2">
          <div className="space-y-0.5">
            <h2 className="font-display font-bold text-sm text-slate-800">
              Avian Ingredient & Formula Compare
            </h2>
            <p className="text-[11px] text-slate-500">
              Analyze safety and health values side-by-side to make logical parenting choices.
            </p>
          </div>

          <div className="bg-white border rounded-xl p-2 space-y-2 shadow-xs">
            {/* Pickers */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                  Product A
                </label>
                <select
                  value={compareId1}
                  onChange={(e) => setCompareId1(e.target.value)}
                  className="w-full text-[11px] font-semibold bg-[#FFFDF8] border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {PRODUCTS_DATA.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name.split(':')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                  Product B
                </label>
                <select
                  value={compareId2}
                  onChange={(e) => setCompareId2(e.target.value)}
                  className="w-full text-[11px] font-semibold bg-[#FFFDF8] border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {PRODUCTS_DATA.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name.split(':')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="border border-slate-100 rounded-lg overflow-hidden text-[11px] divide-y divide-slate-100">
              {/* Row 1: Brand */}
              <div className="grid grid-cols-3 p-2 bg-slate-50/55">
                <span className="font-bold text-slate-500 uppercase">Manufacturer</span>
                <span className="font-semibold text-slate-800">{getProductById(compareId1).brand}</span>
                <span className="font-semibold text-slate-800">{getProductById(compareId2).brand}</span>
              </div>

              {/* Row 2: Score */}
              <div className="grid grid-cols-3 p-2">
                <span className="font-bold text-slate-500 uppercase">Avelyn Rating</span>
                <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                  ★ {getProductById(compareId1).rating}
                </span>
                <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                  ★ {getProductById(compareId2).rating}
                </span>
              </div>

              {/* Row 3: Benefits */}
              <div className="grid grid-cols-3 p-2">
                <span className="font-bold text-slate-500 uppercase">Key Benefit</span>
                <span className="text-slate-600 pr-1.5 leading-tight">{getProductById(compareId1).healthBenefits[0]}</span>
                <span className="text-slate-600 leading-tight">{getProductById(compareId2).healthBenefits[0]}</span>
              </div>

              {/* Row 4: Pricing */}
              <div className="grid grid-cols-3 p-2 bg-slate-50/55">
                <span className="font-bold text-slate-500 uppercase">Investment</span>
                <span className="font-mono text-slate-700 font-bold">{getProductById(compareId1).priceRange}</span>
                <span className="font-mono text-slate-700 font-bold">{getProductById(compareId2).priceRange}</span>
              </div>

              {/* Row 5: Vet Trust */}
              <div className="grid grid-cols-3 p-2">
                <span className="font-bold text-slate-500 uppercase">Vet Assessment</span>
                <p className="text-slate-650 pr-1 italic leading-relaxed line-clamp-2 font-sans">
                  {getProductById(compareId1).vetNotes.substring(0, 90)}...
                </p>
                <p className="text-slate-650 italic leading-relaxed line-clamp-2 font-sans">
                  {getProductById(compareId2).vetNotes.substring(0, 90)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-2 border-emerald-500 rounded-xl p-3 max-w-sm w-full shadow-lg relative space-y-3 max-h-[90vh] overflow-y-auto font-sans"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-2.5 right-2.5 bg-slate-100 p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Header */}
              <div className="space-y-0.5 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                    <Award className="w-3 h-3" /> Vet Premium Food
                  </span>
                  <span className="text-xs text-slate-400">|</span>
                  <span className="text-[10px] font-semibold text-slate-500">{selectedProduct.brand}</span>
                </div>
                <h3 className="font-display font-bold text-sm text-slate-800 leading-snug">
                  {selectedProduct.name}
                </h3>
              </div>

              {/* why recommended card */}
              <div className="bg-emerald-50/40 p-2 border border-emerald-100 rounded-xl space-y-1">
                <h4 className="text-[9px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-0.5">
                  🛡️ Why Recommended by Avelyn
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {selectedProduct.whyRecommended}
                </p>
              </div>

              {/* Health Benefits bullet points */}
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  Clinical Bird-Health Benefits:
                </h4>
                <ul className="space-y-1 pl-0.5">
                  {selectedProduct.healthBenefits.map((b, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex gap-1 items-start leading-snug font-sans">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vet Endorsement notes */}
              <div className="bg-slate-50/70 p-2 border border-slate-100 rounded-xl border-l-4 border-l-emerald-500">
                <h4 className="text-[9px] font-bold text-emerald-700 uppercase tracking-wide mb-1">
                  Avian Veterinary Assessment
                </h4>
                <p className="text-xs text-slate-650 italic leading-relaxed font-sans">
                  {selectedProduct.vetNotes}
                </p>
              </div>

              {/* User Reviews */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  What Bird Parents Say:
                </h4>
                {selectedProduct.reviews.map((rev, idx) => (
                  <div key={idx} className="bg-[#FFFDF8] border border-slate-100 rounded-lg p-2 text-xs leading-relaxed font-sans">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-slate-700">{rev.user}</span>
                      <span className="text-amber-500 flex gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400 stroke-amber-500" />
                        ))}
                      </span>
                    </div>
                    <p className="text-slate-500 italic">"{rev.text}"</p>
                  </div>
                ))}
              </div>

              {/* Close Button CTA */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs"
              >
                Close Record
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
