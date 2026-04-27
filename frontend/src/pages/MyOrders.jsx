import React, { useEffect, useState } from 'react';
import { ClipboardList, RefreshCw, ChefHat, Bike, CheckCircle, XCircle, Clock } from 'lucide-react';

const STATUS_STEPS = ['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered'];

const STATUS_INFO = {
  pending:    { label: 'Order Placed',       color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  icon: Clock },
  accepted:   { label: 'Order Accepted',     color: 'text-blue-400',    bg: 'bg-blue-400/10',    icon: ChefHat },
  preparing:  { label: 'Being Prepared',     color: 'text-orange-400',  bg: 'bg-orange-400/10',  icon: ChefHat },
  ready:      { label: 'Waiting for Pickup', color: 'text-purple-400',  bg: 'bg-purple-400/10',  icon: Bike },
  picked_up:  { label: 'On the Way!',        color: 'text-blue-400',    bg: 'bg-blue-400/10',    icon: Bike },
  delivered:  { label: 'Delivered!',         color: 'text-green-400',   bg: 'bg-green-400/10',   icon: CheckCircle },
  declined:   { label: 'Order Declined',     color: 'text-red-400',     bg: 'bg-red-400/10',     icon: XCircle },
};

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders/my/${user.id}`);
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 10 seconds for live updates
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-primary" size={28} />
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-20">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 flex flex-col items-center gap-3">
          <ClipboardList size={48} className="text-gray-700" />
          <p className="text-lg">No orders yet</p>
          <p className="text-sm text-gray-600">Start exploring and place your first order!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const info = STATUS_INFO[order.status] || STATUS_INFO.pending;
            const Icon = info.icon;
            const stepIndex = STATUS_STEPS.indexOf(order.status);

            return (
              <div key={order._id} className="bg-card border border-white/10 rounded-3xl p-6 shadow-lg">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-400">{order.kitchenName}</p>
                    <p className="text-xs text-gray-600 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${info.bg} ${info.color}`}>
                    <Icon size={14} />
                    {info.label}
                  </div>
                </div>

                {/* Progress Bar (not shown if declined) */}
                {order.status !== 'declined' && (
                  <div className="mb-5">
                    <div className="flex items-center gap-1">
                      {STATUS_STEPS.map((step, i) => (
                        <React.Fragment key={step}>
                          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                            i <= stepIndex ? 'bg-primary' : 'bg-white/10'
                          }`} />
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1 px-0.5">
                      <span>Placed</span>
                      <span>Preparing</span>
                      <span>Ready</span>
                      <span>Picked Up</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}

                {/* Delivery Partner Info */}
                {order.deliveryPartnerName && (
                  <div className="flex items-center gap-2 bg-blue-400/10 border border-blue-400/20 rounded-2xl px-4 py-3 mb-4">
                    <Bike size={16} className="text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Your Delivery Partner</p>
                      <p className="text-sm font-bold text-blue-300">{order.deliveryPartnerName}</p>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.name} <span className="text-gray-500">x{item.qty}</span></span>
                      <span className="text-white font-medium">₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between border-t border-white/5 pt-3">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-primary font-bold">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
