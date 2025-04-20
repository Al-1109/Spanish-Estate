import { ChevronRight } from 'lucide-react';

export function ArticlesSection() {
  const articles = [
    {
      id: 1,
      title: 'Как получить ВНЖ в Испании при покупке недвижимости',
      date: '15 апреля 2025',
      excerpt: 'Подробное руководство о процессе получения вида на жительство через покупку недвижимости в Испании.',
      image: '/images/articles/vnj.jpg'
    },
    {
      id: 2,
      title: 'Топ-10 регионов Испании для инвестиций в недвижимость',
      date: '2 апреля 2025',
      excerpt: 'Анализ лучших регионов Испании с точки зрения рентабельности инвестиций в недвижимость.',
      image: '/images/articles/regions.jpg'
    },
    {
      id: 3,
      title: 'Процесс оформления купли-продажи в Испании',
      date: '27 марта 2025',
      excerpt: 'Пошаговое руководство по юридическим аспектам приобретения недвижимости в Испании.',
      image: '/images/articles/buying.jpg'
    }
  ];

  return (
    <section className="articles">
      <div className="container">
        <h2>Полезная информация</h2>
        
        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <img src={article.image} alt={article.title} />
              <div className="article-content">
                <h3>{article.title}</h3>
                <p className="article-date">{article.date}</p>
                <p className="article-excerpt">{article.excerpt}</p>
                <button className="article-more">
                  Читать полностью <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="center-button">
          <button className="primary-button">Все статьи</button>
        </div>
      </div>
    </section>
  );
} 