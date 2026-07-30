-- CreateEnum
CREATE TYPE "Membership" AS ENUM ('member', 'not_member');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "battlenetId" TEXT NOT NULL,
    "battletag" TEXT NOT NULL,
    "membership" "Membership" NOT NULL DEFAULT 'not_member',
    "isOfficer" BOOLEAN NOT NULL DEFAULT false,
    "guildRank" INTEGER,
    "matchedCharacterSlug" TEXT,
    "matchedCharacterName" TEXT,
    "matchedCharacterRealm" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_battlenetId_key" ON "User"("battlenetId");

-- CreateIndex
CREATE INDEX "User_matchedCharacterSlug_idx" ON "User"("matchedCharacterSlug");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
