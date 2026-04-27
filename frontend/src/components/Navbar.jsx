import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingCart, User, LogOut, ChefHat, Bike, ClipboardList,
  MapPin, Edit3, Check, X, Mail, Info, ShieldAlert, MessageSquare,
  Leaf, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROLE_BADGE = {
  customer: { label: 'Customer', color: 'text-primary bg-primary/10 border-primary/20' },
  cook: { label: 'Home Cook', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  delivery: { label: 'Delivery Partner', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  admin: { label: 'Admin', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
};

export default function Navbar({ toggleCart, user, setUser, onSignOut, cartCount, vegMode, setVegMode }) {
  const [showProfile, setShowProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setAddress(user?.address || '');
    setProfileForm({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  }, [user]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
        setEditingProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const saveAddress = async () => {
    if (!user?.id) return;
    setSavingAddress(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, phone: user.phone, address })
      });
      const data = await res.json();
      if (res.ok && setUser) setUser({ ...user, address: data.user.address });
      setEditingAddress(false);
    } catch { } finally { setSavingAddress(false); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSavingProfile(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (res.ok && setUser) setUser({ ...user, ...data.user });
      setEditingProfile(false);
    } catch { } finally { setSavingProfile(false); }
  };

  const badge = user ? ROLE_BADGE[user.role] || ROLE_BADGE.customer : null;

  return (
    <nav className="w-full bg-background/90 backdrop-blur-md sticky top-0 z-40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-3">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-primary flex items-center justify-center rotate-3">
              <span className="text-white font-bold text-base sm:text-lg -rotate-3">Gv</span>
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">Gharva</span>
          </div>

          {/* Address bar — center — only for customers */}
          {(!user || user.role === 'customer') && (
            <div className="hidden md:flex flex-1 mx-4 max-w-sm items-center bg-card rounded-full px-3 sm:px-4 py-2 border border-white/10 gap-2 overflow-hidden">
              <MapPin size={16} className="text-primary flex-shrink-0" />
              {user ? (
                editingAddress ? (
                  <div className="flex flex-1 gap-1 items-center">
                    <input
                      autoFocus
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500 min-w-0"
                      placeholder="Enter address..."
                    />
                    <button onClick={saveAddress} disabled={savingAddress} className="text-green-400 hover:text-green-300 flex-shrink-0">
                      <Check size={14} />
                    </button>
                    <button onClick={() => { setEditingAddress(false); setAddress(user.address); }} className="text-gray-500 hover:text-white flex-shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-between min-w-0 gap-1">
                    <span className="text-sm text-white truncate flex-1">{user.address || 'Set delivery address'}</span>
                    <button onClick={() => setEditingAddress(true)} className="text-gray-500 hover:text-white flex-shrink-0">
                      <Edit3 size={12} />
                    </button>
                  </div>
                )
              ) : (
                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500 min-w-0"
                />
              )}
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

            {/* Veg Mode Toggle — only for customers */}
            {(!user || user.role === 'customer') && setVegMode && (
              <button
                onClick={() => setVegMode(v => v === null ? true : v === true ? false : null)}
                className={`cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-300 ${
                  vegMode === true
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : vegMode === false
                    ? 'border-orange-400 bg-orange-400/10 text-orange-400'
                    : 'border-white/10 text-gray-400 hover:border-white/30'
                }`}
                title={vegMode === true ? 'Veg Only' : vegMode === false ? 'Non-Veg Only' : 'All Items'}
              >
                <div className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                  vegMode === true ? 'border-green-500' : vegMode === false ? 'border-orange-400' : 'border-gray-500'
                }`}>
                  {vegMode === true && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                  {vegMode === false && <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                </div>
                {vegMode === null ? 'All' : vegMode ? 'Veg' : 'Non-Veg'}
              </button>
            )}

            {/* Profile / Sign In */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-300">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="hidden sm:block text-gray-500" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-3 w-72 bg-card border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden">

                    {/* Profile Header */}
                    <div className="p-5 border-b border-white/5">
                      {!editingProfile ? (
                        <>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-base leading-tight">{user.name}</h4>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </>
                      ) : (
                        <form onSubmit={saveProfile} className="space-y-3">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Edit Profile</p>
                          <input
                            value={profileForm.name}
                            onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                            placeholder="Full Name"
                            className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                          />
                          <input
                            value={profileForm.phone}
                            onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                            placeholder="Phone"
                            className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                          />
                          <textarea
                            rows={2}
                            value={profileForm.address}
                            onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                            placeholder="Delivery Address"
                            className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none"
                          />
                          <div className="flex gap-2">
                            <button type="submit" disabled={savingProfile}
                              className="flex-1 bg-primary text-white py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-70">
                              {savingProfile ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={() => setEditingProfile(false)}
                              className="px-4 bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-xl text-sm transition-colors">
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Menu Items */}
                    {!editingProfile && (
                      <div className="p-2">
                        <button onClick={() => setEditingProfile(true)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left">
                          <Edit3 size={16} className="text-gray-500" /> Edit Profile
                        </button>

                        {user.role === 'customer' && (
                          <button onClick={() => { navigate('/my-orders'); setShowProfile(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left">
                            <ClipboardList size={16} className="text-gray-500" /> My Orders
                          </button>
                        )}
                        {user.role === 'cook' && (
                          <button onClick={() => { navigate('/cook-dashboard'); setShowProfile(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 text-sm text-yellow-400 hover:text-yellow-300 transition-colors text-left">
                            <ChefHat size={16} /> Cook Dashboard
                          </button>
                        )}
                        {user.role === 'delivery' && (
                          <button onClick={() => { navigate('/delivery-dashboard'); setShowProfile(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 text-sm text-blue-400 hover:text-blue-300 transition-colors text-left">
                            <Bike size={16} /> Delivery Dashboard
                          </button>
                        )}

                        <div className="border-t border-white/5 my-1" />

                        <button
                          onClick={() => {
                            const subject = encodeURIComponent('Feedback — CloudKitchen');
                            window.open(`mailto:${import.meta.env.VITE_ADMIN_EMAIL || 'admin@cloudkitchen.in'}?subject=${subject}`);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left">
                          <MessageSquare size={16} className="text-gray-500" /> Send Feedback
                        </button>

                        <button
                          onClick={() => { navigate('/about'); setShowProfile(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left">
                          <Info size={16} className="text-gray-500" /> About
                        </button>

                        <button
                          onClick={() => { navigate('/report-safety'); setShowProfile(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-red-500/5 text-sm text-red-400 hover:text-red-300 transition-colors text-left">
                          <ShieldAlert size={16} /> Report Safety Emergency
                        </button>

                        <div className="border-t border-white/5 my-1" />

                        <button
                          onClick={() => { onSignOut(); setShowProfile(false); navigate('/'); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-red-500/5 text-sm text-red-400 hover:text-red-300 transition-colors text-left">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
              >
                <User size={20} />
                <span className="hidden sm:block">Sign In</span>
              </button>
            )}

            {/* Cart — only customers */}
            {(!user || user.role === 'customer') && (
              <button onClick={toggleCart} className="relative text-gray-400 hover:text-white transition-colors cursor-pointer">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-background">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
