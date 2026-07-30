import type { BlizzardService, RosterMember, RosterSnapshot } from '../blizzard/blizzard.service';
import type { MemberToRevalidate, MembershipRepository } from './membership.repository';
import { MembershipService } from './membership.service';

// Dados fictícios de propósito: nada de nome real de membro em fixture — ver
// a seção de segredos do CLAUDE.md.
const rosterMember = (slug: string, realmSlug: string, rank: number): RosterMember => ({
  name: slug,
  slug,
  realmSlug,
  rank,
});

const dbMember = (over: Partial<MemberToRevalidate> = {}): MemberToRevalidate => ({
  id: 'user-1',
  guildRank: 4,
  matchedCharacterSlug: 'ferrolhx',
  matchedCharacterRealm: 'azralon',
  ...over,
});

const snapshot = (members: RosterMember[], stale = false): RosterSnapshot => ({
  members,
  fetchedAt: Date.now(),
  stale,
});

describe('MembershipService', () => {
  const blizzard = { getGuildRosterSnapshot: jest.fn() };
  const repo = {
    findMembers: jest.fn(),
    revokeMembership: jest.fn(),
    updateRank: jest.fn(),
    touchVerified: jest.fn(),
  };

  let service: MembershipService;

  beforeEach(() => {
    jest.clearAllMocks();
    repo.revokeMembership.mockResolvedValue(0);
    repo.updateRank.mockResolvedValue(undefined);
    repo.touchVerified.mockResolvedValue(undefined);
    repo.findMembers.mockResolvedValue([]);

    service = new MembershipService(
      blizzard as unknown as BlizzardService,
      repo as unknown as MembershipRepository,
    );
  });

  it('revoga quem não está mais no roster e apaga as sessões', async () => {
    blizzard.getGuildRosterSnapshot.mockResolvedValue(
      snapshot([rosterMember('ficou', 'azralon', 4)]),
    );
    repo.findMembers.mockResolvedValue([
      dbMember({ id: 'ficou', matchedCharacterSlug: 'ficou' }),
      dbMember({ id: 'saiu', matchedCharacterSlug: 'saiu' }),
    ]);
    repo.revokeMembership.mockResolvedValue(2);

    const result = await service.revalidateAll();

    expect(repo.revokeMembership).toHaveBeenCalledWith(['saiu']);
    expect(result).toMatchObject({ status: 'ok', revoked: 1, sessionsDeleted: 2 });
  });

  it('busca roster fresco, não o cache da rodada anterior', async () => {
    blizzard.getGuildRosterSnapshot.mockResolvedValue(snapshot([rosterMember('a', 'azralon', 1)]));

    await service.revalidateAll();

    expect(blizzard.getGuildRosterSnapshot).toHaveBeenCalledWith(true);
  });

  describe('não revoga ninguém quando o roster não é confiável', () => {
    beforeEach(() => {
      repo.findMembers.mockResolvedValue([dbMember({ id: 'membro-legitimo' })]);
    });

    it('roster veio do cache porque a Blizzard falhou', async () => {
      // O personagem NÃO está neste roster: se o job não checasse `stale`, este
      // membro perderia acesso por causa de uma falha de API.
      blizzard.getGuildRosterSnapshot.mockResolvedValue(
        snapshot([rosterMember('outro', 'azralon', 1)], true),
      );

      const result = await service.revalidateAll();

      if (result.status !== 'aborted') throw new Error('esperava a rodada abortada');
      expect(result.reason).toMatch(/cache/);
      expect(repo.revokeMembership).not.toHaveBeenCalled();
    });

    it('roster vazio', async () => {
      blizzard.getGuildRosterSnapshot.mockResolvedValue(snapshot([]));

      const result = await service.revalidateAll();

      expect(result).toMatchObject({ status: 'aborted' });
      expect(repo.revokeMembership).not.toHaveBeenCalled();
    });

    it('a chamada à Blizzard lança', async () => {
      blizzard.getGuildRosterSnapshot.mockRejectedValue(new Error('HTTP 503'));

      await expect(service.revalidateAll()).rejects.toThrow('HTTP 503');
      expect(repo.revokeMembership).not.toHaveBeenCalled();
    });

    it('membro sem personagem casado (não dá para verificar)', async () => {
      blizzard.getGuildRosterSnapshot.mockResolvedValue(
        snapshot([rosterMember('a', 'azralon', 1)]),
      );
      repo.findMembers.mockResolvedValue([
        dbMember({ id: 'sem-char', matchedCharacterSlug: null, matchedCharacterRealm: null }),
      ]);

      const result = await service.revalidateAll();

      expect(result).toMatchObject({ status: 'ok', revoked: 0, unverifiable: 1 });
      expect(repo.revokeMembership).toHaveBeenCalledWith([]);
    });
  });

  it('atualiza o rank de quem foi promovido no jogo', async () => {
    blizzard.getGuildRosterSnapshot.mockResolvedValue(
      snapshot([rosterMember('ferrolhx', 'azralon', 1)]),
    );
    repo.findMembers.mockResolvedValue([dbMember({ id: 'promovido', guildRank: 4 })]);

    const result = await service.revalidateAll();

    expect(repo.updateRank).toHaveBeenCalledWith('promovido', 1);
    expect(repo.revokeMembership).toHaveBeenCalledWith([]);
    expect(result).toMatchObject({ ranksUpdated: 1 });
  });

  it('só marca verificado quem continua igual', async () => {
    blizzard.getGuildRosterSnapshot.mockResolvedValue(
      snapshot([rosterMember('ferrolhx', 'azralon', 4)]),
    );
    repo.findMembers.mockResolvedValue([dbMember({ id: 'igual', guildRank: 4 })]);

    await service.revalidateAll();

    expect(repo.touchVerified).toHaveBeenCalledWith(['igual']);
    expect(repo.updateRank).not.toHaveBeenCalled();
  });

  it('compara personagem e realm normalizados, não string crua', async () => {
    // Linha escrita à mão no banco, com acento e maiúscula. Comparação crua
    // falharia aqui — silenciosamente, revogando um membro de verdade.
    blizzard.getGuildRosterSnapshot.mockResolvedValue(
      snapshot([rosterMember('valdrakken', 'area-52', 3)]),
    );
    repo.findMembers.mockResolvedValue([
      dbMember({
        id: 'acentuado',
        guildRank: 3,
        matchedCharacterSlug: 'Valdrakken',
        matchedCharacterRealm: 'Area 52',
      }),
    ]);

    const result = await service.revalidateAll();

    expect(repo.revokeMembership).toHaveBeenCalledWith([]);
    expect(result).toMatchObject({ revoked: 0 });
  });

  it('a rodada agendada não deixa exceção escapar', async () => {
    blizzard.getGuildRosterSnapshot.mockRejectedValue(new Error('Blizzard fora do ar'));

    await expect(service.revalidateScheduled()).resolves.toBeUndefined();
  });
});
