import { Shield, Star, Clock, Award } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Shield size={40} />,
      title: "Надежность",
      description: "Гарантируем безопасность и прозрачность всех сделок"
    },
    {
      icon: <Star size={40} />,
      title: "Эксклюзивность",
      description: "Доступ к уникальным объектам премиум-класса"
    },
    {
      icon: <Clock size={40} />,
      title: "Оперативность",
      description: "Быстрое оформление документов и сопровождение сделки"
    },
    {
      icon: <Award size={40} />,
      title: "Экспертность",
      description: "15+ лет опыта на рынке недвижимости Испании"
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <h2>Почему выбирают нас</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 