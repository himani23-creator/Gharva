import React, { useEffect, useState } from 'react';
import { ChefHat, Plus, Trash2, Package, RefreshCw, CheckCircle, XCircle, Utensils, Edit3 } from 'lucide-react';

const STATUS_COLORS = {
  pending:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  accepted:  'text-blue-400 bg-blue-400/10 border-blue-400/20',
  preparing: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  ready:     'text-purple-400 bg-purple-400/10 border-purple-400/20',
  picked_up: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  declined:  'text-red-400 bg-red-400/10 border-red-400/20',
};

const CATEGORIES = ['Breakfast', 'Main Course', 'Snacks', 'Desserts', 'Beverages', 'South Indian', 'North Indian', 'Chinese'];

export default function CookDashboard({ user }) {
  const [tab, setTab] = useState('orders'); // 'orders' | 'menu'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', img: '', category: 'Main Course', stock: '10', kitchenName: user.kitchenName || (user.name + "'s Kitchen"), isVeg: true
  });
  const [actionLoading, setActionLoading] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/incoming/${user.id}`);
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) { console.error(err); }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/menu/my/${user.id}`);
      const data = await res.json();
      if (res.ok) setMenuItems(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenu();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const setOrderLoading = (id, val) => setActionLoading(prev => ({ ...prev, [id]: val }));

  const orderAction = async (orderId, action) => {
    setOrderLoading(orderId, action);
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/${action}`, { method: 'PUT' });
      await fetchOrders();
    } catch (err) { alert('Action failed'); }
    finally { setOrderLoading(orderId, null); }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock), cookId: user.id })
      });
      if (res.ok) {
        setForm({ name: '', description: '', price: '', img: '', category: 'Main Course', stock: '10', kitchenName: user.kitchenName || (user.name + "'s Kitchen"), isVeg: true });
        setShowAddForm(false);
        await fetchMenu();
      } else {
        const d = await res.json();
        alert(d.message);
      }
    } catch (err) { alert('Failed to add item'); }
    finally { setLoading(false); }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm('Delete this item?')) return;
    await fetch(`http://localhost:5000/api/menu/${id}`, { method: 'DELETE' });
    fetchMenu();
  };

  const updateStock = async (id, newStock) => {
    await fetch(`http://localhost:5000/api/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: parseInt(newStock) })
    });
    fetchMenu();
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
          <ChefHat className="text-yellow-400" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Cook Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome, {user.name}! Manage your kitchen.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-card rounded-2xl p-1.5 border border-white/10 w-fit">
        {[
          { key: 'orders', label: 'Incoming Orders', badge: pendingCount },
          { key: 'menu', label: 'My Menu Items' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.key ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
            {t.badge > 0 && (
              <span className="bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">Incoming Orders ({orders.length})</h2>
            <button onClick={fetchOrders} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center text-gray-500 mt-16 flex flex-col items-center gap-3">
              <Package size={48} className="text-gray-700" />
              <p>No orders yet. They'll appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-card border border-white/10 rounded-3xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-sm text-gray-400">{order.deliveryAddress}</p>
                      <p className="text-xs text-gray-600 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize ${STATUS_COLORS[order.status] || ''}`}>
                      {order.status.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 mb-4 bg-background/50 rounded-2xl p-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.name} <span className="text-gray-500">×{item.qty}</span></span>
                        <span className="text-white">₹{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-white/5 text-sm font-bold mt-2">
                      <span className="text-gray-400">Total</span>
                      <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => orderAction(order._id, 'accept')}
                        disabled={actionLoading[order._id]}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 py-3 rounded-2xl font-semibold text-sm transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={16} />
                        {actionLoading[order._id] === 'accept' ? 'Accepting...' : 'Accept Order'}
                      </button>
                      <button
                        onClick={() => orderAction(order._id, 'decline')}
                        disabled={actionLoading[order._id]}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-2xl font-semibold text-sm transition-colors disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Decline
                      </button>
                    </div>
                  )}
                  {(order.status === 'accepted') && (
                    <button
                      onClick={() => orderAction(order._id, 'preparing')}
                      disabled={actionLoading[order._id]}
                      className="w-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 py-3 rounded-2xl font-semibold text-sm transition-colors disabled:opacity-50"
                    >
                      {actionLoading[order._id] ? 'Updating...' : '🍳 Start Preparing'}
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => orderAction(order._id, 'ready')}
                      disabled={actionLoading[order._id]}
                      className="w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 py-3 rounded-2xl font-semibold text-sm transition-colors disabled:opacity-50"
                    >
                      {actionLoading[order._id] ? 'Notifying partners...' : '✅ Mark as Ready for Pickup'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MENU TAB */}
      {tab === 'menu' && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">My Menu ({menuItems.length} items)</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          {/* Add Item Form */}
          {showAddForm && (
            <form onSubmit={handleAddItem} className="bg-card border border-white/10 rounded-3xl p-6 mb-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2"><Utensils size={18} className="text-primary" /> New Menu Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Dish Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors" />
                <input required type="number" placeholder="Price (₹)" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                  className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors" />
                <input placeholder="Image URL (optional)" value={form.img} onChange={e => setForm({...form, img: e.target.value})}
                  className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors" />
                <input required type="number" placeholder="Stock (qty)" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                  className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors" />
                <div className="flex items-center gap-4 px-4 py-3 bg-background border border-white/10 rounded-xl">
                  <span className="text-gray-400 text-sm">Type:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="isVeg" checked={form.isVeg} onChange={() => setForm({...form, isVeg: true})} className="accent-green-500" />
                    <span className="text-xs text-white">Veg</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="isVeg" checked={!form.isVeg} onChange={() => setForm({...form, isVeg: false})} className="accent-red-500" />
                    <span className="text-xs text-white">Non-Veg</span>
                  </label>
                </div>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input disabled placeholder="Kitchen Name" value={form.kitchenName}
                  className="bg-background border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed focus:outline-none transition-colors" title="Kitchen Name (set in your profile)" />
              </div>
              <textarea placeholder="Description (optional)" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none" />
              <div className="flex gap-3">
                <button type="submit" disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-70">
                  {loading ? 'Adding...' : 'Add to Menu'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)}
                  className="px-6 bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Menu Items Grid */}
          {menuItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-16 flex flex-col items-center gap-3">
              <Utensils size={48} className="text-gray-700" />
              <p>No menu items yet. Add your first dish!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map(item => (
                <div key={item._id} className="bg-card border border-white/10 rounded-3xl p-5 flex gap-4">
                  {item.img ? (
                    <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-2xl flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Utensils size={24} className="text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                    <p className="text-primary font-bold text-sm mb-3">₹{item.price}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Stock:</span>
                      <input
                        type="number"
                        min="0"
                        value={item.stock}
                        onChange={e => updateStock(item._id, e.target.value)}
                        className="w-16 bg-background border border-white/10 rounded-lg px-2 py-1 text-white text-xs text-center focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-gray-600 hover:text-red-400 transition-colors self-start"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
