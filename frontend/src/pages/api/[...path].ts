import type { APIRoute } from 'astro';
import { INTERNAL_API_URL } from 'astro:env/server';

export const ALL: APIRoute = async ({ request, params, cookies }) => {
  const AUTH_COOKIE_NAME = 'access_token';
  const path = params.path;
  const method = request.method;

  // Monta a URL para o NestJS
  const targetUrl = new URL(path || '', INTERNAL_API_URL);

  // Repassa query params
  const requestUrl = new URL(request.url);
  targetUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  headers.set('host', new URL(INTERNAL_API_URL).host);

  // Se já tiver token no cookie, repassa para o NestJS
  const currentToken = cookies.get('access_token');
  if (currentToken) {
    headers.set('Authorization', `Bearer ${currentToken.value}`);
  }

  try {
    // Verifica se é rota de logout
    const isLogoutRoute = path?.includes('auth/signout');

    if (isLogoutRoute) {
      // Remove o cookie de autenticação
      cookies.set(AUTH_COOKIE_NAME, '', {
        httpOnly: true,
        secure: import.meta.env.PROD,
        path: '/',
        maxAge: 0,
      });

      // Retorna uma resposta de sucesso para o front-end
      return new Response(JSON.stringify({ message: 'Logout bem-sucedido.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(targetUrl, {
      method: method,
      headers: headers,
      body: request.body,
      // @ts-ignore
      duplex: 'half',
    });

    console.log(`Resposta do Proxy para ${method} ${targetUrl}:`, response.status);

    // Verifica se é rota de login/cadastro E se deu sucesso (200/201)
    const isAuthRoute = path?.includes('auth/signin') || path?.includes('auth/signup');

    if (isAuthRoute && response.ok) {
      // Precisamos ler o JSON para pegar o token
      const data = await response.json();

      if (data.access_token) {
        // Salva o cookie de forma segura (HttpOnly)
        cookies.set(AUTH_COOKIE_NAME, data.access_token, {
          httpOnly: true,
          secure: import.meta.env.PROD,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      // Reconstrói a resposta para devolver ao front
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          'Content-Type': 'application/json',
        },
      });
    }

    // Para outras rotas, apenas repassa a resposta
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Erro no Proxy:', error);
    return new Response(JSON.stringify({ error: 'Erro interno no Astro Proxy' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
