import React, { useEffect, useState } from 'react';
import { Bike, RefreshCw, Package, CheckCircle, MapPin } from 'lucide-react';

export default function DeliveryDashboard({ user }) {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [tab, setTab] = useState('available');
  const [actionLoading, setActionLoading] = useState({});

  const fetchAvailable = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders/available-deliveries');
      const data = await res.json();
      if (res.ok) setAvailableOrders(data);
    } catch (err) { console.error(err); }
  };

  const fetchMine = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/my-deliveries/${user.id}`);
      const data = await res.json();
      if (res.ok) setMyDeliveries(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchAvailable();
    fetchMine();
    const interval = setInterval(() => { fetchAvailable(); fetchMine(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  const acceptDelivery = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [orderId]: 'accepting' }));
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/accept-delivery`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId: user.id })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchAvailable();
        await fetchMine();
        setTab('mine');
      } else {
        alert(data.message || 'Could not accept delivery');
      }
    } catch (err) { alert('Request failed'); }
    finally { setActionLoading(prev => ({ ...prev, [orderId]: null })); }
  };

  const markDelivered = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [orderId]: 'delivering' }));
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/delivered`, { method: 'PUT' });
      await fetchMine();
    } catch (err) { alert('Request failed'); }
    finally { setActionLoading(prev => ({ ...prev, [orderId]: null })); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-400/10 flex items-center justify-center">
          <Bike className="text-blue-400" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome, {user.name}! Pick up and deliver orders.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-card rounded-2xl p-1.5 border border-white/10 w-fit">
        {[
          { key: 'available', label: 'Available Pickups', badge: availableOrders.length },
          { key: 'mine', label: 'My Deliveries', badge: myDeliveries.filter(o => o.status === 'picked_up').length }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.key ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
            {t.badge > 0 && (
              <span className="bg-white text-blue-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => { fetchAvailable(); fetchMine(); }}
          className="ml-2 text-gray-500 hover:text-white transition-colors px-3"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* AVAILABLE PICKUPS */}
      {tab === 'available' && (
        <div>
          {availableOrders.length === 0 ? (
            <div className="text-center text-gray-500 mt-16 flex flex-col items-center gap-3">
              <Package size={48} className="text-gray-700" />
              <p className="text-lg font-medium">No pickups available right now</p>
              <p className="text-sm text-gray-600">New orders will appear here automatically</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableOrders.map(order => (
                <div key={order._id} className="bg-card border border-white/10 rounded-3xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="font-bold text-white text-lg">{order.kitchenName}</p>
                      <p className="text-sm text-gray-400">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-bold text-lg">₹{order.totalAmount.toFixed(2)}</div>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {/* Delivery address */}
                  <div className="flex items-start gap-2 bg-background/50 rounded-2xl p-3 mb-4">
                    <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{order.deliveryAddress}</p>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-gray-500 mb-4">
                    {order.items.map(i => `${i.name} ×${i.qty}`).join(' · ')}
                  </div>

                  <button
                    onClick={() => acceptDelivery(order._id)}
                    disabled={actionLoading[order._id]}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white py-3.5 rounded-2xl font-bold transition-colors disabled:opacity-70 shadow-lg"
                  >
                    <Bike size={18} />
                    {actionLoading[order._id] === 'accepting' ? 'Accepting...' : 'Accept This Delivery'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY DELIVERIES */}
      {tab === 'mine' && (
        <div>
          {myDeliveries.length === 0 ? (
            <div className="text-center text-gray-500 mt-16 flex flex-col items-center gap-3">
              <Bike size={48} className="text-gray-700" />
              <p>No deliveries yet. Accept one from Available Pickups!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myDeliveries.map(order => (
                <div key={order._id} className={`bg-card border rounded-3xl p-6 ${
                  order.status === 'delivered' ? 'border-green-500/20' : 'border-white/10'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="font-bold text-white">{order.kitchenName} → {order.customerName}</p>
                    </div>
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize ${
                      order.status === 'delivered'
                        ? 'text-green-400 bg-green-400/10 border-green-400/20'
                        : 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                    }`}>
                      {order.status === 'picked_up' ? '🛵 On the Way' : '✅ Delivered'}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-background/50 rounded-2xl p-3 mb-4">
                    <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{order.deliveryAddress}</p>
                  </div>

                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-400">Order Total</span>
                    <span className="text-primary font-bold">₹{order.totalAmount.toFixed(2)}</span>
                  </div>

                  {order.status === 'picked_up' && (
                    <button
                      onClick={() => markDelivered(order._id)}
                      disabled={actionLoading[order._id]}
                      className="w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 py-3.5 rounded-2xl font-bold transition-colors disabled:opacity-70"
                    >
                      <CheckCircle size={18} />
                      {actionLoading[order._id] ? 'Completing...' : 'Mark as Delivered'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
