import React from 'react';

export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 z-10 relative">
          {/* Decorative blur */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Trusted <br />
            Cloud <br />
            Kitchens, <br />
            <span className="text-primary">Delivered<br />Fresh.</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-md font-light">
            Savour freshly cooked meals from top rated cloud kitchens delivered straight to your door. Hot, fresh, and on time.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => {
                document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)]"
            >
              Order Now
            </button>
            <button 
              onClick={() => {
                document.getElementById('partner').scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-card border border-white/10 hover:border-white/30 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:bg-white/5"
            >
              Partner With Us
            </button>
          </div>
        </div>
        
        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full mt-10 lg:mt-0">
          {/* Overlapping Images Effect with animations */}
          <div className="absolute right-0 top-0 w-2/3 h-56 sm:h-72 rounded-3xl overflow-hidden border-[6px] border-background z-10 shadow-2xl transition-transform hover:-translate-y-2 hover:rotate-1 duration-500 group">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800" alt="Pizza" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="absolute left-0 top-32 w-2/3 h-56 sm:h-72 rounded-3xl overflow-hidden border-[6px] border-background z-20 shadow-2xl transition-transform hover:-translate-y-2 hover:-rotate-1 duration-500 group">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" alt="Bowl" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="absolute right-10 bottom-0 w-1/2 h-40 sm:h-56 rounded-3xl overflow-hidden border-[6px] border-background z-30 shadow-2xl transition-transform hover:-translate-y-2 hover:rotate-2 duration-500 group">
            <img src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800" alt="Curry" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
