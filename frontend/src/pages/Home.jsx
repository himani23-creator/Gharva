import React from 'react';
import Hero from '../components/Hero';
import Specials from '../components/Specials';
import Explore from '../components/Explore';
import Features from '../components/Features';
import ContactDetails from '../components/ContactDetails';

export default function Home({ addToCart, user, vegMode }) {
  return (
    <div>
      <Hero />
      <Specials addToCart={addToCart} vegMode={vegMode} />
      <Explore addToCart={addToCart} vegMode={vegMode} user={user} />
      <Features />
      <ContactDetails />
    </div>
  );
}
