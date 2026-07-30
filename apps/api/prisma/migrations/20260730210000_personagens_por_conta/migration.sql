-- Personagens da guilda viram tabela: uma conta tem N personagens no roster.
--
-- Escrita à mão em vez de gerada porque a geração automática dropava as três
-- colunas de personagem SEM preservar o dado. Ver Regra 4 do CLAUDE.md.

-- CreateTable
CREATE TABLE "GuildCharacter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "realmSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuildCharacter_userId_idx" ON "GuildCharacter"("userId");

-- CreateIndex
CREATE INDEX "GuildCharacter_realmSlug_slug_idx" ON "GuildCharacter"("realmSlug", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "GuildCharacter_userId_realmSlug_slug_key" ON "GuildCharacter"("userId", "realmSlug", "slug");

-- AddForeignKey
ALTER TABLE "GuildCharacter" ADD CONSTRAINT "GuildCharacter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: o personagem que já estava casado vira a primeira linha da conta.
--
-- Sem isto, todo mundo que já logou perderia o vínculo e o job de revalidação
-- passaria a tratar essas contas como "membro sem personagem casado" — o mesmo
-- estado que ele já registra como impossível de verificar.
--
-- O rank vem do User porque, com um personagem só, o melhor rank ERA o dele.
INSERT INTO "GuildCharacter" ("id", "userId", "slug", "realmSlug", "name", "rank", "created_at", "updated_at")
SELECT
    gen_random_uuid()::text,
    "id",
    "matchedCharacterSlug",
    "matchedCharacterRealm",
    "matchedCharacterName",
    COALESCE("guildRank", 0),
    NOW(),
    NOW()
FROM "User"
WHERE "matchedCharacterSlug" IS NOT NULL
  AND "matchedCharacterRealm" IS NOT NULL
  AND "matchedCharacterName" IS NOT NULL;

-- DropIndex
DROP INDEX "User_matchedCharacterSlug_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "matchedCharacterName",
DROP COLUMN "matchedCharacterRealm",
DROP COLUMN "matchedCharacterSlug";
