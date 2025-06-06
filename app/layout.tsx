import './globals.css';
import './styles.css';

export const metadata = {
  title: 'Mirasol Estate - Недвижимость в Испании от собственников',
  description: 'Продажа недвижимости в Испании от прямых собственников с полным сопровождением',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
