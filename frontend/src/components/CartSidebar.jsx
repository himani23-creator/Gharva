import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar({ isOpen, onClose, cartItems, updateQuantity, user, clearCart }) {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const delivery = subtotal > 0 ? 2.99 : 0;
  const total = subtotal + delivery;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      onClose();
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id,
          cartItems,
          deliveryAddress: user.address
        })
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        setMessage({ type: 'success', text: 'Order placed! The cook has been notified. 🎉' });
        setTimeout(() => {
          setMessage(null);
          onClose();
          navigate('/my-orders');
        }, 2500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Error placing order' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Could not connect to server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-card border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-2xl`}>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-background/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary" />
            <h2 className="text-xl font-bold">Your Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Toast Message */}
        {message && (
          <div className={`mx-4 mt-4 flex items-center gap-3 p-4 rounded-2xl border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-16 flex flex-col items-center gap-3">
              <ShoppingBag size={40} className="text-gray-700" />
              <p>Your cart is empty</p>
              <p className="text-xs text-gray-600">Add items from the menu to get started</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={item.menuItemId || item.id || idx} className="flex gap-4 items-center bg-background/50 p-3 rounded-2xl border border-white/5">
                {item.img && (
                  <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm mb-1 truncate">{item.name}</h4>
                  {item.kitchenName && <p className="text-xs text-gray-500 mb-1">{item.kitchenName}</p>}
                  <div className="text-primary font-semibold text-sm">₹{item.price}</div>
                </div>
                <div className="flex items-center gap-3 bg-card px-2 py-1.5 rounded-lg border border-white/5 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.menuItemId || item.id, -1)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId || item.id, 1)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-background">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Delivery Fee</span>
              <span>₹{delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/5">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {!user && (
            <p className="text-xs text-gray-500 text-center mb-3">
              <span className="text-primary cursor-pointer" onClick={() => { onClose(); navigate('/login'); }}>
                Sign in
              </span>{' '}
              to place your order
            </p>
          )}

          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-[0_5px_20px_rgba(229,9,20,0.3)]"
          >
            {loading ? 'Placing Order...' : user ? 'Place Order' : 'Sign In to Checkout'}
          </button>
        </div>
      </div>
    </>
  );
}
