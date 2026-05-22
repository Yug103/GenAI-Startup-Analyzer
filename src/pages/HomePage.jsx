import React from 'react';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import Pricing from '../components/home/Pricing';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
    </>
  );
};

export default HomePage;
