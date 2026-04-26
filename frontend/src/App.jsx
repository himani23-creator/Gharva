import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import CookDashboard from './pages/CookDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import MyOrders from './pages/MyOrders';
import SafetyReport from './pages/SafetyReport';

function MainApp() {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [vegMode, setVegMode] = useState(null); // null=All, true=Veg, false=NonVeg
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ck_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [cartItems, setCartItems] = useState([]);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem('ck_user', JSON.stringify(user));
    else localStorage.removeItem('ck_user');
  }, [user]);

  // Sync cart to backend (debounced)
  const syncCartToBackend = useCallback(async (items) => {
    if (!user?.id) return;
    try {
      await fetch('http://localhost:5000/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, cart: items })
      });
    } catch { }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      const timeout = setTimeout(() => syncCartToBackend(cartItems), 1000);
      return () => clearTimeout(timeout);
    }
  }, [cartItems, syncCartToBackend, user]);

  const handleSetUser = (newUser) => {
    setUser(newUser);
    if (newUser?.cart?.length > 0) setCartItems(newUser.cart);
  };

  const handleSignOut = () => {
    syncCartToBackend([]);
    setUser(null);
    setCartItems([]);
    localStorage.removeItem('ck_user');
  };

  const addToCart = (item) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCartItems(prev => {
      const key = item.menuItemId || item.id;
      const existing = prev.find(i => (i.menuItemId || i.id) === key);
      if (existing) return prev.map(i => (i.menuItemId || i.id) === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, menuItemId: key, qty: item.qty || 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item => (item.menuItemId || item.id) === id ? { ...item, qty: item.qty + delta } : item)
        .filter(item => item.qty > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  return (
      <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 flex flex-col">
        <Navbar
          toggleCart={() => setIsCartOpen(!isCartOpen)}
          user={user}
          setUser={handleSetUser}
          onSignOut={handleSignOut}
          cartCount={cartItems.reduce((acc, i) => acc + i.qty, 0)}
          vegMode={vegMode}
          setVegMode={setVegMode}
        />

        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} user={user} vegMode={vegMode} />} />
            <Route path="/login" element={<LoginPage setUser={handleSetUser} setCartItems={setCartItems} />} />
            <Route path="/my-orders" element={user ? <MyOrders user={user} /> : <Navigate to="/login" />} />
            <Route path="/cook-dashboard" element={user?.role === 'cook' ? <CookDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/delivery-dashboard" element={user?.role === 'delivery' ? <DeliveryDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/report-safety" element={<SafetyReport user={user} />} />
            <Route path="/about" element={
              <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">About Gharvity</h1>
                <p className="text-gray-400 text-lg leading-relaxed">Gharvity connects food lovers with talented home cooks in their neighborhood. We believe everyone deserves access to fresh, home-cooked meals made with love — delivered right to their door.</p>
                <p className="text-gray-500 text-sm mt-8">Built with ❤️ by Himani Pinjani</p>
              </div>
            } />
          </Routes>
        </main>

        {(!user || user.role === 'customer') && <Footer />}

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          user={user}
          clearCart={clearCart}
        />
      </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

export default App;
