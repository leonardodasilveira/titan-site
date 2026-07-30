-- A identidade do personagem passa a preservar acento.
--
-- `slug` guardava o nome passado por toSlug(), que remove acento. Isso é certo
-- para realm e errado para personagem: em WoW é comum nomear alts com variações
-- acentuadas do mesmo nome, e são personagens diferentes, com ranks diferentes.
--
-- No roster da Titan Inc isso aparece em 7 grupos, entre eles:
--   azralon/Shrëwd (rank 5) · Shrêwd (rank 5) · Shrèwd (rank 7)
--
-- Com a chave sem acento os três colidiam: a unique estourava no login e, pior,
-- o Map de lookup deixava só o último — a pessoa era lida com o rank de outro
-- personagem, que é o que decide acesso à área interna.

-- DropIndex
DROP INDEX "GuildCharacter_realmSlug_slug_idx";

-- DropIndex
DROP INDEX "GuildCharacter_userId_realmSlug_slug_key";

-- AlterTable
ALTER TABLE "GuildCharacter" RENAME COLUMN "slug" TO "nameKey";

-- Os valores gravados até aqui vieram de toSlug() e podem estar sem acento.
-- Regravar com o nome exibido (que a Blizzard devolve acentuado) em minúsculas
-- é a mesma regra do toCharacterKey().
UPDATE "GuildCharacter" SET "nameKey" = lower("name");

-- CreateIndex
CREATE INDEX "GuildCharacter_realmSlug_nameKey_idx" ON "GuildCharacter"("realmSlug", "nameKey");

-- CreateIndex
CREATE UNIQUE INDEX "GuildCharacter_userId_realmSlug_nameKey_key" ON "GuildCharacter"("userId", "realmSlug", "nameKey");
