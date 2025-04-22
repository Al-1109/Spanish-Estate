import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Define supported locales
  locales: ['ru', 'en', 'es'],
  // Set default locale
  defaultLocale: 'ru',
});

export const config = {
  // Match all routes except for static files and API routes
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 