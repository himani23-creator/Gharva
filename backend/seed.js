/**
 * Seed script — run with: node seed.js
 * Creates mock cooks, delivery partner, and home-cooked menu items
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cloudkitchen';

const mockCooks = [
  { name: 'Sunita Sharma', email: 'sunita.kitchen@demo.com', phone: '9876543210', address: 'Lajpat Nagar, Delhi', role: 'cook', otp: undefined, otpExpiresAt: undefined, kitchenName: "Sunita's Home Kitchen" },
  { name: 'Priya Mehta', email: 'priya.homefood@demo.com', phone: '9812345678', address: 'Andheri West, Mumbai', role: 'cook', otp: undefined, otpExpiresAt: undefined, kitchenName: "Priya's Gujarati Kitchen" },
  { name: 'Rekha Devi', email: 'rekha.dilli@demo.com', phone: '9898989898', address: 'Karol Bagh, Delhi', role: 'cook', otp: undefined, otpExpiresAt: undefined, kitchenName: "Rekha's Dilli Rasoi" },
];

const mockDelivery = { name: 'Rahul Kumar', email: 'rahul.delivery@demo.com', phone: '9111111111', address: 'Connaught Place, Delhi', role: 'delivery' };
const mockCustomer = { name: 'Himani Pinjani', email: 'demo.customer@demo.com', phone: '9000000000', address: 'Sector 18, Noida', role: 'customer' };

const menuItems = (cookId, kitchenName) => [
  { name: 'Aloo Paratha', description: 'Crispy stuffed potato flatbread with white butter & pickle', price: 80, img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600', category: 'Breakfast', stock: 20, isVeg: true, cookId, kitchenName },
  { name: 'Dal Tadka', description: 'Yellow lentils tempered with ghee, cumin & garlic', price: 120, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600', category: 'Main Course', stock: 15, isVeg: true, cookId, kitchenName },
  { name: 'Rajma Chawal', description: 'Slow-cooked red kidney beans with jeera rice', price: 140, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600', category: 'Main Course', stock: 12, isVeg: true, cookId, kitchenName },
  { name: 'Chicken Biryani', description: 'Aromatic basmati rice slow-cooked with marinated chicken', price: 220, img: 'https://images.unsplash.com/photo-1563379091339-03246963d6cd?auto=format&fit=crop&q=80&w=600', category: 'Biryani', stock: 10, isVeg: false, cookId, kitchenName },
  { name: 'Mutton Curry', description: 'Slow cooked mutton in rich onion-tomato gravy', price: 280, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600', category: 'Non-Veg', stock: 8, isVeg: false, cookId, kitchenName },
  { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich creamy tomato gravy', price: 180, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600', category: 'Main Course', stock: 15, isVeg: true, cookId, kitchenName },
  { name: 'Moong Dal Khichdi', description: 'Light comfort food with moong dal and rice, perfect for diet', price: 100, img: 'https://images.unsplash.com/photo-1567245089012-d3a1a9d6a6a0?auto=format&fit=crop&q=80&w=600', category: 'Diet Food', stock: 18, isVeg: true, cookId, kitchenName },
  { name: 'Egg Curry', description: 'Boiled eggs in spicy masala gravy, home style', price: 150, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600', category: 'Non-Veg', stock: 10, isVeg: false, cookId, kitchenName },
  { name: 'Vegetable Sabji', description: 'Seasonal mixed vegetables cooked in light spices', price: 90, img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=600', category: 'Sabji', stock: 20, isVeg: true, cookId, kitchenName },
  { name: 'Chicken Curry', description: 'Home-style chicken in spicy tomato onion gravy', price: 200, img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=600', category: 'Non-Veg', stock: 12, isVeg: false, cookId, kitchenName },
];

const extraItems = [
  { name: 'Veg Biryani', description: 'Aromatic basmati rice with seasonal vegetables', price: 160, img: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&q=80&w=600', category: 'Biryani', stock: 15, isVeg: true },
  { name: 'Poha', description: 'Flattened rice with peanuts, curry leaves & lemon', price: 60, img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=600', category: 'Breakfast', stock: 25, isVeg: true },
  { name: 'Makki ki Roti with Sarson ka Saag', description: 'Traditional Punjabi winter meal', price: 130, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600', category: 'Main Course', stock: 10, isVeg: true },
  { name: 'Fish Curry', description: 'Coastal style spicy fish curry with coconut', price: 250, img: 'https://images.unsplash.com/photo-1626514820127-80e7e89a0c84?auto=format&fit=crop&q=80&w=600', category: 'Non-Veg', stock: 8, isVeg: false },
  { name: 'Chole Bhature', description: 'Spicy chickpeas with fluffy deep-fried bread', price: 110, img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=600', category: 'Breakfast', stock: 20, isVeg: true },
  { name: 'Kheer', description: 'Creamy rice pudding with cardamom and saffron', price: 70, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600', category: 'Desserts', stock: 30, isVeg: true },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing mock demo data
  await User.deleteMany({ email: { $regex: '@demo.com' } });
  await MenuItem.deleteMany({});
  console.log('Cleared old seed data');

  // Create cooks
  const cooks = [];
  for (const cookData of mockCooks) {
    const { kitchenName, ...userData } = cookData;
    const cook = await User.create({ ...userData, kitchenName, cart: [] });
    cooks.push({ cook, kitchenName });
    console.log(`Created cook: ${cook.name}`);
  }

  // Create delivery partner
  await User.create({ ...mockDelivery, cart: [] });
  console.log('Created delivery partner: Rahul Kumar');

  // Create demo customer
  await User.create({ ...mockCustomer, cart: [] });
  console.log('Created demo customer');

  // Skip seeding menu items so they are only added when a home cook signs in and uploads a dish.
  // console.log('Skipping mock menu items creation as per user request.');

  console.log('\n✅ Seed complete!');
  console.log('\nDemo accounts (use OTP "123456" if you set BYPASS_OTP=true, otherwise check email):');
  console.log('  Customer: demo.customer@demo.com');
  console.log('  Cook 1:   sunita.kitchen@demo.com');
  console.log('  Cook 2:   priya.homefood@demo.com');
  console.log('  Cook 3:   rekha.dilli@demo.com');
  console.log('  Driver:   rahul.delivery@demo.com');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
