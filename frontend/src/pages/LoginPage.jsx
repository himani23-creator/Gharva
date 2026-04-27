import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, User, ArrowRight, ShieldCheck, ChefHat, Bike } from 'lucide-react';

const ROLES = [
  { value: 'customer', label: 'Customer', desc: 'Order delicious food', icon: User },
  { value: 'cook', label: 'Home Cook', desc: 'Manage your kitchen & orders', icon: ChefHat },
  { value: 'delivery', label: 'Delivery Partner', desc: 'Deliver orders & earn', icon: Bike },
];

export default function LoginPage({ setUser, setCartItems }) {
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'customer',
    kitchenName: '',
    otp: ''
  });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setIsOtpSent(true);
      } else {
        alert(data.message || 'Error sending OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Could not connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        // Restore saved cart from DB
        if (data.user.cart && data.user.cart.length > 0) {
          setCartItems(data.user.cart);
        }
        // Redirect based on role
        if (data.user.role === 'cook') navigate('/cook-dashboard');
        else if (data.user.role === 'delivery') navigate('/delivery-dashboard');
        else navigate('/');
      } else {
        alert(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Could not connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find(r => r.value === formData.role);

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row max-w-7xl mx-auto items-center py-12 px-4 sm:px-6 lg:px-8 gap-12">

      {/* Left side */}
      <div className="w-full md:w-1/2 flex flex-col gap-8 hidden md:flex">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
            Welcome to <span className="text-primary">CloudKitchen</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Join as a customer, home cook, or delivery partner. We've got a role for everyone!
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: ShieldCheck, title: "100% Secure OTP Login", desc: "No passwords needed — just your email" },
            { icon: ChefHat, title: "Home Cooks Welcome", desc: "Register your kitchen and start selling" },
            { icon: Bike, title: "Delivery Partners", desc: "Accept orders on your schedule" }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-2xl bg-card border border-white/10 flex items-center justify-center">
                <item.icon className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 sm:max-w-md mx-auto">
        <div className="bg-card border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">
            {isOtpSent ? 'Enter OTP' : 'Login / Create Account'}
          </h3>

          {/* Role Selector — only shown before OTP */}
          {!isOtpSent && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {ROLES.map(role => {
                const Icon = role.icon;
                const isSelected = formData.role === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/10 bg-background text-gray-500 hover:border-white/30 hover:text-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-semibold leading-tight">{role.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <form className="space-y-5" onSubmit={isOtpSent ? handleVerifyOTP : handleSendOTP}>
            {!isOtpSent ? (
              <>
                {/* Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors pl-11"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors pl-11"
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address (OTP will be sent here)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors pl-11"
                    required
                  />
                </div>

                {/* Kitchen Name (Only for Cook) */}
                {formData.role === 'cook' && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ChefHat className="text-gray-500" size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Name of your Kitchen"
                      value={formData.kitchenName}
                      onChange={(e) => setFormData({ ...formData, kitchenName: e.target.value })}
                      className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors pl-11"
                      required
                    />
                  </div>
                )}

                {/* Address */}
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                    <MapPin className="text-gray-500" size={18} />
                  </div>
                  <textarea
                    placeholder={formData.role === 'cook' ? 'Kitchen Address' : formData.role === 'delivery' ? 'Your Base Location' : 'Delivery Address'}
                    rows="3"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors pl-11 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg flex justify-center items-center gap-2 group disabled:opacity-70"
                >
                  {loading ? 'Sending OTP...' : `Send OTP as ${selectedRole?.label}`}
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-400 text-center mb-6">
                  OTP sent to <br /><span className="text-white font-medium">{formData.email}</span>
                  <br /><span className="text-xs text-primary mt-1 block">Signing in as {selectedRole?.label}</span>
                </p>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="------"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    className="w-full sm:w-2/3 tracking-[1rem] bg-background border border-white/10 rounded-2xl px-4 py-4 text-white text-center text-xl font-bold focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || formData.otp.length < 6}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 mt-4 rounded-2xl transition-colors shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                  >
                    ← Change details
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-xs text-gray-500 text-center mt-8">
            By continuing, you agree to our{' '}
            <a href="#" className="text-gray-400 hover:text-white underline">Terms</a> &{' '}
            <a href="#" className="text-gray-400 hover:text-white underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
