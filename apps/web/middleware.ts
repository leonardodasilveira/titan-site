import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'titan_session';

/**
 * Protege /interno/* redirecionando quem não tem cookie de sessão.
 *
 * ISTO É UX, NÃO SEGURANÇA — ver Regra 5 do CLAUDE.md.
 *
 * O middleware só olha a *presença* do cookie; não valida nada. Um cookie
 * inventado passa por aqui. A segurança real é o MemberGuard no Nest, que
 * resolve a sessão no banco e confere membership em todo endpoint.
 *
 * O papel deste código é só evitar que a pessoa veja uma tela vazia antes de
 * ser mandada para o login.
 */
export function middleware(request: NextRequest) {
  const temCookie = request.cookies.has(SESSION_COOKIE);

  if (!temCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/entrar';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/interno', '/interno/:path*'],
};
