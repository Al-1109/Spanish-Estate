import { NextIntlClientProvider } from 'next-intl';
import '../../globals.css';
import '../../styles.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });
const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair'
});

export const metadata = {
  title: 'Mirasol Estate - Недвижимость в Испании от собственников',
  description: 'Продажа недвижимости в Испании от прямых собственников с полным сопровождением',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback if locale messages not found
    messages = (await import(`../../messages/ru.json`)).default;
  }

  return (
    <html lang={locale} className={`${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 