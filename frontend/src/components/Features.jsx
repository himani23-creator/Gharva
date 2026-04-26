import React from 'react';
import { Target, CheckCircle, ShieldCheck, TrendingUp, Smartphone, Store, Clock } from 'lucide-react';

export default function Features() {
  return (
    <div id="partner" className="w-full bg-[#0a0a0b] py-24 border-t border-white/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Why We Built This */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Why We Built This</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Empowering local chefs and delivering unmatched convenience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-gradient-to-br from-card to-background p-8 rounded-3xl border border-white/5 hover:border-primary/20 transition-colors">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
              <Target className="text-primary" size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission, Delivered</h3>
            <ul className="space-y-4">
              {["Empower independent chefs to launch risk-free", "Provide customers with diverse, high-quality meals", "Revolutionize the food delivery economics"].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-1 shrink-0" size={18} />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#121815] to-[#0A0D0B] p-8 rounded-3xl border border-green-500/10 hover:border-green-500/30 transition-colors">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-green-500" size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Our Promise</h3>
            <ul className="space-y-4">
              {["100% transparent hygiene ratings", "Temperature-controlled deliveries", "Fair pricing for both chefs and customers"].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hygiene Alert Section */}
        <div className="bg-gradient-to-r from-[#0d1612] to-background p-8 md:p-12 rounded-3xl border border-green-500/20 mb-24 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hygiene isn't <br/>an option. <br/>
              <span className="text-green-500">It's our foundation.</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Every kitchen undergoes rigorous audits. We believe you should know exactly where your food is coming from.
            </p>
            <button className="bg-transparent border border-green-500/30 text-green-500 px-6 py-3 rounded-full hover:bg-green-500/10 transition-colors font-medium">
              View Audit Reports
            </button>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-6 w-full">
            {[
              { title: "FSAI Certified", desc: "Top-tier safety compliance" },
              { title: "Daily Checks", desc: "Monitored every morning" },
              { title: "Video Audits", desc: "Live stream monitoring" },
              { title: "Staff Health", desc: "Regular checkups" }
            ].map((item, i) => (
              <div key={i} className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                <CheckCircle className="text-green-500 mb-3" size={20} />
                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-24">
          <h2 className="text-center text-3xl font-bold mb-16">How it works for Customers</h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12">
            {[
              { icon: Smartphone, title: "1. Browse", desc: "Discover local cloud kitchens" },
              { icon: Target, title: "2. Order", desc: "Select your favorite dishes" },
              { icon: Clock, title: "3. Enjoy", desc: "Fast & fresh delivery to you" }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center max-w-xs relative group">
                <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(229,9,20,0.2)] group-hover:shadow-[0_0_25px_rgba(229,9,20,0.5)]">
                  <step.icon size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-gray-400">{step.desc}</p>
                {/* Connector line */}
                {i < 2 && <div className="hidden md:block absolute top-8 left-16 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent -z-10"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* For Partners */}
        <div className="mb-24">
          <h2 className="text-center text-3xl font-bold mb-16">For Cloud Kitchen Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Store, title: "Plug & Play", desc: "Move in and start cooking in days, not months." },
              { icon: Smartphone, title: "Tech Suite", desc: "Manage orders, inventory, and analytics in one dashboard." },
              { icon: TrendingUp, title: "Marketing", desc: "We bring the customers so you can focus on food." }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-colors group">
                <feature.icon className="text-primary mb-6 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary to-rose-700 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_10px_40px_rgba(229,9,20,0.3)]">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Own a Cloud Kitchen?</h2>
            <p className="text-white/80 text-lg max-w-lg mb-6">
              Join thousands of chefs launching their culinary dreams without the overhead of a traditional restaurant.
            </p>
            <div className="flex gap-4">
               <span className="bg-black/20 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">0% Commission First Month</span>
               <span className="bg-black/20 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">24/7 Support</span>
            </div>
          </div>
          <button 
            onClick={() => window.open(`mailto:${import.meta.env.VITE_ADMIN_EMAIL || 'admin@cloudkitchen.in'}?subject=${encodeURIComponent('Partner With Us — CloudKitchen')}`)}
            className="cursor-pointer bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg whitespace-nowrap shadow-xl transition-transform hover:scale-105"
          >
            Partner With Us
          </button>
        </div>

      </div>
    </div>
  );
}
