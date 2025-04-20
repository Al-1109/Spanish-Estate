import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });
const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair'
});

export const metadata = {
  title: 'Spanish Estate - Элитная недвижимость в Испании',
  description: 'Элитная недвижимость в Испании с ИИ-консультантом',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderBottom: '1px solid #e9ecef' 
        }}>
          <h2 style={{ margin: 0 }}>Spanish-Estate</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              ИИ-консультант
            </button>
            <button style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #ced4da', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Настройки
            </button>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
