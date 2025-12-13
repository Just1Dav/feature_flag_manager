import { defineMiddleware } from 'astro:middleware';

// Intercepta as requisições e trata redirecionamentos, autenticação e rotas públicas
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  const publicRoutes = ['/auth', '/api/auth'];
  const isPublicRoute = publicRoutes.some((route) => url.pathname.startsWith(route));

  const AUTH_COOKIE_NAME = 'access_token';
  const hasAuthToken = cookies.has(AUTH_COOKIE_NAME);

  if (!isPublicRoute && !hasAuthToken) {
    if (url.pathname.startsWith('/api')) {
      return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });
    }
    return redirect('/auth');
  }

  if (isPublicRoute && hasAuthToken && !url.pathname.startsWith('/api')) {
    return redirect('/');
  }

  return next();
});
