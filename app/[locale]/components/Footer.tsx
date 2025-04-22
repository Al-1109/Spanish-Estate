'use client';
import { useTranslations } from 'next-intl';
import { Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mirasol Estate</h3>
            <p className="text-gray-400 mb-4">{t('description')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t('navigation')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Главная</a></li>
              <li><a href="#properties" className="text-gray-400 hover:text-white">Каталог</a></li>
              <li><a href="#articles" className="text-gray-400 hover:text-white">Статьи</a></li>
              <li><a href="#ai-consultant" className="text-gray-400 hover:text-white">AI Консультант</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t('contacts')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+34 912 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@mirasolestate.es</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t('subscribe')}</h3>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition"
              >
                {t('subscribeButton')}
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">{t('copyright')}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">{t('privacyPolicy')}</a>
            <a href="#" className="text-gray-400 hover:text-white">{t('termsOfUse')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 