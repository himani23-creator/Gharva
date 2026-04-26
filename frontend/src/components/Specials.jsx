import React, { useRef, useState, useEffect } from 'react';
import { Star, Plus, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';

export default function Specials({ addToCart, vegMode }) {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchSpecials = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/menu';
      if (vegMode === true) url += '?isVeg=true';
      else if (vegMode === false) url += '?isVeg=false';
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        // Just take the first 10 for recommendations or shuffle
        setSpecials(data.slice(0, 10));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecials();
  }, [vegMode]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!loading && specials.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-white flex items-center gap-3">
            Gharva's Recommendation
            {vegMode === true && <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">Veg Only</span>}
            {vegMode === false && <span className="text-sm font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">Non-Veg Only</span>}
          </h2>
          <p className="text-gray-400 font-light">Hand-picked best sellers from local home cooks</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')} 
            className="p-2 rounded-full border border-white/10 bg-card hover:bg-white/10 hover:border-white/30 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="p-2 rounded-full border border-white/10 bg-card hover:bg-white/10 hover:border-white/30 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          [...Array(4)].map((_, i) => (
             <div key={i} className="min-w-[280px] sm:min-w-[320px] bg-card rounded-[2rem] border border-white/5 animate-pulse h-80" />
          ))
        ) : (
          specials.map(item => (
            <div key={item._id} className="min-w-[280px] sm:min-w-[320px] snap-start bg-card rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(229,9,20,0.1)] shrink-0">
              <div className="relative h-52 overflow-hidden m-2 rounded-[1.75rem]">
                {item.img ? (
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <Utensils size={40} className="text-gray-700" />
                  </div>
                )}
                {/* Veg/Non-veg dot indicator */}
                <div className={`absolute top-4 left-4 w-5 h-5 rounded-sm border-2 flex items-center justify-center bg-background/80 backdrop-blur-sm ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1 border border-white/10 shadow-lg">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">4.8</span>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3">
                <div className="flex flex-col mb-4">
                  <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors truncate">{item.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{item.kitchenName}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xl text-white">₹{item.price}</span>
                  <button 
                    onClick={() => addToCart({
                      menuItemId: item._id,
                      name: item.name,
                      price: item.price,
                      img: item.img,
                      kitchenName: item.kitchenName,
                      qty: 1
                    })}
                    className="bg-white/5 hover:bg-primary text-white border border-white/10 hover:border-primary p-2.5 rounded-full transition-all duration-300 hover:shadow-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
