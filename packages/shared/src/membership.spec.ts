import { describe, expect, it } from 'vitest';
import { canAccessInternalArea, canReviewApplications, type SessionUser } from './membership.js';

const base: SessionUser = {
  battletag: 'Fulano#1234',
  membership: 'member',
  isOfficer: false,
  guildRank: 7,
  matchedCharacter: { name: 'Zenithus', realm: 'Azralon', region: 'us' },
  verifiedAt: '2026-07-30T00:00:00.000Z',
};

const user = (over: Partial<SessionUser> = {}): SessionUser => ({ ...base, ...over });

describe('canAccessInternalArea', () => {
  it('libera membro', () => {
    expect(canAccessInternalArea(user({ membership: 'member' }))).toBe(true);
  });

  it('bloqueia quem não é membro', () => {
    expect(canAccessInternalArea(user({ membership: 'not-member' }))).toBe(false);
  });
});

describe('canReviewApplications', () => {
  it('libera oficial', () => {
    expect(canReviewApplications(user({ isOfficer: true }))).toBe(true);
  });

  it('bloqueia membro comum', () => {
    // O painel tem Discord tag e texto pessoal de candidatos. Ser membro não
    // basta — são 374 pessoas no roster, incluindo alts.
    expect(canReviewApplications(user({ isOfficer: false }))).toBe(false);
  });

  it('bloqueia ex-membro mesmo com a flag de oficial ligada', () => {
    // Sair da guilda tem que derrubar o acesso, mesmo que ninguém lembre de
    // desligar a flag manualmente.
    expect(canReviewApplications(user({ membership: 'not-member', isOfficer: true }))).toBe(false);
  });

  it('rank baixo não impede oficial — permissão não vem do rank', () => {
    expect(canReviewApplications(user({ guildRank: 7, isOfficer: true }))).toBe(true);
  });

  it('rank 0 (GM) não dá acesso sozinho — a flag é que decide', () => {
    // Documenta a decisão: rank é registro histórico, não permissão.
    expect(canReviewApplications(user({ guildRank: 0, isOfficer: false }))).toBe(false);
  });
});
