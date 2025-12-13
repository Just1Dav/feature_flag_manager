import type { AstroGlobal } from 'astro';
import { INTERNAL_API_URL } from 'astro:env/server';

const AUTH_COOKIE_NAME = 'access_token';

/**
 * Realiza chamadas API a partir do servidor Astro (SSR).
 * Verifica o cookie de autenticação e o inclui nas requisições.
 */
export async function fetchWithAuth<T>(endpoint: string, astro: AstroGlobal): Promise<T | null> {
  const cookie = astro.cookies.get(AUTH_COOKIE_NAME);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (cookie?.value) {
    headers['Authorization'] = `Bearer ${cookie.value}`;
  }

  try {
    const response = await fetch(`${INTERNAL_API_URL}${endpoint}`, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 401 || response.status === 403) {
      console.warn(`Não autorizado para ${endpoint}`);
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(` Falha ao buscar ${endpoint}:`, error);
    return null;
  }
}
