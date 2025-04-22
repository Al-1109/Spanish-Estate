'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md" style={{ marginBottom: 0, paddingBottom: 0 }}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-900">Mirasol Estate</div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-6">
            <a href="#properties" onClick={(e) => scrollToSection(e, 'properties')} className="text-gray-700 hover:text-blue-900">
              {t('navigation.catalog')}
            </a>
            <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="text-gray-700 hover:text-blue-900">
              {t('navigation.faq')}
            </a>
            <a href="#articles" onClick={(e) => scrollToSection(e, 'articles')} className="text-gray-700 hover:text-blue-900">
              {t('navigation.articles')}
            </a>
            <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="text-gray-700 hover:text-blue-900">
              {t('navigation.contacts')}
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">
              {t('navigation.consultWithAI')}
            </a>
          </div>
        </div>
        
        <button className="md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 flex flex-col">
            <a href="#properties" onClick={(e) => scrollToSection(e, 'properties')} className="py-2 text-gray-700 hover:text-blue-900">
              {t('navigation.catalog')}
            </a>
            <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="py-2 text-gray-700 hover:text-blue-900">
              {t('navigation.faq')}
            </a>
            <a href="#articles" onClick={(e) => scrollToSection(e, 'articles')} className="py-2 text-gray-700 hover:text-blue-900">
              {t('navigation.articles')}
            </a>
            <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="py-2 text-gray-700 hover:text-blue-900">
              {t('navigation.contacts')}
            </a>
            
            <div className="py-2 flex justify-between items-center">
              <LanguageSwitcher />
              
              <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">
                {t('navigation.consultWithAI')}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 