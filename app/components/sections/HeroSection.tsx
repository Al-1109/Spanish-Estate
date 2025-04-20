import { Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="banner">
      <div className="banner-overlay"></div>
      <div className="container banner-content">
        <h1>Роскошная недвижимость в Испании</h1>
        <p className="banner-subtitle">
          Откройте для себя эксклюзивные объекты на побережье Средиземного моря
        </p>
        <div className="search-container">
          <input type="text" placeholder="Поиск недвижимости..." />
          <button className="search-button">
            <Search size={20} />
          </button>
        </div>
      </div>
    </section>
  );
} 