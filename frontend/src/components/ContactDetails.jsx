import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactDetails() {
  return (
    <div id="contact" className="w-full bg-[#050505] py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Get in Touch</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We're here to help. Reach out to us for any support or inquiries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Phone, title: "Phone", desc: "+91 9302448043", sub: "Mon-Sun, 9am - 10pm" },
            { icon: Mail, title: "Email", desc: "himanipinjani23@gmail.com", sub: "Online support 24/7" },
            { icon: MapPin, title: "Office", desc: "Sector 5, Food Court", sub: "Mumbai, Maharashtra 400005" },
            { icon: Clock, title: "Hours", desc: "Everyday", sub: "9:00 AM - 11:00 PM" }
          ].map((item, i) => (
            <div key={i} className="bg-card p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-colors text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
              <p className="text-primary font-medium mb-1">{item.desc}</p>
              <p className="text-sm text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
