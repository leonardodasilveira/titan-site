import type { Metadata } from 'next';
import { Archivo, Geist_Mono } from 'next/font/google';
import { getSessionUser } from '../lib/api';
import { SiteFooter } from './_components/site-footer';
import { SiteNav } from './_components/site-nav';
import './globals.css';

const archivo = Archivo({
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  display: 'swap',
  preload: false,
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'),
  title: 'Titan Inc — Guilda de World of Warcraft',
  description: 'Guilda de World of Warcraft. Progresso de raid, Mythic+ e recrutamento aberto.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessao = await getSessionUser();
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <span
          hidden
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html:
              '<!-- TITAN_INSTRUMENTO_CONTRACT: THESIS=a_landing_afere; OWN_WORLD=chapa_escura_luz_fria_superior_direita_geometria_gravada_turquesa_luz_rosa_falha_azul_profundidade_sem_blur_sem_glow; STORY=progressao_verificavel_e_candidatura_como_registro; FIRST_VIEWPORT=manchete_mais_disco_de_afericao; FINISH=review_documentacao_e_veredito -->',
          }}
        />
        <a
          href="#conteudo"
          className="chapa text-fg focus-visible:outline-accent fixed top-3 left-3 z-[100] -translate-y-24 px-4 py-3 text-sm transition-transform focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Pular para o conteúdo
        </a>
        <SiteNav sessao={sessao} />
        <main id="conteudo" className="flex flex-1 flex-col" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
