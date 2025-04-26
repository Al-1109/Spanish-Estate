import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Проверяем, является ли запрашиваемый маршрут админ-маршрутом
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') && 
                      !req.nextUrl.pathname.startsWith('/admin/login');

  // Для разработки: пропускаем все запросы, так как проверка авторизации 
  // временно выполняется на клиенте через localStorage
  // В будущем здесь будет настоящая проверка через Supabase
  
  return NextResponse.next();
}

// Указываем маршруты, для которых должен быть запущен middleware
export const config = {
  matcher: ['/admin/:path*'],
}; 