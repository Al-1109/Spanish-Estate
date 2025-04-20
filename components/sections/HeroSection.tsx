import { SearchBar } from '../ui/SearchBar';

export const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Элитная недвижимость в Испании
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
          Находите идеальную недвижимость с помощью нашего ИИ-консультанта
        </p>
        <SearchBar />
      </div>
    </section>
  );
}; 