'use client';

import React, { useState } from 'react';
import { Search, Menu, X, Globe, ChevronRight } from 'lucide-react';
import './styles.css';
import { HeroSection } from './components/sections/HeroSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { PropertiesSection } from './components/sections/PropertiesSection';
import { AIConsultantSection } from './components/sections/AIConsultantSection';
import { ArticlesSection } from './components/sections/ArticlesSection';
import { FooterSection } from './components/sections/FooterSection';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <PropertiesSection />
      <AIConsultantSection />
      <ArticlesSection />
      <FooterSection />
    </main>
  );
} 