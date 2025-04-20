export const FooterSection = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Spanish-Estate</h3>
            <p>
              Элитная недвижимость в Испании с полным сопровождением и поддержкой на всех этапах.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">Twitter</a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3>Навигация</h3>
            <ul className="footer-links">
              <li><a href="#about">О нас</a></li>
              <li><a href="#catalog">Каталог недвижимости</a></li>
              <li><a href="#faq">Часто задаваемые вопросы</a></li>
              <li><a href="#articles">Статьи</a></li>
              <li><a href="#contacts">Контакты</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Контакты</h3>
            <ul className="contact-info">
              <li>📞 +34 XXX XXX XXX</li>
              <li>✉️ info@spanish-estate.com</li>
              <li>🏠 Барселона, Испания</li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Подписка на новости</h3>
            <p>
              Получайте информацию о новых объектах и полезные статьи
            </p>
            <div className="subscribe-form">
              <input type="email" placeholder="Ваш email" />
              <button className="subscribe-button">Подписаться</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 Spanish-Estate. Все права защищены.</p>
          <div className="legal-links">
            <a href="#privacy">Политика конфиденциальности</a>
            <a href="#terms">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 