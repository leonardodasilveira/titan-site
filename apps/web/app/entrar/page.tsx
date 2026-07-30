import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '../../lib/api';
import { API_URL } from '../../lib/config';

const MENSAGENS: Record<string, string> = {
  cancelado: 'Você cancelou a autorização na Blizzard. Nada foi salvo.',
  state:
    'O retorno da Blizzard não pôde ser validado. Isso costuma acontecer quando o login demora demais ou é aberto em outra aba. Tente novamente.',
  falha:
    'Não foi possível concluir o login. Se persistir, a redirect URI registrada no portal da Blizzard pode não bater com a configurada no servidor.',
};

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  // Já logado não precisa ver esta página.
  const user = await getSessionUser();
  if (user) redirect('/interno');

  const { erro } = await searchParams;
  const mensagem = erro ? MENSAGENS[erro] : undefined;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div>
        <Image
          src="/titan-inc-logo.png"
          alt="Titan Inc"
          width={200}
          height={83}
          priority
          className="h-auto w-[200px] max-w-full"
        />
        <h1 className="text-fg mt-8 text-3xl font-semibold tracking-tight">Área de membros</h1>
        <p className="text-fg-muted mt-3">
          Entre com sua conta Battle.net. Verificamos automaticamente se você tem personagem no
          roster da guilda.
        </p>
      </div>

      {mensagem && (
        <div
          role="alert"
          className="border-highlight-soft bg-highlight-soft text-fg rounded-lg border px-4 py-3 text-sm"
        >
          {mensagem}
        </div>
      )}

      {/* Link, não fetch: o fluxo OAuth exige navegação de verdade do browser
          para o domínio da Blizzard. */}
      <a
        href={`${API_URL}/auth/battlenet`}
        className="bg-accent hover:bg-accent/90 flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-medium text-[#0b0d12] transition-colors"
      >
        Entrar com Battle.net
      </a>

      <p className="text-fg-subtle text-sm">
        Não é da guilda?{' '}
        <Link href="/" className="text-accent underline">
          Veja como se candidatar
        </Link>
        .
      </p>
    </main>
  );
}
