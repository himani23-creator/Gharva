import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center rotate-3 transform">
                <span className="text-white font-bold text-lg -rotate-3">Gv</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Gharva</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delivering the best culinary experiences from top cloud kitchens right to your doorstep. Fresh, fast, and reliable.
            </p>
            <div className="flex gap-4">
              {['FB', 'TW', 'IG', 'LI'].map((label, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors text-white font-bold text-xs">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Explore</h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Kitchens', 'Special Offers', 'Partner With Us'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-3">
              {['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Hygiene Guidelines', 'FSAI Compliance'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary shrink-0 mt-0.5" size={18} />
                <span className="text-gray-400 text-sm">Sector 5, Food Court, Mumbai</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary shrink-0" size={18} />
                <span className="text-gray-400 text-sm">+91 9302448043</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary shrink-0" size={18} />
                <span className="text-gray-400 text-sm">himanipinjani23@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Gharva. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-gray-500 text-sm cursor-pointer hover:text-white">Help Center</span>
            <span 
              className="text-gray-500 text-sm cursor-pointer hover:text-white"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
