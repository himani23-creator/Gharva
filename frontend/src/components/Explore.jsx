import React, { useState, useEffect, useRef } from 'react';
import { Star, Clock, Plus, ArrowRight, Leaf, Drumstick, ChevronLeft, ChevronRight, Home, Utensils } from 'lucide-react';

const FOOD_CATEGORIES = [
  { label: 'Paratha', emoji: '🫓' },
  { label: 'Sabji', emoji: '🥬' },
  { label: 'Dal Chawal', emoji: '🍚' },
  { label: 'Biryani', emoji: '🍛' },
  { label: 'Chicken', emoji: '🍗' },
  { label: 'Rajma', emoji: '🫘' },
  { label: 'Chole', emoji: '🫘' },
  { label: 'Diet Food', emoji: '🥗' },
  { label: 'Paneer', emoji: '🧀' },
  { label: 'Khichdi', emoji: '🍲' },
  { label: 'Mutton', emoji: '🥩' },
  { label: 'Fish', emoji: '🐟' },
  { label: 'Desserts', emoji: '🍮' },
  { label: 'Breakfast', emoji: '🌅' },
  { label: 'See All', emoji: '🔍' },
];

const CATEGORY_MAP = {
  'Paratha': 'Breakfast',
  'Sabji': 'Sabji',
  'Dal Chawal': 'Main Course',
  'Biryani': 'Biryani',
  'Chicken': 'Non-Veg',
  'Rajma': 'Main Course',
  'Chole': 'Breakfast',
  'Diet Food': 'Diet Food',
  'Paneer': 'Main Course',
  'Khichdi': 'Diet Food',
  'Mutton': 'Non-Veg',
  'Fish': 'Non-Veg',
  'Desserts': 'Desserts',
  'Breakfast': 'Breakfast',
  'See All': null,
};

export default function Explore({ addToCart, vegMode, user }) {
  const [activeCategory, setActiveCategory] = useState('See All');
  const [menuItems, setMenuItems] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const catRef = useRef(null);

  const scrollCat = (dir) => {
    if (catRef.current) catRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const fetchMenu = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/menu';
      if (vegMode === true) url += '?isVeg=true';
      else if (vegMode === false) url += '?isVeg=false';
      const [menuRes, kitchenRes] = await Promise.all([
        fetch(url),
        fetch('http://localhost:5000/api/menu/kitchens')
      ]);
      if (menuRes.ok) setMenuItems(await menuRes.json());
      if (kitchenRes.ok) setKitchens(await kitchenRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, [vegMode]);

  const filtered = menuItems.filter(item => {
    const catLabel = activeCategory;
    if (catLabel === 'See All') return true;
    const backendCat = CATEGORY_MAP[catLabel];
    if (!backendCat) return true;
    return item.category === backendCat ||
      item.name.toLowerCase().includes(catLabel.toLowerCase());
  });

  return (
    <div id="explore" className="scroll-mt-20">

      {/* ── Food Category Chips ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">What's on your mind?</h2>
          <div className="flex gap-1">
            <button onClick={() => scrollCat('left')} className="p-1.5 rounded-full border border-white/10 bg-card hover:bg-white/10 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scrollCat('right')} className="p-1.5 rounded-full border border-white/10 bg-card hover:bg-white/10 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div ref={catRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {FOOD_CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 px-6 py-4 rounded-3xl border text-sm font-semibold transition-all duration-200 min-w-[90px] ${activeCategory === cat.label
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(229,9,20,0.2)]'
                  : 'border-white/8 bg-card text-gray-300 hover:border-white/20 hover:text-white'
                }`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="leading-tight text-center whitespace-nowrap">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Veg/Non-Veg mobile toggle ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center gap-3 sm:hidden">
        <span className="text-xs text-gray-400">Filter:</span>
        {[
          { label: 'All', val: null },
          { label: 'Veg', val: true },
          { label: 'Non-Veg', val: false }
        ].map(opt => (
          <span key={opt.label}
            className={`text-xs px-3 py-1 rounded-full border cursor-default font-semibold ${vegMode === opt.val
                ? opt.val === true ? 'border-green-500 text-green-400 bg-green-500/10'
                  : opt.val === false ? 'border-orange-400 text-orange-400 bg-orange-400/10'
                    : 'border-white/30 text-white bg-white/10'
                : 'border-white/10 text-gray-500'
              }`}
          >
            {opt.val === true && '🟢 '}{opt.val === false && '🔴 '}{opt.label}
          </span>
        ))}
        <span className="text-xs text-gray-600">(change in top bar)</span>
      </div>

      {/* Removed In the Spotlight section */}

      {/* ── Menu Items Grid ── */}
      <div id="menu-grid" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 border-t border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {activeCategory === 'See All' ? 'All Home Cooked Dishes' : activeCategory}
              {vegMode === true && <span className="ml-2 text-green-400 text-base">🟢 Veg</span>}
              {vegMode === false && <span className="ml-2 text-orange-400 text-base">🔴 Non-Veg</span>}
            </h2>
            <p className="text-gray-400 text-sm mt-1">Fresh from home kitchens in your area</p>
          </div>
          {!loading && (
            <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              {Math.min(filtered.length, 20)} items
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-3xl overflow-hidden border border-white/5 animate-pulse">
                <div className="h-36 bg-white/5" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-4 bg-white/5 rounded w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-16 flex flex-col items-center gap-3">
            <Utensils size={48} className="text-gray-700" />
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm">Try changing the category or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.slice(0, 20).map(item => (
              <div
                key={item._id}
                className="bg-card rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-xl flex flex-col"
              >
                {/* Image */}
                <div className="relative h-32 sm:h-40 overflow-hidden bg-white/5 flex-shrink-0">
                  {item.img ? (
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Utensils size={28} className="text-gray-700" />
                    </div>
                  )}
                  {/* Veg/Non-veg dot */}
                  <div className={`absolute top-2 left-2 w-5 h-5 rounded-sm border-2 flex items-center justify-center bg-background/80 backdrop-blur-sm ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  {/* Rating badge */}
                  {item.rating && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-[11px] font-bold text-white">{item.rating}</span>
                    </div>
                  )}
                  {/* Stock badge */}
                  {item.stock <= 5 && item.stock > 0 && (
                    <div className="absolute top-2 right-2 text-[10px] font-bold bg-orange-500/90 text-white px-2 py-0.5 rounded-full">
                      Only {item.stock} left!
                    </div>
                  )}
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xs font-bold text-white bg-red-500/80 px-3 py-1 rounded-full">Sold Out</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-white text-sm leading-snug mb-0.5 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-1 line-clamp-1">{item.kitchenName}</p>
                  {item.description && <p className="text-[11px] text-gray-600 line-clamp-2 mb-2 flex-1">{item.description}</p>}

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                    <span className="font-bold text-white text-sm">₹{item.price}</span>
                    <button
                      disabled={item.stock === 0}
                      onClick={() => addToCart({
                        menuItemId: item._id,
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        img: item.img,
                        kitchenName: item.kitchenName,
                        qty: 1
                      })}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
